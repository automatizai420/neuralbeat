// ════════════════════════════════════════════════════
// intent.js — «¿Qué quieres hacer hoy?»
// Convierte una frase libre en una sesión: preset base + ajustes.
//   "quiero respirar 6 segundos inhalando y exhalando con sonidos
//    de concentración máxima para el trabajo, 20 minutos"
//   → base gamma40, inhala 6 s, exhala 6 s, sin retenciones, 20 min
//
// Funciona 100 % en el navegador (sin servidor ni API): reglas por
// palabras clave en español, inglés, portugués y francés. Es puro
// (no toca el DOM) para poder probarlo con node.
// ════════════════════════════════════════════════════

// Objetivos: palabras clave (sin tildes, en minúscula) → preset base.
// El orden importa solo para desempatar.
export const GOALS = {
  sleep:      { preset: 'delta',   emoji: '😴', kw: ['dormir', 'sueno', 'insomnio', 'acostar', 'noche', 'sleep', 'insomnia', 'bedtime', 'sono', 'sommeil', 'dormi'] },
  anxiety:    { preset: '478',     emoji: '🫁', kw: ['panico', 'ataque', 'crisis', 'angustia', 'panic', 'panique', 'urgente', 'ya mismo'] },
  calm:       { preset: 'alpha10', emoji: '😌', kw: ['ansiedad', 'ansios', 'estres', 'calma', 'calmar', 'relaj', 'tranquil', 'nervio', 'anxiety', 'anxious', 'stress', 'calm', 'relax', 'ansiedade', 'estresse', 'anxiete', 'detente', 'coherencia', 'coherence'] },
  meditate:   { preset: 'theta',   emoji: '🧘', kw: ['medit', 'mindful', 'introspec', 'conciencia', 'awareness', 'contemplat'] },
  focus:      { preset: 'beta',    emoji: '🎯', kw: ['concentr', 'foco', 'enfoc', 'focus', 'trabaj', 'estudi', 'productiv', 'work', 'study', 'travail', 'etudi', 'estudar', 'trabalh', 'atencion', 'attention', 'examen', 'exam', 'leer', 'read', 'programar', 'coding'] },
  creativity: { preset: 'alpha8',  emoji: '💡', kw: ['creativ', 'criativ', 'creatif', 'inspira', 'ideas', 'idea', 'flow', 'fluir', 'escribir', 'write', 'disen', 'design', 'arte', 'art', 'musica'] },
  energy:     { preset: 'gamma40', emoji: '⚡', kw: ['energia', 'energy', 'energie', 'activar', 'activa', 'despert', 'wake', 'manana', 'morning', 'cansad', 'tired', 'vitalidad', 'animo'] },
  pain:       { preset: 'hz174',   emoji: '🩹', kw: ['dolor', 'pain', 'dor', 'douleur', 'migran', 'cabeza', 'headache'] },
  heal:       { preset: 'hz528',   emoji: '💚', kw: ['sanar', 'sanacion', 'healing', 'heal', 'cura', 'amor', 'love', 'corazon', 'heart', 'gratitud', 'gratitude'] },
  balance:    { preset: 'nadi',    emoji: '☯️', kw: ['equilibr', 'balance', 'nadi', 'hemisfer', 'alterna'] },
};

// Técnicas nombradas explícitamente (ganan sobre los objetivos)
const TECHNIQUES = [
  { preset: 'wimhof', re: /wim\s*hof/ },
  { preset: '478',    re: /\b4\s*[-–\/ ]\s*7\s*[-–\/ ]\s*8\b/ },
  { preset: 'box',    re: /\bbox\b|cuadrad|caja|carre|quadrad|\b4\s*[-–]\s*4\s*[-–]\s*4\s*[-–]\s*4\b/ },
  { preset: 'nadi',   re: /nadi|shodhana|fosas? alterna/ },
  { preset: 'dispenza', re: /dispenza|maha\s*bandha/ },
  { preset: 'schumann', re: /schumann|7[.,]83/ },
];

const SOLFEGGIO = { 174: 'hz174', 396: 'hz396', 432: 'hz432', 528: 'hz528', 639: 'hz639', 777: 'hz777', 852: 'hz852' };

// Palabras de fase
// \\b evita que «respiración» cuente como «espiración»
const W_IN   = '\\b(?:inhal\\w*|inspir\\w*|inhale\\w*|inala\\w*|breathe in|aspir\\w*)';
const W_OUT  = '\\b(?:exhal\\w*|espir\\w*|expir\\w*|exhale\\w*|exala\\w*|breathe out|solt\\w*|bota\\w*)';
const W_HOLD = '\\b(?:reten\\w*|ret[ie]n\\w*|aguant\\w*|mant[ei]n\\w*|hold\\w*|segur\\w*|bloque\\w*|pausa\\w*|apnea\\w*)';
const NUM    = '(\\d+(?:[.,]\\d+)?)';
const UNIT   = '\\s*(?:s|seg|segs|segundos?|sec|secs|seconds?|secondes?|"|\'\')?';

