/**
 * Los 15 idiomas de Polyglot (para hispanohablantes).
 * difficulty: 1 (muy accesible) .. 5 (requiere mas horas) para un hispanohablante.
 * tts_locale: etiqueta BCP-47 que usa el navegador para la sintesis de voz.
 */
export const LANGUAGES = [
  { code: 'en', name: 'Ingles',    native_name: 'English',    flag: '🇬🇧', script: 'latin',  direction: 'ltr', difficulty: 2, tts_locale: 'en-US', family: 'Germanica',
    blurb: 'La lengua franca global. Imprescindible en el mundo profesional, academico y digital.' },
  { code: 'fr', name: 'Frances',   native_name: 'Francais',    flag: '🇫🇷', script: 'latin',  direction: 'ltr', difficulty: 2, tts_locale: 'fr-FR', family: 'Romance',
    blurb: 'Idioma de la diplomacia, hablado en 5 continentes. Muy cercano al espanol.' },
  { code: 'it', name: 'Italiano',  native_name: 'Italiano',    flag: '🇮🇹', script: 'latin',  direction: 'ltr', difficulty: 1, tts_locale: 'it-IT', family: 'Romance',
    blurb: 'El mas transparente para un hispanohablante: fonetica clara y lexico hermano.' },
  { code: 'pt', name: 'Portugues', native_name: 'Portugues',   flag: '🇧🇷', script: 'latin',  direction: 'ltr', difficulty: 1, tts_locale: 'pt-BR', family: 'Romance',
    blurb: 'Mas de 260 millones de hablantes. La comprension escrita es casi inmediata.' },
  { code: 'de', name: 'Aleman',    native_name: 'Deutsch',     flag: '🇩🇪', script: 'latin',  direction: 'ltr', difficulty: 3, tts_locale: 'de-DE', family: 'Germanica',
    blurb: 'Motor economico de Europa. Gramatica logica con casos y palabras compuestas.' },
  { code: 'nl', name: 'Neerlandes', native_name: 'Nederlands', flag: '🇳🇱', script: 'latin',  direction: 'ltr', difficulty: 3, tts_locale: 'nl-NL', family: 'Germanica',
    blurb: 'Puente entre el ingles y el aleman. Paises Bajos y Belgica (Flandes).' },
  { code: 'sv', name: 'Sueco',     native_name: 'Svenska',     flag: '🇸🇪', script: 'latin',  direction: 'ltr', difficulty: 3, tts_locale: 'sv-SE', family: 'Germanica',
    blurb: 'La puerta a Escandinavia. Gramatica sencilla y musicalidad tonal.' },
  { code: 'pl', name: 'Polaco',    native_name: 'Polski',      flag: '🇵🇱', script: 'latin',  direction: 'ltr', difficulty: 4, tts_locale: 'pl-PL', family: 'Eslava',
    blurb: 'La lengua eslava mas hablada de la UE. Siete casos y una fonetica rica.' },
  { code: 'ru', name: 'Ruso',      native_name: 'Russkiy',     flag: '🇷🇺', script: 'cyrillic', direction: 'ltr', difficulty: 4, tts_locale: 'ru-RU', family: 'Eslava',
    blurb: 'Alfabeto cirilico y seis casos. Enorme peso cultural, cientifico y literario.' },
  { code: 'el', name: 'Griego',    native_name: 'Ellinika',    flag: '🇬🇷', script: 'greek',  direction: 'ltr', difficulty: 3, tts_locale: 'el-GR', family: 'Helenica',
    blurb: 'La raiz de gran parte del vocabulario cientifico. Alfabeto propio de 24 letras.' },
  { code: 'tr', name: 'Turco',     native_name: 'Turkce',      flag: '🇹🇷', script: 'latin',  direction: 'ltr', difficulty: 4, tts_locale: 'tr-TR', family: 'Turcica',
    blurb: 'Lengua aglutinante y perfectamente regular: casi no tiene excepciones.' },
  { code: 'ja', name: 'Japones',   native_name: 'Nihongo',     flag: '🇯🇵', script: 'kana',   direction: 'ltr', difficulty: 5, tts_locale: 'ja-JP', family: 'Japonica',
    blurb: 'Tres sistemas de escritura y una cultura fascinante. Gramatica muy distinta.' },
  { code: 'ko', name: 'Coreano',   native_name: 'Hangugeo',    flag: '🇰🇷', script: 'hangul', direction: 'ltr', difficulty: 5, tts_locale: 'ko-KR', family: 'Coreanica',
    blurb: 'El hangul se aprende en un dia. Detras hay un idioma preciso y sistematico.' },
  { code: 'zh', name: 'Chino mandarin', native_name: 'Zhongwen', flag: '🇨🇳', script: 'han', direction: 'ltr', difficulty: 5, tts_locale: 'zh-CN', family: 'Sinotibetana',
    blurb: 'El idioma con mas hablantes nativos. Tonal, sin conjugaciones ni generos.' },
  { code: 'ar', name: 'Arabe',     native_name: 'al-Arabiyya', flag: '🇸🇦', script: 'arabic', direction: 'rtl', difficulty: 5, tts_locale: 'ar-SA', family: 'Semitica',
    blurb: 'Se escribe de derecha a izquierda. Sistema de raices triconsonanticas.' },
];
