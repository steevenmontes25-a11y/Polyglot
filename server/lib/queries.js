import { db } from '../db.js';
import { HttpError } from './http.js';
import { bumpStreak, today, xpForAnswer } from './xp.js';

export function langByCode(code) {
  const lang = db.prepare('SELECT * FROM languages WHERE code = ?').get(code);
  if (!lang) throw new HttpError(404, `Idioma "${code}" no encontrado`);
  return lang;
}

export function langById(id) {
  return db.prepare('SELECT * FROM languages WHERE id = ?').get(id);
}

export function getEnrollment(userId, languageId) {
  return db
    .prepare('SELECT * FROM enrollments WHERE user_id = ? AND language_id = ?')
    .get(userId, languageId);
}

export function ensureEnrollment(userId, languageId, level = 'A1') {
  let enr = getEnrollment(userId, languageId);
  if (!enr) {
    db.prepare(
      'INSERT INTO enrollments (user_id, language_id, level) VALUES (?, ?, ?)',
    ).run(userId, languageId, level);
    enr = getEnrollment(userId, languageId);
  }
  return enr;
}

/**
 * Registra XP + actividad del dia, actualiza la racha de la matricula.
 * Devuelve un resumen para que el cliente muestre animaciones.
 */
export function recordActivity({ userId, languageId, xp = 0, exercises = 0, correct = 0 }) {
  const t = today();

  db.prepare(`
    INSERT INTO daily_activity (user_id, language_id, date, xp, exercises, correct)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, language_id, date) DO UPDATE SET
      xp = xp + excluded.xp,
      exercises = exercises + excluded.exercises,
      correct = correct + excluded.correct
  `).run(userId, languageId, t, xp, exercises, correct);

  const enr = ensureEnrollment(userId, languageId);
  const streak = bumpStreak(enr);
  db.prepare(`
    UPDATE enrollments
       SET xp = xp + ?, streak = ?, best_streak = ?, last_active_date = ?
     WHERE id = ?
  `).run(xp, streak.streak, streak.bestStreak, streak.lastDate, enr.id);

  const todayRow = db
    .prepare('SELECT COALESCE(SUM(xp),0) AS xp FROM daily_activity WHERE user_id = ? AND date = ?')
    .get(userId, t);
  const user = db.prepare('SELECT daily_goal_xp FROM users WHERE id = ?').get(userId);

  return {
    xpEarned: xp,
    streak: streak.streak,
    bestStreak: streak.bestStreak,
    streakIncreased: streak.changed && streak.streak > (enr.streak || 0),
    todayXp: todayRow.xp,
    dailyGoal: user.daily_goal_xp,
    goalMet: todayRow.xp >= user.daily_goal_xp,
    languageXp: enr.xp + xp,
  };
}

/** Crea (o deja intacta) una tarjeta SRS para cada vocablo de una leccion. */
export function seedCardsForVocab(userId, languageId, vocabIds, { firstIntervalMin = 10 } = {}) {
  const now = new Date();
  const due = new Date(now.getTime() + firstIntervalMin * 60000)
    .toISOString().replace('T', ' ').slice(0, 19);
  const insert = db.prepare(`
    INSERT INTO srs_cards (user_id, vocab_id, language_id, state, due_at)
    VALUES (?, ?, ?, 'learning', ?)
    ON CONFLICT(user_id, vocab_id) DO NOTHING
  `);
  let created = 0;
  for (const vid of vocabIds) {
    const r = insert.run(userId, vid, languageId, due);
    created += r.changes;
  }
  return created;
}

/**
 * Tras el test de nivelacion: da por sabidas las primeras habilidades
 * segun el nivel obtenido (marca sus lecciones como completadas y crea
 * tarjetas SRS ya "maduras" que reapareceran de forma escalonada para
 * confirmar el conocimiento). Asi un alumno de A2 no empieza por "hola".
 */
const HEAD_BY_LEVEL = { A1: 0, 'A1+': 1, A2: 3, 'A2+': 5, B1: 6 };

export function applyPlacementHead(userId, languageId, level, raw = 0) {
  let n = HEAD_BY_LEVEL[level] ?? 0;
  if (level === 'A2' && raw >= 0.6) n = 4;          // A2 fuerte
  if (n === 0) return [];

  const skills = db.prepare(
    'SELECT id, title FROM skills WHERE language_id = ? ORDER BY sort_order LIMIT ?',
  ).all(languageId, n);

  const lessonsOf = db.prepare('SELECT id FROM lessons WHERE skill_id = ?');
  const vocabOf = db.prepare('SELECT id FROM vocab WHERE skill_id = ?');
  const markLesson = db.prepare(`
    INSERT INTO lesson_progress (user_id, lesson_id, status, best_score, attempts, completed_at, updated_at)
    VALUES (?, ?, 'completed', 0.9, 1, datetime('now'), datetime('now'))
    ON CONFLICT(user_id, lesson_id) DO UPDATE SET
      status = 'completed',
      best_score = MAX(best_score, 0.9),
      completed_at = COALESCE(completed_at, datetime('now'))
  `);
  const makeCard = db.prepare(`
    INSERT INTO srs_cards (user_id, vocab_id, language_id, ease, interval_days, repetitions, state, due_at)
    VALUES (?, ?, ?, 2.5, ?, 2, 'review', ?)
    ON CONFLICT(user_id, vocab_id) DO NOTHING
  `);

  for (const s of skills) {
    for (const l of lessonsOf.all(s.id)) markLesson.run(userId, l.id);
    for (const v of vocabOf.all(s.id)) {
      const interval = 6 + Math.floor(Math.random() * 9);          // 6-14 dias
      const dueInDays = Math.floor(Math.random() * 4);             // aparece en 0-3 dias
      const due = new Date(Date.now() + dueInDays * 86400000).toISOString().replace('T', ' ').slice(0, 19);
      makeCard.run(userId, v.id, languageId, interval, due);
    }
  }

  const enr = getEnrollment(userId, languageId);
  if (enr) db.prepare('UPDATE enrollments SET xp = xp + ? WHERE id = ?').run(n * 45, enr.id);

  return skills.map((s) => ({ id: s.id, title: s.title }));
}

export { xpForAnswer };
