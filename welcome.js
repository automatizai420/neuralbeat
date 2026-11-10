// ════════════════════════════════════════════════════
// welcome.js — Bienvenida «¿Qué quieres hacer hoy?» + Novedades
//
// · Objetivos rápidos (dormir, calmarse, concentrarse…) o texto libre
//   que intent.js convierte en una sesión.
// · Recuerda las últimas sesiones y muestra estadísticas locales.
// · Enlaces compartibles: ?q=dormir%2020%20minutos o ?go=focus
// · Modal de Novedades: se muestra una vez por versión a quien ya
//   conocía la app; también se abre desde la bienvenida.
// ════════════════════════════════════════════════════

import { PRESETS } from './presets.js';
import { parseIntent, resolveSession, GOALS } from './intent.js';
import { applySession, togglePlay, switchLeftTab, openMobSheet, isMobileLayout, getStats, S } from './app.js';

export const APP_VERSION = '9.1';
const RECENT_KEY = 'coherencia_recent';
const VERSION_KEY = 'coherencia_seen_version';
const SHOWN_KEY = 'coherencia_welcome_shown';   // sessionStorage: una vez por visita

const QUICK = ['sleep', 'calm', 'focus', 'meditate', 'energy', 'creativity'];
const DEFAULT_MIN = { sleep: 20, calm: 5, focus: 25, meditate: 10, energy: 5, creativity: 15 };

