// ════════════════════════════════════════════════════
// audio.js — Motor de audio · Coherencia v8
// Binaural puro + Tone solfeggio + Ruido rosa + Beeps
// ════════════════════════════════════════════════════

let AC = null;
let masterGain = null;
let leftOsc  = null;
let rightOsc = null;
let lGain    = null;
let rGain    = null;
let merger   = null;
let noiseNode = null;
let noiseGain = null;

// ─── INIT ────────────────────────────────────────────
export function initAC() {
  if (AC) return;
  // iOS 17+: tratar el audio como "reproducción" para que el interruptor
  // de silencio no apague los pitidos ni el binaural.
  try {
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
  } catch (e) {}
  AC = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = AC.createGain();
  masterGain.gain.value = 0.6;
  masterGain.connect(AC.destination);

  // Móvil: el sistema puede suspender/interrumpir el contexto (llamada,
  // bloqueo de pantalla, cambio de app). Al volver, lo reanudamos.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') resumeAC();
  });
}

export function getAC()         { return AC; }
export function getMasterGain() { return masterGain; }

export function setVolume(v) {
  if (!masterGain) return;
  // Rampa corta para evitar "clicks" al mover el slider
  masterGain.gain.setTargetAtTime(v, AC.currentTime, 0.02);
}

export function resumeAC() {
  if (AC && AC.state !== 'running' && AC.state !== 'closed') {
    return AC.resume().catch(() => {});
  }
  return Promise.resolve();
}

// ─── OSCILADOR BASE ──────────────────────────────────
function mkOsc(freq) {
  const o = AC.createOscillator();
  o.type = 'sine';
  o.frequency.value = freq;
  return o;
}

// ─── BINAURAL PURO ───────────────────────────────────
// Para presets: delta, theta, schumann, alpha*, beta, gamma*
// L = carrier Hz  |  R = carrier + beat Hz
export function startBinaural(carrier, beat) {
  if (!AC || !masterGain) return;
  merger   = AC.createChannelMerger(2);
  merger.connect(masterGain);
  leftOsc  = mkOsc(carrier);
  rightOsc = mkOsc(carrier + beat);
  lGain = AC.createGain();
  rGain = AC.createGain();
  // Fade-in suave para eliminar click de entrada
  lGain.gain.setValueAtTime(0, AC.currentTime);
  lGain.gain.linearRampToValueAtTime(0.35, AC.currentTime + 0.02);
  rGain.gain.setValueAtTime(0, AC.currentTime);
  rGain.gain.linearRampToValueAtTime(0.35, AC.currentTime + 0.02);
  leftOsc.connect(lGain);  lGain.connect(merger, 0, 0);
  rightOsc.connect(rGain); rGain.connect(merger, 0, 1);
  leftOsc.start();
  rightOsc.start();
}

// ─── TONE SOLFEGGIO + BINAURAL ───────────────────────
// Para presets healing: hz174, hz396, hz432, hz528, hz639, hz777, hz852
// El tono principal que escucha el usuario ES el solfeggio.
// L = tone Hz  |  R = tone + beat Hz
// FIX: en v7 los healing usaban data-beat=528 → enviaba 528 Hz al beat,
// no como portadora. Ahora tone es el carrier real.
export function startTone(tone, beat) {
  if (!AC || !masterGain) return;
  merger   = AC.createChannelMerger(2);
  merger.connect(masterGain);
  leftOsc  = mkOsc(tone);
  rightOsc = mkOsc(tone + beat);
  lGain = AC.createGain();
  rGain = AC.createGain();
  // Fade-in suave para eliminar click de entrada
  lGain.gain.setValueAtTime(0, AC.currentTime);
  lGain.gain.linearRampToValueAtTime(0.40, AC.currentTime + 0.02);
  rGain.gain.setValueAtTime(0, AC.currentTime);
  rGain.gain.linearRampToValueAtTime(0.40, AC.currentTime + 0.02);
  leftOsc.connect(lGain);  lGain.connect(merger, 0, 0);
  rightOsc.connect(rGain); rGain.connect(merger, 0, 1);
  leftOsc.start();
  rightOsc.start();
}

