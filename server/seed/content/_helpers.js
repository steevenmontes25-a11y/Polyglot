/**
 * Normaliza el formato compacto de los ficheros de contenido a filas
 * listas para insertar en la base de datos.
 *
 * Fila de vocabulario (array):
 *   [ lemma, translation, pos?, reading?, exampleTarget?, exampleSource?, gender? ]
 *   - lemma        : palabra/expresion en el idioma que se estudia
 *   - translation  : traduccion al espanol (varias separadas por " / ")
 *   - pos          : categoria gramatical (sust., verbo, adj., adv., interj., expr.)
 *   - reading      : romanizacion / transliteracion (idiomas con otro alfabeto)
 *   - example*     : frase de ejemplo y su traduccion
 *   - gender       : m / f / n  (para lenguas con genero)
 */
export function normalizeContent(raw) {
  const vocab = [];
  for (const [skillSlug, rows] of Object.entries(raw.vocab || {})) {
    rows.forEach((row, i) => {
      if (Array.isArray(row)) {
        const [lemma, translation, pos, reading, exampleTarget, exampleSource, gender] = row;
        vocab.push({
          skillSlug, lemma, translation,
          pos: pos || null, reading: reading || null, ipa: null,
          exampleTarget: exampleTarget || null, exampleSource: exampleSource || null,
          gender: gender || null,
          frequency: 1000 - i, // el orden del fichero marca la prioridad
        });
      } else {
        vocab.push({
          skillSlug,
          lemma: row.lemma, translation: row.translation,
          pos: row.pos || null, reading: row.reading || null, ipa: row.ipa || null,
          exampleTarget: row.example || row.exampleTarget || null,
          exampleSource: row.exampleSource || null,
          gender: row.gender || null,
          frequency: row.frequency ?? (1000 - i),
        });
      }
    });
  }
  return {
    code: raw.code,
    vocab,
    grammar: (raw.grammar || []).map((g) => ({
      skillSlug: g.skill || g.skillSlug || null,
      slug: g.slug, title: g.title, cefr: g.cefr || 'A1', body: g.body.trim(),
    })),
    readings: (raw.readings || []).map((r) => ({
      skillSlug: r.skill || r.skillSlug || null,
      title: r.title, cefr: r.cefr || 'A1',
      body: r.body.trim(), translation: (r.translation || '').trim() || null,
      questions: r.questions || [],
    })),
    dialogues: (raw.dialogues || []).map((d) => ({
      skillSlug: d.skill || d.skillSlug || null,
      title: d.title, cefr: d.cefr || 'A1', scenario: d.scenario || null,
      lines: d.lines || [],
    })),
  };
}
