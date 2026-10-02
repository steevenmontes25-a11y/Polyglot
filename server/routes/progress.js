import { db } from '../db.js';
import { langByCode, getEnrollment } from '../lib/queries.js';
import { levelForXp, evaluateAchievements, today } from '../lib/xp.js';

const MATURE_DAYS = 21;

function activitySeries(userId, languageId, days = 14) {
  const rows = db.prepare(`
    SELECT date, SUM(xp) xp, SUM(exercises) exercises, SUM(correct) correct
    FROM daily_activity
    WHERE user_id = ? AND (? IS NULL OR language_id = ?)
      AND date >= date('now', ?)
    GROUP BY date ORDER BY date
  `).all(userId, languageId, languageId, `-${days} days`);
  const map = Object.fromEntries(rows.map((r) => [r.date, r]));
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = today(new Date(Date.now() - i * 86400000));
    const r = map[d] || { xp: 0, exercises: 0, correct: 0 };
    out.push({ date: d, xp: r.xp || 0, exercises: r.exercises || 0, correct: r.correct || 0 });
  }
  return out;
}

export default function register(router) {
  router.get('/api/progress/overview', ({ query, user }) => {
    const lang = langByCode(query.code);
    const enr = getEnrollment(user.id, lang.id);
    const g = levelForXp(enr?.xp || 0);

    const t = today();
    const todayRow = db.prepare(
      'SELECT COALESCE(SUM(xp),0) xp, COALESCE(SUM(exercises),0) ex, COALESCE(SUM(correct),0) ok FROM daily_activity WHERE user_id=? AND language_id=? AND date=?',
    ).get(user.id, lang.id, t);

    const cardStats = db.prepare(`
      SELECT
        COUNT(*) total,
        SUM(CASE WHEN due_at <= datetime('now') THEN 1 ELSE 0 END) due,
        SUM(CASE WHEN state IN ('new','learning','lapsed') THEN 1 ELSE 0 END) learning,
        SUM(CASE WHEN state='review' THEN 1 ELSE 0 END) review,
        SUM(CASE WHEN state='review' AND interval_days >= ${MATURE_DAYS} THEN 1 ELSE 0 END) mature
      FROM srs_cards WHERE user_id=? AND language_id=?
    `).get(user.id, lang.id);

    const acc = db.prepare(`
      SELECT COUNT(*) n, SUM(correct) ok FROM attempts
      WHERE user_id=? AND language_id=? AND created_at >= datetime('now','-30 days')
    `).get(user.id, lang.id);
    const accuracy30d = acc.n ? acc.ok / acc.n : 0;

    const lessonAgg = db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM lessons l JOIN skills s ON s.id=l.skill_id WHERE s.language_id=?) total,
        (SELECT COUNT(*) FROM lesson_progress lp JOIN lessons l ON l.id=lp.lesson_id
          JOIN skills s ON s.id=l.skill_id
          WHERE s.language_id=? AND lp.user_id=? AND lp.status='completed') done
    `).get(lang.id, lang.id, user.id);

    const nextUp = db.prepare(`
      SELECT l.id, l.title, l.kind, s.title AS skillTitle, s.icon
      FROM lessons l JOIN skills s ON s.id = l.skill_id
      WHERE s.language_id = ?
        AND l.id NOT IN (
          SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND status = 'completed'
        )
      ORDER BY s.sort_order, l.sort_order
      LIMIT 1
    `).get(lang.id, user.id);

    const skillMastery = db.prepare(`
      SELECT s.id, s.title, s.icon, s.cefr,
        (SELECT COUNT(*) FROM lessons l WHERE l.skill_id = s.id) lessons_total,
        (SELECT COUNT(*) FROM lesson_progress lp JOIN lessons l ON l.id = lp.lesson_id
          WHERE l.skill_id = s.id AND lp.user_id = ? AND lp.status='completed') lessons_done,
        (SELECT COUNT(*) FROM vocab v WHERE v.skill_id = s.id) vocab_total,
        (SELECT COUNT(*) FROM srs_cards sc JOIN vocab v ON v.id = sc.vocab_id
          WHERE v.skill_id = s.id AND sc.user_id = ? AND sc.state='review' AND sc.interval_days >= ${MATURE_DAYS}) mature
      FROM skills s WHERE s.language_id = ? ORDER BY s.sort_order
    `).all(user.id, user.id, lang.id).map((r) => {
      const lp = r.lessons_total ? r.lessons_done / r.lessons_total : 0;
      const vp = r.vocab_total ? r.mature / r.vocab_total : 0;
      return {
        id: r.id, title: r.title, icon: r.icon, cefr: r.cefr,
        mastery: Math.round(Math.min(1, 0.55 * lp + 0.45 * vp) * 100) / 100,
        lessonsDone: r.lessons_done, lessonsTotal: r.lessons_total,
      };
    });

    const stats = {
      lessonsCompleted: lessonAgg.done,
      bestStreak: enr?.best_streak || 0,
      wordsLearning: cardStats.learning || 0,
      wordsMature: cardStats.mature || 0,
      totalXp: enr?.xp || 0,
      exercises30d: acc.n || 0,
      accuracy30d,
      cefr: enr?.level || 'A1',
    };

    return {
      language: { code: lang.code, name: lang.name, flag: lang.flag, ttsLocale: lang.tts_locale, script: lang.script, direction: lang.direction },
      enrolled: !!enr,
      level: enr?.level || 'A1',
      xp: enr?.xp || 0,
      streak: enr?.streak || 0,
      bestStreak: enr?.best_streak || 0,
      levelCurve: g,
      today: {
        xp: todayRow.xp, exercises: todayRow.ex, correct: todayRow.ok,
        goal: user.daily_goal_xp, goalMet: todayRow.xp >= user.daily_goal_xp,
      },
      srs: {
        due: cardStats.due || 0, learning: cardStats.learning || 0,
        review: cardStats.review || 0, mature: cardStats.mature || 0, total: cardStats.total || 0,
      },
      accuracy30d: Math.round(accuracy30d * 100) / 100,
      lessons: { done: lessonAgg.done, total: lessonAgg.total },
      nextUp,
      skillMastery,
      activity: activitySeries(user.id, lang.id, 14),
      achievements: evaluateAchievements(stats),
    };
  }, { auth: true });

  router.get('/api/progress/vocab', ({ query, user }) => {
    const lang = langByCode(query.code);
    const page = Math.max(0, Number(query.page) || 0);
    const size = 50;
    const filter = String(query.q || '').trim().toLowerCase();
    const state = query.state || 'all';

    const where = ['v.language_id = ?'];
    const args = [lang.id];
    if (filter) {
      where.push('(LOWER(v.lemma) LIKE ? OR LOWER(v.translation) LIKE ? OR LOWER(v.reading) LIKE ?)');
      args.push(`%${filter}%`, `%${filter}%`, `%${filter}%`);
    }

    const rows = db.prepare(`
      SELECT v.id, v.lemma, v.translation, v.reading, v.pos, v.example_target, v.example_source,
             s.title AS skill, sc.state, sc.interval_days, sc.due_at, sc.repetitions
      FROM vocab v
      LEFT JOIN skills s ON s.id = v.skill_id
      LEFT JOIN srs_cards sc ON sc.vocab_id = v.id AND sc.user_id = ?
      WHERE ${where.join(' AND ')}
      ORDER BY v.frequency DESC, v.id
    `).all(user.id, ...args);

    const filtered = rows.filter((r) => {
      if (state === 'all') return true;
      if (state === 'new') return !r.state;
      if (state === 'learning') return ['new', 'learning', 'lapsed'].includes(r.state);
      if (state === 'mature') return r.state === 'review' && r.interval_days >= MATURE_DAYS;
      if (state === 'review') return r.state === 'review';
      return true;
    });

    return {
      total: filtered.length,
      page,
      pageSize: size,
      items: filtered.slice(page * size, page * size + size),
    };
  }, { auth: true });

  router.get('/api/profile', ({ user }) => {
    const enrollments = db.prepare(`
      SELECT e.*, l.code, l.name, l.flag, l.native_name
      FROM enrollments e JOIN languages l ON l.id = e.language_id
      WHERE e.user_id = ? ORDER BY e.xp DESC
    `).all(user.id).map((e) => ({
      code: e.code, name: e.name, flag: e.flag, nativeName: e.native_name,
      xp: e.xp, streak: e.streak, bestStreak: e.best_streak,
      lastActive: e.last_active_date,
      ...levelForXp(e.xp),
      xpLevel: levelForXp(e.xp).level,
      level: e.level, // MCER — despues del spread
    }));

    const totals = db.prepare(`
      SELECT
        (SELECT COALESCE(SUM(xp),0) FROM enrollments WHERE user_id=?) xp,
        (SELECT COUNT(*) FROM srs_cards WHERE user_id=?) cards,
        (SELECT COUNT(*) FROM srs_cards WHERE user_id=? AND state='review' AND interval_days>=${MATURE_DAYS}) mature,
        (SELECT COUNT(*) FROM lesson_progress WHERE user_id=? AND status='completed') lessons,
        (SELECT COUNT(*) FROM attempts WHERE user_id=?) attempts,
        (SELECT COALESCE(SUM(correct),0) FROM attempts WHERE user_id=?) correct
    `).get(user.id, user.id, user.id, user.id, user.id, user.id);

    return {
      user: {
        email: user.email, displayName: user.display_name,
        dailyGoalXp: user.daily_goal_xp, createdAt: user.created_at,
      },
      enrollments,
      totals: {
        xp: totals.xp,
        globalLevel: levelForXp(totals.xp).level,
        cards: totals.cards,
        mature: totals.mature,
        lessons: totals.lessons,
        accuracy: totals.attempts ? Math.round((totals.correct / totals.attempts) * 100) / 100 : 0,
        activeDays: db.prepare('SELECT COUNT(DISTINCT date) c FROM daily_activity WHERE user_id=?').get(user.id).c,
      },
      activity: activitySeries(user.id, null, 30),
    };
  }, { auth: true });
}
