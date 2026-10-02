import { h, mount, bar, mdLite, confirmDialog, toast } from '../ui.js';
import { api } from '../api.js';
import { screen, loadingScreen } from '../app.js';
import { navigate } from '../router.js';
import { tts } from '../tts.js';
import { createExercise } from '../exercises.js';

export async function renderLesson(id) {
  loadingScreen('Preparando la leccion…');
  let data;
  try {
    data = await api.get(`/api/lessons/${id}`);
  } catch (e) {
    toast('No se pudo cargar la leccion', 'err');
    navigate('/');
    return;
  }

  const { lesson, steps, vocabIds } = data;
  const ttsLocale = lesson.ttsLocale;
  const direction = lesson.direction;

  let i = 0;
  let combo = 0;
  let correctCount = 0;
  let exerciseCount = 0;
  const seenVocab = new Set();

  const root = h('div', { class: 'player' });
  const progress = bar(0);
  const stage = h('div', {});

  const top = h('div', { class: 'player-top' },
    h('button', { class: 'x', title: 'Salir', onclick: async () => {
      if (i >= steps.length || await confirmDialog({
        title: 'Salir de la leccion',
        message: 'Perderas el progreso de esta sesion.',
        confirmText: 'Salir', danger: true,
      })) {
        tts.stop();
        navigate(`/learn/${lesson.languageCode}`);
      }
    } }, '✕'),
    progress,
    h('span', { class: 'muted small mono' }, ''),
  );
  const counter = top.lastChild;

  mount(root, top, stage);
  screen(root);

  function renderStep() {
    tts.stop();
    progress.querySelector('i').style.width = `${(i / steps.length) * 100}%`;
    counter.textContent = `${Math.min(i + 1, steps.length)}/${steps.length}`;

    if (i >= steps.length) return finish();
    const step = steps[i];

    if (step.kind === 'teach_word') {
      mount(stage, h('div', { class: 'q-card' },
        h('div', { class: 'q-kind' }, 'Palabra nueva'),
        h('div', { class: `q-prompt ${direction === 'rtl' ? 'rtl' : ''}`, style: { marginTop: '30px' } },
          h('button', { class: 'speak-btn big', onclick: () => tts.speak(step.audio, ttsLocale) }, '🔊'),
        ),
        h('div', { class: 'center' },
          h('div', { style: { fontSize: '32px', fontWeight: '750' }, dir: direction === 'rtl' ? 'rtl' : 'ltr' }, step.lemma),
          step.reading ? h('div', { class: 'muted', style: { fontStyle: 'italic' } }, step.reading) : null,
          h('div', { style: { fontSize: '20px', marginTop: '10px', color: 'var(--accent)' } }, step.translation),
          step.pos ? h('span', { class: 'pill', style: { marginTop: '8px' } }, step.pos + (step.gender ? ` · ${step.gender}` : '')) : null,
          step.example ? h('p', { class: 'muted small', style: { marginTop: '16px' } },
            h('span', { dir: direction === 'rtl' ? 'rtl' : 'ltr' }, `“${step.example}”`),
            step.exampleSource ? h('br') : null,
            step.exampleSource ? h('span', { class: 'faint' }, step.exampleSource) : null) : null,
        ),
        h('div', { style: { marginTop: 'auto', paddingTop: '18px' } },
          h('button', { class: 'btn primary block lg', onclick: advance }, 'Entendido')),
      ));
      setTimeout(() => tts.speak(step.audio, ttsLocale), 250);
      return;
    }

    if (step.kind === 'teach_note') {
      mount(stage, h('div', { class: 'q-card' },
        h('div', { class: 'q-kind' }, `Gramatica · ${step.cefr || ''}`),
        h('h2', {}, step.title),
        h('div', { class: 'md', html: mdLite(step.body) }),
        h('div', { style: { marginTop: 'auto', paddingTop: '18px' } },
          h('button', { class: 'btn primary block lg', onclick: advance }, 'Continuar')),
      ));
      return;
    }

    if (step.kind === 'reading') {
      mount(stage, h('div', { class: 'q-card' },
        h('div', { class: 'q-kind' }, `Lectura · ${step.cefr || ''}`),
        h('div', { class: 'row', style: { justifyContent: 'space-between' } },
          h('h2', { style: { margin: 0 } }, step.title),
          h('button', { class: 'speak-btn', onclick: () => tts.speak(step.body, ttsLocale) }, '🔊')),
        h('div', { class: `reading-text ${direction === 'rtl' ? 'rtl' : ''}`, style: { marginTop: '12px' } }, step.body),
        step.translation ? h('details', { style: { marginTop: '10px' } },
          h('summary', { class: 'muted small', style: { cursor: 'pointer' } }, 'Ver traduccion'),
          h('div', { class: 'reading-text', style: { marginTop: '8px' } }, step.translation)) : null,
        h('div', { style: { marginTop: 'auto', paddingTop: '18px' } },
          h('button', { class: 'btn primary block lg', onclick: advance }, 'Empezar preguntas')),
      ));
      return;
    }

    if (step.kind === 'dialogue') {
      mount(stage, h('div', { class: 'q-card' },
        h('div', { class: 'q-kind' }, 'Conversacion'),
        h('h2', {}, step.title),
        step.scenario ? h('p', { class: 'muted small' }, step.scenario) : null,
        h('div', { style: { marginTop: '8px' } }, ...(step.lines || []).map((ln) => h('div', { class: 'dialogue-line' },
          h('span', { class: 'who' }, ln.speaker || ''),
          h('div', { class: 'tx' },
            h('b', { dir: direction === 'rtl' ? 'rtl' : 'ltr' }, ln.target),
            h('span', {}, ln.source),
            h('button', { class: 'speak-btn', style: { width: '30px', height: '30px', fontSize: '13px' }, onclick: () => tts.speak(ln.target, ttsLocale) }, '🔊')),
        ))),
        h('div', { style: { marginTop: 'auto', paddingTop: '18px' } },
          h('button', { class: 'btn primary block lg', onclick: advance }, 'Continuar')),
      ));
      return;
    }

    if (step.kind === 'speak_prompt') {
      mount(stage, h('div', { class: 'q-card' },
        h('div', { class: 'q-kind' }, 'Pronunciacion'),
        h('div', { class: 'q-title' }, step.question),
        h('p', { class: 'center muted' }, step.prompt),
        h('div', { class: `q-prompt ${direction === 'rtl' ? 'rtl' : ''}` },
          h('button', { class: 'speak-btn big', onclick: () => tts.speak(step.target, ttsLocale) }, '🔊'),
          h('span', {}, step.target, step.reading ? h('span', { class: 'reading' }, step.reading) : null)),
        h('p', { class: 'tiny faint center' }, 'Escucha, repite en voz alta y compara.'),
        h('div', { style: { marginTop: 'auto', paddingTop: '18px' } },
          h('button', { class: 'btn primary block lg', onclick: advance }, 'Hecho')),
      ));
      return;
    }

    // ---- ejercicio ----
    exerciseCount++;
    const isNew = step.vocabId && !seenVocab.has(step.vocabId);
    if (step.vocabId) seenVocab.add(step.vocabId);

    const { node } = createExercise(step, {
      ttsLocale, direction,
      onGraded: async (res) => {
        if (res.correct) { combo++; correctCount++; } else { combo = 0; }
        if (!step.isComprehension) {
          try {
            await api.post(`/api/lessons/${id}/answer`, {
              type: step.type, correct: !!res.correct, close: !!res.close,
              combo, isNew, answer: typeof res.answer === 'string' ? res.answer : undefined,
            });
          } catch { /* offline: seguimos */ }
        }
      },
      onContinue: advance,
    });
    mount(stage, node);
  }

  function advance() { i++; renderStep(); }

  async function finish() {
    progress.querySelector('i').style.width = '100%';
    const score = exerciseCount ? correctCount / exerciseCount : 1;
    let res = {};
    try {
      res = await api.post(`/api/lessons/${id}/complete`, { score, vocabIds });
    } catch { /* */ }

    const pass = res.passed !== false && score >= (res.passMark || 0.8);

    if (!pass) {
      mount(stage, h('div', { class: 'done-screen' },
        h('div', { class: 'big' }, '💪'),
        h('h2', {}, 'Leccion no superada'),
        h('p', { class: 'muted', style: { maxWidth: '420px', marginInline: 'auto' } },
          `Necesitas al menos ${Math.round((res.passMark || 0.8) * 100)}% de aciertos para superarla. Has hecho ${Math.round(score * 100)}%.`),
        h('div', { class: 'done-stats' },
          h('div', {}, h('b', {}, `${Math.round(score * 100)}%`), h('span', {}, 'aciertos')),
          h('div', {}, h('b', {}, `${Math.round((res.passMark || 0.8) * 100)}%`), h('span', {}, 'necesario')),
        ),
        res.cardsCreated ? h('p', { class: 'tiny faint' }, `Aun asi, ${res.cardsCreated} palabras entran en tu repaso.`) : null,
        h('div', { class: 'grid', style: { marginTop: '20px', maxWidth: '320px', marginInline: 'auto' } },
          h('button', { class: 'btn primary lg', onclick: () => renderLesson(id) }, 'Reintentar'),
          h('button', { class: 'btn ghost', onclick: () => navigate(`/learn/${lesson.languageCode}`) }, 'Volver a los temas'),
        ),
      ));
      return;
    }

    mount(stage, h('div', { class: 'done-screen' },
      h('div', { class: 'big' }, score >= 0.95 ? '🏆' : '🎉'),
      h('h2', {}, '¡Leccion superada!'),
      h('div', { class: 'done-stats' },
        h('div', {}, h('b', {}, `+${res.bonusXp || 0}`), h('span', {}, 'XP de leccion')),
        h('div', {}, h('b', {}, `${Math.round(score * 100)}%`), h('span', {}, 'aciertos')),
        h('div', {}, h('b', {}, res.streak ?? '–'), h('span', {}, 'dias de racha')),
      ),
      res.cardsCreated ? h('p', { class: 'muted small' }, `${res.cardsCreated} palabras nuevas anadidas a tu repaso espaciado.`) : null,
      res.goalMet ? h('p', { style: { color: 'var(--accent)' } }, '¡Meta diaria cumplida! 🔥') : null,
      h('div', { class: 'grid', style: { marginTop: '20px', maxWidth: '320px', marginInline: 'auto' } },
        res.next
          ? h('button', { class: 'btn primary lg', onclick: () => navigate(`/lesson/${res.next.id}`) }, `Siguiente: ${res.next.title}`)
          : null,
        h('button', { class: 'btn', onclick: () => navigate(`/review/${lesson.languageCode}`) }, 'Ir a repasar'),
        h('button', { class: 'btn ghost', onclick: () => navigate(`/learn/${lesson.languageCode}`) }, 'Volver a los temas'),
      ),
    ));
  }

  renderStep();
}
