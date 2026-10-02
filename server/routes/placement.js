import { createHmac } from 'node:crypto';
import { db } from '../db.js';
import { HttpError } from '../lib/http.js';
import { JWT_SECRET } from '../config.js';
import { langByCode, ensureEnrollment, applyPlacementHead } from '../lib/queries.js';
import { shuffle } from '../lib/exercises.js';
import { gradeText } from '../lib/grading.js';
import { blueprintFor, bankFor, IDK } from '../lib/placement-bank.js';

/* ---------- sellado del solucionario ---------- */
function seal(payload) {
  const b = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', JWT_SECRET).update(b).digest('base64url');
  return `${b}.${sig}`;
}
function unseal(token) {
  const [b, sig] = String(token).split('.');
  if (!b || !sig) throw new HttpError(400, 'Test invalido');
  if (createHmac('sha256', JWT_SECRET).update(b).digest('base64url') !== sig) {
    throw new HttpError(400, 'Test manipulado');
  }
  return JSON.parse(Buffer.from(b, 'base64url').toString('utf8'));
}

const firstVariant = (s) => String(s).split(/\s*[/,;]\s*/)[0].trim();
const LEVEL_ORDER = ['A1', 'A1+', 'A2', 'A2+', 'B1'];
const minLevel = (a, b) => LEVEL_ORDER[Math.min(LEVEL_ORDER.indexOf(a), LEVEL_ORDER.indexOf(b))];