// ─── TEXTOS ─────────────────────────────────────────────────────────
const TXT = {
  es: {
    title: '¿Qué quieres hacer hoy?',
    sub: 'Respiración guiada con sonido binaural. Elige un objetivo o descríbelo con tus palabras.',
    goals: {
      sleep: ['Dormir', 'Delta · respiración lenta'], calm: ['Calmar la ansiedad', 'Coherencia cardíaca'],
      focus: ['Concentrarme', 'Beta · foco para trabajar'], meditate: ['Meditar', 'Theta · estado profundo'],
      energy: ['Energía', 'Gamma · respiración activa'], creativity: ['Creatividad', 'Alpha · flujo de ideas'],
    },
    orWrite: 'O escríbelo con tus palabras',
    placeholder: 'Ej.: 6 segundos inhalando y exhalando, concentración máxima para trabajar, 20 min',
    create: 'Crear mi sesión',
    examples: ['6 s inhala y exhala, concentración máxima para trabajar', 'dormir 20 minutos con ruido rosa', '4-7-8 para calmar la ansiedad'],
    duration: 'Duración', free: 'Libre',
    yourSession: 'Tu sesión', start: '▶ Empezar', adjust: 'Ajustar', change: '← Cambiar',
    continue: 'Continuar donde quedaste', recent: 'Tus últimas sesiones',
    stats: (n, m, d) => `${n} sesiones · ${m} min en total${d > 1 ? ` · racha de ${d} días` : ''}`,
    headphones: '🎧 Usa audífonos: el efecto binaural necesita un sonido distinto en cada oído.',
    explore: 'Ver todos los programas →', whatsNew: '✦ Novedades',
    notUnderstood: 'No te entendí del todo. Prueba con un objetivo (dormir, concentrarme, calmarme…) o con tiempos (inhala 4, exhala 6).',
    sum: {
      breath: (i, e) => `Inhala ${i} s · exhala ${e} s`, hold: (h) => `retén ${h} s`, holdEmpty: (h) => `vacío ${h} s`,
      rpm: (b) => `${b} resp/min`, beat: (b) => `Pulso binaural ${b} Hz`, tone: (h) => `Tono ${h} Hz`,
      noise: 'Ruido rosa', noBeep: 'Sin pitido guía', noBinaural: 'Sin binaural',
      minutes: (m) => `${m} min`, noLimit: 'Sin límite de tiempo',
    },
    wimhofWarn: '⚠️ Hiperventilación: hazlo sentado o acostado, nunca en el agua ni conduciendo.',
    headerBtn: '✦ ¿Qué hacemos hoy?',
    news: {
      title: 'Novedades', version: 'Versión', ok: 'Entendido', tryIt: 'Probar «¿Qué quieres hacer hoy?»',
      items: [
        ['✦', 'Nueva pantalla de inicio', 'Elige un objetivo o escribe lo que necesitas («6 s inhalando y exhalando para trabajar») y te armamos la sesión.'],
        ['🔔', 'Recordatorio diario', 'Activa una notificación al día, a la hora que elijas, para no perder tu práctica.'],
        ['⏱', 'Sesiones con duración', 'Fija 5, 10, 20 minutos o los que quieras: suena una campana suave al terminar.'],
        ['🧠', 'Recuerda tus elecciones', 'Tus últimas sesiones, tu racha de días y tus ajustes quedan guardados en este navegador.'],
        ['🔔', 'Pitidos exactos', 'La guía sonora se programa en el reloj del audio: ya no se atrasa ni se pierde.'],
        ['📱', 'Mejor en el móvil', 'Programas y controles accesibles, textos legibles y pantalla siempre encendida durante la sesión.'],
        ['⬇', 'Instálala como app', 'Agrégala a tu pantalla de inicio y úsala sin conexión.'],
        ['🌍', 'Ciencia en 6 idiomas', 'La sección de base científica ya está traducida.'],
      ],
    },
  },
  en: {
    title: 'What do you want to do today?',
    sub: 'Guided breathing with binaural sound. Pick a goal or describe it in your own words.',
    goals: {
      sleep: ['Sleep', 'Delta · slow breathing'], calm: ['Ease anxiety', 'Heart coherence'],
      focus: ['Focus', 'Beta · focus for work'], meditate: ['Meditate', 'Theta · deep state'],
      energy: ['Energy', 'Gamma · active breathing'], creativity: ['Creativity', 'Alpha · flow of ideas'],
    },
    orWrite: 'Or write it in your own words',
    placeholder: 'E.g.: 6 seconds in and out, maximum focus for work, 20 min',
    create: 'Create my session',
    examples: ['6 s in and out, maximum focus for work', 'sleep 20 minutes with pink noise', '4-7-8 to calm anxiety'],
    duration: 'Duration', free: 'Open',
    yourSession: 'Your session', start: '▶ Start', adjust: 'Adjust', change: '← Change',
    continue: 'Pick up where you left off', recent: 'Your recent sessions',
    stats: (n, m, d) => `${n} sessions · ${m} min total${d > 1 ? ` · ${d}-day streak` : ''}`,
    headphones: '🎧 Use headphones: the binaural effect needs a different sound in each ear.',
    explore: 'See all programs →', whatsNew: '✦ What’s new',
    notUnderstood: 'I didn’t quite get that. Try a goal (sleep, focus, calm down…) or timings (inhale 4, exhale 6).',
    sum: {
      breath: (i, e) => `Inhale ${i} s · exhale ${e} s`, hold: (h) => `hold ${h} s`, holdEmpty: (h) => `empty ${h} s`,
      rpm: (b) => `${b} breaths/min`, beat: (b) => `Binaural beat ${b} Hz`, tone: (h) => `Tone ${h} Hz`,
      noise: 'Pink noise', noBeep: 'No guide beep', noBinaural: 'No binaural',
      minutes: (m) => `${m} min`, noLimit: 'No time limit',
    },
    wimhofWarn: '⚠️ Hyperventilation: do it sitting or lying down, never in water or while driving.',
    headerBtn: '✦ What today?',
    news: {
      title: 'What’s new', version: 'Version', ok: 'Got it', tryIt: 'Try “What do you want to do today?”',
      items: [
        ['✦', 'New start screen', 'Pick a goal or type what you need (“6 s in and out for work”) and we build the session for you.'],
        ['🔔', 'Daily reminder', 'Turn on one notification a day, at the time you choose, so you keep up your practice.'],
        ['⏱', 'Timed sessions', 'Set 5, 10, 20 minutes or any length: a soft bell rings at the end.'],
        ['🧠', 'Remembers your choices', 'Your recent sessions, day streak and settings are saved in this browser.'],
        ['🔔', 'Precise beeps', 'The audio guide is scheduled on the audio clock, so it no longer drifts or drops.'],
        ['📱', 'Better on mobile', 'Programs and controls within reach, readable text and the screen stays on during sessions.'],
        ['⬇', 'Install it as an app', 'Add it to your home screen and use it offline.'],
        ['🌍', 'Science in 6 languages', 'The scientific basis section is now translated.'],
      ],
    },
  },
  fr: {
    title: 'Que veux-tu faire aujourd’hui ?',
    sub: 'Respiration guidée avec son binaural. Choisis un objectif ou décris-le avec tes mots.',
    goals: {
      sleep: ['Dormir', 'Delta · respiration lente'], calm: ['Apaiser l’anxiété', 'Cohérence cardiaque'],
      focus: ['Me concentrer', 'Bêta · focus pour travailler'], meditate: ['Méditer', 'Thêta · état profond'],
      energy: ['Énergie', 'Gamma · respiration active'], creativity: ['Créativité', 'Alpha · flux d’idées'],
    },
    orWrite: 'Ou écris-le avec tes mots',
    placeholder: 'Ex. : inspirer et expirer 6 secondes, concentration maximale pour travailler, 20 min',
    create: 'Créer ma séance',
    examples: ['inspirer et expirer 6 s, concentration maximale pour travailler', 'dormir 20 minutes avec bruit rose', '4-7-8 pour calmer l’anxiété'],
    duration: 'Durée', free: 'Libre',
    yourSession: 'Ta séance', start: '▶ Commencer', adjust: 'Ajuster', change: '← Changer',
    continue: 'Reprendre là où tu t’étais arrêté', recent: 'Tes dernières séances',
    stats: (n, m, d) => `${n} séances · ${m} min au total${d > 1 ? ` · ${d} jours d’affilée` : ''}`,
    headphones: '🎧 Utilise des écouteurs : l’effet binaural a besoin d’un son différent dans chaque oreille.',
    explore: 'Voir tous les programmes →', whatsNew: '✦ Nouveautés',
    notUnderstood: 'Je n’ai pas bien compris. Essaie un objectif (dormir, me concentrer, me calmer…) ou des durées (inspire 4, expire 6).',
    sum: {
      breath: (i, e) => `Inspire ${i} s · expire ${e} s`, hold: (h) => `retiens ${h} s`, holdEmpty: (h) => `vide ${h} s`,
      rpm: (b) => `${b} resp/min`, beat: (b) => `Battement binaural ${b} Hz`, tone: (h) => `Ton ${h} Hz`,
      noise: 'Bruit rose', noBeep: 'Sans bip guide', noBinaural: 'Sans binaural',
      minutes: (m) => `${m} min`, noLimit: 'Sans limite de temps',
    },
    wimhofWarn: '⚠️ Hyperventilation : assis ou allongé, jamais dans l’eau ni en conduisant.',
    headerBtn: '✦ Et aujourd’hui ?',
    news: {
      title: 'Nouveautés', version: 'Version', ok: 'Compris', tryIt: 'Essayer « Que veux-tu faire aujourd’hui ? »',
      items: [
        ['✦', 'Nouvel écran d’accueil', 'Choisis un objectif ou écris ce dont tu as besoin (« inspirer et expirer 6 s pour travailler ») et nous créons la séance.'],
        ['🔔', 'Rappel quotidien', 'Active une notification par jour, à l’heure de ton choix, pour garder ta pratique.'],
        ['⏱', 'Séances minutées', 'Choisis 5, 10, 20 minutes ou la durée que tu veux : une cloche douce sonne à la fin.'],
        ['🧠', 'Se souvient de tes choix', 'Tes dernières séances, ta série de jours et tes réglages sont enregistrés dans ce navigateur.'],
        ['🔔', 'Bips précis', 'Le guide sonore est programmé sur l’horloge audio : il ne prend plus de retard.'],
        ['📱', 'Mieux sur mobile', 'Programmes et réglages accessibles, textes lisibles et écran allumé pendant la séance.'],
        ['⬇', 'Installe-la comme une app', 'Ajoute-la à ton écran d’accueil et utilise-la hors ligne.'],
        ['🌍', 'La science en 6 langues', 'La section sur les bases scientifiques est maintenant traduite.'],
      ],
    },
  },
  pt: {
    title: 'O que você quer fazer hoje?',
    sub: 'Respiração guiada com som binaural. Escolha um objetivo ou descreva com suas palavras.',
    goals: {
      sleep: ['Dormir', 'Delta · respiração lenta'], calm: ['Acalmar a ansiedade', 'Coerência cardíaca'],
      focus: ['Concentrar', 'Beta · foco para trabalhar'], meditate: ['Meditar', 'Theta · estado profundo'],
      energy: ['Energia', 'Gamma · respiração ativa'], creativity: ['Criatividade', 'Alpha · fluxo de ideias'],
    },
    orWrite: 'Ou escreva com suas palavras',
    placeholder: 'Ex.: 6 segundos inspirando e expirando, concentração máxima para trabalhar, 20 min',
    create: 'Criar minha sessão',
    examples: ['6 s inspira e expira, concentração máxima para trabalhar', 'dormir 20 minutos com ruído rosa', '4-7-8 para acalmar a ansiedade'],
    duration: 'Duração', free: 'Livre',
    yourSession: 'Sua sessão', start: '▶ Começar', adjust: 'Ajustar', change: '← Mudar',
    continue: 'Continuar de onde parou', recent: 'Suas últimas sessões',
    stats: (n, m, d) => `${n} sessões · ${m} min no total${d > 1 ? ` · sequência de ${d} dias` : ''}`,
    headphones: '🎧 Use fones de ouvido: o efeito binaural precisa de um som diferente em cada ouvido.',
    explore: 'Ver todos os programas →', whatsNew: '✦ Novidades',
    notUnderstood: 'Não entendi bem. Tente um objetivo (dormir, concentrar, acalmar…) ou tempos (inspira 4, expira 6).',
    sum: {
      breath: (i, e) => `Inspira ${i} s · expira ${e} s`, hold: (h) => `segura ${h} s`, holdEmpty: (h) => `vazio ${h} s`,
      rpm: (b) => `${b} resp/min`, beat: (b) => `Batida binaural ${b} Hz`, tone: (h) => `Tom ${h} Hz`,
      noise: 'Ruído rosa', noBeep: 'Sem bipe guia', noBinaural: 'Sem binaural',
      minutes: (m) => `${m} min`, noLimit: 'Sem limite de tempo',
    },
    wimhofWarn: '⚠️ Hiperventilação: faça sentado ou deitado, nunca na água nem dirigindo.',
    headerBtn: '✦ O que fazemos hoje?',
    news: {
      title: 'Novidades', version: 'Versão', ok: 'Entendi', tryIt: 'Experimentar «O que você quer fazer hoje?»',
      items: [
        ['✦', 'Nova tela inicial', 'Escolha um objetivo ou escreva o que precisa («6 s inspirando e expirando para trabalhar») e montamos a sessão.'],
        ['🔔', 'Lembrete diário', 'Ative uma notificação por dia, no horário que escolher, para manter sua prática.'],
        ['⏱', 'Sessões com duração', 'Defina 5, 10, 20 minutos ou o tempo que quiser: um sino suave toca no final.'],
        ['🧠', 'Lembra das suas escolhas', 'Suas últimas sessões, sequência de dias e ajustes ficam salvos neste navegador.'],
        ['🔔', 'Bipes precisos', 'O guia sonoro é programado no relógio do áudio: não atrasa nem se perde.'],
        ['📱', 'Melhor no celular', 'Programas e controles acessíveis, textos legíveis e tela sempre ligada durante a sessão.'],
        ['⬇', 'Instale como app', 'Adicione à tela inicial e use sem conexão.'],
        ['🌍', 'Ciência em 6 idiomas', 'A seção de base científica agora está traduzida.'],
      ],
    },
  },
  zh: {
    title: '今天想做什么？',
    sub: '结合双耳节拍的引导式呼吸。选择一个目标，或用你自己的话描述。',
    goals: {
      sleep: ['入睡', 'Delta · 慢呼吸'], calm: ['缓解焦虑', '心脏相干'],
      focus: ['专注', 'Beta · 工作专注'], meditate: ['冥想', 'Theta · 深度状态'],
      energy: ['提神', 'Gamma · 活力呼吸'], creativity: ['创造力', 'Alpha · 灵感流动'],
    },
    orWrite: '或者用你自己的话写下来',
    placeholder: '例如：吸气和呼气各 6 秒，工作时最大专注，20 分钟（目前最懂西班牙语和英语）',
    create: '生成我的练习',
    examples: ['6 s inhale and exhale, maximum focus for work', 'sleep 20 minutes with pink noise', '4-7-8 to calm anxiety'],
    duration: '时长', free: '不限',
    yourSession: '你的练习', start: '▶ 开始', adjust: '调整', change: '← 更改',
    continue: '从上次继续', recent: '最近的练习',
    stats: (n, m, d) => `${n} 次练习 · 共 ${m} 分钟${d > 1 ? ` · 连续 ${d} 天` : ''}`,
    headphones: '🎧 请使用耳机：双耳效果需要左右耳听到不同的声音。',
    explore: '查看全部程序 →', whatsNew: '✦ 新功能',
    notUnderstood: '没有完全理解。请选择一个目标，或用英语/西班牙语描述，例如 “inhale 4, exhale 6”。',
    sum: {
      breath: (i, e) => `吸气 ${i} 秒 · 呼气 ${e} 秒`, hold: (h) => `屏息 ${h} 秒`, holdEmpty: (h) => `空息 ${h} 秒`,
      rpm: (b) => `每分钟 ${b} 次呼吸`, beat: (b) => `双耳节拍 ${b} Hz`, tone: (h) => `音调 ${h} Hz`,
      noise: '粉红噪音', noBeep: '无提示音', noBinaural: '无双耳节拍',
      minutes: (m) => `${m} 分钟`, noLimit: '不限时',
    },
    wimhofWarn: '⚠️ 过度换气：请坐着或躺着练习，切勿在水中或驾驶时进行。',
    headerBtn: '✦ 今天做什么？',
    news: {
      title: '新功能', version: '版本', ok: '知道了', tryIt: '试试「今天想做什么？」',
      items: [
        ['✦', '全新开始页面', '选择一个目标，或写下你的需求，我们会为你生成练习。'],
        ['🔔', '每日提醒', '在你选择的时间每天收到一条通知，坚持练习。'],
        ['⏱', '定时练习', '可设定 5、10、20 分钟或任意时长，结束时会响起柔和的铃声。'],
        ['🧠', '记住你的选择', '最近的练习、连续天数和设置都会保存在此浏览器中。'],
        ['🔔', '精准提示音', '提示音按音频时钟精确安排，不再延迟或丢失。'],
        ['📱', '手机体验更好', '程序和控制更易操作，文字更清晰，练习时屏幕保持常亮。'],
        ['⬇', '可安装为应用', '添加到主屏幕，离线也能使用。'],
        ['🌍', '科学依据支持 6 种语言', '科学依据部分现已翻译。'],
      ],
    },
  },
  hi: {
    title: 'आज आप क्या करना चाहते हैं?',
    sub: 'बाइनॉरल ध्वनि के साथ निर्देशित श्वास। कोई लक्ष्य चुनें या अपने शब्दों में बताएं।',
    goals: {
      sleep: ['नींद', 'Delta · धीमी श्वास'], calm: ['चिंता कम करें', 'हृदय सामंजस्य'],
      focus: ['एकाग्रता', 'Beta · काम के लिए फोकस'], meditate: ['ध्यान', 'Theta · गहरी अवस्था'],
      energy: ['ऊर्जा', 'Gamma · सक्रिय श्वास'], creativity: ['रचनात्मकता', 'Alpha · विचारों का प्रवाह'],
    },
    orWrite: 'या अपने शब्दों में लिखें',
    placeholder: 'उदा.: 6 सेकंड सांस लें और छोड़ें, काम के लिए अधिकतम फोकस, 20 मिनट (अभी स्पेनिश और अंग्रेज़ी सबसे अच्छी समझी जाती है)',
    create: 'मेरा सत्र बनाएं',
    examples: ['6 s inhale and exhale, maximum focus for work', 'sleep 20 minutes with pink noise', '4-7-8 to calm anxiety'],
    duration: 'अवधि', free: 'असीमित',
    yourSession: 'आपका सत्र', start: '▶ शुरू करें', adjust: 'समायोजित करें', change: '← बदलें',
    continue: 'जहाँ छोड़ा था वहीं से जारी रखें', recent: 'आपके हाल के सत्र',
    stats: (n, m, d) => `${n} सत्र · कुल ${m} मिनट${d > 1 ? ` · लगातार ${d} दिन` : ''}`,
    headphones: '🎧 हेडफ़ोन लगाएं: बाइनॉरल प्रभाव के लिए हर कान में अलग ध्वनि चाहिए।',
    explore: 'सभी प्रोग्राम देखें →', whatsNew: '✦ नया क्या है',
    notUnderstood: 'पूरी तरह समझ नहीं आया। कोई लक्ष्य चुनें, या अंग्रेज़ी/स्पेनिश में लिखें, जैसे “inhale 4, exhale 6”।',
    sum: {
      breath: (i, e) => `सांस लें ${i} से · छोड़ें ${e} से`, hold: (h) => `रोकें ${h} से`, holdEmpty: (h) => `खाली ${h} से`,
      rpm: (b) => `${b} श्वास/मिनट`, beat: (b) => `बाइनॉरल बीट ${b} Hz`, tone: (h) => `स्वर ${h} Hz`,
      noise: 'पिंक नॉइज़', noBeep: 'बिना संकेत ध्वनि', noBinaural: 'बिना बाइनॉरल',
      minutes: (m) => `${m} मिनट`, noLimit: 'कोई समय सीमा नहीं',
    },
    wimhofWarn: '⚠️ हाइपरवेंटिलेशन: बैठकर या लेटकर करें, कभी पानी में या गाड़ी चलाते समय नहीं।',
    headerBtn: '✦ आज क्या करें?',
    news: {
      title: 'नया क्या है', version: 'संस्करण', ok: 'समझ गया', tryIt: '«आज आप क्या करना चाहते हैं?» आज़माएं',
      items: [
        ['✦', 'नई शुरुआती स्क्रीन', 'कोई लक्ष्य चुनें या अपनी ज़रूरत लिखें, और हम आपके लिए सत्र तैयार करेंगे।'],
        ['🔔', 'दैनिक अनुस्मारक', 'अपने चुने हुए समय पर रोज़ एक सूचना पाएं, ताकि अभ्यास न छूटे।'],
        ['⏱', 'समयबद्ध सत्र', '5, 10, 20 मिनट या कोई भी अवधि चुनें: अंत में एक हल्की घंटी बजेगी।'],
        ['🧠', 'आपकी पसंद याद रखता है', 'आपके हाल के सत्र, लगातार दिनों की गिनती और सेटिंग्स इस ब्राउज़र में सहेजी जाती हैं।'],
        ['🔔', 'सटीक संकेत ध्वनि', 'ध्वनि संकेत ऑडियो घड़ी पर निर्धारित होते हैं: अब न देर होती है, न छूटते हैं।'],
        ['📱', 'मोबाइल पर बेहतर', 'प्रोग्राम और नियंत्रण आसानी से उपलब्ध, पढ़ने योग्य टेक्स्ट और सत्र के दौरान स्क्रीन चालू रहती है।'],
        ['⬇', 'ऐप की तरह इंस्टॉल करें', 'इसे होम स्क्रीन पर जोड़ें और बिना इंटरनेट के उपयोग करें।'],
        ['🌍', '6 भाषाओं में विज्ञान', 'वैज्ञानिक आधार वाला भाग अब अनुवादित है।'],
      ],
    },
  },
};

