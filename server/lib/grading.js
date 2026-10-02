/**
 * Correccion de respuestas de texto libre con tolerancia.
 *
 * - normaliza mayusculas, espacios y signos de puntuacion
 * - ignora acentos de forma opcional (para no penalizar de mas al principiante)
 * - acepta variantes separadas por " / " o " , " en la respuesta esperada
 * - acepta articulos iniciales opcionales (el, la, un, the, le, der...)
 * - devuelve una distancia de edicion para dar feedback "casi correcto"
 */

const LEADING_ARTICLES = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'the', 'a', 'an',
  'le', 'les', 'un', 'une', 'des', 'du', 'la',
  'der', 'die', 'das', 'ein', 'eine',
  'il', 'lo', 'gli', 'una', 'uno',
  'o', 'os', 'as', 'um', 'uma',
  'de', 'het', 'een',
  'to', // infinitivos en ingles: "to go"
]);

export function stripDiacritics(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function normalize(str, { keepDiacritics = false } = {}) {
  let s = String(str ?? '').trim().toLowerCase();
  s = s.replace(/[‘’“”]/g, "'");
  s = s.replace(/[.,!?;:¿¡"«»()\[\]{}]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  if (!keepDiacritics) s = stripDiacritics(s);
  return s;
}

function dropLeadingArticle(s) {
  const parts = s.split(' ');
  if (parts.length > 1 && LEADING_ARTICLES.has(parts[0])) return parts.slice(1).join(' ');
  return s;
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const prev = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diag + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diag = tmp;
    }
  }
  return prev[n];
}

/**
 * @param {string} answer     lo que escribio el usuario
 * @param {string|string[]} expected  respuesta(s) aceptada(s)
 * @param {object} opts
 * @returns {{correct:boolean, close:boolean, distance:number, matched:string|null}}
 */
export function gradeText(answer, expected, opts = {}) {
  const variants = (Array.isArray(expected) ? expected : String(expected).split(/\s*[/,;]\s*|\s+o\s+/i))
    .map((v) => v.trim())
    .filter(Boolean);

  const candidates = new Set();
  for (const v of variants) {
    const n = normalize(v, opts);
    candidates.add(n);
    candidates.add(dropLeadingArticle(n));
    const nd = normalize(v, { ...opts, keepDiacritics: false });
    candidates.add(nd);
    candidates.add(dropLeadingArticle(nd));
  }

  const given = normalize(answer, opts);
  const givenNoArt = dropLeadingArticle(given);
  const givenNoDia = normalize(answer, { ...opts, keepDiacritics: false });

  if (candidates.has(given) || candidates.has(givenNoArt) || candidates.has(givenNoDia)) {
    return { correct: true, close: false, distance: 0, matched: variants[0] };
  }

  let best = Infinity;
  for (const c of candidates) {
    if (!c) continue;
    best = Math.min(best, levenshtein(givenNoDia, c), levenshtein(givenNoArt, c));
  }
  const threshold = best <= 2 && variants[0] && variants[0].length >= 4;
  return { correct: false, close: !!threshold, distance: best, matched: null };
}

/** Comparacion exacta para opcion multiple / emparejar (por id o valor). */
export function gradeChoice(answer, expected) {
  return { correct: String(answer) === String(expected), close: false, distance: answer === expected ? 0 : 1, matched: null };
}