function tokenize(s) { return String(s).trim().split(/\s+/).filter(Boolean); }
function blankExample(sentence, lemma) {
  const words = tokenize(sentence);
  if (words.length < 3) return null;
  const t = lemma.toLowerCase();
  let idx = words.findIndex((w) => w.replace(/[.,!?;:¿¡"«»()]/g, '').toLowerCase() === t);
  if (idx === -1) return null;
  const removed = words[idx].replace(/[.,!?;:¿¡"«»()]/g, '');
  words[idx] = '_____';
  return { text: words.join(' '), removed };
}

/* ---------- construccion del test ---------- */
function buildTest(lang) {
  const bp = blueprintFor(lang.family);
  const useScript = lang.script !== 'latin';
  const cjkLike = ['Japonica', 'Coreanica', 'Sinotibetana', 'Semitica'].includes(lang.family);

  const vocab = db.prepare(`
    SELECT v.*, s.sort_order AS skill_order
    FROM vocab v JOIN skills s ON s.id = v.skill_id
    WHERE v.language_id = ?
  `).all(lang.id);
  if (vocab.length < 12) throw new HttpError(404, 'Ese idioma aun no tiene contenido para el test');
  vocab.sort((a, b) => (a.skill_order - b.skill_order) || (b.frequency - a.frequency));

  const cut = Math.floor(vocab.length * 0.45);
  const poolA1 = vocab.slice(0, cut);
  const poolA2 = vocab.slice(cut);
  const pick = (arr, n, used) => {
    const out = [];
    for (const v of shuffle(arr)) {
      if (used.has(v.id)) continue;
      used.add(v.id);
      out.push(v);
      if (out.length >= n) break;
    }
    return out;
  };

  const used = new Set();
  const questions = [];
  const key = [];
  let qn = 0;
  const bank = shuffle(bankFor(lang.code));
  let bankPtr = 0;

  const glossHint = (v) => [v.pos, v.gender].filter(Boolean).join(' · ') || null;

  const addRecall = (v, weight, band) => {
    const answers = v.reading ? [v.lemma, v.reading] : [v.lemma];
    questions.push({
      n: qn, kind: 'recall', band,
      q: `Escribe en ${lang.name.toLowerCase()}:`, prompt: firstVariant(v.translation),
      hint: glossHint(v), accepts: v.reading ? 'palabra o su transcripcion' : null,
    });
    key.push({ n: qn, group: 'production', typed: true, answer: answers, weight });
    qn++;
  };
  const addRecognize = (v, weight, band, poolForDistractors) => {
    const correct = firstVariant(v.translation);
    const distractors = shuffle(poolForDistractors.filter((x) => x.id !== v.id && firstVariant(x.translation) !== correct))
      .slice(0, 3).map((x) => firstVariant(x.translation));
    const opts = shuffle([correct, ...distractors]);
    questions.push({
      n: qn, kind: 'recognize', band, q: `¿Que significa esta palabra?`,
      prompt: v.lemma, reading: v.reading || null, options: [...opts, IDK],
    });
    key.push({ n: qn, group: 'recognition', typed: false, answer: correct, weight });
    qn++;
  };
  const addCloze = (v, weight, band) => {
    const b = blankExample(v.example_target, v.lemma);
    if (!b) return false;
    questions.push({
      n: qn, kind: 'cloze', band, q: 'Completa la frase', prompt: b.text,
      hint: v.example_source || firstVariant(v.translation),
    });
    key.push({ n: qn, group: 'production', typed: true, answer: [b.removed], weight });
    qn++;
    return true;
  };
  const addListening = (v, weight, band) => {
    if (cjkLike) {
      const correct = firstVariant(v.translation);
      const distractors = shuffle(vocab.filter((x) => x.id !== v.id))
        .slice(0, 3).map((x) => firstVariant(x.translation));
      questions.push({
        n: qn, kind: 'listening', band, mc: true, q: 'Escucha y elige el significado',
        audio: v.lemma, options: [...shuffle([correct, ...distractors]), IDK],
      });
      key.push({ n: qn, group: 'listening', typed: false, answer: correct, weight });
    } else {
      const answers = v.reading ? [v.lemma, v.reading] : [v.lemma];
      questions.push({
        n: qn, kind: 'listening', band, q: 'Escucha y escribe la palabra', audio: v.lemma,
        accepts: v.reading ? 'palabra o su transcripcion' : null,
      });
      key.push({ n: qn, group: 'listening', typed: true, answer: answers, weight });
    }
    qn++;
  };
  const addBankItem = (weight) => {
    if (bankPtr >= bank.length) return false;
    const it = bank[bankPtr++];
    const correct = it.options[it.answer];
    questions.push({
      n: qn, kind: 'bank', band: it.band, q: it.q, prompt: it.prompt || null,
      options: [...shuffle(it.options.slice()), IDK],
    });
    key.push({
      n: qn, group: it.kind === 'script' ? 'script' : 'recognition',
      typed: false, answer: correct, weight: weight ?? it.weight ?? 1.5,
    });
    qn++;
    return true;
  };
  const addScriptGenerated = (v, weight) => {
    if (!v.reading) return false;
    const distractRead = shuffle(vocab.filter((x) => x.reading && x.reading !== v.reading))
      .slice(0, 2).map((x) => x.reading);
    questions.push({
      n: qn, kind: 'script', band: 'A1', q: '¿Como se lee / transcribe?',
      prompt: v.lemma, options: [...shuffle([v.reading, ...distractRead]), IDK],
    });
    key.push({ n: qn, group: 'script', typed: false, answer: v.reading, weight: weight ?? 1 });
    qn++;
    return true;
  };

  for (const sec of bp.sections) {
    if (sec.type === 'script' && !useScript) continue;
    const poolMap = { A1: poolA1, A2: poolA2 };
    const pool = poolMap[sec.band] || vocab;

    if (sec.type === 'recall') {
      for (const v of pick(pool, sec.n, used)) addRecall(v, sec.weight, sec.band);
    } else if (sec.type === 'recognize') {
      for (const v of pick(pool, sec.n, used)) addRecognize(v, sec.weight, sec.band, vocab);
    } else if (sec.type === 'cloze') {
      let got = 0;
      for (const v of pick(pool.filter((x) => x.example_target), sec.n * 3, used)) {
        if (addCloze(v, sec.weight, sec.band)) got++;
        if (got >= sec.n) break;
      }
    } else if (sec.type === 'listening') {
      for (const v of pick(pool, sec.n, used)) addListening(v, sec.weight, sec.band);
    } else if (sec.type === 'script') {
      // primero items de banco de escritura, luego generados
      let placed = 0;
      const scriptBank = bank.filter((b) => b.kind === 'script');
      for (const it of scriptBank) {
        if (placed >= sec.n) break;
        const correct = it.options[it.answer];
        questions.push({
          n: qn, kind: 'script', band: it.band, q: it.q, prompt: it.prompt || null,
          options: [...shuffle(it.options.slice()), IDK],
        });
        key.push({ n: qn, group: 'script', typed: false, answer: correct, weight: it.weight ?? 1 });
        qn++; placed++;
        bank.splice(bank.indexOf(it), 1);
      }
      for (const v of pick(vocab.filter((x) => x.reading), (sec.n - placed) * 3, used)) {
        if (placed >= sec.n) break;
        if (addScriptGenerated(v, sec.weight)) placed++;
      }
    } else if (sec.type === 'bank') {
      for (let i = 0; i < sec.n; i++) if (!addBankItem()) break;
    }
  }

  // ordenar por dificultad percibida (A1 primero) manteniendo variedad
  const bandRank = { A1: 0, 'A1+': 1, A2: 2, 'A2+': 3, B1: 4 };
  const withOrder = questions.map((q, i) => ({ q, i }));
  withOrder.sort((a, b) => (bandRank[a.q.band] ?? 2) - (bandRank[b.q.band] ?? 2) || a.i - b.i);
  const orderedQuestions = withOrder.map(({ q }) => q);

  return {
    blueprint: lang.family,
    hasScript: useScript,
    ticket: seal({ lang: lang.id, key, ts: Date.now() }),
    questions: orderedQuestions,
    totalWeight: Math.round(key.reduce((s, k) => s + k.weight, 0) * 10) / 10,
  };
}

/* ---------- correccion ---------- */
function scoreTest(key, answers) {
  const groups = {}; // group -> { credit, max, correct, wrong, skipped, net }
  const bump = (g) => (groups[g] ||= { credit: 0, max: 0, correct: 0, wrong: 0, skipped: 0, net: 0 });
  const per = [];
  let net = 0, max = 0;

  for (const k of key) {
    const g = bump(k.group);
    g.max += k.weight;
    max += k.weight;
    const raw = answers ? answers[k.n] : undefined;
    const given = raw == null ? '' : String(raw).trim();
    let pts = 0, verdict = 'skip';

    if (!given || given === IDK) {
      g.skipped++;
      verdict = 'skip';
    } else if (k.typed) {
      const res = gradeText(given, k.answer, { keepDiacritics: true });
      if (res.correct) { pts = k.weight; g.credit += k.weight; g.correct++; verdict = 'ok'; }
      else if (res.close) { pts = k.weight * 0.45; g.credit += k.weight * 0.45; g.correct++; verdict = 'close'; }
      else { pts = -k.weight * 0.18; g.wrong++; verdict = 'no'; }
    } else {
      if (given === String(k.answer)) { pts = k.weight; g.credit += k.weight; g.correct++; verdict = 'ok'; }
      else { pts = -k.weight * 0.4; g.wrong++; verdict = 'no'; }
    }
    g.net += pts;
    net += pts;
    per.push({ n: k.n, group: k.group, verdict });
  }

  const acc = {};
  for (const [name, g] of Object.entries(groups)) acc[name] = g.max ? Math.max(0, g.credit / g.max) : 0;
  return { net, max, raw: max ? net / max : 0, groups, acc, per };
}

function bandFromRaw(raw) {
  if (raw < 0.30) return 'A1';
  if (raw < 0.50) return 'A1+';
  if (raw < 0.70) return 'A2';
  if (raw < 0.88) return 'A2+';
  return 'B1';
}

const MESSAGES = {
  A1: 'Empiezas desde cero. Vamos a construir una base firme paso a paso.',
  'A1+': 'Tienes algunas nociones sueltas. Consolidaremos saludos, numeros y frases basicas antes de avanzar.',
  A2: 'Nivel elemental real: reconoces y produces lo esencial. Trabajaremos vocabulario cotidiano y la gramatica de A2.',
  'A2+': 'Base de A2 muy solida, casi listo para B1. Empezaras mas adelante en el temario y con menos repaso inicial.',
  B1: 'Excelente: dominas toda la base disponible. El contenido B1-C2 esta en preparacion; mientras tanto empezaras en A2+ con el temario avanzado desbloqueado.',
};

export default function register(router) {
  router.get('/api/placement/:code', ({ params }) => {
    const lang = langByCode(params.code);
    const t = buildTest(lang);
    return {
      language: { code: lang.code, name: lang.name, flag: lang.flag, ttsLocale: lang.tts_locale, direction: lang.direction, script: lang.script },
      blueprint: t.blueprint,
      hasScript: t.hasScript,
      questionCount: t.questions.length,
      ticket: t.ticket,
      questions: t.questions,
    };
  });

  router.post('/api/placement/:code', ({ params, body, user }) => {
    const lang = langByCode(params.code);
    const data = unseal(body.ticket);
    if (data.lang !== lang.id) throw new HttpError(400, 'El test no corresponde a este idioma');

    const s = scoreTest(data.key, body.answers || {});
    let band = bandFromRaw(s.raw);
    let cap = 'B1';
    let capReason = null;

    const prodAcc = s.acc.production ?? 1;
    if (prodAcc < 0.35) { cap = minLevel(cap, 'A1'); capReason = 'produccion-baja'; }
    else if (prodAcc < 0.60) { cap = minLevel(cap, 'A2'); capReason = 'produccion-parcial'; }

    let level = minLevel(band, cap);

    // filtro de escritura (idiomas con otro alfabeto)
    let scriptFail = false;
    if (s.groups.script && s.acc.script < 0.6) {
      scriptFail = true;
      level = 'A1';
      capReason = 'escritura';
    }

    const enrollLevel = ['A1', 'A1+'].includes(level) ? 'A1' : 'A2';
    const pct = Math.max(0, Math.min(1, s.raw));

    let capNote = null;
    if (capReason === 'escritura') capNote = 'Todavia no lees con fluidez el sistema de escritura. Empiezas en A1 para dominarlo primero.';
    else if (capReason === 'produccion-baja') capNote = 'Reconoces palabras sueltas, pero aun no las produces. Empiezas en A1 para asentar la base activa (no basta con entender: hay que saber decirlo).';
    else if (capReason === 'produccion-parcial') capNote = 'Entiendes bastante, pero la produccion falla. Te situamos en A2 como maximo para reforzar lo activo.';

    let headSkills = [];
    if (user) {
      db.prepare('INSERT INTO placement_results (user_id, language_id, score, level) VALUES (?, ?, ?, ?)')
        .run(user.id, lang.id, s.raw, level);
      const enr = ensureEnrollment(user.id, lang.id, enrollLevel);
      db.prepare('UPDATE enrollments SET level = ? WHERE id = ?').run(enrollLevel, enr.id);
      headSkills = applyPlacementHead(user.id, lang.id, level, s.raw);
    }

    const groupLabels = { production: 'Produccion (escribir)', recognition: 'Reconocimiento', listening: 'Comprension oral', script: 'Escritura / lectura' };
    const groups = Object.entries(s.groups).map(([name, g]) => ({
      name, label: groupLabels[name] || name,
      accuracy: Math.round((s.acc[name] || 0) * 100) / 100,
      correct: g.correct, wrong: g.wrong, skipped: g.skipped,
    }));

    return {
      level, band, enrollLevel,
      pct: Math.round(pct * 100),
      rawScore: Math.round(s.raw * 100),
      capApplied: level !== band,
      capReason, capNote,
      scriptFail,
      correct: s.per.filter((p) => p.verdict === 'ok' || p.verdict === 'close').length,
      wrong: s.per.filter((p) => p.verdict === 'no').length,
      skipped: s.per.filter((p) => p.verdict === 'skip').length,
      total: data.key.length,
      groups,
      perQuestion: s.per,
      headSkills,
      saved: !!user,
      message: MESSAGES[level],
    };
  });
}