// ─── STOP BINAURAL/TONE ──────────────────────────────
export function stopBinaural() {
  // Fade-out suave para eliminar click de salida
  if (lGain && rGain && AC) {
    const now = AC.currentTime;
    lGain.gain.linearRampToValueAtTime(0, now + 0.02);
    rGain.gain.linearRampToValueAtTime(0, now + 0.02);
    try { leftOsc  && leftOsc.stop(now + 0.03);  } catch(e) {}
    try { rightOsc && rightOsc.stop(now + 0.03); } catch(e) {}
  } else {
    try { leftOsc  && leftOsc.stop();  } catch(e) {}
    try { rightOsc && rightOsc.stop(); } catch(e) {}
  }
  leftOsc = rightOsc = null;
  if (lGain)  { lGain.disconnect();  lGain  = null; }
  if (rGain)  { rGain.disconnect();  rGain  = null; }
  if (merger) { merger.disconnect(); merger = null; }
}

// ─── RETUNE EN VIVO ──────────────────────────────────
// Cambia las frecuencias de los osciladores existentes con una rampa
// suave, sin destruirlos. Antes cada movimiento del slider paraba y
// recreaba los osciladores → clicks y cortes audibles.
// Devuelve false si no hay osciladores activos.
export function retune(base, beat) {
  if (!AC || !leftOsc || !rightOsc) return false;
  const t = AC.currentTime;
  leftOsc.frequency.setTargetAtTime(base, t, 0.03);
  rightOsc.frequency.setTargetAtTime(base + beat, t, 0.03);
  return true;
}

// ─── RESTART (llamado al cambiar carrier/beat/tone) ──
// Decide automáticamente si usar startTone o startBinaural
// según si el preset activo tiene audio.tone definido.
export function restartAudio(S, activePreset) {
  stopBinaural();
  if (!S.playing || !S.binaural) return;
  if (activePreset && activePreset.audio && activePreset.audio.tone) {
    startTone(S.tone, S.beat);
  } else {
    startBinaural(S.carrier, S.beat);
  }
}

// ─── RUIDO ROSA ──────────────────────────────────────
// Algoritmo Voss-McCartney. Mejora percepción del binaural
// (NIH study: pink noise + binaural beat).
export function startNoise() {
  if (!AC || !masterGain) return;
  const sr = AC.sampleRate;
  const sz = sr * 3;
  const buf = AC.createBuffer(1, sz, sr);
  const d   = buf.getChannelData(0);
  let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
  for (let i = 0; i < sz; i++) {
    const w = Math.random() * 2 - 1;
    b0 = .99886*b0 + w*.0555179;
    b1 = .99332*b1 + w*.0750759;
    b2 = .96900*b2 + w*.153852;
    b3 = .86650*b3 + w*.3104856;
    b4 = .55000*b4 + w*.5329522;
    b5 = -.7616*b5 - w*.016898;
    d[i] = (b0+b1+b2+b3+b4+b5+b6+w*.5362) * .11;
    b6 = w * .115926;
  }
  const src  = AC.createBufferSource();
  src.buffer = buf;
  src.loop   = true;
  noiseGain  = AC.createGain();
  noiseGain.gain.value = 0.08; // Reducido de 0.18 → textura sutil sin competir con binaural
  src.connect(noiseGain);
  noiseGain.connect(masterGain);
  src.start();
  noiseNode = src;
}

export function stopNoise() {
  try { noiseNode && noiseNode.stop(); } catch(e) {}
  noiseNode = null;
  if (noiseGain) { noiseGain.disconnect(); noiseGain = null; }
}

// ─── SEÑALES PROGRAMADAS EN EL RELOJ DEL AUDIO ───────
// Todas las señales aceptan `when` (segundos en AC.currentTime) y devuelven
// los nodos creados, para poder cancelarlas con cancelNodes() si la sesión
// se pausa o cambia el plan. El motor de respiración (app.js) las programa
// por adelantado: suenan a tiempo aunque el hilo principal esté ocupado o la
// pestaña esté en segundo plano (los timers del navegador se ralentizan,
// el reloj del audio no).
//
// Tonos por fase:
//   inhale:    520 Hz — brillante, señal de subida
//   exhale:    360 Hz — grave, señal de soltar
//   holdFull:  440 Hz — neutro, pulmón lleno (dorado)
//   holdEmpty: 280 Hz — muy grave, vacío (púrpura)
//
// El volumen general lo aplica masterGain (no se multiplica aquí otra vez).
// Un parcial a la octava evita que el pitido quede enmascarado por los tonos
// solfeggio (440 Hz de beep vs 432 Hz de portadora).
const BEEP_GAIN = 1.6;
const BEEP_DUR  = 0.22;

