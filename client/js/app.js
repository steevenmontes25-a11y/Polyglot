import { store } from './store.js';
import { api } from './api.js';
import { route, startRouter, navigate, getPath } from './router.js';
import { h, mount, clear, toast } from './ui.js';

import { renderAuth } from './views/auth.js';
import { renderLanguages } from './views/languages.js';
import { renderDashboard } from './views/dashboard.js';
import { renderCourse } from './views/course.js';
import { renderLesson } from './views/lesson.js';
import { renderReview } from './views/review.js';
import { renderPlacement } from './views/placement.js';
import { renderProfile } from './views/profile.js';

const appRoot = document.getElementById('app');
let langCache = null;

export async function getLanguages(force = false) {
  if (!langCache || force) {
    const r = await api.get('/api/languages');
    langCache = r.languages;
  }
  return langCache;
}
export function invalidateLanguages() { langCache = null; }

/* --------------------------------------------------------------- *
 *  Chrome de la aplicacion (topbar + contenedor)
 * --------------------------------------------------------------- */
function topbar() {
  const path = getPath();
  const active = store.activeLang;
  const user = store.user;

  const navLink = (href, icon, label) => h('a', {
    href: `#${href}`,
    class: path === href || path.startsWith(href + '/') ? 'active' : '',
  }, h('span', {}, icon), h('span', { class: 'lbl' }, label));

  const langBtn = h('div', { class: 'lang-switch', onclick: openLangMenu },
    active
      ? [h('span', { class: 'flag', id: 'ls-flag' }, ''), h('span', { id: 'ls-name' }, active.toUpperCase())]
      : [h('span', {}, '＋ Idioma')],
    h('span', { class: 'faint' }, '▾'),
  );
  if (active) {
    getLanguages().then((langs) => {
      const l = langs.find((x) => x.code === active);
      if (l) {
        const f = document.getElementById('ls-flag'); const n = document.getElementById('ls-name');
        if (f) f.textContent = l.flag;
        if (n) n.textContent = l.name;
      }
    });
  }

  return h('header', { class: 'topbar' },
    h('div', { class: 'topbar-inner' },
      h('div', { class: 'brand', onclick: () => navigate('/') },
        h('span', { class: 'globe' }, '🌍'), h('span', { class: 'lbl' }, 'Polyglot')),
      langBtn,
      h('nav', { class: 'nav' },
        navLink('/', '🏠', 'Inicio'),
        active ? navLink(`/learn/${active}`, '📚', 'Aprender') : null,
        active ? navLink(`/review/${active}`, '🔁', 'Repasar') : null,
        navLink('/languages', '🌐', 'Idiomas'),
        navLink('/profile', '👤', 'Perfil'),
        h('button', {
          class: 'btn ghost', style: { padding: '6px 9px' }, title: 'Cambiar tema',
          onclick: () => store.setTheme(store.theme === 'dark' ? 'light' : 'dark'),
        }, store.theme === 'dark' ? '☀️' : '🌙'),
      ),
    ),
  );
}

async function openLangMenu(e) {
  e.stopPropagation();
  const langs = await getLanguages();
  const enrolled = langs.filter((l) => l.enrollment);
  const back = h('div', { class: 'drawer-back', style: { background: 'transparent' } });
  const menu = h('div', {
    class: 'card', style: {
      position: 'fixed', top: '58px', left: '50%', transform: 'translateX(-50%)',
      width: 'min(340px, 92vw)', padding: '10px', boxShadow: 'var(--shadow)',
    },
  });
  if (!enrolled.length) {
    menu.append(h('p', { class: 'muted small', style: { padding: '8px' } }, 'Aun no estudias ningun idioma.'));
  }
  for (const l of enrolled) {
    menu.append(h('button', {
      class: 'btn ghost block', style: { justifyContent: 'flex-start', marginBottom: '4px' },
      onclick: () => { store.setActiveLang(l.code); back.remove(); navigate(`/learn/${l.code}`); },
    }, h('span', { style: { fontSize: '20px' } }, l.flag), l.name,
      l.enrollment ? h('span', { class: 'pill cefr', style: { marginLeft: 'auto' } }, l.enrollment.level) : null));
  }
  menu.append(h('button', {
    class: 'btn block', style: { marginTop: '4px' },
    onclick: () => { back.remove(); navigate('/languages'); },
  }, '＋ Anadir idioma'));
  back.append(menu);
  back.addEventListener('click', (ev) => { if (ev.target === back) back.remove(); });
  document.body.append(back);
}

/**
 * Monta una pantalla. Los views llaman a screen(node).
 */
export function screen(contentEl, { chrome = true } = {}) {
  clear(appRoot);
  const shell = h('div', { class: 'app-shell' });
  if (chrome && store.isAuthed) shell.append(topbar());
  shell.append(h('main', { class: 'main' }, contentEl));
  appRoot.append(shell);
  window.scrollTo(0, 0);
}

export function loadingScreen(msg = 'Cargando…') {
  screen(h('div', { class: 'center muted', style: { padding: '60px' } }, msg));
}

/* --------------------------------------------------------------- *
 *  Guard + rutas
 * --------------------------------------------------------------- */
function guard(fn) {
  return async (params) => {
    if (!store.isAuthed) { navigate('/login'); return; }
    if (!store.user) {
      try {
        const r = await api.get('/api/auth/me');
        store.setUser(r.user);
      } catch { store.logout(); return; }
    }
    await fn(params);
  };
}

route('/login', () => {
  if (store.isAuthed) { navigate('/'); return; }
  renderAuth();
});

route('/', guard(async () => {
  if (!store.activeLang) { navigate('/languages'); return; }
  await renderDashboard(store.activeLang);
}));

route('/languages', guard(async () => { await renderLanguages(); }));
route('/learn/:code', guard(async ({ code }) => { store.setActiveLang(code); await renderCourse(code); }));
route('/skill/:id', guard(async ({ id }) => { await renderCourse(store.activeLang, Number(id)); }));
route('/lesson/:id', guard(async ({ id }) => { await renderLesson(Number(id)); }));
route('/review/:code', guard(async ({ code }) => { store.setActiveLang(code); await renderReview(code); }));
route('/placement/:code', guard(async ({ code }) => { await renderPlacement(code); }));
route('/profile', guard(async () => { await renderProfile(); }));

/* --------------------------------------------------------------- *
 *  Arranque
 * --------------------------------------------------------------- */
store.subscribe(() => {
  // re-render de la topbar cuando cambian tema/idioma/racha
  const tb = document.querySelector('.topbar');
  if (tb && store.isAuthed) tb.replaceWith(topbar());
});

(async function boot() {
  if (store.token && !store.user) {
    try {
      const r = await api.get('/api/auth/me');
      store.setUser(r.user);
    } catch { store.setSession(null, null); }
  }
  if (!location.hash) location.hash = '#/';
  startRouter();
})();

window.addEventListener('error', (e) => {
  console.error(e.error || e.message);
});
