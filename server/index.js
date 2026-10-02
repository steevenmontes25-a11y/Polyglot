import { createServer } from 'node:http';
import { CLIENT_DIR, PORT, HOST } from './config.js';
import { db } from './db.js';
import { Router, HttpError, json, serveStatic } from './lib/http.js';

import registerAuth from './routes/auth.js';
import registerCatalog from './routes/catalog.js';
import registerLearn from './routes/learn.js';
import registerReview from './routes/review.js';
import registerPlacement from './routes/placement.js';
import registerProgress from './routes/progress.js';

const router = new Router();
registerAuth(router);
registerCatalog(router);
registerLearn(router);
registerReview(router);
registerPlacement(router);
registerProgress(router);

router.get('/api/health', () => {
  const langs = db.prepare('SELECT COUNT(*) c FROM languages').get().c;
  const vocab = db.prepare('SELECT COUNT(*) c FROM vocab').get().c;
  return { ok: true, languages: langs, vocab, time: new Date().toISOString() };
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // CORS abierto para desarrollo local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (url.pathname.startsWith('/api/')) {
      const handled = await router.handle(req, res, url);
      if (!handled) json(res, 404, { error: 'Ruta no encontrada', path: url.pathname });
      return;
    }
    // ficheros estaticos del cliente + fallback SPA
    const ok = serveStatic(res, CLIENT_DIR, url.pathname, { spaFallback: 'index.html' });
    if (!ok) json(res, 404, { error: 'No encontrado' });
  } catch (err) {
    if (err instanceof HttpError) {
      json(res, err.status, { error: err.message, ...err.extra });
    } else {
      console.error('[error]', err);
      json(res, 500, { error: 'Error interno del servidor' });
    }
  }
});

const langCount = db.prepare('SELECT COUNT(*) c FROM languages').get().c;
if (langCount === 0) {
  console.log('\n  ⚠  La base de datos esta vacia. Ejecuta:  npm run seed\n');
}

server.listen(PORT, HOST, () => {
  console.log(`\n  🌍  Polyglot en marcha`);
  console.log(`      Local:   http://localhost:${PORT}`);
  console.log(`      Idiomas: ${langCount}\n`);
});
