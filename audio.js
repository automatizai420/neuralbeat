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
  lGain = AC.createGain(); lGain.gain.value = 0.35;
  rGain = AC.createGain(); rGain.gain.value = 0.35;
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
  lGain = AC.createGain(); lGain.gain.value = 0.40;
  rGain = AC.createGain(); rGain.gain.value = 0.40;
  leftOsc.connect(lGain);  lGain.connect(merger, 0, 0);
  rightOsc.connect(rGain); rGain.connect(merger, 0, 1);
  leftOsc.start();
  rightOsc.start();
}

// ─── STOP BINAURAL/TONE ──────────────────────────────
export function stopBinaural() {
  try { leftOsc  && leftOsc.stop();  } catch(e) {}
  try { rightOsc && rightOsc.stop(); } catch(e) {}
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
  noiseGain.gain.value = 0.18;
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

// ─── BEEP DE GUÍA RESPIRATORIA ───────────────────────
// Cada fase tiene un tono diferente:
//   inhale:    520 Hz — brillante, señal de subida
//   exhale:    360 Hz — grave, señal de soltar
//   holdFull:  440 Hz — neutro, pulmón lleno (dorado)
//   holdEmpty: 280 Hz — muy grave, vacío (púrpura)
//
// Correcciones:
//  · El volumen ya se aplica en masterGain; antes se multiplicaba otra vez
//    por el volumen (vol²) y a volumen medio el pitido quedaba casi inaudible.
//  · Se programa unos ms en el futuro con ataque corto: programar en
//    AC.currentTime exacto hace que en móvil a veces se pierda el inicio.
//  · Si el contexto está suspendido (móvil), se reanuda antes de sonar.
//  · Un parcial a la octava lo hace distinguible del tono solfeggio
//    (p. ej. 440 Hz de beep vs 432 Hz de portadora quedaban enmascarados).
const BEEP_GAIN = 1.6;   // compensa la quita del doble volumen
const BEEP_DUR  = 0.22;  // s

function playBeep(freq, peak, dur) {
  const t0 = AC.currentTime + 0.015;
  const g  = AC.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  g.connect(masterGain);

  const partials = [[freq, 1.0], [freq * 2, 0.3]];
  partials.forEach(([f, amp], i) => {
    const o = AC.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    let out = o;
    if (amp !== 1) {
      const pg = AC.createGain();
      pg.gain.value = amp;
      o.connect(pg);
      out = pg;
    }
    out.connect(g);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
    if (i === 0) o.onended = () => { try { g.disconnect(); } catch (e) {} };
  });
}

// `currentVol` se mantiene por compatibilidad pero ya no se usa:
// masterGain aplica el volumen general.
export function beep(freq, vol = 0.25, currentVol) { // eslint-disable-line no-unused-vars
  if (!AC || !masterGain) return;
  const peak = Math.min(0.9, Math.max(0.0002, vol * BEEP_GAIN));
  if (AC.state === 'running') {
    playBeep(freq, peak, BEEP_DUR);
  } else {
    resumeAC().then(() => { if (AC.state === 'running') playBeep(freq, peak, BEEP_DUR); });
  }
}


// ═══════════════════════════════════════════════════════════════════
// WIM HOF AUDIO FEEDBACK
// ═══════════════════════════════════════════════════════════════════

// ─── Wim Hof: tono largo que guía el inhale de recuperación
// Sweep 600→520 Hz en 2s — señal clara de "inhala profundo ahora"
export function whRecoveryTone() {
  if (!AC || !masterGain) return;
  const o = AC.createOscillator();
  const g = AC.createGain();
  
  o.frequency.setValueAtTime(600, AC.currentTime);
  o.frequency.linearRampToValueAtTime(520, AC.currentTime + 1.8);
  g.gain.setValueAtTime(0.22, AC.currentTime);
  g.gain.linearRampToValueAtTime(0.12, AC.currentTime + 1.8);
  g.gain.linearRampToValueAtTime(0.001, AC.currentTime + 2.0);
  
  o.type = 'sine';
  o.connect(g);
  g.connect(masterGain);
  o.start();
  o.stop(AC.currentTime + 2.0);
}

// ─── Wim Hof: tick suave de orientación temporal durante holdEmpty
// type: 'soft' (cada 10s), 'warning' (60s), 'invite' (80s)
// Propósito: orientación temporal sin romper la quietud
export function whRetentionTick(type = 'soft') {
  if (!AC || !masterGain) return;
  
  const configs = {
    soft:    { freq: 210, vol: 0.10, dur: 0.08 },  // apenas perceptible
    warning: { freq: 330, vol: 0.15, dur: 0.12 },  // nota de atención
    invite:  { freq: 420, vol: 0.18, dur: 0.20 }   // invitación a inhalar
  };
  
  const c = configs[type];
  const o = AC.createOscillator();
  const g = AC.createGain();
  
  g.gain.setValueAtTime(c.vol, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + c.dur);
  o.frequency.value = c.freq;
  o.type = 'sine';
  
  o.connect(g);
  g.connect(masterGain);
  o.start();
  o.stop(AC.currentTime + c.dur + 0.02);
}

// ─── Wim Hof: tono de liberación al final del holdFull 15s
// Señal de "exhala ahora" — sweep descendente 440→360 Hz
export function whReleaseBeep() {
  if (!AC || !masterGain) return;
  const o = AC.createOscillator();
  const g = AC.createGain();
  
  o.frequency.setValueAtTime(440, AC.currentTime);
  o.frequency.linearRampToValueAtTime(360, AC.currentTime + 0.25);
  g.gain.setValueAtTime(0.28, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + 0.30);
  
  o.type = 'sine';
  o.connect(g);
  g.connect(masterGain);
  o.start();
  o.stop(AC.currentTime + 0.32);
}
