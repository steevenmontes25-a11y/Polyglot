import { db } from '../db.js';
import { HttpError } from '../lib/http.js';
import { buildExercise, buildMatchPairsRound, shuffle } from '../lib/exercises.js';
import {
  ensureEnrollment, recordActivity, seedCardsForVocab,
} from '../lib/queries.js';

function loadLesson(id) {
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(Number(id));
  if (!lesson) throw new HttpError(404, 'Leccion no encontrada');
  const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(lesson.skill_id);
  const lang = db.prepare('SELECT * FROM languages WHERE id = ?').get(skill.language_id);
  return { lesson, skill, lang };
}

function skillVocab(skillId) {
  return db.prepare(
    'SELECT * FROM vocab WHERE skill_id = ? ORDER BY frequency DESC, id',
  ).all(skillId);
}

/* --------------------------------------------------------------- *
 *  Generadores de contenido por tipo de leccion
 * --------------------------------------------------------------- */

function buildVocabLesson({ lesson, skill, lang }) {
  const all = skillVocab(skill.id);
  // ventana de 8 palabras que rota segun el slug (leccion 1, 2, 3...)
  const m = /(\d+)$/.exec(lesson.slug);
  const idx = m ? Number(m[1]) - 1 : 0;
  const size = 8;
  let batch = all.slice(idx * size, idx * size + size);
  if (batch.length < 4) batch = all.slice(0, Math.max(size, all.length));
  const pool = all;

  const steps = [];
  for (const v of batch) {
    steps.push({
      kind: 'teach_word',
      vocabId: v.id,
      lemma: v.lemma,
      reading: v.reading || null,
      ipa: v.ipa || null,
      pos: v.pos || null,
      gender: v.gender || null,
      translation: v.translation,
      example: v.example_target || null,
      exampleSource: v.example_source || null,
      audio: v.lemma,
    });
  }

  const exSteps = [];
  batch.forEach((v, i) => {
    exSteps.push({ kind: 'exercise', ...buildExercise(v, pool, { script: lang.script }) });
    if (i % 2 === 1) {
      exSteps.push({
        kind: 'exercise',
        ...buildExercise(v, pool, {
          script: lang.script,
          types: ['type_translation', 'reverse_mc', 'listening_choice'],
        }),
      });
    }
  });

  const shuffled = shuffle(exSteps);
  const mid = Math.floor(shuffled.length / 2);
  const withMatch = [
    ...shuffled.slice(0, mid),
    { kind: 'exercise', ...buildMatchPairsRound(batch) },
    ...shuffled.slice(mid),
    { kind: 'exercise', ...buildMatchPairsRound(batch) },
  ];

  return { steps: [...steps, ...withMatch], vocabIds: batch.map((v) => v.id) };
}

function buildGrammarLesson({ skill, lang }) {
  const notes = db.prepare(
    'SELECT * FROM grammar_notes WHERE skill_id = ? OR (language_id = ? AND skill_id IS NULL) ORDER BY id',
  ).all(skill.id, lang.id);
  const vocab = skillVocab(skill.id);
  const steps = [];
  for (const n of notes) {
    steps.push({ kind: 'teach_note', title: n.title, cefr: n.cefr, body: n.body });
  }
  const withExamples = vocab.filter((v) => v.example_target);
  for (const v of shuffle(withExamples).slice(0, 8)) {
    steps.push({
      kind: 'exercise',
      ...buildExercise(v, vocab, { script: lang.script, types: ['fill_blank', 'word_bank', 'type_translation'] }),
    });
  }
  if (steps.length < 3) {
    for (const v of vocab.slice(0, 6)) {
      steps.push({ kind: 'exercise', ...buildExercise(v, vocab, { script: lang.script }) });
    }
  }
  return { steps, vocabIds: withExamples.slice(0, 8).map((v) => v.id) };
}

function buildReadingLesson({ skill, lang }) {
  const reading = db.prepare(
    'SELECT * FROM readings WHERE skill_id = ? OR language_id = ? ORDER BY (skill_id = ?) DESC, id LIMIT 1',
  ).get(skill.id, lang.id, skill.id);
  if (!reading) return buildVocabLesson({ lesson: { slug: 'l1' }, skill, lang });
  let questions = [];
  try { questions = JSON.parse(reading.questions || '[]'); } catch { questions = []; }
  return {
    steps: [
      { kind: 'reading', title: reading.title, cefr: reading.cefr, body: reading.body, translation: reading.translation, audio: reading.body },
      ...questions.map((q) => ({
        kind: 'exercise', type: 'multiple_choice',
        question: q.q, prompt: q.q, options: shuffle(q.options.slice()),
        answer: q.options[q.answer], isComprehension: true,
      })),
    ],
    vocabIds: [],
  };
}

