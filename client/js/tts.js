/**
 * Sintesis de voz con la Web Speech API del navegador.
 * Gratuita y sin claves. La calidad y los idiomas disponibles
 * dependen del sistema operativo del usuario.
 */
let voices = [];
function refresh() {
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
if (window.speechSynthesis) {
  refresh();
  window.speechSynthesis.onvoiceschanged = refresh;
}

function pickVoice(locale) {
  if (!locale) return null;
  const lc = locale.toLowerCase();
  const base = lc.split('-')[0];
  return (
    voices.find((v) => v.lang.toLowerCase() === lc) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(base)) ||
    null
  );
}

export const tts = {
  get supported() { return !!window.speechSynthesis; },

  available(locale) {
    return !!pickVoice(locale);
  },

  speak(text, locale, { rate = 0.92 } = {}) {
    if (!window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = locale || 'en-US';
      const v = pickVoice(locale);
      if (v) u.voice = v;
      u.rate = rate;
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
  },

  stop() {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch { /* */ }
  },
};
