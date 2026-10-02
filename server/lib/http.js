import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize as normPath } from 'node:path';
import { currentUser } from './auth.js';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

export function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 1_000_000) {
        reject(new HttpError(413, 'Cuerpo de la peticion demasiado grande'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new HttpError(400, 'JSON invalido en el cuerpo de la peticion'));
      }
    });
    req.on('error', reject);
  });
}

function compilePattern(pattern) {
  const names = [];
  const rx = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, (m) => (m === '*' ? '(.*)' : `\\${m}`))
    .replace(/:([A-Za-z_]+)/g, (_, n) => {
      names.push(n);
      return '([^/]+)';
    });
  return { rx: new RegExp(`^${rx}/?$`), names };
}

export class Router {
  constructor() {
    this.routes = [];
  }

  add(method, pattern, handler, { auth = false } = {}) {
    this.routes.push({ method, handler, auth, ...compilePattern(pattern) });
    return this;
  }
  get(p, h, o) { return this.add('GET', p, h, o); }
  post(p, h, o) { return this.add('POST', p, h, o); }
  put(p, h, o) { return this.add('PUT', p, h, o); }
  patch(p, h, o) { return this.add('PATCH', p, h, o); }
  delete(p, h, o) { return this.add('DELETE', p, h, o); }

  async handle(req, res, url) {
    for (const route of this.routes) {
      if (route.method !== req.method) continue;
      const m = route.rx.exec(url.pathname);
      if (!m) continue;

      const params = {};
      route.names.forEach((n, i) => { params[n] = decodeURIComponent(m[i + 1]); });

      const ctx = {
        req, res, params, url,
        query: Object.fromEntries(url.searchParams),
        user: null,
        body: {},
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        ctx.body = await readBody(req);
      }

      if (route.auth) {
        ctx.user = currentUser(req);
        if (!ctx.user) throw new HttpError(401, 'Necesitas iniciar sesion');
      } else {
        ctx.user = currentUser(req); // opcional
      }

      const result = await route.handler(ctx);
      if (result !== undefined && !res.writableEnded) {
        json(res, 200, result);
      }
      return true;
    }
    return false;
  }
}

export function serveStatic(res, rootDir, pathname, { spaFallback = null } = {}) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const full = normPath(join(rootDir, rel));
  if (!full.startsWith(normPath(rootDir))) {
    json(res, 403, { error: 'forbidden' });
    return true;
  }
  let target = full;
  if (!existsSync(target) || !statSync(target).isFile()) {
    if (spaFallback && !extname(rel)) {
      target = join(rootDir, spaFallback);
    } else {
      return false;
    }
  }
  const ext = extname(target).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    // app local: sin cache para que los cambios se vean al recargar
    'Cache-Control': 'no-cache, must-revalidate',
  });
  createReadStream(target).pipe(res);
  return true;
}
