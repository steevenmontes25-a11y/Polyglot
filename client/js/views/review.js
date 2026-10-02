import { h, mount, bar, relTime, toast } from '../ui.js';
import { api } from '../api.js';
import { screen, loadingScreen } from '../app.js';
import { navigate } from '../router.js';
import { tts } from '../tts.js';
import { createExercise, ratingFromResult } from '../exercises.js';

export async function renderReview(code, { early = false, fresh = 0 } = {}) {
  loadingScreen('Buscando tarjetas para repasar…');
  let data;
  try {
    const qs = new URLSearchParams({ code, limit: '20' });
    if (early) qs.set('early', '1');
    if (fresh) qs.set('new', String(fresh));
    data = await api.get(`/api/review/queue?${qs}`);
  } catch {
    toast('No se pudo cargar el repaso', 'err');
    navigate(`/learn/${code}`);
    return;
  }

  const { queue, counts, language } = data;
  const ttsLocale = language.ttsLocale;
  const direction = language.direction;

  if (!queue.length) {
    return renderEmpty(code, counts, language);
  }

  let i = 0;
  let combo = 0;
  let correct = 0;
  let again = 0;
  const startedAt = Date.now();

  const root = h('div', { class: 'player' });
  const progress = bar(0);
  const stage = h('div');
  const top = h('div', { class: 'player-top' },
    h('button', { class: 'x', onclick: () => { tts.stop(); navigate(`/learn/${code}`); } }, '✕'),
    progress,
    h('span', { class: 'muted small mono' }, ''),
  );
  const counter = top.lastChild;
  mount(root, top, stage);
  screen(root);

  function step() {
    tts.stop();
    progress.querySelector('i').style.width = `${(i / queue.length) * 100}%`;
    counter.textContent = `${Math.min(i + 1, queue.length)}/${queue.length}`;
    if (i >= queue.length) return finish();

    const item = queue[i];
    const startTs = Date.now();
    const { node } = createExercise(item.exercise, {
      ttsLocale, direction,
      onGraded: async (res) => {
        const fast = Date.now() - startTs < 3500;
        const rating = ratingFromResult(res, { fast });
        if (rating >= 2) correct++; else combo = 0;
        if (rating >= 2) combo++;
        if (rating === 0) again++;
        try {
          const r = await api.post('/api/review/answer', {
            cardId: item.cardId, vocabId: item.vocabId, rating, combo,
          });
          const tag = node.querySelector('.feedback');
          if (tag && r.nextReview) tag.append(h('span', { class: 'sol', style: { marginLeft: '8px' } }, `· proximo repaso: ${r.nextReview}`));
        } catch { /* */ }
      },
      onContinue: () => { i++; step(); },
    });
    mount(stage, node);
  }

  async function finish() {
    progress.querySelector('i').style.width = '100%';
    const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    let summary;
    try {
      summary = await api.get(`/api/review/summary?code=${code}`);
    } catch { summary = null; }

    mount(stage, h('div', { class: 'done-screen' },
      h('div', { class: 'big' }, again === 0 ? '🌟' : '✅'),
      h('h2', {}, 'Repaso terminado'),
      h('div', { class: 'done-stats' },
        h('div', {}, h('b', {}, `${correct}/${queue.length}`), h('span', {}, 'acertadas')),
        h('div', {}, h('b', {}, `${mins}`), h('span', {}, 'min')),
        h('div', {}, h('b', {}, summary ? summary.dueNow : '–'), h('span', {}, 'aun pendientes')),
      ),
      summary && summary.dueNow > 0
        ? h('button', { class: 'btn primary lg', onclick: () => renderReview(code) }, `Seguir repasando (${summary.dueNow})`)
        : h('p', { class: 'muted' }, '¡Todo al dia! Vuelve mas tarde para el siguiente repaso.'),
      h('div', { class: 'grid', style: { marginTop: '16px', maxWidth: '320px', marginInline: 'auto' } },
        h('button', { class: 'btn', onclick: () => renderReview(code, { fresh: 10 }) }, '＋ Aprender 10 palabras nuevas'),
        h('button', { class: 'btn ghost', onclick: () => navigate(`/learn/${code}`) }, 'Volver a los temas'),
      ),
    ));
  }

  step();
}

function renderEmpty(code, counts, language) {
  const root = h('div', { class: 'player' });
  mount(root, h('div', { class: 'done-screen' },
    h('div', { class: 'big' }, '🧘'),
    h('h2', {}, 'No hay repasos pendientes'),
    h('p', { class: 'muted' }, `Tienes ${counts.total} palabras en tu memoria (${counts.mature} ya consolidadas).`),
    h('div', { class: 'grid', style: { marginTop: '10px', maxWidth: '340px', marginInline: 'auto' } },
      counts.learning > 0
        ? h('button', { class: 'btn primary lg', onclick: () => renderReview(code, { early: true }) },
            `Adelantar ${counts.learning} en aprendizaje`)
        : null,
      counts.newAvailable > 0
        ? h('button', { class: 'btn lg', onclick: () => renderReview(code, { fresh: 12 }) },
            `Aprender 12 palabras nuevas (${counts.newAvailable} disponibles)`)
        : null,
      h('button', { class: 'btn ghost', onclick: () => navigate(`/learn/${code}`) }, 'Volver a los temas'),
    ),
  ));
  screen(root);
}
