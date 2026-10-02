import { db, initSchema, dropAll } from '../db.js';
import { LANGUAGES } from './languages.js';
import { SKILL_TREE } from './skills.js';
import { normalizeContent } from './content/_helpers.js';
import { hashPassword } from '../lib/auth.js';
import { seedCardsForVocab, recordActivity } from '../lib/queries.js';

const args = new Set(process.argv.slice(2));
const RESET = args.has('--reset') || args.has('--demo');
const DEMO = args.has('--demo');
const FORCE = args.has('--force');

function lessonsForSkill({ vocabCount, hasGrammar, hasReading, hasDialogue }) {
  const out = [];
  if (vocabCount >= 4) out.push({ slug: 'l1', title: 'Palabras 1', kind: 'vocab', xp: 20 });
  if (vocabCount >= 12) out.push({ slug: 'l2', title: 'Palabras 2', kind: 'vocab', xp: 20 });
  if (hasGrammar) out.push({ slug: 'g1', title: 'Gramatica', kind: 'grammar', xp: 25 });
  if (vocabCount >= 6) out.push({ slug: 'list1', title: 'Escucha', kind: 'listening', xp: 20 });
  if (hasReading) out.push({ slug: 'r1', title: 'Lectura', kind: 'reading', xp: 25 });
  if (hasDialogue) out.push({ slug: 'c1', title: 'Conversacion', kind: 'conversation', xp: 25 });
  if (vocabCount >= 6) out.push({ slug: 'chk', title: 'Repaso', kind: 'checkpoint', xp: 30 });
  return out;
}

async function loadContent(code) {
  try {
    const mod = await import(`./content/${code}.js`);
    return normalizeContent(mod.default);
  } catch (err) {
    console.warn(`  · sin contenido para "${code}" (${err.message})`);
    return { code, vocab: [], grammar: [], readings: [], dialogues: [] };
  }
}

