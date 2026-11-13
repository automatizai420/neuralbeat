// ════════════════════════════════════════════════════
// seo.js — Metadatos por idioma (título, descripción, canonical, Open Graph)
//
// La página es una sola (index.html). Cada idioma tiene su URL:
//   es → https://neuralbeat.online/            (también x-default)
//   en/fr/pt/zh/hi → https://neuralbeat.online/?lang=xx
// index.html declara los hreflang estáticos; aquí se ajusta el título,
// la descripción y la URL canónica al idioma activo (Google ejecuta JS).
// ════════════════════════════════════════════════════

export const SITE = 'https://neuralbeat.online/';

// Código hreflang y og:locale de cada idioma de la app
export const LOCALES = {
  es: { hreflang: 'es',      og: 'es_LA' },
  en: { hreflang: 'en',      og: 'en_US' },
  fr: { hreflang: 'fr',      og: 'fr_FR' },
  pt: { hreflang: 'pt-BR',   og: 'pt_BR' },
  zh: { hreflang: 'zh-Hans', og: 'zh_CN' },
  hi: { hreflang: 'hi',      og: 'hi_IN' },
};

const META = {
  es: {
    title: 'NeuralBeat · Respiración guiada con sonidos binaurales para dormir, calmarte y concentrarte',
    desc: 'Respiración guiada gratis con ondas binaurales y frecuencias solfeggio: coherencia cardíaca, 4-7-8, box breathing y Wim Hof. Elige tu objetivo —dormir, ansiedad, concentración— y empieza en un toque, sin registro.',
  },
  en: {
    title: 'NeuralBeat · Guided breathing with binaural beats for sleep, calm and focus',
    desc: 'Free guided breathing with binaural beats and solfeggio frequencies: heart coherence, 4-7-8, box breathing and Wim Hof. Pick a goal —sleep, anxiety, focus— and start in one tap. No sign-up, works in your browser.',
  },
  fr: {
    title: 'NeuralBeat · Respiration guidée et sons binauraux pour dormir, se calmer et se concentrer',
    desc: 'Respiration guidée gratuite avec battements binauraux et fréquences solfège : cohérence cardiaque, 4-7-8, respiration carrée et Wim Hof. Choisissez un objectif —sommeil, anxiété, concentration— et commencez en un clic, sans inscription.',
  },
  pt: {
    title: 'NeuralBeat · Respiração guiada com batidas binaurais para dormir, relaxar e focar',
    desc: 'Respiração guiada grátis com batidas binaurais e frequências solfeggio: coerência cardíaca, 4-7-8, respiração quadrada e Wim Hof. Escolha seu objetivo —dormir, ansiedade, foco— e comece em um toque, sem cadastro.',
  },
  zh: {
    title: 'NeuralBeat · 双耳节拍引导呼吸：助眠、减压、专注',
    desc: '免费的双耳节拍与索尔费吉奥频率引导呼吸练习：心脏相干呼吸、4-7-8 呼吸法、箱式呼吸和 Wim Hof 呼吸法。选择目标——睡眠、焦虑、专注——一键开始，无需注册，浏览器即可使用。',
  },
  hi: {
    title: 'NeuralBeat · बाइनॉरल बीट्स के साथ निर्देशित श्वास — नींद, शांति और एकाग्रता',
    desc: 'बाइनॉरल बीट्स और सॉल्फ़ेजियो आवृत्तियों के साथ मुफ़्त निर्देशित श्वास: हृदय सामंजस्य, 4-7-8, बॉक्स ब्रीदिंग और विम हॉफ। लक्ष्य चुनें — नींद, चिंता, एकाग्रता — और एक टैप में शुरू करें, बिना पंजीकरण।',
  },
};

export const urlFor = (lang) => (lang === 'es' ? SITE : `${SITE}?lang=${lang}`);

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function applySeo(lang) {
  const m = META[lang] || META.es;
  const loc = LOCALES[lang] || LOCALES.es;
  document.title = m.title;
  setMeta('meta[name="description"]', 'content', m.desc);
  setMeta('link[rel="canonical"]', 'href', urlFor(lang));
  setMeta('meta[property="og:title"]', 'content', m.title);
  setMeta('meta[property="og:description"]', 'content', m.desc);
  setMeta('meta[property="og:url"]', 'content', urlFor(lang));
  setMeta('meta[property="og:locale"]', 'content', loc.og);
  setMeta('meta[name="twitter:title"]', 'content', m.title);
  setMeta('meta[name="twitter:description"]', 'content', m.desc);
}
