import {
  scryptSync, randomBytes, timingSafeEqual,
  createHmac,
} from 'node:crypto';
import { JWT_SECRET, TOKEN_TTL_SECONDS } from '../config.js';
import { db } from '../db.js';

/* ------------------------------------------------------------------ *
 *  Hash de contrasenas (scrypt, sin dependencias externas)
 * ------------------------------------------------------------------ */

export function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export function verifyPassword(password, stored) {
  try {
    const [scheme, N, r, p, saltHex, hashHex] = stored.split('$');
    if (scheme !== 'scrypt') return false;
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    const derived = scryptSync(password, salt, expected.length, {
      N: Number(N), r: Number(r), p: Number(p),
    });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ *
 *  JSON Web Token minimalista (HS256)
 * ------------------------------------------------------------------ */

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const b64urlJson = (obj) => b64url(JSON.stringify(obj));

function sign(data) {
  return b64url(createHmac('sha256', JWT_SECRET).update(data).digest());
}

export function createToken(payload, ttl = TOKEN_TTL_SECONDS) {
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + ttl };
  const head = b64urlJson({ alg: 'HS256', typ: 'JWT' });
  const claims = b64urlJson(body);
  const sig = sign(`${head}.${claims}`);
  return `${head}.${claims}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [head, claims, sig] = parts;
  const expected = sign(`${head}.${claims}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(claims, 'base64').toString('utf8'));
  } catch {
    return null;
  }
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
  return payload;
}

/* ------------------------------------------------------------------ *
 *  Helpers de sesion
 * ------------------------------------------------------------------ */

export function currentUser(req) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = db
    .prepare('SELECT id, email, display_name, daily_goal_xp, ui_language, created_at FROM users WHERE id = ?')
    .get(payload.sub);
  return user || null;
}
