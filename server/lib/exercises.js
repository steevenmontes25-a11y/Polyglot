/**
 * Generador de ejercicios a partir de vocabulario.
 * Se usa tanto para las lecciones (learn) como para los repasos (review).
 *
 * Tipos: flashcard, multiple_choice, reverse_mc, listening_choice,
 *        type_translation, fill_blank, word_bank, match_pairs.
 */

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function distractors(target, pool, key, n = 3) {
  const seen = new Set([String(target[key]).toLowerCase()]);
  const out = [];
  for (const item of shuffle(pool)) {
    const v = String(item[key] ?? '').trim();
    if (!v || seen.has(v.toLowerCase())) continue;
    seen.add(v.toLowerCase());
    out.push(v);
    if (out.length >= n) break;
  }
  return out;
}

function firstVariant(translation) {
  return String(translation).split(/\s*[/,;]\s*/)[0].trim();
}

function tokenize(sentence) {
  return String(sentence).trim().split(/\s+/).filter(Boolean);
}

function blankOut(sentence, lemma) {
  const words = tokenize(sentence);
  if (words.length < 3) return null; // hace falta contexto alrededor del hueco
  const target = lemma.toLowerCase();
  let idx = words.findIndex((w) => w.replace(/[.,!?;:¿¡"«»()]/g, '').toLowerCase() === target);
  if (idx === -1) idx = words.findIndex((w) => w.toLowerCase().includes(target) && target.length > 2 && w.length <= target.length + 2);
  if (idx === -1) return null;
  const clean = words[idx];
  words[idx] = '_____';
  return { text: words.join(' '), removed: clean.replace(/[.,!?;:¿¡"«»()]/g, ''), raw: clean };
}

/**
 * @param {'es->L2'|'L2->es'} direction  sentido de la pregunta
 */
export function buildExercise(target, pool, { direction = 'mix', types, script = 'latin' } = {}) {
  const allowed = types || [
    'multiple_choice', 'reverse_mc', 'type_translation',
    'listening_choice', 'fill_blank', 'word_bank',
  ];
  const canFill = !!target.example_target && !!blankOut(target.example_target, target.lemma);
  const hasSpaces = !!target.example_target && tokenize(target.example_target).length >= 4;
  const canWordBank = hasSpaces && !['han', 'kana'].includes(script);

  const menu = allowed.filter((t) => {
    if (t === 'fill_blank') return canFill;
    if (t === 'word_bank') return canWordBank;
    return true;
  });
  const type = pick(menu.length ? menu : ['multiple_choice']);

  const base = { vocabId: target.id, lemma: target.lemma, reading: target.reading || null,
    translation: target.translation, example: target.example_target || null,
    exampleSource: target.example_source || null };

  switch (type) {
    case 'multiple_choice': {
      const correct = firstVariant(target.translation);
      const opts = shuffle([correct, ...distractors(target, pool, 'translation')].map(firstVariant));
      return {
        ...base, type: 'multiple_choice',
        prompt: target.lemma, promptReading: target.reading || null,
        audio: target.lemma,
        options: opts, answer: correct,
        question: '¿Que significa esta palabra?',
      };
    }
    case 'reverse_mc': {
      const opts = shuffle([target.lemma, ...distractors(target, pool, 'lemma')]);
      return {
        ...base, type: 'reverse_mc',
        prompt: firstVariant(target.translation),
        options: opts, answer: target.lemma,
        optionReadings: Object.fromEntries(
          opts.map((o) => [o, (pool.find((p) => p.lemma === o)?.reading) || (o === target.lemma ? target.reading : '') || '']),
        ),
        question: 'Elige la traduccion correcta',
      };
    }
    case 'listening_choice': {
      const correct = firstVariant(target.translation);
      const opts = shuffle([correct, ...distractors(target, pool, 'translation')].map(firstVariant));
      return {
        ...base, type: 'listening_choice',
        audio: target.lemma, autoplay: true,
        prompt: null, promptReading: null,
        options: opts, answer: correct,
        question: 'Escucha y elige el significado',
      };
    }
    case 'type_translation': {
      return {
        ...base, type: 'type_translation',
        prompt: firstVariant(target.translation),
        audio: null,
        expected: target.lemma,
        question: `Escribe en el idioma que estudias`,
      };
    }
    case 'fill_blank': {
      const b = blankOut(target.example_target, target.lemma);
      return {
        ...base, type: 'fill_blank',
        prompt: b.text, hint: target.example_source || firstVariant(target.translation),
        audio: target.example_target,
        expected: b.removed,
        question: 'Completa la frase',
      };
    }
    case 'word_bank': {
      const tokens = tokenize(target.example_target)
        .map((t) => t.replace(/^[¿¡"«(]+|[.,!?;:"»)]+$/g, '').trim())
        .filter(Boolean);
      return {
        ...base, type: 'word_bank',
        prompt: target.example_source || firstVariant(target.translation),
        audio: target.example_target,
        bank: shuffle(tokens),
        expected: tokens,
        question: 'Ordena las palabras',
      };
    }
    default:
      return buildExercise(target, pool, { direction, types: ['multiple_choice'], script });
  }
}

/** Ronda de emparejar: 5 pares palabra <-> traduccion. */
export function buildMatchPairsRound(items) {
  const chosen = shuffle(items).slice(0, 5);
  return {
    type: 'match_pairs',
    question: 'Empareja cada palabra con su significado',
    pairs: chosen.map((v) => ({
      id: v.id, lemma: v.lemma, reading: v.reading || null,
      translation: firstVariant(v.translation),
    })),
    left: shuffle(chosen.map((v) => ({ id: v.id, text: v.lemma, reading: v.reading || null }))),
    right: shuffle(chosen.map((v) => ({ id: v.id, text: firstVariant(v.translation) }))),
  };
}

/**
 * Corrige un ejercicio en el servidor a partir de su definicion y la respuesta.
 * (import perezoso de grading para no crear ciclos)
 */
export async function gradeExercise(exercise, answer) {
  const { gradeText, gradeChoice } = await import('./grading.js');
  switch (exercise.type) {
    case 'multiple_choice':
    case 'reverse_mc':
    case 'listening_choice':
      return gradeChoice(answer, exercise.answer);
    case 'type_translation':
    case 'fill_blank':
      return gradeText(answer, exercise.expected);
    case 'word_bank': {
      const got = Array.isArray(answer) ? answer.join(' ') : String(answer);
      const want = exercise.expected.join(' ');
      return gradeText(got, want, { keepDiacritics: true });
    }
    case 'match_pairs': {
      // answer = { [leftId]: rightId }
      const ok = exercise.pairs.every((p) => String(answer?.[p.id]) === String(p.id));
      return { correct: ok, close: false, distance: ok ? 0 : 1, matched: null };
    }
    case 'flashcard':
      return { correct: answer !== 0 && answer !== 'again', close: false, distance: 0, matched: null };
    default:
      return { correct: false, close: false, distance: 1, matched: null };
  }
}