const LANGS = [['es', 'ES'], ['en', 'EN'], ['fr', 'FR'], ['pt', 'PT'], ['zh', '中文'], ['hi', 'हिं']];

// ─── ESTADO ─────────────────────────────────────────────────────────
let lang = 'es';
let minutesSel = null;        // null = el usuario no eligió duración
let current = null;           // { sess, label, emoji, text, intent }
let lastQuery = '';
const L = () => TXT[lang] || TXT.es;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

function presetLabel(id) {
  const el = document.querySelector(`.preset-card[data-preset-id="${id}"] .pc-benefit`);
  const p = PRESETS.find(x => x.id === id);
  return el ? el.textContent.trim() : (p ? (p.name[lang] || p.name.es) : id);
}
function presetName(id) {
  const p = PRESETS.find(x => x.id === id);
  return p ? (p.name[lang] || p.name.es) : '';
}

// ─── CONSTRUIR SESIÓN ───────────────────────────────────────────────
function buildFromIntent(intent, text) {
  const preset = PRESETS.find(p => p.id === intent.preset);
  if (!preset) return null;
  const sess = resolveSession(intent, preset);
  ['noise', 'binaural', 'beep'].forEach(k => { if (intent[k] != null) sess[k] = intent[k]; });
  if (sess.minutes == null) {
    if (minutesSel !== null) sess.minutes = minutesSel || null;
    else if (intent.goal && DEFAULT_MIN[intent.goal] && !text) sess.minutes = DEFAULT_MIN[intent.goal];
  }
  const goal = intent.goal && GOALS[intent.goal];
  const emoji = goal ? goal.emoji : '✦';
  const label = text
    ? presetLabel(preset.id)
    : (L().goals[intent.goal] ? L().goals[intent.goal][0] : presetLabel(preset.id));
  return { sess, label, emoji, text: text || '', goal: intent.goal || null, intent };
}

