import { h, mount, DIFF_LABEL } from '../ui.js';
import { store } from '../store.js';
import { navigate } from '../router.js';
import { screen, getLanguages, invalidateLanguages } from '../app.js';
import { api } from '../api.js';

function diffDots(n) {
  return h('span', { class: 'diff-dots', title: DIFF_LABEL[n] },
    ...[1, 2, 3, 4, 5].map((i) => h('i', { class: i <= n ? 'on' : '' })));
}

function chooseStart(lang) {
  const back = h('div', { class: 'drawer-back', style: { justifyContent: 'center', alignItems: 'center' } });
  const box = h('div', { class: 'card', style: { maxWidth: '380px', margin: '0 16px' } },
    h('div', { class: 'row' }, h('span', { style: { fontSize: '34px' } }, lang.flag),
      h('div', {}, h('h3', { style: { margin: 0 } }, lang.name), h('span', { class: 'muted small' }, lang.nativeName))),
    h('p', { class: 'muted small', style: { marginTop: '12px' } }, lang.blurb),
    h('div', { class: 'grid', style: { marginTop: '8px' } },
      h('button', { class: 'btn primary block', onclick: async () => {
        await api.post(`/api/languages/${lang.code}/enroll`, { level: 'A1' });
        invalidateLanguages();
        store.setActiveLang(lang.code);
        back.remove();
        navigate(`/learn/${lang.code}`);
      } }, 'Empezar desde cero (A1)'),
      h('button', { class: 'btn block', onclick: () => { back.remove(); navigate(`/placement/${lang.code}`); } },
        'Ya se algo — test de nivel (exigente)'),
      h('button', { class: 'btn ghost block', onclick: () => back.remove() }, 'Cancelar'),
    ),
  );
  back.append(box);
  back.addEventListener('click', (e) => { if (e.target === back) back.remove(); });
  document.body.append(back);
}

export async function renderLanguages() {
  const root = h('div');
  screen(mount(root, h('div', { class: 'center muted', style: { padding: '50px' } }, 'Cargando idiomas…')));

  const langs = await getLanguages(true);

  const cards = langs.map((l) => {
    const enr = l.enrollment;
    return h('div', { class: 'lang-card', onclick: () => {
      if (enr) { store.setActiveLang(l.code); navigate(`/learn/${l.code}`); }
      else chooseStart(l);
    } },
      h('div', { class: 'row', style: { justifyContent: 'space-between' } },
        h('span', { class: 'flag' }, l.flag),
        enr ? h('span', { class: 'pill cefr' }, enr.level) : diffDots(l.difficulty),
      ),
      h('h3', {}, l.name),
      h('div', { class: 'native' }, `${l.nativeName} · ${l.family}`),
      h('div', { class: 'blurb' }, l.blurb),
      h('div', { class: 'meta' },
        h('span', { class: 'pill' }, `${l.vocabCount} palabras`),
        h('span', { class: 'pill' }, `${l.skillCount} temas`),
        enr ? h('span', { class: 'enrolled-tag' }, `${enr.xp} XP · racha ${enr.streak}🔥`) : null,
      ),
    );
  });

  mount(root,
    h('div', { class: 'lang-hero' },
      h('h1', {}, 'Elige tu idioma'),
      h('p', { class: 'muted' }, '15 idiomas, del alfabeto a la conversacion profesional. Empieza uno o varios a la vez.'),
    ),
    h('div', { class: 'grid cols-3' }, ...cards),
  );
}
