import { h, mount, bar, toast } from '../ui.js';
import { api } from '../api.js';
import { store } from '../store.js';
import { screen, loadingScreen, invalidateLanguages } from '../app.js';
import { navigate } from '../router.js';
import { tts } from '../tts.js';

const IDK = 'No lo se';

const BLUEPRINT_LABEL = {
  Romance: 'Enfasis en produccion escrita, falsos amigos y acentuacion.',
  Germanica: 'Enfasis en produccion, articulos/genero y orden de la frase.',
  Eslava: 'Incluye lectura del alfabeto, declinacion y produccion.',
  Helenica: 'Incluye lectura del alfabeto griego y produccion.',
  Turcica: 'Enfasis en armonia vocalica, "var/yok" y orden de la frase.',
  Japonica: 'Seccion de lectura de kana/kanji como filtro previo.',
  Coreanica: 'Seccion de lectura de hangul como filtro previo.',
  Sinotibetana: 'Seccion de lectura de caracteres y tonos como filtro previo.',
  Semitica: 'Seccion de lectura del alfabeto arabe (derecha a izquierda).',
};

export async function renderPlacement(code) {
  loadingScreen('Generando tu test de nivel…');
  let test;
  try {
    test = await api.get(`/api/placement/${code}`);
  } catch {
    toast('No se pudo generar el test', 'err');
    navigate('/languages');
    return;
  }

  const lang = test.language;
  const rtl = lang.direction === 'rtl';
  const answers = {};
  const root = h('div', { style: { maxWidth: '640px', margin: '0 auto' } });

  function qCard(q, idx) {
    const card = h('div', { class: 'card', style: { marginBottom: '12px' } });
    const head = h('div', { class: 'row', style: { justifyContent: 'space-between' } },
      h('span', { class: 'tiny faint' }, `Pregunta ${idx + 1} de ${test.questionCount} · ${q.band}`),
      (q.kind === 'recognize' || q.kind === 'listening' || q.kind === 'script')
        ? h('span', { class: 'pill' }, kindTag(q.kind))
        : h('span', { class: 'pill' }, kindTag(q.kind)),
    );
    card.append(head);

    // enunciado
    card.append(h('div', { style: { fontWeight: '650', margin: '10px 0 4px' } }, q.q));

    // audio
    if (q.audio) {
      card.append(h('div', { style: { textAlign: 'center', margin: '10px 0' } },
        h('button', { class: 'speak-btn big', type: 'button', onclick: () => tts.speak(q.audio, lang.ttsLocale) }, '🔊')));
      setTimeout(() => tts.speak(q.audio, lang.ttsLocale), 250 + idx * 5);
    }

    // prompt grande (palabra objetivo / gloss / frase con hueco)
    if (q.prompt) {
      const canSpeak = ['recognize', 'cloze', 'script', 'bank'].includes(q.kind);
      card.append(h('div', {
        class: 'q-prompt', dir: (q.kind === 'recall') ? 'ltr' : (rtl ? 'rtl' : 'ltr'),
        style: { fontSize: q.kind === 'cloze' ? '20px' : '26px', margin: '6px 0 12px' },
      },
        canSpeak
          ? h('button', { class: 'speak-btn', type: 'button', onclick: () => tts.speak(q.audio || q.prompt, lang.ttsLocale) }, '🔊')
          : null,
        h('span', {}, q.prompt, q.reading ? h('span', { class: 'reading' }, ` ${q.reading}`) : null),
      ));
    }
    if (q.hint) card.append(h('p', { class: 'muted small', style: { marginTop: '-4px' } }, q.hint));
    if (q.accepts) card.append(h('p', { class: 'tiny faint' }, `Se acepta: ${q.accepts}`));

    // respuesta
    if (q.options) {
      const opts = h('div', { class: 'opts' });
      for (const o of q.options) {
        const isIdk = o === IDK;
        const b = h('button', {
          class: `opt ${isIdk ? 'idk' : ''}`, type: 'button',
          style: isIdk ? { opacity: '.8', fontStyle: 'italic' } : {},
          onclick: () => {
            answers[q.n] = o;
            opts.querySelectorAll('.opt').forEach((x) => x.classList.toggle('sel', x === b));
          },
        }, o);
        opts.append(b);
      }
      card.append(opts);
    } else {
      const inp = h('input', {
        class: 'input', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
        dir: rtl ? 'rtl' : 'ltr',
        placeholder: q.kind === 'cloze' ? 'la palabra que falta' : 'escribe tu respuesta',
        oninput: (e) => { answers[q.n] = e.target.value; },
      });
      card.append(inp);
      card.append(h('p', { class: 'tiny faint' }, 'Dejalo en blanco si no lo sabes (no penaliza).'));
    }
    return card;
  }

  const submit = h('button', { class: 'btn primary block lg', onclick: async () => {
    submit.disabled = true; submit.textContent = 'Calculando…';
    try {
      const r = await api.post(`/api/placement/${code}`, { ticket: test.ticket, answers });
      invalidateLanguages();
      showResult(r);
    } catch (e) {
      toast('Error al enviar el test', 'err');
      submit.disabled = false; submit.textContent = 'Ver mi nivel';
    }
  } }, 'Ver mi nivel');

  function showResult(r) {
    const capBox = r.capNote
      ? h('div', { class: 'err', style: { background: 'rgba(245,185,66,.12)', borderColor: 'rgba(245,185,66,.35)', color: 'var(--gold)' } },
          h('b', {}, 'Ajuste estricto: '), r.capNote)
      : null;

    mount(root, h('div', {},
      h('div', { class: 'done-screen', style: { paddingBottom: '8px' } },
        h('div', { class: 'big' }, r.level === 'A1' ? '🌱' : (r.level.startsWith('A2') ? '📈' : (r.level === 'B1' ? '🚀' : '🧭'))),
        h('h2', {}, `Tu nivel: ${r.level}`),
        r.capApplied ? h('p', { class: 'tiny faint' }, `(la puntuacion bruta daria ${r.band}, ajustado a ${r.level})`) : null,
        h('p', { class: 'muted', style: { maxWidth: '460px', marginInline: 'auto' } }, r.message),
      ),
      capBox,
      h('div', { class: 'card' },
        h('div', { class: 'row', style: { justifyContent: 'space-between' } },
          h('b', {}, 'Desglose por destreza'),
          h('span', { class: 'muted small mono' }, `${r.correct} ✓ · ${r.wrong} ✗ · ${r.skipped} en blanco`)),
        h('div', { style: { marginTop: '12px', display: 'grid', gap: '10px' } },
          ...r.groups.map((g) => h('div', { class: 'row', style: { gap: '10px' } },
            h('span', { class: 'small', style: { minWidth: '170px' } }, g.label),
            bar(g.accuracy, g.name === 'production' ? '' : 'gold'),
            h('span', { class: 'tiny faint mono', style: { minWidth: '38px', textAlign: 'right' } }, `${Math.round(g.accuracy * 100)}%`),
          ))),
        h('p', { class: 'tiny faint', style: { marginTop: '12px' } },
          'La produccion (saber decir/escribir) pesa mas que el reconocimiento: entender no es lo mismo que dominar.'),
      ),
      r.headSkills && r.headSkills.length
        ? h('div', { class: 'card' },
            h('b', {}, 'Damos por asentado'),
            h('p', { class: 'muted small', style: { marginTop: '6px' } },
              `${r.headSkills.map((s) => s.title).join(', ')}. Empezaras mas adelante en el temario; estas palabras volveran en el repaso para confirmarlas.`))
        : null,
      h('div', { class: 'grid', style: { maxWidth: '340px', marginInline: 'auto', marginTop: '16px' } },
        h('button', { class: 'btn primary lg', onclick: () => {
          if (!store.user) { navigate('/login'); return; }
          store.setActiveLang(code);
          navigate(`/learn/${code}`);
        } }, `Empezar el curso (${r.enrollLevel})`),
        h('button', { class: 'btn ghost', onclick: () => navigate('/languages') }, 'Volver a los idiomas'),
      ),
    ));
    window.scrollTo(0, 0);
  }

  mount(root,
    h('div', { class: 'row', style: { marginBottom: '10px' } },
      h('button', { class: 'btn ghost', onclick: () => navigate('/languages') }, '← Idiomas')),
    h('h1', {}, `Test de nivel · ${lang.name} ${lang.flag}`),
    h('p', { class: 'muted' }, BLUEPRINT_LABEL[test.blueprint] || 'Prueba adaptada a este idioma.'),
    h('div', { class: 'err', style: { background: 'var(--bg-elev-2)', borderColor: 'var(--border)', color: 'var(--text-dim)' } },
      h('b', {}, 'Cómo puntúa: '),
      'acertar suma, ', h('b', {}, 'fallar resta'), '. Si no estás seguro, marca ',
      h('b', {}, '«No lo sé»'), ' o deja en blanco: no penaliza. Adivinar a lo loco baja tu nota.'),
    ...test.questions.map((q, i) => qCard(q, i)),
    submit,
    h('div', { style: { height: '48px' } }),
  );
  screen(root);
}

function kindTag(kind) {
  return {
    recall: '✍️ Producir', recognize: '👁️ Reconocer', cloze: '✍️ Completar',
    listening: '🎧 Escuchar', script: '🔤 Escritura', bank: '⚠️ Trampa',
  }[kind] || kind;
}
