import { db } from '../db.js';
import { HttpError } from '../lib/http.js';
import { hashPassword, verifyPassword, createToken } from '../lib/auth.js';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(u) {
  return {
    id: u.id, email: u.email, displayName: u.display_name,
    dailyGoalXp: u.daily_goal_xp, uiLanguage: u.ui_language, createdAt: u.created_at,
  };
}

export default function register(router) {
  router.post('/api/auth/register', ({ body }) => {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const displayName = String(body.displayName || '').trim() || email.split('@')[0];

    if (!EMAIL_RX.test(email)) throw new HttpError(400, 'Correo electronico invalido');
    if (password.length < 8) throw new HttpError(400, 'La contrasena debe tener al menos 8 caracteres');

    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) throw new HttpError(409, 'Ya existe una cuenta con ese correo');

    const info = db.prepare(
      'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
    ).run(email, hashPassword(password), displayName);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
    const token = createToken({ sub: user.id, name: user.display_name });
    return { token, user: publicUser(user) };
  });

  router.post('/api/auth/login', ({ body }) => {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      throw new HttpError(401, 'Correo o contrasena incorrectos');
    }
    const token = createToken({ sub: user.id, name: user.display_name });
    return { token, user: publicUser(user) };
  });

  router.get('/api/auth/me', ({ user }) => {
    if (!user) throw new HttpError(401, 'No hay sesion activa');
    return { user: publicUser(user) };
  }, { auth: true });

  router.patch('/api/auth/me', ({ user, body }) => {
    const fields = [];
    const values = [];
    if (body.displayName !== undefined) {
      fields.push('display_name = ?');
      values.push(String(body.displayName).trim().slice(0, 60) || user.display_name);
    }
    if (body.dailyGoalXp !== undefined) {
      const g = Math.max(10, Math.min(500, Number(body.dailyGoalXp) || 50));
      fields.push('daily_goal_xp = ?');
      values.push(g);
    }
    if (body.password !== undefined) {
      if (String(body.password).length < 8) throw new HttpError(400, 'La contrasena debe tener al menos 8 caracteres');
      fields.push('password_hash = ?');
      values.push(hashPassword(String(body.password)));
    }
    if (!fields.length) return { user: publicUser(user) };
    values.push(user.id);
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    const fresh = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
    return { user: publicUser(fresh) };
  }, { auth: true });
}