function summaryChips(c) {
  const T = L().sum, s = c.sess, p = PRESETS.find(x => x.id === s.presetId);
  const chips = [];
  const name = presetName(s.presetId);
  if (name) chips.push(name);
  if (s.pattern !== 'wimhof') {
    if (s.customTiming && s.ratio && s.bpm) {
      const cyc = 60 / s.bpm, inh = cyc * s.ratio / (s.ratio + 1), exh = cyc - inh;
      const r1 = (x) => Math.round(x * 10) / 10;
      chips.push(T.breath(r1(inh), r1(exh)));
    } else {
      chips.push(T.rpm(Math.round(s.bpm * 10) / 10));
    }
    if (s.holdFull) chips.push(T.hold(s.holdFull));
    if (s.holdEmpty) chips.push(T.holdEmpty(s.holdEmpty));
  }
  if (p && p.audio.tone) chips.push(T.tone(p.audio.tone));
  else if (s.beat) chips.push(T.beat(s.beat));
  if (s.noise === true) chips.push(T.noise);
  if (s.beep === false) chips.push(T.noBeep);
  if (s.binaural === false) chips.push(T.noBinaural);
  chips.push(s.minutes ? T.minutes(s.minutes) : T.noLimit);
  return chips;
}

// ─── RECIENTES ──────────────────────────────────────────────────────
function saveRecent(c) {
  const list = ls.get(RECENT_KEY, []).filter(r => !(r.sess.presetId === c.sess.presetId && r.text === c.text && r.goal === c.goal));
  list.unshift({ sess: c.sess, label: c.label, emoji: c.emoji, text: c.text, goal: c.goal, ts: Date.now() });
  ls.set(RECENT_KEY, list.slice(0, 4));
}

