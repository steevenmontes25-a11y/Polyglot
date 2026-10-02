import { db } from '../db.js';
import { HttpError } from '../lib/http.js';
import { langByCode, ensureEnrollment, getEnrollment } from '../lib/queries.js';
import { levelForXp } from '../lib/xp.js';

const MATURE_DAYS = 21;

function languageSummary(lang, userId) {
  const vocabCount = db.prepare('SELECT COUNT(*) c FROM vocab WHERE language_id = ?').get(lang.id).c;
  const skillCount = db.prepare('SELECT COUNT(*) c FROM skills WHERE language_id = ?').get(lang.id).c;
  let enrollment = null;
  if (userId) {
    const enr = getEnrollment(userId, lang.id);
    if (enr) {
      const due = db.prepare(
        `SELECT COUNT(*) c FROM srs_cards WHERE user_id = ? AND language_id = ? AND due_at <= datetime('now')`,
      ).get(userId, lang.id).c;
      const known = db.prepare(
        `SELECT COUNT(*) c FROM srs_cards WHERE user_id = ? AND language_id = ?`,
      ).get(userId, lang.id).c;
      enrollment = {
        xp: enr.xp, streak: enr.streak, bestStreak: enr.best_streak,
        lastActive: enr.last_active_date,
        dueCount: due, cardsTotal: known,
        ...levelForXp(enr.xp),
        xpLevel: levelForXp(enr.xp).level,
        level: enr.level, // MCER — despues del spread para que no lo pise
      };
    }
  }
  return {
    id: lang.id, code: lang.code, name: lang.name, nativeName: lang.native_name,
    flag: lang.flag, direction: lang.direction, script: lang.script,
    difficulty: lang.difficulty, ttsLocale: lang.tts_locale, family: lang.family,
    blurb: lang.blurb, vocabCount, skillCount, enrollment,
  };
}

export default function register(router) {
  // ---- catalogo de idiomas ----
  router.get('/api/languages', ({ user }) => {
    const langs = db.prepare('SELECT * FROM languages ORDER BY difficulty, name').all();
    return { languages: langs.map((l) => languageSummary(l, user?.id)) };
  });

  router.get('/api/languages/:code', ({ params, user }) => {
    const lang = langByCode(params.code);
    return { language: languageSummary(lang, user?.id) };
  });

  // ---- matricularse en un idioma ----
  router.post('/api/languages/:code/enroll', ({ params, user, body }) => {
    const lang = langByCode(params.code);
    const level = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(body.level) ? body.level : 'A1';
    const enr = ensureEnrollment(user.id, lang.id, level);
    return { enrollment: { level: enr.level, xp: enr.xp, streak: enr.streak } };
  }, { auth: true });

  // ---- arbol de habilidades de un idioma ----
  router.get('/api/languages/:code/tree', ({ params, user }) => {
    const lang = langByCode(params.code);
    const skills = db.prepare(
      'SELECT * FROM skills WHERE language_id = ? ORDER BY sort_order, id',
    ).all(lang.id);

    const lessonsBySkill = db.prepare(
      'SELECT * FROM lessons WHERE skill_id = ? ORDER BY sort_order, id',
    );
    const vocabCountStmt = db.prepare('SELECT COUNT(*) c FROM vocab WHERE skill_id = ?');
    const progressStmt = user && db.prepare(
      'SELECT status, best_score FROM lesson_progress WHERE user_id = ? AND lesson_id = ?',
    );
    const matureStmt = user && db.prepare(`
      SELECT COUNT(*) c FROM srs_cards sc
      JOIN vocab v ON v.id = sc.vocab_id
      WHERE sc.user_id = ? AND v.skill_id = ? AND sc.state = 'review' AND sc.interval_days >= ?
    `);
    const learningStmt = user && db.prepare(`
      SELECT COUNT(*) c FROM srs_cards sc
      JOIN vocab v ON v.id = sc.vocab_id
      WHERE sc.user_id = ? AND v.skill_id = ?
    `);

    let prevMastery = 1;
    const out = skills.map((s) => {
      const lessons = lessonsBySkill.all(s.id).map((l) => {
        const p = progressStmt ? progressStmt.get(user.id, l.id) : null;
        return {
          id: l.id, slug: l.slug, title: l.title, kind: l.kind, xpAward: l.xp_award,
          status: p?.status || 'not_started', bestScore: p?.best_score || 0,
        };
      });
      const vocabTotal = vocabCountStmt.get(s.id).c;
      const lessonsDone = lessons.filter((l) => l.status === 'completed').length;
      let mastery = 0;
      if (user) {
        const mature = matureStmt.get(user.id, s.id, MATURE_DAYS).c;
        const lessonPart = lessons.length ? lessonsDone / lessons.length : 0;
        const vocabPart = vocabTotal ? mature / vocabTotal : 0;
        mastery = Math.min(1, 0.55 * lessonPart + 0.45 * vocabPart);
      }
      const unlocked = !user ? true : prevMastery >= 0.5 || lessonsDone > 0;
      prevMastery = user ? mastery : 1;
      return {
        id: s.id, slug: s.slug, title: s.title, description: s.description,
        cefr: s.cefr, category: s.category, icon: s.icon,
        vocabTotal, lessons, lessonsDone, lessonsTotal: lessons.length,
        mastery: Math.round(mastery * 100) / 100,
        cardsStarted: user ? learningStmt.get(user.id, s.id).c : 0,
        unlocked,
      };
    });

    const enr = user ? getEnrollment(user.id, lang.id) : null;
    return {
      language: languageSummary(lang, user?.id),
      enrolled: !!enr,
      skills: out,
    };
  });

  // ---- detalle de una habilidad (vocabulario + gramatica) ----
  router.get('/api/skills/:id', ({ params, user }) => {
    const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(Number(params.id));
    if (!skill) throw new HttpError(404, 'Habilidad no encontrada');
    const vocab = db.prepare(
      'SELECT id, lemma, translation, pos, reading, ipa, example_target, example_source, gender FROM vocab WHERE skill_id = ? ORDER BY frequency DESC, id',
    ).all(skill.id);
    const grammar = db.prepare(
      'SELECT slug, title, cefr, body FROM grammar_notes WHERE skill_id = ?',
    ).all(skill.id);
    const readings = db.prepare(
      'SELECT id, title, cefr FROM readings WHERE skill_id = ?',
    ).all(skill.id);
    const dialogues = db.prepare(
      'SELECT id, title, cefr, scenario FROM dialogues WHERE skill_id = ?',
    ).all(skill.id);

    let cards = {};
    if (user) {
      const rows = db.prepare(`
        SELECT vocab_id, state, interval_days, due_at FROM srs_cards
        WHERE user_id = ? AND vocab_id IN (SELECT id FROM vocab WHERE skill_id = ?)
      `).all(user.id, skill.id);
      cards = Object.fromEntries(rows.map((r) => [r.vocab_id, r]));
    }

    return {
      skill: {
        id: skill.id, slug: skill.slug, title: skill.title,
        description: skill.description, cefr: skill.cefr, icon: skill.icon,
      },
      vocab: vocab.map((v) => ({ ...v, card: cards[v.id] || null })),
      grammar, readings, dialogues,
    };
  });
}
