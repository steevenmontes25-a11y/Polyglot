/**
 * Motor de ejercicios del cliente: renderiza cada tipo, corrige la
 * respuesta en el navegador (feedback instantaneo) y avisa al
 * contenedor mediante callbacks.
 *
 *   createExercise(exercise, {
 *     ttsLocale, script, direction,
 *     onGraded(result),   // { correct, close, answer, rating? }
 *     onContinue(),
 *   }) -> { node }
 */
import { h, mount } from './ui.js';
import { tts } from './tts.js';

/* ---------------- correccion de texto ---------------- */
function stripDiacritics(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}
export function normalize(str, keepDia = false) {
  let s = String(str ?? '').trim().toLowerCase();
  s = s.replace(/[‘’]/g, "'").replace(/[.,!?;:¿¡"«»()\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!keepDia) s = stripDiacritics(s);
  return s;
}
const ARTICLES = new Set(['el','la','los','las','un','una','the','a','an','le','les','der','die','das','il','lo','o','de','het','een','to']);
function dropArticle(s) {
  const p = s.split(' ');
  return p.length > 1 && ARTICLES.has(p[0]) ? p.slice(1).join(' ') : s;
}
function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const dp = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]; dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const t = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = t;
    }
  }
  return dp[n];
}
export function gradeText(answer, expected, { keepDia = false } = {}) {
  const variants = (Array.isArray(expected) ? expected : String(expected).split(/\s*[/,;]\s*|\s+o\s+/i))
    .map((v) => v.trim()).filter(Boolean);
  const cand = new Set();
  for (const v of variants) {
    const n = normalize(v, keepDia);
    cand.add(n); cand.add(dropArticle(n));
    const nd = normalize(v, false);
    cand.add(nd); cand.add(dropArticle(nd));
  }
  const g = normalize(answer, keepDia);
  const gd = normalize(answer, false);
  if (cand.has(g) || cand.has(dropArticle(g)) || cand.has(gd) || cand.has(dropArticle(gd))) {
    return { correct: true, close: false };
  }
  let best = Infinity;
  for (const c of cand) if (c) best = Math.min(best, lev(gd, c));
  return { correct: false, close: best <= 2 && variants[0]?.length >= 4 };
}

/* ---------------- helpers de render ---------------- */
function speakBtn(text, locale, big = false) {
  return h('button', {
    class: `speak-btn ${big ? 'big' : ''}`, type: 'button', title: 'Escuchar',
    onclick: () => tts.speak(text, locale),
  }, '🔊');
}

const RATINGS = [
  { r: 0, label: 'Otra vez', hint: '<1 min' },
  { r: 1, label: 'Dificil', hint: 'corto' },
  { r: 2, label: 'Bien', hint: 'normal' },
  { r: 3, label: 'Facil', hint: 'largo' },
];