// ─── RENDER BIENVENIDA ──────────────────────────────────────────────
function el(id) { return document.getElementById(id); }

function render() {
  const T = L();
  const root = el('welcome');
  if (!root) return;
  const recent = ls.get(RECENT_KEY, []);
  const stats = getStats();

  const langBtns = LANGS.map(([k, n]) => `<button class="ob-lang${k === lang ? ' active' : ''}" data-lang="${k}">${n}</button>`).join('');
  const goals = QUICK.map(g => `
      <button class="ob-goal" data-goal="${g}">
        <span class="ob-goal-emoji">${GOALS[g].emoji}</span>
        <span class="ob-goal-txt"><b>${esc(T.goals[g][0])}</b><small>${esc(T.goals[g][1])}</small></span>
      </button>`).join('');
  const durs = [0, 5, 10, 20, 30].map(m =>
    `<button class="ob-dur${minutesSel === m ? ' active' : ''}" data-min="${m}">${m ? m + ' min' : esc(T.free)}</button>`).join('');
  const examples = T.examples.map(x => `<button class="ob-ex" data-ex="${esc(x)}">“${esc(x)}”</button>`).join('');

  const recentHtml = recent.length ? `
      <div class="ob-section">
        <div class="ob-label">${esc(T.continue)}</div>
        <div class="ob-recent">
          ${recent.slice(0, 3).map((r, i) => `
            <button class="ob-recent-item${i === 0 ? ' first' : ''}" data-recent="${i}">
              <span class="ob-goal-emoji">${r.emoji || '✦'}</span>
              <span class="ob-goal-txt"><b>${esc(r.label)}</b><small>${esc(r.text || (r.sess.minutes ? T.sum.minutes(r.sess.minutes) : T.sum.noLimit))}</small></span>
              <span class="ob-play">▶</span>
            </button>`).join('')}
        </div>
        ${stats.sessions ? `<div class="ob-stats">${esc(T.stats(stats.sessions, Math.round(stats.seconds / 60), stats.streak || 0))}</div>` : ''}
      </div>` : '';

  let resultHtml = '';
  if (current) {
    resultHtml = `
      <div class="ob-result" id="obResult">
        <div class="ob-label">${esc(T.yourSession)}</div>
        <div class="ob-result-head"><span class="ob-goal-emoji">${current.emoji}</span><b>${esc(current.label)}</b></div>
        ${current.text ? `<div class="ob-quote">“${esc(current.text)}”</div>` : ''}
        <div class="ob-chips">${summaryChips(current).map(c => `<span class="ob-chip">${esc(c)}</span>`).join('')}</div>
        ${current.sess.pattern === 'wimhof' ? `<div class="ob-warn">${esc(T.wimhofWarn)}</div>` : ''}
        <div class="ob-actions">
          <button class="ob-btn primary" id="obStart">${esc(T.start)}</button>
          <button class="ob-btn" id="obAdjust">${esc(T.adjust)}</button>
          <button class="ob-btn ghost" id="obChange">${esc(T.change)}</button>
        </div>
      </div>`;
  } else if (lastQuery) {
    resultHtml = `<div class="ob-warn" id="obResult">${esc(T.notUnderstood)}</div>`;
  }

  root.innerHTML = `
    <div class="ob-card" role="dialog" aria-modal="true" aria-labelledby="obTitle">
      <div class="ob-top">
        <div class="ob-brand">COHERENCIA</div>
        <div class="ob-langs">${langBtns}</div>
        <button class="ob-close" id="obClose" aria-label="Cerrar">✕</button>
      </div>
      <h1 class="ob-title" id="obTitle">${esc(T.title)}</h1>
      <p class="ob-sub">${esc(T.sub)}</p>
      ${current ? resultHtml : `
      ${recentHtml}
      <div class="ob-section">
        <div class="ob-goals">${goals}</div>
      </div>
      <div class="ob-section">
        <div class="ob-label">${esc(T.duration)}</div>
        <div class="ob-durs">${durs}</div>
      </div>
      <div class="ob-section">
        <div class="ob-label">${esc(T.orWrite)}</div>
        <form class="ob-form" id="obForm">
          <textarea id="obText" rows="2" placeholder="${esc(T.placeholder)}">${esc(lastQuery)}</textarea>
          <button type="submit" class="ob-btn primary">${esc(T.create)}</button>
        </form>
        <div class="ob-examples">${examples}</div>
        ${resultHtml}
      </div>`}
      <div class="ob-foot">
        <div class="ob-phones">${esc(T.headphones)}</div>
        <div class="ob-links">
          <button class="ob-link" id="obNews">${esc(T.whatsNew)}</button>
          <button class="ob-link reminder-entry" id="obReminder"></button>
          <button class="ob-link" id="obExplore">${esc(T.explore)}</button>
        </div>
      </div>
    </div>`;
  bind();
}

