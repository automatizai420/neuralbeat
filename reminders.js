// ════════════════════════════════════════════════════
// reminders.js — Recordatorio diario (Web Push)
//
// · Solo aparece si el servidor está configurado (GET /api/push/key = 200):
//   se puede desplegar el código antes de configurar Cloudflare.
// · Puntos de entrada: botón en Controles, enlace en la bienvenida y una
//   oferta al terminar una sesión («¿Te recuerdo mañana a las 21:30?»).
// · El texto de la notificación se guarda en el service worker en el
//   idioma de la persona (el push llega sin contenido).
// · En iPhone/iPad solo funciona con la app instalada (iOS 16.4+).
// ════════════════════════════════════════════════════

const PREF_KEY = 'coherencia_reminder';
const OFFER_KEY = 'coherencia_reminder_offer';

const TXT = {
  es: {
    entry: '🔔 Recordatorio diario', title: 'Recordatorio diario',
    desc: 'Te enviamos una notificación al día para tu práctica de respiración. Puedes desactivarlo cuando quieras.',
    time: 'Hora', enable: 'Activar recordatorio', save: 'Guardar hora', disable: 'Desactivar', close: 'Cerrar',
    on: (t) => `✓ Activo · todos los días a las ${t}`,
    denied: 'Las notificaciones están bloqueadas para este sitio. Actívalas en los ajustes del navegador y vuelve a intentarlo.',
    ios: 'En iPhone y iPad: primero instala la app (Compartir → «Agregar a pantalla de inicio») y ábrela desde el ícono.',
    unsupported: 'Este navegador no permite notificaciones.',
    error: 'No se pudo activar. Revisa tu conexión e inténtalo de nuevo.',
    offer: (t) => `¿Te recuerdo mañana a las ${t}?`, yes: 'Sí, recuérdame', no: 'Ahora no',
    notifTitle: 'NeuralBeat',
    bodies: ['Tu momento de respirar 🌬', 'Unos minutos de coherencia te esperan.', '¿Respiramos? Tu sesión diaria está lista.'],
  },
  en: {
    entry: '🔔 Daily reminder', title: 'Daily reminder',
    desc: 'We send you one notification a day for your breathing practice. You can turn it off anytime.',
    time: 'Time', enable: 'Turn on reminder', save: 'Save time', disable: 'Turn off', close: 'Close',
    on: (t) => `✓ On · every day at ${t}`,
    denied: 'Notifications are blocked for this site. Allow them in your browser settings and try again.',
    ios: 'On iPhone and iPad: first install the app (Share → “Add to Home Screen”) and open it from the icon.',
    unsupported: 'This browser doesn’t support notifications.',
    error: 'Couldn’t turn it on. Check your connection and try again.',
    offer: (t) => `Remind you tomorrow at ${t}?`, yes: 'Yes, remind me', no: 'Not now',
    notifTitle: 'NeuralBeat',
    bodies: ['Time to breathe 🌬', 'A few minutes of coherence are waiting for you.', 'Ready to breathe? Your daily session is set.'],
  },
  fr: {
    entry: '🔔 Rappel quotidien', title: 'Rappel quotidien',
    desc: 'Nous t’envoyons une notification par jour pour ta pratique de respiration. Tu peux la désactiver à tout moment.',
    time: 'Heure', enable: 'Activer le rappel', save: 'Enregistrer l’heure', disable: 'Désactiver', close: 'Fermer',
    on: (t) => `✓ Activé · tous les jours à ${t}`,
    denied: 'Les notifications sont bloquées pour ce site. Autorise-les dans les réglages du navigateur et réessaie.',
    ios: 'Sur iPhone et iPad : installe d’abord l’app (Partager → « Sur l’écran d’accueil ») et ouvre-la depuis l’icône.',
    unsupported: 'Ce navigateur ne prend pas en charge les notifications.',
    error: 'Impossible de l’activer. Vérifie ta connexion et réessaie.',
    offer: (t) => `Je te le rappelle demain à ${t} ?`, yes: 'Oui, rappelle-moi', no: 'Pas maintenant',
    notifTitle: 'NeuralBeat',
    bodies: ['C’est le moment de respirer 🌬', 'Quelques minutes de cohérence t’attendent.', 'On respire ? Ta séance du jour est prête.'],
  },
  pt: {
    entry: '🔔 Lembrete diário', title: 'Lembrete diário',
    desc: 'Enviamos uma notificação por dia para sua prática de respiração. Você pode desativar quando quiser.',
    time: 'Horário', enable: 'Ativar lembrete', save: 'Salvar horário', disable: 'Desativar', close: 'Fechar',
    on: (t) => `✓ Ativo · todos os dias às ${t}`,
    denied: 'As notificações estão bloqueadas para este site. Permita nas configurações do navegador e tente de novo.',
    ios: 'No iPhone e iPad: primeiro instale o app (Compartilhar → «Adicionar à Tela de Início») e abra pelo ícone.',
    unsupported: 'Este navegador não permite notificações.',
    error: 'Não foi possível ativar. Verifique sua conexão e tente de novo.',
    offer: (t) => `Te lembro amanhã às ${t}?`, yes: 'Sim, me lembre', no: 'Agora não',
    notifTitle: 'NeuralBeat',
    bodies: ['Hora de respirar 🌬', 'Alguns minutos de coerência esperam por você.', 'Vamos respirar? Sua sessão diária está pronta.'],
  },
  zh: {
    entry: '🔔 每日提醒', title: '每日提醒',
    desc: '我们每天发送一条通知，提醒你进行呼吸练习。你可以随时关闭。',
    time: '时间', enable: '开启提醒', save: '保存时间', disable: '关闭', close: '关闭',
    on: (t) => `✓ 已开启 · 每天 ${t}`,
    denied: '此网站的通知已被阻止。请在浏览器设置中允许通知后重试。',
    ios: '在 iPhone 和 iPad 上：请先安装应用（分享 →「添加到主屏幕」），然后从图标打开。',
    unsupported: '此浏览器不支持通知。',
    error: '无法开启，请检查网络后重试。',
    offer: (t) => `明天 ${t} 提醒你吗？`, yes: '好，提醒我', no: '以后再说',
    notifTitle: 'NeuralBeat',
    bodies: ['该呼吸一下了 🌬', '几分钟的心脏相干练习在等你。', '一起呼吸吧？今天的练习已准备好。'],
  },
  hi: {
    entry: '🔔 दैनिक अनुस्मारक', title: 'दैनिक अनुस्मारक',
    desc: 'हम आपके श्वास अभ्यास के लिए दिन में एक सूचना भेजेंगे। आप इसे कभी भी बंद कर सकते हैं।',
    time: 'समय', enable: 'अनुस्मारक चालू करें', save: 'समय सहेजें', disable: 'बंद करें', close: 'बंद करें',
    on: (t) => `✓ चालू · हर दिन ${t} बजे`,
    denied: 'इस साइट के लिए सूचनाएं अवरुद्ध हैं। ब्राउज़र सेटिंग्स में अनुमति दें और फिर से प्रयास करें।',
    ios: 'iPhone और iPad पर: पहले ऐप इंस्टॉल करें (शेयर → «होम स्क्रीन पर जोड़ें») और आइकन से खोलें।',
    unsupported: 'यह ब्राउज़र सूचनाओं का समर्थन नहीं करता।',
    error: 'चालू नहीं हो सका। अपना कनेक्शन जांचें और फिर से प्रयास करें।',
    offer: (t) => `क्या कल ${t} बजे याद दिलाऊं?`, yes: 'हाँ, याद दिलाएं', no: 'अभी नहीं',
    notifTitle: 'NeuralBeat',
    bodies: ['सांस लेने का समय 🌬', 'कुछ मिनट का सामंजस्य आपका इंतज़ार कर रहा है।', 'चलें सांस लें? आज का सत्र तैयार है।'],
  },
};