/* ---------------- componente principal ---------------- */
export function createExercise(ex, opts) {
  const { ttsLocale, direction = 'ltr', onGraded, onContinue } = opts;
  const rtl = direction === 'rtl';
  const node = h('div', { class: 'q-card' });
  let graded = false;
  let picked = null;           // opcion / texto / orden
  const state = { done: false };

  const actionRow = h('div', { style: { marginTop: 'auto', paddingTop: '18px' } });
  const feedbackSlot = h('div');

  function setAction(label, cls, onclick, disabled) {
    mount(actionRow, h('button', { class: `btn ${cls} block lg`, disabled: disabled ? true : null, onclick }, label));
  }

  function showFeedback(res, solution) {
    graded = true;
    state.done = true;
    const cls = res.correct ? 'ok' : (res.close ? 'no' : 'no');
    mount(feedbackSlot, h('div', { class: `feedback ${res.correct ? 'ok' : 'no'}` },
      h('div', {},
        h('div', {}, res.correct ? '¡Correcto!' : (res.close ? 'Casi… revisa la tilde o una letra' : 'No exactamente')),
        !res.correct && solution ? h('div', { class: 'sol' }, `Respuesta: ${solution}`) : null,
      ),
    ));
    setAction('Continuar', 'primary', () => onContinue());
    onGraded({ ...res, answer: picked });
  }

  function grade() {
    if (graded) return;
    let res, solution;
    switch (ex.type) {
      case 'multiple_choice':
      case 'reverse_mc':
      case 'listening_choice':
        res = { correct: picked === ex.answer, close: false };
        solution = ex.answer;
        break;
      case 'type_translation':
      case 'fill_blank':
        res = gradeText(picked || '', ex.expected);
        solution = Array.isArray(ex.expected) ? ex.expected[0] : ex.expected;
        break;
      case 'dictation':
        res = gradeText(picked || '', ex.expected, { keepDia: true });
        solution = ex.expected;
        break;
      case 'word_bank': {
        const got = (picked || []).join(' ');
        res = gradeText(got, (ex.expected || []).join(' '), { keepDia: true });
        solution = (ex.expected || []).join(' ');
        break;
      }
      case 'match_pairs': {
        const ok = ex.pairs.every((p) => String(picked?.[p.id]) === String(p.id));
        res = { correct: ok, close: false };
        solution = null;
        break;
      }
      default:
        res = { correct: false, close: false };
    }
    renderPickedLock(res);
    showFeedback(res, solution);
  }

  function renderPickedLock(res) {
    // marca visualmente las opciones tras corregir
    node.querySelectorAll('.opt').forEach((b) => {
      const val = b.dataset.val;
      if (val === ex.answer) b.classList.add('correct');
      else if (val === picked && !res.correct) b.classList.add('wrong');
      b.style.pointerEvents = 'none';
    });
  }

  /* ---- construccion segun tipo ---- */
  const kindLabel = {
    multiple_choice: 'Opcion multiple', reverse_mc: 'Elige la traduccion',
    listening_choice: 'Comprension oral', type_translation: 'Traduce',
    fill_blank: 'Completa', word_bank: 'Ordena', match_pairs: 'Empareja',
    dictation: 'Dictado', flashcard: 'Tarjeta',
  }[ex.type] || '';

  node.append(h('div', { class: 'q-kind' }, kindLabel));
  node.append(h('div', { class: 'q-title' }, ex.question || ''));

  if (ex.type === 'multiple_choice' || ex.type === 'reverse_mc' || ex.type === 'listening_choice') {
    if (ex.type === 'listening_choice') {
      node.append(h('div', { class: 'q-prompt' }, speakBtn(ex.audio, ttsLocale, true)));
      setTimeout(() => tts.speak(ex.audio, ttsLocale), 350);
    } else if (ex.prompt) {
      node.append(h('div', { class: `q-prompt ${rtl && ex.type !== 'reverse_mc' ? 'rtl' : ''}` },
        ex.type === 'multiple_choice' ? speakBtn(ex.audio || ex.prompt, ttsLocale) : null,
        h('span', {}, ex.prompt,
          ex.promptReading ? h('span', { class: 'reading' }, ex.promptReading) : null),
      ));
    }
    const opts = h('div', { class: 'opts' });
    for (const o of ex.options) {
      const rd = ex.optionReadings && ex.optionReadings[o];
      const btn = h('button', { class: 'opt', dataset: { val: o }, onclick: () => {
        picked = o;
        opts.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', b === btn));
        setAction('Comprobar', 'primary', grade, false);
      } }, h('span', {}, o), rd ? h('span', { class: 'rd' }, rd) : null);
      opts.append(btn);
    }
    node.append(opts);
    setAction('Comprobar', 'primary', grade, true);
  }

  else if (ex.type === 'type_translation' || ex.type === 'fill_blank' || ex.type === 'dictation') {
    if (ex.type === 'fill_blank') {
      node.append(h('div', { class: `q-prompt ${rtl ? 'rtl' : ''}`, style: { fontSize: '22px' } },
        speakBtn(ex.audio || ex.prompt, ttsLocale), h('span', {}, ex.prompt)));
      if (ex.hint) node.append(h('p', { class: 'muted small center' }, ex.hint));
    } else if (ex.type === 'dictation') {
      node.append(h('div', { class: 'q-prompt' }, speakBtn(ex.audio, ttsLocale, true)));
      if (ex.hint) node.append(h('p', { class: 'muted small center' }, `Pista: ${ex.hint}`));
      setTimeout(() => tts.speak(ex.audio, ttsLocale), 350);
    } else {
      node.append(h('div', { class: 'q-prompt' }, h('span', {}, ex.prompt)));
    }
    const inp = h('input', {
      class: 'input', placeholder: 'Escribe aqui…', autocomplete: 'off',
      autocapitalize: 'off', spellcheck: 'false',
      dir: (ex.type !== 'type_translation' && rtl) ? 'rtl' : 'ltr',
      oninput: () => { picked = inp.value; setAction('Comprobar', 'primary', grade, !inp.value.trim()); },
      onkeydown: (e) => { if (e.key === 'Enter') { if (!graded && inp.value.trim()) grade(); else if (graded) onContinue(); } },
    });
    node.append(inp);
    setTimeout(() => inp.focus(), 30);
    setAction('Comprobar', 'primary', grade, true);
  }

  else if (ex.type === 'word_bank') {
    node.append(h('div', { class: 'q-prompt', style: { fontSize: '18px' } },
      ex.audio ? speakBtn(ex.audio, ttsLocale) : null, h('span', {}, ex.prompt)));
    const answer = h('div', { class: `word-bank answer ${rtl ? 'rtl' : ''}` });
    const bankBox = h('div', { class: 'word-bank' });
    const chosen = [];
    function sync() {
      picked = chosen.slice();
      mount(answer, chosen.length ? chosen.map((w, i) =>
        h('span', { class: 'token', onclick: () => { if (graded) return; chosen.splice(i, 1); rebuild(); } }, w))
        : h('span', { class: 'faint small' }, 'Toca las palabras en orden'));
      setAction('Comprobar', 'primary', grade, chosen.length === 0);
    }
    function rebuild() {
      const used = {};
      mount(bankBox, ex.bank.map((w, i) => {
        const takenCount = chosen.filter((c) => c === w).length;
        const seen = (used[w] = (used[w] || 0) + 1);
        const isUsed = seen <= takenCount;
        return h('span', {
          class: 'token', style: { opacity: isUsed ? '.25' : '1', pointerEvents: isUsed || graded ? 'none' : 'auto' },
          onclick: () => { chosen.push(w); rebuild(); },
        }, w);
      }));
      sync();
    }
    node.append(answer, bankBox);
    rebuild();
    setAction('Comprobar', 'primary', grade, true);
  }

  else if (ex.type === 'match_pairs') {
    const sel = {};                 // { leftId: rightId }
    let activeLeft = null;
    const left = h('div', { class: 'col' });
    const right = h('div', { class: 'col' });
    function paint() {
      left.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', b.dataset.id === activeLeft));
      right.querySelectorAll('.opt').forEach((b) => {
        const usedBy = Object.entries(sel).find(([, rid]) => rid === b.dataset.id);
        b.classList.toggle('correct', !!usedBy);
      });
      picked = { ...sel };
      const complete = Object.keys(sel).length === ex.pairs.length;
      setAction('Comprobar', 'primary', grade, !complete);
    }
    for (const l of ex.left) {
      left.append(h('button', { class: 'opt', dataset: { id: l.id }, onclick: () => {
        activeLeft = String(l.id); paint();
      } }, h('span', {}, l.text), l.reading ? h('span', { class: 'rd' }, l.reading) : null));
    }
    for (const r of ex.right) {
      right.append(h('button', { class: 'opt', dataset: { id: r.id }, onclick: () => {
        if (activeLeft == null) return;
        for (const k of Object.keys(sel)) if (sel[k] === String(r.id)) delete sel[k];
        sel[activeLeft] = String(r.id);
        activeLeft = null; paint();
      } }, r.text));
    }
    node.append(h('div', { class: 'match-cols' }, left, right));
    setAction('Comprobar', 'primary', grade, true);
  }

  else if (ex.type === 'flashcard') {
    const front = h('div', { class: `q-prompt ${rtl ? 'rtl' : ''}` },
      speakBtn(ex.audio || ex.lemma, ttsLocale, true),
      h('span', {}, ex.lemma, ex.reading ? h('span', { class: 'reading' }, ex.reading) : null));
    const back = h('div', { class: 'center', hidden: true },
      h('div', { style: { fontSize: '22px', fontWeight: '650', margin: '10px 0' } }, ex.translation),
      ex.example ? h('p', { class: 'muted small' }, ex.example) : null);
    node.append(front, back);
    setAction('Mostrar respuesta', 'primary', () => {
      back.hidden = false;
      mount(actionRow, h('div', { class: 'srs-rate' },
        ...RATINGS.map((rt) => h('button', { onclick: () => {
          picked = rt.r;
          onGraded({ correct: rt.r >= 2, close: false, rating: rt.r, answer: rt.r });
          onContinue();
        } }, h('b', {}, rt.label), h('span', {}, rt.hint)))));
    });
  }

  node.append(feedbackSlot, actionRow);
  return { node };
}

/** Traduce correccion binaria -> valoracion SRS (para repasos con opcion/typing). */
export function ratingFromResult(res, { fast = false } = {}) {
  if (!res.correct) return 0;              // otra vez
  if (res.close) return 1;                 // dificil
  return fast ? 3 : 2;                     // facil / bien
}