export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const toNum = (s) => parseFloat(String(s).replace(',', '.'));

// Busca "N s de <fase>", "<fase> N s", "<fase> de N s", "<fase> por N s"
function phaseSeconds(t, word) {
  const before = new RegExp(`${NUM}${UNIT}\\s*(?:de |of |para |pour |a )?(?:la |el |the |l')?${word}`);
  const after  = new RegExp(`${word}\\s*(?:\\w+\\s){0,3}?(?:de |por |durante |for |pendant |during |en |a |por )?${NUM}${UNIT}`);
  // Primero "<fase> N" (inspira 5 expira 7), luego "N s de <fase>"
  const m = t.match(after) || t.match(before);
  return m ? toNum(m[1]) : null;
}

/**
 * parseIntent(text) → {
 *   preset, goal, matched: bool,
 *   inhale, exhale, holdFull, holdEmpty, bpm,   (segundos / resp-min, o null)
 *   beat, minutes, noise, binaural, beep,       (null = no especificado)
 * }
 */
export function parseIntent(text) {
  const t = normalize(text);
  const r = {
    text: String(text || '').trim(), preset: null, goal: null, matched: false, intense: false,
    inhale: null, exhale: null, holdFull: null, holdEmpty: null, bpm: null,
    beat: null, minutes: null, noise: null, binaural: null, beep: null,
  };
  if (!t) return r;

  // 1) Técnica explícita
  for (const tech of TECHNIQUES) {
    if (tech.re.test(t)) { r.preset = tech.preset; r.matched = true; break; }
  }

  // 2) Objetivo por palabras clave (el de más coincidencias)
  let best = null, bestScore = 0;
  for (const [goal, g] of Object.entries(GOALS)) {
    const score = g.kw.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
    if (score > bestScore) { best = goal; bestScore = score; }
  }
  if (best) {
    r.goal = best;
    r.matched = true;
    if (!r.preset) r.preset = GOALS[best].preset;
  }

  // Intensidad: "máxima", "profunda", "intensa" → foco pasa a gamma 40 Hz
  r.intense = /maxim|intens|profund|deep|extrem|alto rendimiento|high perform|full|total/.test(t);
  if (r.goal === 'focus' && r.intense && r.preset === 'beta') r.preset = 'gamma40';

  // 3) Frecuencias explícitas: solfeggio (≥100 Hz) o beat (≤50 Hz)
  for (const m of t.matchAll(/(\d+(?:[.,]\d+)?)\s*hz/g)) {
    const hz = toNum(m[1]);
    if (SOLFEGGIO[Math.round(hz)]) { r.preset = SOLFEGGIO[Math.round(hz)]; r.matched = true; }
    else if (hz >= 0.5 && hz <= 50) { r.beat = hz; r.matched = true; }
  }

  // 4) Respiración
  r.inhale    = phaseSeconds(t, W_IN);
  r.exhale    = phaseSeconds(t, W_OUT);
  r.holdFull  = phaseSeconds(t, W_HOLD);

  // "6 segundos de inhalación y exhalación" / "inhala y exhala 5 s":
  // si se nombran ambas fases y solo una tiene número, se comparte.
  const saysIn  = new RegExp(W_IN).test(t);
  const saysOut = new RegExp(W_OUT).test(t);
  if (saysIn && saysOut) {
    if (r.inhale != null && r.exhale == null) r.exhale = r.inhale;
    if (r.exhale != null && r.inhale == null) r.inhale = r.exhale;
  }

  // Patrón "4-6" / "4:6" / "5 y 5" junto a respir… → inhala-exhala
  if (r.inhale == null && r.exhale == null) {
    const pair = t.match(/(\d+(?:[.,]\d+)?)\s*(?:[-–:\/]|y|and|e|et)\s*(\d+(?:[.,]\d+)?)\s*(?:s|seg|segundos?|sec|seconds?)?\b/);
    const nearBreath = /respir|breath|resp\b|ciclo|cycle/.test(t);
    if (pair && nearBreath && !/\bhz\b/.test(pair[0]) && !/min/.test(t.slice(pair.index, pair.index + pair[0].length + 4))) {
      r.inhale = toNum(pair[1]);
      r.exhale = toNum(pair[2]);
    }
  }

  // "respiración de 6 segundos" sin nombrar fases → inhala = exhala = 6
  if (r.inhale == null && r.exhale == null) {
    const m = t.match(new RegExp(`(?:respir\\w*|breath\\w*|ciclos?|cycles?)\\D{0,25}?${NUM}\\s*(?:s|seg|segundos?|sec|seconds?|secondes?)\\b`))
           || t.match(new RegExp(`${NUM}\\s*(?:s|seg|segundos?|sec|seconds?|secondes?)\\b`));
    if (m && (saysIn || saysOut || /respir|breath/.test(t))) {
      r.inhale = r.exhale = toNum(m[1]);
    }
  }

  // Ritmo explícito: "6 respiraciones por minuto", "6 rpm", "6 breaths per minute"
  const bpm = t.match(/(\d+(?:[.,]\d+)?)\s*(?:rpm|resp\w*\s*(?:por|\/|al|a|per)\s*min\w*|breath\w*\s*(?:per|\/|a)\s*min\w*)/);
  if (bpm) r.bpm = toNum(bpm[1]);

  // Validar rangos razonables
  const clamp = (v, lo, hi) => (v == null || isNaN(v) ? null : Math.min(hi, Math.max(lo, v)));
  r.inhale = clamp(r.inhale, 1, 20);
  r.exhale = clamp(r.exhale, 1, 30);
  r.holdFull = clamp(r.holdFull, 0, 60);
  r.bpm = clamp(r.bpm, 2, 30);
  if (r.inhale != null || r.exhale != null || r.bpm != null) r.matched = true;

  // Solo tiempos, sin objetivo → coherencia cardíaca como base
  if (!r.preset && (r.inhale != null || r.exhale != null || r.bpm != null)) r.preset = 'alpha10';

  // 5) Duración: "20 minutos", "media hora", "1 hora"
  const mins = t.match(/(\d+)\s*(?:min|minutos?|minutes?|mn)\b/);
  if (mins && !bpm) r.minutes = parseInt(mins[1], 10);
  else if (mins && bpm && mins.index !== bpm.index) r.minutes = parseInt(mins[1], 10);
  if (/media hora|half an hour|meia hora|demi-heure/.test(t)) r.minutes = 30;
  const hours = t.match(/(\d+)\s*(?:h|horas?|hours?|heures?)\b/);
  if (hours) r.minutes = parseInt(hours[1], 10) * 60;
  if (r.minutes != null) { r.minutes = Math.min(180, Math.max(1, r.minutes)); r.matched = true; }

  // 6) Sonido
  if (/sin ruido|no noise|without noise|sem ruido|sans bruit/.test(t)) r.noise = false;
  else if (/ruido|noise|bruit|lluvia|rain|ambiente|fondo|background/.test(t)) r.noise = true;
  if (/sin (sonido|binaural|tono|frecuencia|musica)|solo (la )?respiracion|no (sound|binaural)|without (sound|binaural)|silencio|silence|sem som/.test(t)) r.binaural = false;
  if (/sin (pitido|beep|guia sonora|sonido de guia)|no beeps?|without beeps?|sem bip|sans bip/.test(t)) r.beep = false;

  return r;
}