function buildListeningLesson({ skill, lang }) {
  const vocab = skillVocab(skill.id);
  const steps = [];
  for (const v of shuffle(vocab).slice(0, 8)) {
    steps.push({ kind: 'exercise', ...buildExercise(v, vocab, { script: lang.script, types: ['listening_choice'] }) });
  }
  for (const v of shuffle(vocab.filter((x) => x.example_target)).slice(0, 4)) {
    steps.push({
      kind: 'exercise', type: 'dictation',
      question: 'Escribe lo que escuchas', audio: v.example_target,
      expected: v.example_target, hint: v.example_source, vocabId: v.id,
    });
  }
  return { steps, vocabIds: vocab.slice(0, 8).map((v) => v.id) };
}

function buildConversationLesson({ skill, lang }) {
  const dlg = db.prepare(
    'SELECT * FROM dialogues WHERE skill_id = ? OR language_id = ? ORDER BY (skill_id = ?) DESC, id LIMIT 1',
  ).get(skill.id, lang.id, skill.id);
  const vocab = skillVocab(skill.id);
  const steps = [];
  if (dlg) {
    let lines = [];
    try { lines = JSON.parse(dlg.lines || '[]'); } catch { lines = []; }
    steps.push({ kind: 'dialogue', title: dlg.title, scenario: dlg.scenario, lines });
    const usable = lines
      .filter((l) => l.target)
      .map((l) => ({ l, toks: l.target.replace(/[.,!?¿¡"«»;:]/g, ' ').split(/\s+/).filter(Boolean) }))
      .filter(({ toks }) => toks.length >= 3);
    for (const { l, toks } of usable.slice(0, 4)) {
      steps.push({
        kind: 'exercise', type: 'word_bank',
        question: 'Reconstruye la frase del dialogo',
        prompt: l.source, audio: l.target,
        bank: shuffle(toks.slice()),
        expected: toks,
      });
    }
  }
  for (const v of shuffle(vocab).slice(0, 4)) {
    steps.push({
      kind: 'speak_prompt',
      question: 'Di esta frase en voz alta y comprueba tu pronunciacion',
      prompt: v.example_source || v.translation,
      target: v.example_target || v.lemma,
      reading: v.reading || null,
    });
  }
  return { steps, vocabIds: vocab.slice(0, 6).map((v) => v.id) };
}

function buildCheckpoint({ skill, lang }) {
  const vocab = skillVocab(skill.id);
  const steps = shuffle(vocab).slice(0, 14).map((v) => ({
    kind: 'exercise',
    ...buildExercise(v, vocab, { script: lang.script }),
  }));
  return { steps, vocabIds: vocab.map((v) => v.id), checkpoint: true };
}

const GENERATORS = {
  vocab: buildVocabLesson,
  grammar: buildGrammarLesson,
  reading: buildReadingLesson,
  listening: buildListeningLesson,
  conversation: buildConversationLesson,
  checkpoint: buildCheckpoint,
};

/* --------------------------------------------------------------- *
 *  Rutas
 * --------------------------------------------------------------- */

export default function register(router) {
  router.get('/api/lessons/:id', ({ params, user }) => {
    const { lesson, skill, lang } = loadLesson(params.id);
    ensureEnrollment(user.id, lang.id);
    const gen = GENERATORS[lesson.kind] || buildVocabLesson;
    const { steps, vocabIds, checkpoint } = gen({ lesson, skill, lang });

    db.prepare(`
      INSERT INTO lesson_progress (user_id, lesson_id, status, attempts)
      VALUES (?, ?, 'in_progress', 0)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET updated_at = datetime('now')
    `).run(user.id, lesson.id);

    return {
      lesson: {
        id: lesson.id, title: lesson.title, kind: lesson.kind,
        xpAward: lesson.xp_award, skillTitle: skill.title,
        languageCode: lang.code, languageName: lang.name,
        ttsLocale: lang.tts_locale, direction: lang.direction, script: lang.script,
      },
      steps,
      vocabIds,
      checkpoint: !!checkpoint,
    };
  }, { auth: true });

  // registrar una respuesta individual
  router.post('/api/lessons/:id/answer', ({ params, user, body }) => {
    const { lesson, lang } = loadLesson(params.id);
    const correct = !!body.correct;
    const close = !!body.close;
    const combo = Math.max(0, Number(body.combo) || 0);
    const isNew = !!body.isNew;

    let xp = 0;
    if (correct) xp = 10 + Math.min(combo, 10) + (isNew ? 2 : 0);
    else if (close) xp = 1;

    db.prepare(`
      INSERT INTO attempts (user_id, language_id, lesson_id, type, correct, answer)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.id, lang.id, lesson.id, String(body.type || ''), correct ? 1 : 0,
      typeof body.answer === 'string' ? body.answer.slice(0, 300) : JSON.stringify(body.answer || null));

    const summary = recordActivity({
      userId: user.id, languageId: lang.id, xp, exercises: 1, correct: correct ? 1 : 0,
    });
    return { xp, ...summary };
  }, { auth: true });

  // completar la leccion  (hace falta >= 80% de aciertos para superarla)
  const PASS = 0.8;
  router.post('/api/lessons/:id/complete', ({ params, user, body }) => {
    const { lesson, skill, lang } = loadLesson(params.id);
    const score = Math.max(0, Math.min(1, Number(body.score) || 0));
    const vocabIds = Array.isArray(body.vocabIds) ? body.vocabIds.map(Number).filter(Boolean) : [];
    const passed = score >= PASS;

    const prev = db.prepare(
      'SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?',
    ).get(user.id, lesson.id);
    const firstCompletion = passed && (!prev || prev.status !== 'completed');

    db.prepare(`
      INSERT INTO lesson_progress (user_id, lesson_id, status, best_score, attempts, completed_at, updated_at)
      VALUES (?, ?, ?, ?, 1, ?, datetime('now'))
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
        status = CASE WHEN ? >= ${PASS} THEN 'completed' ELSE lesson_progress.status END,
        best_score = MAX(best_score, excluded.best_score),
        attempts = attempts + 1,
        completed_at = CASE WHEN ? >= ${PASS} THEN COALESCE(lesson_progress.completed_at, datetime('now')) ELSE lesson_progress.completed_at END,
        updated_at = datetime('now')
    `).run(
      user.id, lesson.id, passed ? 'completed' : 'in_progress', score,
      passed ? new Date().toISOString().replace('T', ' ').slice(0, 19) : null,
      score, score,
    );

    // las tarjetas se crean siempre (la exposicion ayuda), aunque no se supere
    const cardsCreated = vocabIds.length
      ? seedCardsForVocab(user.id, lang.id, vocabIds)
      : 0;

    // XP: bonus solo si se supera; algo simbolico si no
    const bonus = passed
      ? (firstCompletion ? Math.round(lesson.xp_award * (0.6 + 0.4 * score))
                         : Math.round(lesson.xp_award * 0.25))
      : Math.round(lesson.xp_award * 0.1);

    const summary = recordActivity({
      userId: user.id, languageId: lang.id, xp: bonus, exercises: 0, correct: 0,
    });

    // siguiente leccion sugerida
    const next = db.prepare(`
      SELECT l.id, l.title, l.slug FROM lessons l
      WHERE l.skill_id = ? AND l.sort_order > (SELECT sort_order FROM lessons WHERE id = ?)
      ORDER BY l.sort_order LIMIT 1
    `).get(skill.id, lesson.id) || db.prepare(`
      SELECT l.id, l.title, l.slug, s.title AS skillTitle FROM lessons l
      JOIN skills s ON s.id = l.skill_id
      WHERE s.language_id = ? AND s.sort_order > (SELECT sort_order FROM skills WHERE id = ?)
      ORDER BY s.sort_order, l.sort_order LIMIT 1
    `).get(lang.id, skill.id);

    return {
      completed: passed,
      passed,
      passMark: PASS,
      score,
      firstCompletion,
      bonusXp: bonus,
      cardsCreated,
      next: passed ? next : null,
      ...summary,
    };
  }, { auth: true });
}