async function main() {
  console.log('\n=== Polyglot :: sembrado de la base de datos ===\n');

  const existing = (() => {
    try { return db.prepare('SELECT COUNT(*) c FROM languages').get().c; } catch { return 0; }
  })();

  if (existing > 0 && !RESET && !FORCE) {
    console.log(`La base de datos ya tiene ${existing} idiomas.`);
    console.log('Usa  npm run reset  para regenerarla desde cero (borra el progreso),');
    console.log('o    npm run demo   para regenerarla con un usuario de prueba.\n');
    process.exit(0);
  }

  if (RESET) {
    console.log('· Borrando tablas...');
    dropAll();
  }
  initSchema();

  const insertLang = db.prepare(`
    INSERT INTO languages (code, name, native_name, flag, direction, script, difficulty, tts_locale, family, blurb)
    VALUES (@code, @name, @native_name, @flag, @direction, @script, @difficulty, @tts_locale, @family, @blurb)
    ON CONFLICT(code) DO UPDATE SET
      name=excluded.name, native_name=excluded.native_name, flag=excluded.flag,
      direction=excluded.direction, script=excluded.script, difficulty=excluded.difficulty,
      tts_locale=excluded.tts_locale, family=excluded.family, blurb=excluded.blurb
  `);

  const upsertSkill = db.prepare(`
    INSERT INTO skills (language_id, slug, title, description, cefr, category, icon, sort_order)
    VALUES (@language_id, @slug, @title, @description, @cefr, @category, @icon, @sort_order)
    ON CONFLICT(language_id, slug) DO UPDATE SET
      title=excluded.title, description=excluded.description, cefr=excluded.cefr,
      category=excluded.category, icon=excluded.icon, sort_order=excluded.sort_order
  `);
  const getSkill = db.prepare('SELECT id FROM skills WHERE language_id=? AND slug=?');
  const insertLesson = db.prepare(`
    INSERT INTO lessons (skill_id, slug, title, kind, xp_award, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(skill_id, slug) DO UPDATE SET title=excluded.title, kind=excluded.kind,
      xp_award=excluded.xp_award, sort_order=excluded.sort_order
  `);
  const insertVocab = db.prepare(`
    INSERT INTO vocab (language_id, skill_id, lemma, translation, pos, reading, ipa,
      example_target, example_source, gender, frequency)
    VALUES (@language_id, @skill_id, @lemma, @translation, @pos, @reading, @ipa,
      @example_target, @example_source, @gender, @frequency)
  `);
  const insertGrammar = db.prepare(`
    INSERT INTO grammar_notes (language_id, skill_id, slug, title, cefr, body)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(language_id, slug) DO UPDATE SET title=excluded.title, body=excluded.body, cefr=excluded.cefr
  `);
  const insertReading = db.prepare(`
    INSERT INTO readings (language_id, skill_id, title, cefr, body, translation, questions)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertDialogue = db.prepare(`
    INSERT INTO dialogues (language_id, skill_id, title, cefr, scenario, lines)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let totals = { langs: 0, skills: 0, lessons: 0, vocab: 0, grammar: 0, readings: 0, dialogues: 0 };

  // cargar todo el contenido antes de abrir la transaccion
  const contentByCode = {};
  for (const lang of LANGUAGES) {
    contentByCode[lang.code] = await loadContent(lang.code);
  }

  db.exec('BEGIN');
  try {
    for (const lang of LANGUAGES) {
      insertLang.run(lang);
      const langRow = db.prepare('SELECT id FROM languages WHERE code=?').get(lang.code);
      const langId = langRow.id;
      totals.langs++;

      // limpiar contenido previo de este idioma (reseed limpio)
      db.prepare('DELETE FROM vocab WHERE language_id=?').run(langId);
      db.prepare('DELETE FROM grammar_notes WHERE language_id=?').run(langId);
      db.prepare('DELETE FROM readings WHERE language_id=?').run(langId);
      db.prepare('DELETE FROM dialogues WHERE language_id=?').run(langId);
      db.prepare('DELETE FROM lessons WHERE skill_id IN (SELECT id FROM skills WHERE language_id=?)').run(langId);

      const content = contentByCode[lang.code];
      const vocabBySkill = {};
      for (const v of content.vocab) (vocabBySkill[v.skillSlug] ||= []).push(v);
      const grammarBySkill = {};
      for (const g of content.grammar) (grammarBySkill[g.skillSlug] ||= []).push(g);
      const readingBySkill = {};
      for (const r of content.readings) (readingBySkill[r.skillSlug] ||= []).push(r);
      const dialogueBySkill = {};
      for (const d of content.dialogues) (dialogueBySkill[d.skillSlug] ||= []).push(d);

      SKILL_TREE.forEach((skill, sIdx) => {
        upsertSkill.run({
          language_id: langId, slug: skill.slug, title: skill.title,
          description: skill.description, cefr: skill.cefr,
          category: skill.category, icon: skill.icon, sort_order: sIdx,
        });
        const skillId = getSkill.get(langId, skill.slug).id;

        const vs = vocabBySkill[skill.slug] || [];
        for (const v of vs) {
          insertVocab.run({
            language_id: langId, skill_id: skillId,
            lemma: v.lemma, translation: v.translation, pos: v.pos,
            reading: v.reading, ipa: v.ipa,
            example_target: v.exampleTarget, example_source: v.exampleSource,
            gender: v.gender, frequency: v.frequency,
          });
          totals.vocab++;
        }
        for (const g of grammarBySkill[skill.slug] || []) {
          insertGrammar.run(langId, skillId, g.slug, g.title, g.cefr, g.body);
          totals.grammar++;
        }
        for (const r of readingBySkill[skill.slug] || []) {
          insertReading.run(langId, skillId, r.title, r.cefr, r.body, r.translation, JSON.stringify(r.questions));
          totals.readings++;
        }
        for (const d of dialogueBySkill[skill.slug] || []) {
          insertDialogue.run(langId, skillId, d.title, d.cefr, d.scenario, JSON.stringify(d.lines));
          totals.dialogues++;
        }

        const lessons = lessonsForSkill({
          vocabCount: vs.length,
          hasGrammar: !!(grammarBySkill[skill.slug] || []).length,
          hasReading: !!(readingBySkill[skill.slug] || []).length,
          hasDialogue: !!(dialogueBySkill[skill.slug] || []).length,
        });
        lessons.forEach((l, i) => {
          insertLesson.run(skillId, l.slug, l.title, l.kind, l.xp, sIdx * 100 + i);
          totals.lessons++;
        });
        totals.skills++;
      });

      const vcount = content.vocab.length;
      console.log(`  ✓ ${lang.flag} ${lang.name.padEnd(16)} ${String(vcount).padStart(3)} palabras`);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('\n✗ Error durante el sembrado:', err);
    process.exit(1);
  }

  console.log('\nResumen:', totals);

  if (DEMO) {
    console.log('\n· Creando usuario de demostracion...');
    db.prepare('DELETE FROM users WHERE email=?').run('demo@polyglot.app');
    const info = db.prepare(
      'INSERT INTO users (email, password_hash, display_name, daily_goal_xp) VALUES (?, ?, ?, ?)',
    ).run('demo@polyglot.app', hashPassword('polyglot123'), 'Estudiante Demo', 40);
    const userId = info.lastInsertRowid;

    for (const code of ['fr', 'it', 'ja']) {
      const lang = db.prepare('SELECT * FROM languages WHERE code=?').get(code);
      const level = code === 'fr' ? 'A2' : 'A1';
      db.prepare('INSERT INTO enrollments (user_id, language_id, level) VALUES (?, ?, ?)')
        .run(userId, lang.id, level);
      const vocab = db.prepare(
        'SELECT id FROM vocab WHERE language_id=? ORDER BY frequency DESC LIMIT ?',
      ).all(lang.id, code === 'fr' ? 40 : 12).map((r) => r.id);
      seedCardsForVocab(userId, lang.id, vocab);
      // marcar algunas lecciones completadas
      const lessons = db.prepare(`
        SELECT l.id FROM lessons l JOIN skills s ON s.id=l.skill_id
        WHERE s.language_id=? ORDER BY s.sort_order, l.sort_order LIMIT ?
      `).all(lang.id, code === 'fr' ? 6 : 2);
      for (const l of lessons) {
        db.prepare(`INSERT INTO lesson_progress (user_id, lesson_id, status, best_score, attempts, completed_at)
          VALUES (?, ?, 'completed', 0.9, 1, datetime('now'))`).run(userId, l.id);
      }
      recordActivity({ userId, languageId: lang.id, xp: code === 'fr' ? 320 : 60, exercises: 20, correct: 18 });
    }
    console.log('  Usuario:  demo@polyglot.app');
    console.log('  Clave:    polyglot123');
  }

  console.log('\nListo. Arranca el servidor con:  npm start\n');
  process.exit(0);
}

main();