function bind() {
  const root = el('welcome');
  root.querySelectorAll('.ob-lang').forEach(b => b.onclick = () => window.setLang(b.dataset.lang));
  el('obClose').onclick = closeWelcome;
  el('obExplore').onclick = closeWelcome;
  el('obNews').onclick = () => openNews();
  el('obReminder').onclick = () => { closeWelcome(); window.openReminder && window.openReminder(); };
  el('obReminder').textContent = (window.__reminderEntry && window.__reminderEntry()) || '🔔';
  root.querySelectorAll('.ob-goal').forEach(b => b.onclick = () => {
    current = buildFromIntent({ preset: GOALS[b.dataset.goal].preset, goal: b.dataset.goal }, '');
    render();
  });
  root.querySelectorAll('.ob-dur').forEach(b => b.onclick = () => {
    minutesSel = parseInt(b.dataset.min, 10);
    root.querySelectorAll('.ob-dur').forEach(x => x.classList.toggle('active', x === b));
  });
  root.querySelectorAll('.ob-ex').forEach(b => b.onclick = () => { el('obText').value = b.dataset.ex; submitText(b.dataset.ex); });
  root.querySelectorAll('.ob-recent-item').forEach(b => b.onclick = () => {
    const r = ls.get(RECENT_KEY, [])[+b.dataset.recent];
    if (r) startSession({ sess: r.sess, label: r.label, emoji: r.emoji, text: r.text, goal: r.goal });
  });
  const form = el('obForm');
  if (form) {
    form.onsubmit = (e) => { e.preventDefault(); submitText(el('obText').value); };
    el('obText').onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitText(el('obText').value); } };
  }
  if (el('obStart')) {
    el('obStart').onclick = () => startSession(current);
    el('obAdjust').onclick = () => adjustSession(current);
    el('obChange').onclick = () => { current = null; render(); };
    el('obStart').focus();
  }
}

