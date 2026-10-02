/* Router de hash minimalista con parametros :param */

const routes = [];

export function route(pattern, handler) {
  const names = [];
  const rx = new RegExp('^' + pattern.replace(/:[^/]+/g, (m) => {
    names.push(m.slice(1));
    return '([^/]+)';
  }).replace(/\//g, '\\/') + '$');
  routes.push({ rx, names, handler });
}

let current = null;

export function navigate(path) {
  if (location.hash.slice(1) === path) resolve();
  else location.hash = path;
}

export function getPath() {
  return location.hash.slice(1) || '/';
}

async function resolve() {
  const path = getPath();
  for (const r of routes) {
    const m = r.rx.exec(path);
    if (!m) continue;
    const params = {};
    r.names.forEach((n, i) => { params[n] = decodeURIComponent(m[i + 1]); });
    current = path;
    try {
      await r.handler(params);
    } catch (err) {
      console.error('[route error]', err);
    }
    return;
  }
  // sin coincidencia
  navigate('/');
}

export function startRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}

export function currentPath() { return current; }
