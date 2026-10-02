import { db } from '../db.js';
import { HttpError } from '../lib/http.js';
import { langByCode } from '../lib/queries.js';
import { recordActivity } from '../lib/queries.js';
import { schedule, humanizeInterval } from '../lib/srs.js';
import { buildExercise } from '../lib/exercises.js';

const MATURE_DAYS = 21;

function counts(userId, languageId) {
  const q = (sql, ...a) => db.prepare(sql).get(userId, languageId, ...a).c;
  return {
    dueNow: q(`SELECT COUNT(*) c FROM srs_cards WHERE user_id=? AND language_id=? AND due_at <= datetime('now')`),
    dueToday: q(`SELECT COUNT(*) c FROM srs_cards WHERE user_id=? AND language_id=? AND due_at <= datetime('now','+1 day','start of day')`),
    learning: q(`SELECT COUNT(*) c FROM srs_cards WHERE user_id=? AND language_id=? AND state IN ('new','learning','lapsed')`),
    review: q(`SELECT COUNT(*) c FROM srs_cards WHERE user_id=? AND language_id=? AND state='review'`),
    mature: q(`SELECT COUNT(*) c FROM srs_cards WHERE user_id=? AND language_id=? AND state='review' AND interval_days >= ${MATURE_DAYS}`),
    total: q(`SELECT COUNT(*) c FROM srs_cards WHERE user_id=? AND language_id=?`),
  };
}

export default function register(router) {
  router.get('/api/review/summary', ({ query, user }) => {
    const lang = langByCode(query.code);
    const c = counts(user.id, lang.id);
    const newAvailable = db.prepare(`
      SELECT COUNT(*) c FROM vocab v
      WHERE v.language_id = ?
        AND v.id NOT IN (SELECT vocab_id FROM srs_cards WHERE user_id = ?)
    `).get(lang.id, user.id).c;
    const nextDue = db.prepare(`
      SELECT due_at FROM srs_cards WHERE user_id=? AND language_id=? AND due_at > datetime('now')
      ORDER BY due_at LIMIT 1
    `).get(user.id, lang.id);
    return { ...c, newAvailable, nextDue: nextDue?.due_at || null };
  }, { auth: true });

  router.get('/api/review/queue', ({ query, user }) => {
    const lang = langByCode(query.code);
    const limit = Math.max(1, Math.min(60, Number(query.limit) || 20));
    const includeNew = Math.max(0, Math.min(20, Number(query.new) || 0));
    const early = query.early === '1' || query.early === 'true';

    const due = db.prepare(`
      SELECT sc.*, v.lemma, v.translation, v.reading, v.ipa, v.pos,
             v.example_target, v.example_source, v.skill_id
      FROM srs_cards sc JOIN vocab v ON v.id = sc.vocab_id
      WHERE sc.user_id = ? AND sc.language_id = ?
        AND (sc.due_at <= datetime('now') OR (? AND sc.state IN ('new','learning','lapsed')))
      ORDER BY (sc.due_at <= datetime('now')) DESC, sc.due_at
      LIMIT ?
    `).all(user.id, lang.id, early ? 1 : 0, limit);

    let items = due;

    if (includeNew && items.length < limit) {
      const fresh = db.prepare(`
        SELECT v.id AS vocab_id, v.lemma, v.translation, v.reading, v.ipa, v.pos,
               v.example_target, v.example_source, v.skill_id,
               NULL AS id, 2.5 AS ease, 0 AS interval_days, 0 AS repetitions,
               0 AS lapses, 'new' AS state
        FROM vocab v
        WHERE v.language_id = ?
          AND v.id NOT IN (SELECT vocab_id FROM srs_cards WHERE user_id = ?)
        ORDER BY v.frequency DESC, v.id
        LIMIT ?
      `).all(lang.id, user.id, Math.min(includeNew, limit - items.length));
      items = items.concat(fresh);
    }

    const poolCache = new Map();
    const getPool = (skillId) => {
      if (!poolCache.has(skillId)) {
        poolCache.set(skillId, db.prepare('SELECT * FROM vocab WHERE skill_id = ? OR language_id = ? LIMIT 60')
          .all(skillId, lang.id));
      }
      return poolCache.get(skillId);
    };

    const queue = items.map((row) => {
      const target = {
        id: row.vocab_id, lemma: row.lemma, translation: row.translation,
        reading: row.reading, ipa: row.ipa, pos: row.pos,
        example_target: row.example_target, example_source: row.example_source,
      };
      const ex = buildExercise(target, getPool(row.skill_id), { script: lang.script });
      return {
        cardId: row.id, vocabId: row.vocab_id, state: row.state,
        isNew: row.state === 'new',
        exercise: ex,
      };
    });

    return {
      language: { code: lang.code, name: lang.name, ttsLocale: lang.tts_locale, script: lang.script, direction: lang.direction },
      counts: counts(user.id, lang.id),
      queue,
    };
  }, { auth: true });

  router.post('/api/review/answer', ({ body, user }) => {
    const rating = Math.max(0, Math.min(3, Number(body.rating)));
    const combo = Math.max(0, Number(body.combo) || 0);
    let cardId = body.cardId ? Number(body.cardId) : null;
    const vocabId = body.vocabId ? Number(body.vocabId) : null;

    let card;
    if (cardId) {
      card = db.prepare('SELECT * FROM srs_cards WHERE id = ? AND user_id = ?').get(cardId, user.id);
    }
    if (!card && vocabId) {
      // tarjeta nueva introducida desde el repaso: crearla
      const v = db.prepare('SELECT * FROM vocab WHERE id = ?').get(vocabId);
      if (!v) throw new HttpError(404, 'Vocablo no encontrado');
      const info = db.prepare(`
        INSERT INTO srs_cards (user_id, vocab_id, language_id, state, due_at)
        VALUES (?, ?, ?, 'new', datetime('now'))
        ON CONFLICT(user_id, vocab_id) DO UPDATE SET due_at = due_at
        RETURNING id
      `).get(user.id, vocabId, v.language_id);
      card = db.prepare('SELECT * FROM srs_cards WHERE id = ?').get(info.id);
      cardId = card.id;
    }
    if (!card) throw new HttpError(404, 'Tarjeta no encontrada');

    const next = schedule(card, rating);
    db.prepare(`
      UPDATE srs_cards SET ease=?, interval_days=?, repetitions=?, lapses=?, state=?,
        due_at=?, last_reviewed_at=? WHERE id=?
    `).run(next.ease, next.interval_days, next.repetitions, next.lapses, next.state,
      next.due_at, next.last_reviewed_at, card.id);

    db.prepare(`
      INSERT INTO review_log (user_id, card_id, rating, prev_interval, new_interval)
      VALUES (?, ?, ?, ?, ?)
    `).run(user.id, card.id, rating, next.prev_interval, next.new_interval);

    let xp = 0;
    if (rating >= 2) xp = 10 + Math.min(combo, 10);
    else if (rating === 1) xp = 6;
    const summary = recordActivity({
      userId: user.id, languageId: card.language_id,
      xp, exercises: 1, correct: rating >= 2 ? 1 : 0,
    });

    return {
      cardId: card.id,
      state: next.state,
      intervalDays: next.interval_days,
      nextReview: humanizeInterval(next.interval_days),
      dueAt: next.due_at,
      xp,
      ...summary,
      counts: counts(user.id, card.language_id),
    };
  }, { auth: true });
}