const lang = () => (TXT[document.documentElement.lang] ? document.documentElement.lang : 'es');
const T = () => TXT[lang()];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

let publicKey = null;     // null = servidor no configurado
let status = '';          // mensaje de estado en el modal

// ─── capacidades del dispositivo ────────────────────────────────────
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

function capability() {
  if (isIOS() && !isStandalone()) return 'ios';
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  return 'ok';
}

function b64uToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

const roundTime = (d = new Date()) => {
  const m = Math.ceil((d.getHours() * 60 + d.getMinutes()) / 15) * 15 % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

// ─── servidor ───────────────────────────────────────────────────────
async function loadKey() {
  try {
    const r = await fetch('./api/push/key', { cache: 'no-store' });
    if (!r.ok) return null;
    const j = await r.json();
    return j.publicKey || null;
  } catch (e) { return null; }
}

async function sendTextsToSW() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const t = T();
    reg.active && reg.active.postMessage({ type: 'reminder-texts', title: t.notifTitle, bodies: t.bodies, url: './?from=reminder' });
  } catch (e) {}
}

async function subscribeOnServer(sub, time) {
  const r = await fetch('./api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON ? sub.toJSON() : sub, time, tzOffset: new Date().getTimezoneOffset(), lang: lang() }),
  });
  if (!r.ok) throw new Error('subscribe ' + r.status);
}

