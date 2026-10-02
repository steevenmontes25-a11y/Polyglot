/**
 * Gamificacion: niveles por XP, rachas diarias y logros.
 */

/** XP acumulada -> nivel del usuario (curva suave, cada nivel cuesta un poco mas). */
export function levelForXp(xp) {
  // xp necesaria para el nivel n:  50 * n^2 + 50 * n
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level += 1;
  const current = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return {
    level,
    xpIntoLevel: xp - current,
    xpForNext: next - current,
    progress: (xp - current) / (next - current),
    totalXp: xp,
  };
}

export function xpForLevel(n) {
  if (n <= 1) return 0;
  return 50 * (n - 1) * (n - 1) + 50 * (n - 1);
}

/** Fecha local YYYY-MM-DD (el servidor y el navegador comparten zona horaria en local). */
export function today(d = new Date()) {
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}

export function yesterday(d = new Date()) {
  return today(new Date(d.getTime() - 86400000));
}

/**
 * Recalcula la racha al registrar actividad hoy.
 * @returns {{streak:number, bestStreak:number, changed:boolean}}
 */
export function bumpStreak({ streak = 0, best_streak = 0, last_active_date = null }) {
  const t = today();
  if (last_active_date === t) {
    return { streak, bestStreak: best_streak, changed: false, lastDate: t };
  }
  const next = last_active_date === yesterday() ? streak + 1 : 1;
  return {
    streak: next,
    bestStreak: Math.max(best_streak, next),
    changed: true,
    lastDate: t,
  };
}

export function xpForAnswer({ correct, close, combo = 0, isNew = false, hard = false }) {
  if (!correct) return close ? 1 : 0;
  let xp = 10;
  if (isNew) xp += 2;
  if (hard) xp += 3;
  xp += Math.min(combo, 10); // bonus por racha de aciertos dentro de la sesion
  return xp;
}

export const ACHIEVEMENTS = [
  { id: 'first_lesson', title: 'Primer paso', desc: 'Completa tu primera leccion', icon: '🌱',
    test: (s) => s.lessonsCompleted >= 1 },
  { id: 'ten_lessons', title: 'Constancia', desc: 'Completa 10 lecciones', icon: '📚',
    test: (s) => s.lessonsCompleted >= 10 },
  { id: 'streak_3', title: 'En marcha', desc: 'Racha de 3 dias', icon: '🔥',
    test: (s) => s.bestStreak >= 3 },
  { id: 'streak_7', title: 'Semana perfecta', desc: 'Racha de 7 dias', icon: '⚡',
    test: (s) => s.bestStreak >= 7 },
  { id: 'streak_30', title: 'Habito de acero', desc: 'Racha de 30 dias', icon: '💎',
    test: (s) => s.bestStreak >= 30 },
  { id: 'words_50', title: 'Vocabulario inicial', desc: '50 palabras en repaso', icon: '🗂️',
    test: (s) => s.wordsLearning >= 50 },
  { id: 'words_300', title: 'Base solida', desc: '300 palabras aprendidas', icon: '🏗️',
    test: (s) => s.wordsMature >= 300 },
  { id: 'words_1000', title: 'Fluidez a la vista', desc: '1000 palabras dominadas', icon: '🏆',
    test: (s) => s.wordsMature >= 1000 },
  { id: 'xp_1000', title: 'Mil de XP', desc: 'Acumula 1000 XP', icon: '✨',
    test: (s) => s.totalXp >= 1000 },
  { id: 'xp_10000', title: 'Maratonista', desc: 'Acumula 10 000 XP', icon: '🚀',
    test: (s) => s.totalXp >= 10000 },
  { id: 'accuracy_90', title: 'Precision quirurgica', desc: '90% de aciertos (ultimos 30 dias, +50 ejercicios)', icon: '🎯',
    test: (s) => s.exercises30d >= 50 && s.accuracy30d >= 0.9 },
  { id: 'level_b1', title: 'Usuario independiente', desc: 'Alcanza el nivel B1', icon: '🧭',
    test: (s) => ['B1', 'B2', 'C1', 'C2'].includes(s.cefr) },
  { id: 'level_c1', title: 'Dominio profesional', desc: 'Alcanza el nivel C1', icon: '👑',
    test: (s) => ['C1', 'C2'].includes(s.cefr) },
];

export function evaluateAchievements(stats) {
  return ACHIEVEMENTS.map((a) => ({
    id: a.id, title: a.title, desc: a.desc, icon: a.icon,
    unlocked: !!a.test(stats),
  }));
}
