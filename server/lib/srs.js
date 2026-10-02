/**
 * Motor de repeticion espaciada.
 *
 * Variante de SM-2 (el algoritmo de SuperMemo / Anki) con una fase de
 * aprendizaje corta para las tarjetas nuevas. Valoraciones:
 *
 *   0 = "Otra vez"  (fallo)
 *   1 = "Dificil"
 *   2 = "Bien"
 *   3 = "Facil"
 *
 * El estado de cada tarjeta: new -> learning -> review  (y lapsed si se falla).
 */

const MIN_EASE = 1.3;
const LEARNING_STEPS_MIN = [1, 10]; // minutos
const GRADUATING_INTERVAL_DAYS = 1;
const EASY_INTERVAL_DAYS = 4;
const LAPSE_INTERVAL_DAYS = 0.007; // ~10 min

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60_000);
}
function addDays(date, days) {
  return new Date(date.getTime() + days * 86_400_000);
}
function iso(date) {
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

/**
 * @param {object} card  { ease, interval_days, repetitions, lapses, state }
 * @param {number} rating 0..3
 * @param {Date}   now
 * @returns {object} nuevos campos + due_at (ISO) + intervalo previo/nuevo
 */
export function schedule(card, rating, now = new Date()) {
  let { ease, interval_days: interval, repetitions, lapses, state } = {
    ease: 2.5, interval_days: 0, repetitions: 0, lapses: 0, state: 'new',
    ...card,
  };
  const prevInterval = interval;

  const isLearning = state === 'new' || state === 'learning' || state === 'lapsed';

  if (isLearning) {
    if (rating === 0) {
      // repetir el primer paso
      interval = LEARNING_STEPS_MIN[0] / 1440;
      state = state === 'lapsed' ? 'lapsed' : 'learning';
      repetitions = 0;
      return finish({ ease, interval, repetitions, lapses, state, prevInterval, now, unit: 'min', minutes: LEARNING_STEPS_MIN[0] });
    }
    if (rating === 1) {
      const minutes = LEARNING_STEPS_MIN[Math.min(1, LEARNING_STEPS_MIN.length - 1)];
      interval = minutes / 1440;
      state = 'learning';
      return finish({ ease, interval, repetitions, lapses, state, prevInterval, now, unit: 'min', minutes });
    }
    // rating 2 o 3 -> graduar
    interval = rating === 3 ? EASY_INTERVAL_DAYS : GRADUATING_INTERVAL_DAYS;
    repetitions = 1;
    state = 'review';
    if (rating === 3) ease = Math.max(MIN_EASE, ease + 0.15);
    return finish({ ease, interval, repetitions, lapses, state, prevInterval, now, unit: 'day' });
  }

  // ---- estado review ----
  if (rating === 0) {
    lapses += 1;
    repetitions = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
    interval = LAPSE_INTERVAL_DAYS;
    state = 'lapsed';
    return finish({ ease, interval, repetitions, lapses, state, prevInterval, now, unit: 'min', minutes: 10 });
  }

  // SM-2 clasico para aciertos
  const q = rating + 2; // 1->3, 2->4, 3->5
  ease = Math.max(MIN_EASE, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  let factor;
  if (rating === 1) factor = 1.2;          // dificil
  else if (rating === 2) factor = ease;    // bien
  else factor = ease * 1.3;                // facil

  const base = interval < 1 ? 1 : interval;
  interval = Math.round(base * factor * 100) / 100;
  interval = Math.min(interval, 365 * 3);
  repetitions += 1;
  state = 'review';

  return finish({ ease, interval, repetitions, lapses, state, prevInterval, now, unit: 'day' });
}

function finish({ ease, interval, repetitions, lapses, state, prevInterval, now, unit, minutes }) {
  const due = unit === 'min' ? addMinutes(now, minutes ?? interval * 1440) : addDays(now, interval);
  return {
    ease: Math.round(ease * 1000) / 1000,
    interval_days: Math.round(interval * 1000) / 1000,
    repetitions,
    lapses,
    state,
    due_at: iso(due),
    last_reviewed_at: iso(now),
    prev_interval: prevInterval,
    new_interval: interval,
  };
}

/** Descripcion legible del proximo repaso (para la UI). */
export function humanizeInterval(days) {
  if (days < 1 / 24) return `${Math.max(1, Math.round(days * 1440))} min`;
  if (days < 1) return `${Math.round(days * 24)} h`;
  if (days < 30) return `${Math.round(days)} d`;
  if (days < 365) return `${Math.round(days / 30)} meses`;
  return `${(days / 365).toFixed(1)} anos`;
}

export const RATINGS = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 };
