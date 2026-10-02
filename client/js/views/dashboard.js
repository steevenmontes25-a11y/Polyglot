import { h, mount, ring, bar } from '../ui.js';
import { api } from '../api.js';
import { store } from '../store.js';
import { screen, loadingScreen } from '../app.js';
import { navigate } from '../router.js';

const DAY = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export async function renderDashboard(code) {
  loadingScreen('Cargando tu progreso…');
  let ov;
  try {
    ov = await api.get(`/api/progress/overview?code=${code}`);
  } catch {
    navigate('/languages');
    return;
  }

  const root = h('div');
  const name = store.user?.displayName || 'estudiante';
  const g = ov.levelCurve;

  const tiles = h('div', { class: 'stat-tiles' },
    tile('🔥', ov.streak, `racha (max ${ov.bestStreak})`),
    tile('🗂️', ov.srs.mature, 'palabras dominadas'),
    tile('🎯', `${Math.round(ov.accuracy30d * 100)}%`, 'precision 30d'),
    tile('📘', `${ov.lessons.done}/${ov.lessons.total}`, 'lecciones'),
  );

  const goalPct = ov.today.goal ? ov.today.xp / ov.today.goal : 0;
  const goalCard = h('div', { class: 'card' },
    h('div', { class: 'row', style: { justifyContent: 'space-between', marginBottom: '10px' } },
      h('b', {}, 'Meta diaria'),
      h('span', { class: 'muted small mono' }, `${ov.today.xp} / ${ov.today.goal} XP`)),
    bar(goalPct, 'gold'),
    ov.today.goalMet
      ? h('p', { class: 'small', style: { color: 'var(--accent)', marginTop: '10px', marginBottom: 0 } }, '¡Meta cumplida hoy! 🎉')
      : h('p', { class: 'muted small', style: { marginTop: '10px', marginBottom: 0 } }, `Te faltan ${Math.max(0, ov.today.goal - ov.today.xp)} XP`),
  );

  const next = ov.nextUp;
  const continueCard = h('div', { class: 'card continue-card' },
    h('span', { class: 'ic' }, next ? (next.icon || '📚') : '🎓'),
    h('div', { style: { flex: 1 } },
      h('b', {}, next ? next.title : '¡Has completado todo el contenido!'),
      h('div', { class: 'muted small' }, next ? `${next.skillTitle} · ${kindLabel(next.kind)}` : 'Sigue repasando para consolidar')),
    next
      ? h('button', { class: 'btn primary', onclick: () => navigate(`/lesson/${next.id}`) }, 'Continuar')
      : h('button', { class: 'btn', onclick: () => navigate(`/learn/${code}`) }, 'Ver temas'),
  );

  const reviewCard = h('div', { class: 'card continue-card' },
    h('span', { class: 'ic' }, '🔁'),
    h('div', { style: { flex: 1 } },
      h('b', {}, ov.srs.due > 0 ? `${ov.srs.due} repasos pendientes` : 'Sin repasos pendientes'),
      h('div', { class: 'muted small' }, `${ov.srs.learning} en aprendizaje · ${ov.srs.review} en repaso`)),
    h('button', { class: `btn ${ov.srs.due > 0 ? 'primary' : ''}`, onclick: () => navigate(`/review/${code}`) },
      ov.srs.due > 0 ? 'Repasar' : 'Repasar igual'),
  );

  const maxXp = Math.max(1, ...ov.activity.map((d) => d.xp));
  const week = h('div', { class: 'card' },
    h('b', {}, 'Actividad (14 dias)'),
    h('div', { class: 'week-bars', style: { marginTop: '14px' } },
      ...ov.activity.map((d) => {
        const dt = new Date(d.date + 'T00:00');
        return h('div', { class: `d ${d.xp ? '' : 'empty'}`, title: `${d.date}: ${d.xp} XP` },
          h('i', { style: { height: `${d.xp ? Math.max(6, (d.xp / maxXp) * 100) : 3}%` } }),
          h('span', {}, DAY[dt.getDay()]));
      })),
  );

  const skills = h('div', { class: 'card' },
    h('b', {}, 'Dominio por tema'),
    h('div', { style: { marginTop: '12px', display: 'grid', gap: '10px' } },
      ...ov.skillMastery.slice(0, 12).map((s) => h('div', { class: 'row', style: { gap: '10px' } },
        h('span', { style: { fontSize: '16px' } }, s.icon || '•'),
        h('span', { class: 'small', style: { minWidth: '150px' } }, s.title),
        bar(s.mastery),
        h('span', { class: 'tiny faint mono', style: { minWidth: '34px', textAlign: 'right' } }, `${Math.round(s.mastery * 100)}%`),
      ))),
  );

  const ach = h('div', { class: 'card' },
    h('div', { class: 'row', style: { justifyContent: 'space-between' } },
      h('b', {}, 'Logros'),
      h('span', { class: 'muted small' }, `${ov.achievements.filter((a) => a.unlocked).length}/${ov.achievements.length}`)),
    h('div', { class: 'ach-grid', style: { marginTop: '14px' } },
      ...ov.achievements.map((a) => h('div', { class: `ach ${a.unlocked ? 'on' : ''}`, title: a.desc },
        h('div', { class: 'em' }, a.icon), h('b', {}, a.title), h('span', {}, a.desc)))),
  );

  mount(root,
    h('div', { class: 'dash-head' },
      h('div', { class: 'hello' },
        h('h1', {}, `Hola, ${name}`),
        h('div', { class: 'row wrap', style: { gap: '8px' } },
          h('span', { class: 'pill cefr' }, `Nivel ${ov.level}`),
          h('span', { class: 'pill' }, `${ov.xp} XP totales`),
          h('span', { class: 'pill gold' }, `Nivel ${g.level}`),
        ),
        h('div', { style: { marginTop: '12px', maxWidth: '320px' } },
          bar(g.progress),
          h('span', { class: 'tiny faint mono' }, `${g.xpIntoLevel} / ${g.xpForNext} XP para el nivel ${g.level + 1}`)),
      ),
      h('div', { class: 'spacer' }),
      ring(g.progress, String(g.level), 'nivel'),
    ),
    tiles,
    h('div', { class: 'grid cols-2', style: { marginTop: '16px' } }, continueCard, reviewCard),
    h('div', { class: 'grid cols-2', style: { marginTop: '16px' } }, goalCard, week),
    h('div', { style: { marginTop: '16px' } }, skills),
    h('div', { style: { marginTop: '16px' } }, ach),
  );

  screen(root);
}

function tile(icon, value, label) {
  return h('div', { class: 'tile' },
    h('span', {}, `${icon} `),
    h('b', {}, String(value)),
    h('span', {}, label));
}
function kindLabel(k) {
  return ({ vocab: 'Vocabulario', grammar: 'Gramatica', reading: 'Lectura', listening: 'Escucha', conversation: 'Conversacion', checkpoint: 'Repaso' })[k] || k;
}
