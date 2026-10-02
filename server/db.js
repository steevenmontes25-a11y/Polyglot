import { DatabaseSync } from 'node:sqlite';
import { DB_PATH } from './config.js';

export const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS languages (
  id            INTEGER PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  native_name   TEXT NOT NULL,
  flag          TEXT NOT NULL,
  direction     TEXT NOT NULL DEFAULT 'ltr',
  script        TEXT NOT NULL DEFAULT 'latin',
  difficulty    INTEGER NOT NULL DEFAULT 3,
  tts_locale    TEXT,
  family        TEXT,
  blurb         TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id             INTEGER PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  display_name   TEXT NOT NULL,
  daily_goal_xp  INTEGER NOT NULL DEFAULT 50,
  ui_language    TEXT NOT NULL DEFAULT 'es',
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enrollments (
  id                INTEGER PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_id       INTEGER NOT NULL REFERENCES languages(id),
  level             TEXT NOT NULL DEFAULT 'A1',
  xp                INTEGER NOT NULL DEFAULT 0,
  streak            INTEGER NOT NULL DEFAULT 0,
  best_streak       INTEGER NOT NULL DEFAULT 0,
  last_active_date  TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, language_id)
);

CREATE TABLE IF NOT EXISTS skills (
  id           INTEGER PRIMARY KEY,
  language_id  INTEGER NOT NULL REFERENCES languages(id),
  slug         TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  cefr         TEXT NOT NULL DEFAULT 'A1',
  category     TEXT,
  icon         TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  UNIQUE(language_id, slug)
);

CREATE TABLE IF NOT EXISTS lessons (
  id          INTEGER PRIMARY KEY,
  skill_id    INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  kind        TEXT NOT NULL DEFAULT 'vocab',
  xp_award    INTEGER NOT NULL DEFAULT 20,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  UNIQUE(skill_id, slug)
);

CREATE TABLE IF NOT EXISTS vocab (
  id              INTEGER PRIMARY KEY,
  language_id     INTEGER NOT NULL REFERENCES languages(id),
  skill_id        INTEGER REFERENCES skills(id),
  lemma           TEXT NOT NULL,
  translation     TEXT NOT NULL,
  pos             TEXT,
  reading         TEXT,
  ipa             TEXT,
  example_target  TEXT,
  example_source  TEXT,
  gender          TEXT,
  frequency       INTEGER DEFAULT 0,
  notes           TEXT
);

CREATE TABLE IF NOT EXISTS grammar_notes (
  id           INTEGER PRIMARY KEY,
  language_id  INTEGER NOT NULL REFERENCES languages(id),
  skill_id     INTEGER REFERENCES skills(id),
  slug         TEXT NOT NULL,
  title        TEXT NOT NULL,
  cefr         TEXT NOT NULL DEFAULT 'A1',
  body         TEXT NOT NULL,
  UNIQUE(language_id, slug)
);

CREATE TABLE IF NOT EXISTS readings (
  id           INTEGER PRIMARY KEY,
  language_id  INTEGER NOT NULL REFERENCES languages(id),
  skill_id     INTEGER REFERENCES skills(id),
  title        TEXT NOT NULL,
  cefr         TEXT NOT NULL DEFAULT 'A1',
  body         TEXT NOT NULL,
  translation  TEXT,
  questions    TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS dialogues (
  id           INTEGER PRIMARY KEY,
  language_id  INTEGER NOT NULL REFERENCES languages(id),
  skill_id     INTEGER REFERENCES skills(id),
  title        TEXT NOT NULL,
  cefr         TEXT NOT NULL DEFAULT 'A1',
  scenario     TEXT,
  lines        TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS srs_cards (
  id                INTEGER PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vocab_id          INTEGER NOT NULL REFERENCES vocab(id),
  language_id       INTEGER NOT NULL REFERENCES languages(id),
  ease              REAL NOT NULL DEFAULT 2.5,
  interval_days     REAL NOT NULL DEFAULT 0,
  repetitions       INTEGER NOT NULL DEFAULT 0,
  lapses            INTEGER NOT NULL DEFAULT 0,
  state             TEXT NOT NULL DEFAULT 'new',
  due_at            TEXT NOT NULL DEFAULT (datetime('now')),
  last_reviewed_at  TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, vocab_id)
);

CREATE TABLE IF NOT EXISTS review_log (
  id             INTEGER PRIMARY KEY,
  user_id        INTEGER NOT NULL,
  card_id        INTEGER NOT NULL,
  rating         INTEGER NOT NULL,
  prev_interval  REAL,
  new_interval   REAL,
  reviewed_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id            INTEGER PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id     INTEGER NOT NULL REFERENCES lessons(id),
  status        TEXT NOT NULL DEFAULT 'in_progress',
  best_score    REAL NOT NULL DEFAULT 0,
  attempts      INTEGER NOT NULL DEFAULT 0,
  completed_at  TEXT,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS attempts (
  id              INTEGER PRIMARY KEY,
  user_id         INTEGER NOT NULL,
  language_id     INTEGER,
  lesson_id       INTEGER,
  type            TEXT,
  correct         INTEGER NOT NULL,
  answer          TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS daily_activity (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_id INTEGER,
  date       TEXT NOT NULL,
  xp         INTEGER NOT NULL DEFAULT 0,
  exercises  INTEGER NOT NULL DEFAULT 0,
  correct    INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, language_id, date)
);

CREATE TABLE IF NOT EXISTS placement_results (
  id           INTEGER PRIMARY KEY,
  user_id      INTEGER NOT NULL,
  language_id  INTEGER NOT NULL,
  score        REAL NOT NULL,
  level        TEXT NOT NULL,
  taken_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_skills_lang       ON skills(language_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lessons_skill     ON lessons(skill_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_vocab_skill       ON vocab(skill_id);
CREATE INDEX IF NOT EXISTS idx_vocab_lang        ON vocab(language_id, frequency);
CREATE INDEX IF NOT EXISTS idx_cards_due         ON srs_cards(user_id, language_id, due_at);
CREATE INDEX IF NOT EXISTS idx_cards_state       ON srs_cards(user_id, language_id, state);
CREATE INDEX IF NOT EXISTS idx_lp_user           ON lesson_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user     ON attempts(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_daily_user        ON daily_activity(user_id, date);
`;

export function initSchema() {
  db.exec(SCHEMA);
}

export function dropAll() {
  const tables = [
    'placement_results', 'daily_activity', 'attempts', 'lesson_progress',
    'review_log', 'srs_cards', 'dialogues', 'readings', 'grammar_notes',
    'vocab', 'lessons', 'skills', 'enrollments', 'users', 'languages',
  ];
  db.exec('PRAGMA foreign_keys = OFF;');
  for (const t of tables) db.exec(`DROP TABLE IF EXISTS ${t};`);
  db.exec('PRAGMA foreign_keys = ON;');
}

initSchema();