export function now() { return AC ? AC.currentTime : 0; }

export function cancelNodes(nodes) {
  if (!nodes) return;
  nodes.forEach(n => { try { n.stop(); } catch (e) {} });
}

// Envolvente + osciladores. partials: [[freqStart, amp, freqEnd?], ...]
function voice(when, dur, peak, partials, attack = 0.012, curve = 'exp') {
  if (!AC || !masterGain) return [];
  const t0 = Math.max(when, AC.currentTime + 0.005);
  const g = AC.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + attack);
  if (curve === 'exp') g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  else { g.gain.setValueAtTime(peak, t0 + dur * 0.6); g.gain.linearRampToValueAtTime(0.0001, t0 + dur); }
  g.connect(masterGain);
  const nodes = [];
  partials.forEach(([f0, amp, f1]) => {
    const o = AC.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f0, t0);
    if (f1) o.frequency.linearRampToValueAtTime(f1, t0 + dur * 0.9);
    let out = o;
    if (amp !== 1) { const pg = AC.createGain(); pg.gain.value = amp; o.connect(pg); out = pg; }
    out.connect(g);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
    nodes.push(o);
  });
  nodes[0].onended = () => { try { g.disconnect(); } catch (e) {} };
  return nodes;
}

export function beepAt(freq, vol, when) {
  const peak = Math.min(0.9, Math.max(0.0002, vol * BEEP_GAIN));
  return voice(when, BEEP_DUR, peak, [[freq, 1], [freq * 2, 0.3]]);
}

// Pitido inmediato (reanuda el contexto si el móvil lo suspendió).
// `currentVol` se mantiene por compatibilidad: masterGain ya aplica el volumen.
export function beep(freq, vol = 0.25, currentVol) { // eslint-disable-line no-unused-vars
  if (!AC || !masterGain) return;
  if (AC.state === 'running') beepAt(freq, vol, AC.currentTime + 0.015);
  else resumeAC().then(() => { if (AC.state === 'running') beepAt(freq, vol, AC.currentTime + 0.015); });
}

// ═══════════════════════════════════════════════════════════════════
// WIM HOF AUDIO FEEDBACK
// ═══════════════════════════════════════════════════════════════════

// Tono largo que guía el inhale de recuperación: sweep 600→520 Hz en 2 s
export function whRecoveryToneAt(when) {
  return voice(when, 2.0, 0.3, [[600, 1, 520], [1200, 0.25, 1040]], 0.05, 'lin');
}

// Tick suave de orientación temporal durante la retención
// type: 'soft' (cada 10 s), 'warning' (60 s), 'invite' (80 s)
const TICKS = {
  soft:    { freq: 210, vol: 0.16, dur: 0.12 },
  warning: { freq: 330, vol: 0.22, dur: 0.16 },
  invite:  { freq: 420, vol: 0.26, dur: 0.24 },
};
export function whRetentionTickAt(type, when) {
  const c = TICKS[type] || TICKS.soft;
  return voice(when, c.dur, c.vol * BEEP_GAIN, [[c.freq, 1], [c.freq * 2, 0.35]], 0.008);
}

// Señal de "suelta / exhala" al final del recovery hold: 440→360 Hz
export function whReleaseBeepAt(when) {
  return voice(when, 0.32, 0.4, [[440, 1, 360], [880, 0.3, 720]], 0.01);
}

// Compatibilidad: versiones inmediatas
export function whRecoveryTone()            { return whRecoveryToneAt(now() + 0.015); }
export function whRetentionTick(type='soft'){ return whRetentionTickAt(type, now() + 0.015); }
export function whReleaseBeep()             { return whReleaseBeepAt(now() + 0.015); }
