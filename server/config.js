import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));

export const ROOT = join(here, '..');
export const CLIENT_DIR = join(ROOT, 'client');
export const DATA_DIR = join(ROOT, 'data');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

export const DB_PATH = process.env.POLYGLOT_DB || join(DATA_DIR, 'polyglot.db');
export const PORT = Number(process.env.PORT || 4000);
export const HOST = process.env.HOST || '0.0.0.0';

/**
 * Secret para firmar los JWT. Se toma de la variable de entorno si existe;
 * si no, se genera una y se guarda en server/.secret para que persista
 * entre reinicios (asi las sesiones no se invalidan al reiniciar).
 */
function loadSecret() {
  if (process.env.POLYGLOT_SECRET) return process.env.POLYGLOT_SECRET;
  const file = join(here, '.secret');
  if (existsSync(file)) return readFileSync(file, 'utf8').trim();
  const generated = randomBytes(48).toString('hex');
  try {
    writeFileSync(file, generated, { mode: 0o600 });
  } catch {
    /* entorno de solo lectura: usamos el secreto en memoria */
  }
  return generated;
}

export const JWT_SECRET = loadSecret();
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 dias

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
