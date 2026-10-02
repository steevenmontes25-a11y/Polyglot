/**
 * Estado global minimalista con persistencia en localStorage
 * y un sistema de suscripcion sencillo.
 */
const KEY = 'polyglot.v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

const persisted = load();

const state = {
  token: persisted.token || null,
  user: persisted.user || null,
  activeLang: persisted.activeLang || null, // codigo del idioma en curso
  theme: persisted.theme || 'dark',
};

const subs = new Set();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      token: state.token, user: state.user,
      activeLang: state.activeLang, theme: state.theme,
    }));
  } catch { /* almacenamiento no disponible */ }
}

function emit() {
  save();
  for (const fn of subs) fn(state);
}

export const store = {
  get token() { return state.token; },
  get user() { return state.user; },
  get activeLang() { return state.activeLang; },
  get theme() { return state.theme; },
  get isAuthed() { return !!state.token; },

  subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

  setSession(token, user) {
    state.token = token;
    state.user = user;
    emit();
  },
  setUser(user) { state.user = user; emit(); },
  setActiveLang(code) { state.activeLang = code; emit(); },
  setTheme(t) {
    state.theme = t;
    document.documentElement.classList.toggle('light', t === 'light');
    emit();
  },
  logout() {
    state.token = null;
    state.user = null;
    state.activeLang = null;
    emit();
    location.hash = '#/login';
  },
};

// aplicar tema al arrancar
document.documentElement.classList.toggle('light', state.theme === 'light');
