import { h, mount, bar, mdLite, toast } from '../ui.js';
import { api } from '../api.js';
import { screen, loadingScreen, getLanguages } from '../app.js';
import { navigate } from '../router.js';
import { tts } from '../tts.js';

const KIND = {
  vocab: { icon: '📇', label: 'Vocabulario' },
  grammar: { icon: '📐', label: 'Gramatica' },
  reading: { icon: '📖', label: 'Lectura' },
  listening: { icon: '🎧', label: 'Escucha' },
  conversation: { icon: '💬', label: 'Conversacion' },
  checkpoint: { icon: '🏁', label: 'Repaso del tema' },
};

export async function renderCourse(code, openSkillId = null) {
  loadingScreen('Cargando el curso…');
  let tree, langs;
  try {
    [tree, langs] = await Promise.all([api.get(`/api/languages/${code}/tree`), getLanguages()]);
  } catch {
    navigate('/languages');
    return;
  }
  if (!tree.enrolled) await api.post(`/api/languages/${code}/enroll`, { level: 'A1' });

  const lang = tree.language;
  const ttsLocale = (langs.find((l) => l.code === code) || {}).ttsLocale;
  const root = h('div', { class: 'tree' });

  mount(root,
    h('div', { class: 'row', style: { marginBottom: '4px' } },
      h('span', { style: { fontSize: '30px' } }, lang.flag),
      h('div', {}, h('h1', { style: { margin: 0, fontSize: '24px' } }, lang.name),
        h('span', { class: 'muted small' }, `${lang.nativeName} · nivel ${lang.enrollment?.level || 'A1'}`)),
      h('div', { class: 'spacer' }),
      h('button', { class: 'btn', onclick: () => navigate(`/review/${code}`) },
        `🔁 Repasar${lang.enrollment?.dueCount ? ` (${lang.enrollment.dueCount})` : ''}`),
    ),
    h('p', { class: 'muted small', style: { marginBottom: '10px' } },
      'Completa los temas en orden. Cada palabra que aprendas entra en tu sistema de repaso espaciado (SRS).'),
  );

  let lastCat = null;
  for (const s of tree.skills) {
    if (s.category !== lastCat) {
      lastCat = s.category;
      root.append(h('div', { class: 'tree-cat' }, s.category));
    }
    const done = s.lessonsTotal > 0 && s.lessonsDone === s.lessonsTotal;
    root.append(h('div', {
      class: `skill-node ${s.unlocked ? '' : 'locked'} ${done ? 'done' : ''}`,
      onclick: () => {
        if (s.unlocked) openDrawer(s, code, ttsLocale, lang.direction);
        else toast('Completa el tema anterior para desbloquearlo');
      },
    },
      h('div', { class: 'badge' }, s.icon || '•', done ? h('span', { class: 'check' }, '✓') : null),
      h('div', { class: 'info' },
        h('h3', {}, s.title, ' ', h('span', { class: 'pill cefr', style: { fontSize: '10px' } }, s.cefr)),
        h('p', {}, s.description),
        h('div', { class: 'mastery' }, bar(s.mastery),
          h('span', {}, `${s.lessonsDone}/${s.lessonsTotal} · ${Math.round(s.mastery * 100)}%`)),
      ),
    ));
  }

  screen(root);

  if (openSkillId) {
    const s = tree.skills.find((x) => x.id === openSkillId);
    if (s) openDrawer(s, code, ttsLocale, lang.direction);
  }
}

async function openDrawer(skill, code, ttsLocale, direction) {
  const back = h('div', { class: 'drawer-back' });
  const panel = h('div', { class: 'drawer' }, h('p', { class: 'muted' }, 'Cargando…'));
  back.append(panel);
  function close() {
    back.remove();
    if (location.hash.startsWith('#/skill/')) history.replaceState(null, '', `#/learn/${code}`);
  }
  back.addEventListener('click', (e) => { if (e.target === back) close(); });
  document.body.append(back);
  history.replaceState(null, '', `#/skill/${skill.id}`);

  let d;
  try {
    d = await api.get(`/api/skills/${skill.id}`);
  } catch {
    mount(panel, h('p', { class: 'err' }, 'No se pudo cargar el tema'), h('button', { class: 'btn', onclick: close }, 'Cerrar'));
    return;
  }

  mount(panel,
    h('div', { class: 'row', style: { justifyContent: 'space-between' } },
      h('h2', {}, `${skill.icon || ''} ${d.skill.title}`),
      h('button', { class: 'btn ghost', onclick: close }, '✕')),
    h('p', { class: 'muted small' }, d.skill.description),

    h('h4', { style: { marginTop: '18px' } }, 'Lecciones'),
    ...skill.lessons.map((l) => {
      const k = KIND[l.kind] || { icon: '•', label: l.kind };
      return h('div', { class: 'lesson-row' },
        h('span', { class: 'ic' }, k.icon),
        h('div', { class: 't' },
          h('b', {}, l.title),
          h('span', {}, `${k.label} · ${l.xpAward} XP${l.status === 'completed' ? ' · ✓' : ''}`)),
        h('button', {
          class: `btn ${l.status === 'completed' ? '' : 'primary'}`,
          onclick: () => { close(); navigate(`/lesson/${l.id}`); },
        }, l.status === 'completed' ? 'Repasar' : 'Empezar'),
      );
    }),

    d.grammar.length ? h('h4', { style: { marginTop: '20px' } }, 'Notas de gramatica') : null,
    ...d.grammar.map((g) => h('details', { style: { marginBottom: '8px', background: 'var(--bg-elev)', border: '1px solid var(--border-soft)', borderRadius: '10px', padding: '12px' } },
      h('summary', { style: { cursor: 'pointer', fontWeight: '600' } }, g.title),
      h('div', { class: 'md', style: { marginTop: '10px' }, html: mdLite(g.body) }))),

    h('h4', { style: { marginTop: '20px' } }, `Vocabulario (${d.vocab.length})`),
    ...d.vocab.map((v) => h('div', { class: 'vocab-item' },
      h('span', { class: `state-dot ${cardCls(v.card)}`, title: cardTitle(v.card) }),
      h('div', { style: { minWidth: 0 } },
        h('span', { class: 'lemma', dir: direction === 'rtl' ? 'rtl' : 'ltr' }, v.lemma),
        v.reading ? h('span', { class: 'reading' }, ` ${v.reading}`) : null,
        v.example_target ? h('div', { class: 'tiny faint' }, v.example_target) : null),
      h('span', { class: 'tr' }, v.translation),
      h('span', { class: 'spk', onclick: () => tts.speak(v.lemma, ttsLocale) }, '🔊'),
    )),

    h('div', { style: { height: '40px' } }),
  );
}

function cardCls(card) {
  if (!card) return '';
  if (['new', 'learning', 'lapsed'].includes(card.state)) return 'learning';
  if (card.state === 'review' && card.interval_days >= 21) return 'mature';
  return 'review';
}
function cardTitle(card) {
  if (!card) return 'sin empezar';
  return ({ new: 'nueva', learning: 'en aprendizaje', lapsed: 'reaprendiendo', review: 'en repaso' })[card.state] || card.state;
}