// Convierte el resultado en parámetros concretos para el motor, dado el
// preset base (objeto de presets.js). No toca el DOM.
export function resolveSession(intent, preset) {
  const b = preset.breathing;
  const out = {
    presetId: preset.id,
    pattern: b.pattern,
    bpm: b.bpm, ratio: b.ratio || 1,
    holdFull: b.holdFull || 0, holdEmpty: b.holdEmpty || 0,
    customTiming: false,
    beat: intent.beat != null ? intent.beat : preset.audio.beat,
    minutes: intent.minutes,
  };
  if (b.pattern === 'wimhof') return out;   // Wim Hof tiene su propio protocolo

  // Resp/min = ciclo completo (retenciones incluidas, ver breath.js).
  // Con retención se usa el patrón «box» (su secuencia incluye las
  // retenciones; con customTiming los tiempos salen de los sliders).
  const hasIn = intent.inhale != null, hasOut = intent.exhale != null;
  if (hasIn || hasOut) {
    const inh = hasIn ? intent.inhale : intent.exhale;
    const exh = hasOut ? intent.exhale : intent.inhale;
    const hf = intent.holdFull || 0;
    out.holdFull = hf;
    out.holdEmpty = 0;
    out.pattern = hf > 0 ? 'box' : 'coherencia';
    out.bpm = 60 / (inh + exh + hf);
    out.ratio = inh / exh;
    out.customTiming = true;
  } else if (intent.bpm != null) {
    out.bpm = intent.bpm;
    out.customTiming = true;
    // Ritmo explícito: sin las retenciones fijas de box / 4-7-8
    if (['box', '478'].includes(out.pattern)) { out.pattern = 'coherencia'; out.holdFull = 0; out.holdEmpty = 0; }
  } else if (intent.holdFull != null) {
    // "retén 5 s" sin tiempos: se agrega la retención al patrón del preset
    out.holdFull = intent.holdFull;
    if (!['box', '478'].includes(out.pattern)) { out.pattern = 'box'; out.holdEmpty = 0; out.customTiming = true; }
  }

  out.bpm = Math.round(Math.min(40, Math.max(2, out.bpm)) * 100) / 100;
  out.ratio = Math.round(Math.min(3, Math.max(0.1, out.ratio)) * 100) / 100;
  return out;
}
