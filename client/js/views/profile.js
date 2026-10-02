import { h, mount, bar, toast, confirmDialog } from '../ui.js';
import { api } from '../api.js';
import { store } from '../store.js';
import { screen, loadingScreen, invalidateLanguages } from '../app.js';
import { navigate } from '../router.js';
import { tts } from '../tts.js';

export async function renderProfile() {
  loadingScreen('Cargando tu perfil…');
  let p;
  try {
    p = await api.get('/api/profile');
  } catch {
    navigate('/');
    return;
  }

  const root = h('div', { style: { maxWidth: '720px', margin: '0 auto' } });

  const totals = p.totals;
  const statRow = h('div', { class: 'stat-tiles' },
    tile('🏅', `Nv. ${totals.globalLevel}`, 'nivel global'),
    tile('✨', totals.xp, 'XP totales'),
    tile('🗂️', totals.mature, 'palabras dominadas'),
    tile('📅', totals.activeDays, 'dias activos'),
  );

  const langRows = p.enrollments.length
    ? p.enrollments.map((e) => h('div', { class: 'pl-row', style: { cursor: 'pointer' }, onclick: () => { store.setActiveLang(e.code); navigate(`/learn/${e.code}`); } },
        h('span', { class: 'flag' }, e.flag),
        h('div', { style: { minWidth: '110px' } }, h('b', {}, e.name),
          h('div', { class: 'tiny faint' }, `MCER ${e.level} · nivel ${e.xpLevel}`)),
        bar(e.progress),
        h('div', { class: 'tiny faint mono', style: { minWidth: '90px', textAlign: 'right' } },
          `${e.xp} XP · ${e.streak}🔥`),
      ))
    : [h('p', { class: 'muted small' }, 'Aun no estudias ningun idioma. ',
        h('a', { href: '#/languages' }, 'Elige uno'))];

  // ---- ajustes ----
  const nameInput = h('input', { class: 'input', value: p.user.displayName });
  const goalInput = h('input', { class: 'input', type: 'number', min: '10', max: '500', step: '10', value: p.user.dailyGoalXp });
  const saveBtn = h('button', { class: 'btn primary', onclick: async () => {
    saveBtn.disabled = true;
    try {
      const r = await api.patch('/api/auth/me', {
        displayName: nameInput.value.trim(),
        dailyGoalXp: Number(goalInput.value),
      });
      store.setUser(r.user);
      toast('Ajustes guardados', 'ok');
    } catch { toast('No se pudieron guardar', 'err'); }
    saveBtn.disabled = false;
  } }, 'Guardar');

  const settings = h('div', { class: 'card' },
    h('h3', {}, 'Ajustes'),
    h('label', { class: 'field' }, h('span', {}, 'Nombre visible'), nameInput),
    h('label', { class: 'field' }, h('span', {}, 'Meta diaria de XP'), goalInput),
    h('div', { class: 'row' },
      saveBtn,
      h('button', { class: 'btn', onclick: () => store.setTheme(store.theme === 'dark' ? 'light' : 'dark') },
        store.theme === 'dark' ? '☀️ Tema claro' : '🌙 Tema oscuro'),
      h('div', { class: 'spacer' }),
      h('button', { class: 'btn danger', onclick: async () => {
        if (await confirmDialog({ title: 'Cerrar sesion', confirmText: 'Cerrar sesion', danger: true })) store.logout();
      } }, 'Cerrar sesion'),
    ),
    h('p', { class: 'tiny faint', style: { marginTop: '12px' } }, `Cuenta creada el ${new Date(p.user.createdAt.replace(' ', 'T') + 'Z').toLocaleDateString('es')} · ${p.user.email}`),
  );

  // ---- diccionario ----
  const dict = store.activeLang ? dictionarySection(store.activeLang) : null;

  mount(root,
    h('h1', {}, p.user.displayName),
    h('p', { class: 'muted' }, `Precision global: ${Math.round(totals.accuracy * 100)}% · ${totals.lessons} lecciones · ${totals.cards} palabras en memoria`),
    statRow,
    h('div', { class: 'card', style: { marginTop: '16px' } },
      h('h3', {}, 'Mis idiomas'),
      h('div', { class: 'profile-langs', style: { marginTop: '10px' } }, ...langRows)),
    dict,
    settings,
  );
  screen(root);
}

function dictionarySection(code) {
  const box = h('div', { class: 'card', style: { marginTop: '16px' } });
  const listSlot = h('div', { style: { marginTop: '10px' } });
  const search = h('input', { class: 'input', placeholder: 'Buscar palabra…' });
  const stateSel = h('select', { class: 'input', style: { maxWidth: '180px' } },
    ...[['all', 'Todas'], ['mature', 'Dominadas'], ['learning', 'En aprendizaje'], ['new', 'Sin empezar']]
      .map(([v, t]) => h('option', { value: v }, t)));
  let ttsLocale;

  async function load() {
    mount(listSlot, h('p', { class: 'muted small' }, 'Cargando…'));
    try {
      const [r, langs] = await Promise.all([
        api.get(`/api/progress/vocab?code=${code}&q=${encodeURIComponent(search.value)}&state=${stateSel.value}&page=0`),
        import('../app.js').then((m) => m.getLanguages()),
      ]);
      ttsLocale = (langs.find((l) => l.code === code) || {}).ttsLocale;
      mount(listSlot,
        h('p', { class: 'tiny faint' }, `${r.total} palabras`),
        ...r.items.map((v) => h('div', { class: 'vocab-item' },
          h('span', { class: `state-dot ${v.state ? (v.interval_days >= 21 && v.state === 'review' ? 'mature' : (['new', 'learning', 'lapsed'].includes(v.state) ? 'learning' : 'review')) : ''}` }),
          h('div', { style: { minWidth: 0 } }, h('span', { class: 'lemma' }, v.lemma),
            v.reading ? h('span', { class: 'reading' }, ` ${v.reading}`) : null,
            v.skill ? h('div', { class: 'tiny faint' }, v.skill) : null),
          h('span', { class: 'tr' }, v.translation),
          h('span', { class: 'spk', onclick: () => tts.speak(v.lemma, ttsLocale) }, '🔊'),
        )),
      );
    } catch {
      mount(listSlot, h('p', { class: 'err' }, 'No se pudo cargar'));
    }
  }

  let t;
  search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(load, 250); });
  stateSel.addEventListener('change', load);

  mount(box,
    h('div', { class: 'row', style: { justifyContent: 'space-between', flexWrap: 'wrap' } },
      h('h3', { style: { margin: 0 } }, 'Mi diccionario'),
      h('div', { class: 'row' }, stateSel)),
    h('div', { style: { marginTop: '10px' } }, search),
    listSlot,
  );
  load();
  return box;
}

function tile(icon, value, label) {
  return h('div', { class: 'tile' }, h('span', {}, `${icon} `), h('b', {}, String(value)), h('span', {}, label));
}