// Debe llamarse desde un clic (el permiso exige gesto del usuario)
export async function enableReminder(time) {
  const cap = capability();
  if (cap !== 'ok') throw new Error(cap);
  if (!publicKey) throw new Error('not-configured');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('denied');
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToBytes(publicKey) });
  await subscribeOnServer(sub, time);
  await sendTextsToSW();
  ls.set(PREF_KEY, { enabled: true, time });
}

export async function disableReminder() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch('./api/push/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) }).catch(() => {});
      await sub.unsubscribe();
    }
  } catch (e) {}
  ls.set(PREF_KEY, { enabled: false, time: (ls.get(PREF_KEY, {}) || {}).time });
}

// Al abrir la app: re-sincroniza zona horaria (cambios de horario) e idioma
async function resync() {
  const pref = ls.get(PREF_KEY, null);
  if (!pref || !pref.enabled || capability() !== 'ok' || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) { ls.set(PREF_KEY, { enabled: false, time: pref.time }); return; }
    await subscribeOnServer(sub, pref.time);
    await sendTextsToSW();
  } catch (e) {}
}

// ─── modal ──────────────────────────────────────────────────────────
function errorText(e) {
  const t = T(), m = String(e && e.message || e);
  if (m === 'denied') return t.denied;
  if (m === 'ios') return t.ios;
  if (m === 'unsupported') return t.unsupported;
  return t.error;
}

function render() {
  const root = document.getElementById('reminderModal');
  if (!root) return;
  const t = T();
  const pref = ls.get(PREF_KEY, {}) || {};
  const cap = capability();
  const time = pref.time || roundTime();
  const blocked = cap !== 'ok' ? (cap === 'ios' ? t.ios : cap === 'denied' ? t.denied : t.unsupported) : '';

  root.innerHTML = `
    <div class="ob-card rem-card" role="dialog" aria-modal="true" aria-labelledby="remTitle">
      <div class="ob-top">
        <div class="ob-brand">NEURALBEAT</div>
        <button class="ob-close" id="remClose" aria-label="${esc(t.close)}">✕</button>
      </div>
      <h1 class="ob-title" id="remTitle">🔔 ${esc(t.title)}</h1>
      <p class="ob-sub">${esc(t.desc)}</p>
      ${blocked ? `<div class="ob-warn">${esc(blocked)}</div>` : `
        <label class="rem-time"><span class="ob-label">${esc(t.time)}</span>
          <input type="time" id="remTime" value="${esc(time)}" step="900">
        </label>
        ${pref.enabled ? `<div class="ob-stats">${esc(t.on(pref.time))}</div>` : ''}
        ${status ? `<div class="ob-warn">${esc(status)}</div>` : ''}
        <div class="ob-actions">
          <button class="ob-btn primary" id="remSave">${esc(pref.enabled ? t.save : t.enable)}</button>
          ${pref.enabled ? `<button class="ob-btn" id="remOff">${esc(t.disable)}</button>` : ''}
        </div>`}
    </div>`;

  document.getElementById('remClose').onclick = closeReminder;
  const save = document.getElementById('remSave');
  if (save) save.onclick = async () => {
    save.disabled = true;
    try { await enableReminder(document.getElementById('remTime').value || time); status = ''; }
    catch (e) { status = errorText(e); }
    render();
  };
  const off = document.getElementById('remOff');
  if (off) off.onclick = async () => { off.disabled = true; await disableReminder(); status = ''; render(); };
}