function submitText(text) {
  lastQuery = String(text || '').trim();
  if (!lastQuery) return;
  const intent = parseIntent(lastQuery);
  current = intent.matched && intent.preset ? buildFromIntent(intent, lastQuery) : null;
  render();
  if (!current) el('obResult')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function startSession(c) {
  applySession(c.sess, c.label);
  saveRecent(c);
  closeWelcome();
  if (!S.playing) togglePlay();      // gesto del usuario → el audio puede arrancar
}

function adjustSession(c) {
  applySession(c.sess, c.label);
  saveRecent(c);
  closeWelcome();
  if (isMobileLayout()) openMobSheet('controls');
  else switchLeftTab('controls');
}

// ─── ABRIR / CERRAR ─────────────────────────────────────────────────
export function openWelcome(opts = {}) {
  current = null;
  if (opts.query) { lastQuery = opts.query; const it = parseIntent(opts.query); if (it.matched && it.preset) current = buildFromIntent(it, opts.query); }
  else if (opts.goal && GOALS[opts.goal]) current = buildFromIntent({ preset: GOALS[opts.goal].preset, goal: opts.goal }, '');
  else lastQuery = '';
  render();
  el('welcome').classList.add('open');
  document.body.classList.add('ob-lock');
  try { sessionStorage.setItem(SHOWN_KEY, '1'); } catch (e) {}
}

export function closeWelcome() {
  el('welcome')?.classList.remove('open');
  document.body.classList.remove('ob-lock');
}

// ─── NOVEDADES ──────────────────────────────────────────────────────
function renderNews() {
  const N = L().news;
  const root = el('newsModal');
  if (!root) return;
  root.innerHTML = `
    <div class="ob-card news" role="dialog" aria-modal="true" aria-labelledby="newsTitle">
      <div class="ob-top">
        <div class="ob-brand">${esc(N.version)} ${APP_VERSION}</div>
        <div class="ob-langs">${LANGS.map(([k, n]) => `<button class="ob-lang${k === lang ? ' active' : ''}" data-lang="${k}">${n}</button>`).join('')}</div>
        <button class="ob-close" id="newsClose" aria-label="Cerrar">✕</button>
      </div>
      <h1 class="ob-title" id="newsTitle">${esc(N.title)}</h1>
      <ul class="news-list">
        ${N.items.map(([ic, h, d]) => `<li><span class="news-ic">${ic}</span><div><b>${esc(h)}</b><p>${esc(d)}</p></div></li>`).join('')}
      </ul>
      <div class="ob-actions">
        <button class="ob-btn primary" id="newsTry">${esc(N.tryIt)}</button>
        <button class="ob-btn" id="newsOk">${esc(N.ok)}</button>
      </div>
    </div>`;
  root.querySelectorAll('.ob-lang').forEach(b => b.onclick = () => window.setLang(b.dataset.lang));
  el('newsClose').onclick = closeNews;
  el('newsOk').onclick = closeNews;
  el('newsTry').onclick = () => { closeNews(); openWelcome(); };
}

export function openNews() {
  closeWelcome();
  renderNews();
  el('newsModal').classList.add('open');
  document.body.classList.add('ob-lock');
  ls.set(VERSION_KEY, APP_VERSION);
}

export function closeNews() {
  el('newsModal')?.classList.remove('open');
  document.body.classList.remove('ob-lock');
  ls.set(VERSION_KEY, APP_VERSION);
}

// ─── INIT ───────────────────────────────────────────────────────────
// returning: la persona ya había usado la app antes de esta carga
export function initWelcome({ returning }) {
  lang = document.documentElement.lang || 'es';

  // Re-render al cambiar idioma (desde la app o desde los modales)
  const origSetLang = window.setLang;
  window.setLang = (l) => {
    origSetLang(l);
    lang = l;
    if (el('welcome')?.classList.contains('open')) {
      // reconstruir el resumen con el nuevo idioma
      if (current) current = current.text ? buildFromIntent(current.intent, current.text) : buildFromIntent({ preset: current.sess.presetId, goal: current.goal }, '');
      render();
    }
    if (el('newsModal')?.classList.contains('open')) renderNews();
    setHeaderLabel();
  };
  setHeaderLabel();

  window.openWelcome = openWelcome;
  window.openNews = openNews;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeWelcome(); closeNews(); }
  });
  ['welcome', 'newsModal'].forEach(id => el(id)?.addEventListener('click', (e) => {
    if (e.target.id === id) id === 'welcome' ? closeWelcome() : closeNews();
  }));

  // Enlaces compartibles: ?q=texto o ?go=objetivo
  const params = new URLSearchParams(location.search);
  const q = params.get('q'), go = params.get('go');
  if (params.get('from') === 'reminder') { openWelcome(); return; }   // abierto desde la notificación
  if (q || go) { openWelcome({ query: q, goal: go }); ls.set(VERSION_KEY, APP_VERSION); return; }

  const seenVersion = ls.get(VERSION_KEY, null);
  if (returning && seenVersion !== APP_VERSION) { openNews(); return; }
  if (!returning) ls.set(VERSION_KEY, APP_VERSION);   // a los nuevos no se les muestran novedades

  let shown = false;
  try { shown = sessionStorage.getItem(SHOWN_KEY) === '1'; } catch (e) {}
  if (!shown) openWelcome();
}

function setHeaderLabel() {
  const b = el('welcomeBtn');
  if (b) b.textContent = L().headerBtn;
}