export function openReminder() {
  // Una sola ventana a la vez
  ['welcome', 'newsModal'].forEach(id => document.getElementById(id)?.classList.remove('open'));
  status = '';
  render();
  document.getElementById('reminderModal').classList.add('open');
  document.body.classList.add('ob-lock');
}

export function closeReminder() {
  document.getElementById('reminderModal')?.classList.remove('open');
  if (!document.querySelector('.ob-overlay.open')) document.body.classList.remove('ob-lock');
}

// ─── oferta al terminar una sesión ──────────────────────────────────
function offer() {
  const pref = ls.get(PREF_KEY, {}) || {};
  const o = ls.get(OFFER_KEY, { dismissed: 0, last: 0 });
  if (!publicKey || pref.enabled || capability() !== 'ok') return;
  if (o.dismissed >= 2 || Date.now() - (o.last || 0) < 3 * 864e5) return;   // máx. 2 rechazos, cada 3 días

  const t = T(), time = roundTime();
  const el = document.getElementById('reminderToast');
  el.innerHTML = `
    <div class="rem-toast-txt">🔔 ${esc(t.offer(time))}</div>
    <div class="rem-toast-actions">
      <button class="ob-btn primary" id="remYes">${esc(t.yes)}</button>
      <button class="ob-btn ghost" id="remNo">${esc(t.no)}</button>
    </div>`;
  el.classList.add('show');
  ls.set(OFFER_KEY, { ...o, last: Date.now() });
  document.getElementById('remYes').onclick = async () => {
    el.classList.remove('show');
    let err = '';
    try { await enableReminder(time); } catch (e) { err = errorText(e); }
    openReminder();
    if (err) { status = err; render(); }
  };
  document.getElementById('remNo').onclick = () => {
    el.classList.remove('show');
    ls.set(OFFER_KEY, { dismissed: (o.dismissed || 0) + 1, last: Date.now() });
  };
}

// ─── init ───────────────────────────────────────────────────────────
function renderEntryLabels() {
  document.querySelectorAll('.reminder-entry').forEach(b => { b.textContent = T().entry; });
}

export async function initReminders() {
  window.openReminder = openReminder;
  window.__reminderEntry = () => T().entry;
  renderEntryLabels();
  document.getElementById('reminderModal')?.addEventListener('click', (e) => { if (e.target.id === 'reminderModal') closeReminder(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeReminder(); });

  // Re-traducir al cambiar idioma
  const prev = window.setLang;
  window.setLang = (l) => {
    prev(l);
    renderEntryLabels();
    if (document.getElementById('reminderModal')?.classList.contains('open')) render();
    if ((ls.get(PREF_KEY, {}) || {}).enabled) sendTextsToSW();
  };

  publicKey = await loadKey();
  if (!publicKey) return;                       // servidor sin configurar → no se muestra nada
  document.documentElement.dataset.reminders = 'on';
  document.addEventListener('coherencia:session-end', () => setTimeout(offer, 1200));
  resync();
}
