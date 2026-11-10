// ════════════════════════════════════════════════════
// app.js — Núcleo de la aplicación · Coherencia v8
// STATE + applyPreset + UI + Wim Hof SM + i18n
// ════════════════════════════════════════════════════

import { PRESETS } from './presets.js';
import { initAC, startBinaural, startTone, stopBinaural, startNoise, stopNoise, beepAt, cancelNodes, setVolume, getAC, resumeAC, retune, whRecoveryToneAt, whRetentionTickAt, whReleaseBeepAt } from './audio.js';
import { BREATH_PRESETS, WH_DEFAULT, getPhaseDuration, getPhaseSequence } from './breath.js';
import { I18N } from './i18n.js';
import { renderBib } from './bib.js';
import { initViz, setViz, resizeCanvas, initAnalyser, animateViz } from './viz.js';

// ─── STATE ──────────────────────────────────────────────────────────
export const S = {
  playing:       false,
  bpm:           6,
  ratio:         1.0,
  holdFull:      0,
  holdEmpty:     0,
  carrier:       250,
  beat:          10,
  tone:          null,      // NUEVO: null = no healing tone activo
  vol:           0.6,
  binaural:      true,
  beep:          true,
  noise:         false,
  phase:         'idle',
  cycles:        0,
  sessionSec:    0,
  breathPreset:  'coherencia',
  customTiming:  false,     // true cuando el usuario mueve BPM/ratio
  activePreset:  null,      // NUEVO: referencia al objeto PRESETS[i] activo
  wh:            { ...WH_DEFAULT },
};

let LANG = 'es';

// ─── i18n ───────────────────────────────────────────────────────────
export function t(key, fallback) {
  return (I18N[LANG] && I18N[LANG][key]) || I18N.es[key] || fallback || key;
}

export function setLang(lang) {
  if (!I18N[lang]) return;
  LANG = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));
  applyLang();
  renderBib(lang);
  try { localStorage.setItem('coherencia_lang', lang); } catch (e) {}
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    // Guardar el texto original del HTML como respaldo: si falta una
    // traducción, se muestra ese texto en vez de la clave cruda.
    if (el.dataset.i18nDefault === undefined) el.dataset.i18nDefault = el.textContent;
    el.textContent = t(el.dataset.i18n, el.dataset.i18nDefault);
  });
  updatePhaseInfo();
}

// ─── APPLY PRESET (v3) ──────────────────────────────────────────────
/**
 * applyPreset(id) — lee desde PRESETS[] por id.
 * Ya no lee data-* del DOM.
 */
export function applyPreset(id) {
  const preset = PRESETS.find(p => p.id === id);
  if (!preset) return;

  // Abrir wizard si es la primera vez (antes de aplicar el preset)
  openWizard(id, false);  // false = no forzar si ya fue visto

  // Marcar activo en DOM
  document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
  const card = document.querySelector(`.preset-card[data-preset-id="${id}"]`);
  if (card) card.classList.add('active');

  S.activePreset = preset;

  // Audio params
  S.beat    = preset.audio.beat;
  S.carrier = preset.audio.carrier;
  S.tone    = preset.audio.tone || null;  // null si no es healing

  // Breath params
  S.customTiming = false;   // vuelve a los tiempos fijos de la técnica (box, 478)
  S.bpm     = preset.breathing.bpm || S.bpm;
  S.ratio   = preset.breathing.ratio || 1.0;
  S.breathPreset = preset.breathing.pattern;

  // Hold times
  const bp = BREATH_PRESETS[S.breathPreset];
  if (bp?.fixedDurations) {
    S.holdFull  = (bp.fixedDurations.holdFull  || 0) / 1000;
    S.holdEmpty = (bp.fixedDurations.holdEmpty || 0) / 1000;
  } else {
    S.holdFull  = preset.breathing.holdFull  || 0;
    S.holdEmpty = preset.breathing.holdEmpty || 0;
  }

  // Wim Hof: cargar config específica del preset
  if (preset.breathing.pattern === 'wimhof' && preset.breathing.wimhof) {
    const wh = preset.breathing.wimhof;
    S.wh = {
      ...WH_DEFAULT,
      totalRounds:      wh.rounds         || 4,
      totalReps:        wh.breathCount    || 30,
      holdEmptyTarget:  [...(wh.holdEmptyTarget || [30,45,60,60])],
      holdEmptyMax:     wh.holdEmptyMax   || 120,
      recoveryHold:     wh.recoveryHold   || 15,
    };
  }

  syncSliders();
  updateReadout();

  saveSettings();
  updatePhaseInfo();

  // Móvil: cerrar el sheet para que el ▶ quede visible
  if (isMobileLayout() && mobTab === 'presets') closeMobSheet();

  // Si está playing, DETENER para que el usuario pueda reiniciar con el nuevo preset
  if (S.playing) {
    togglePlay(); // Detiene todo correctamente
  }

  // Mostrar/ocultar UI Wim Hof
  const whRow = document.getElementById('whRow');
  if (whRow) {
    whRow.classList.toggle('visible', S.breathPreset === 'wimhof' && S.playing);
  }
}

// ─── SYNC SLIDERS ───────────────────────────────────────────────────
function syncSliders() {
  const sBpm = document.getElementById('sBpm');
  const sRatio = document.getElementById('sRatio');
  const sHoldFull = document.getElementById('sHoldFull');
  const sHoldEmpty = document.getElementById('sHoldEmpty');
  const sCarrier = document.getElementById('sCarrier');
  const sBeat = document.getElementById('sBeat');
  const sVol = document.getElementById('sVol');

  if (sBpm) sBpm.value = S.bpm;
  if (sRatio) sRatio.value = S.ratio;
  if (sHoldFull) sHoldFull.value = S.holdFull;
  if (sHoldEmpty) sHoldEmpty.value = S.holdEmpty;
  if (sCarrier) sCarrier.value = S.carrier;
  if (sBeat) sBeat.value = S.beat;
  if (sVol) sVol.value = S.vol * 100;

  ['sBpm', 'sRatio', 'sHoldFull', 'sHoldEmpty', 'sCarrier', 'sBeat', 'sVol'].forEach(updateSliderFill);
  updateSliderDisplays();
}

function updateSliderDisplays() {
  const vBpm = document.getElementById('vBpm');
  const vRatio = document.getElementById('vRatio');
  const vHoldFull = document.getElementById('vHoldFull');
  const vHoldEmpty = document.getElementById('vHoldEmpty');
  const vCarrier = document.getElementById('vCarrier');
  const vBeat = document.getElementById('vBeat');
  const vVol = document.getElementById('vVol');

  if (vBpm) vBpm.textContent = S.bpm.toFixed(1);
  if (vRatio) vRatio.textContent = `1:${(1/S.ratio).toFixed(1)}`;
  if (vHoldFull) vHoldFull.textContent = `${S.holdFull}s`;
  if (vHoldEmpty) vHoldEmpty.textContent = `${S.holdEmpty}s`;
  if (vCarrier) vCarrier.textContent = `${S.carrier} Hz`;
  if (vBeat) vBeat.textContent = `${S.beat.toFixed(1)} Hz`;
  if (vVol) vVol.textContent = `${Math.round(S.vol * 100)}%`;
}

// ─── UPDATE READOUT ─────────────────────────────────────────────────
export function updateReadout() {
  const dL = document.getElementById('dL');
  const dR = document.getElementById('dR');
  const dB = document.getElementById('dB');
  const dC = document.getElementById('dC');
  const sBpmStat = document.getElementById('sBpmStat');

  if (S.tone) {
    // Healing: muestra el tono solfeggio
    if (dL) dL.textContent = S.tone;
    if (dR) dR.textContent = (S.tone + S.beat).toFixed(1);
    if (dB) dB.textContent = S.beat.toFixed(1);
    if (dC) dC.textContent = S.tone;
  } else {
    // Binaural estándar
    if (dL) dL.textContent = S.carrier;
    if (dR) dR.textContent = (S.carrier + S.beat).toFixed(1);
    if (dB) dB.textContent = S.beat.toFixed(1);
    if (dC) dC.textContent = S.carrier;
  }

  if (sBpmStat) sBpmStat.textContent = S.bpm.toFixed(1);
}

// ─── TOGGLE PLAY ────────────────────────────────────────────────────
export function togglePlay() {
  if (!S.playing) {
    initAC();
    resumeAC();
    setVolume(S.vol);   // volumen guardado (initAC parte en 0.6)
    initAnalyser();
    S.playing = true;
    requestWakeLock();

    // Resetear contadores de sesión ANTES de iniciar respiración
    S.cycles = 0;
    S.sessionSec = 0;
    setText('sCycles', '0');
    setText('sTime', '0:00');

    if (S.binaural) {
      if (S.tone) startTone(S.tone, S.beat);
      else        startBinaural(S.carrier, S.beat);
    }
    if (S.noise) startNoise();

    // Iniciar motor de respiración (reloj del audio)
    if (S.breathPreset === 'wimhof') {
      S.wh.active = true;
      S.wh.round = 0;
      S.wh.repCount = 0;
      S.wh.mode = 'reps';
      updateWhDots();
      startTimeline(wimHofGen());
    } else {
      startTimeline(genericGen());
    }
    startBreathLoop();

    // Contador de tiempo de sesión
    if (sessionIV) clearInterval(sessionIV);
    sessionIV = setInterval(() => {
      S.sessionSec++;
      const m = Math.floor(S.sessionSec / 60);
      const s = S.sessionSec % 60;
      setText('sTime', `${m}:${s.toString().padStart(2, '0')}`);
    }, 1000);

    animateViz();

    const playBtn = document.getElementById('playBtn');
    playBtn.classList.add('on');
    playBtn.textContent = '⏸';
    playBtn.setAttribute('aria-label', 'Pausa');
    document.getElementById('statusDot').classList.add('live');
    setText('statusTxt', t('statusActive'));
    document.getElementById('whRow')?.classList.toggle('visible', S.breathPreset === 'wimhof');
  } else {
    S.playing = false;
    releaseWakeLock();
    stopBinaural();
    stopNoise();
    stopBreathing();

    if (sessionIV) {
      clearInterval(sessionIV);
      sessionIV = null;
    }

    const playBtn = document.getElementById('playBtn');
    playBtn.classList.remove('on');
    playBtn.textContent = '▶';
    playBtn.setAttribute('aria-label', 'Iniciar');
    document.getElementById('statusDot').classList.remove('live');
    setText('statusTxt', t('statusInactive'));
    document.getElementById('whRow')?.classList.remove('visible');
    updatePhaseInfo();
  }
}

function setText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

// ════════════════════════════════════════════════════════════════════
// MOTOR DE RESPIRACIÓN — programado en el reloj del audio
// ════════════════════════════════════════════════════════════════════
// Antes cada fase se encadenaba con setTimeout y el pitido sonaba cuando
// el timer disparaba. Los timers del navegador se atrasan (pestaña en
// segundo plano, móvil, hilo ocupado) y el error se acumula.
//
// Ahora un "generador" produce pasos {phase, dur, cues, enter} y un
// planificador los coloca en la línea de tiempo de AC.currentTime con
// LOOKAHEAD segundos de anticipación. Los pitidos (cues) se programan en
// el motor de audio para el instante exacto. La parte visual (enter) se
// ejecuta cuando AC.currentTime alcanza el inicio del paso.
// Si el sistema suspende el audio, el reloj se congela y todo se pausa
// en conjunto: al reanudar sigue sincronizado.
const LOOKAHEAD = 2.5;   // s de audio programado por adelantado
const PUMP_MS   = 150;   // frecuencia del planificador (también corre en rAF)

let TL = null;           // { gen, queue, nextStart, cur, done }
let pumpIV = null;
let rafId = null;
let sessionIV = null;
let phaseStart = 0;      // performance.now() del inicio de la fase actual
let phaseDur = 0;        // ms (0 = retención abierta: se muestra el tiempo transcurrido)

// Exponer para viz.js
if (typeof window !== 'undefined') {
  window.phaseStart = 0;
  window.phaseDur = 0;
}

function startTimeline(gen) {
  stopTimeline();
  TL = { gen, queue: [], nextStart: audioNow() + 0.15, cur: null, done: false };
  pump();
  pumpIV = setInterval(pump, PUMP_MS);
}

function stopTimeline() {
  if (pumpIV) { clearInterval(pumpIV); pumpIV = null; }
  if (TL) TL.queue.forEach(unscheduleStep);
  TL = null;
}

function scheduleStep(step) {
  unscheduleStep(step);
  if (!S.beep || !step.cues) return;
  const t = audioNow();
  step.cues.forEach(c => {
    const at = step.start + (c.at || 0);
    if (at < t - 0.01 || at > step.end + 0.001) return;   // ya pasó / fuera del paso
    step.nodes.push(...c.play(at));
  });
}

function unscheduleStep(step) {
  cancelNodes(step.nodes);
  step.nodes = [];
}

function pump() {
  if (!TL || !S.playing) return;
  const t = audioNow();

  // 1) Planificar pasos hasta t + LOOKAHEAD
  while (!TL.done && TL.nextStart !== Infinity && TL.nextStart < t + LOOKAHEAD) {
    const step = TL.gen.next();
    if (!step) { TL.done = true; break; }
    step.start = TL.nextStart;
    step.end = step.dur === Infinity ? Infinity : step.start + step.dur;
    step.nodes = [];
    scheduleStep(step);
    TL.queue.push(step);
    TL.nextStart = step.end;
  }

  // 2) Avanzar al paso que está sonando
  while (TL.queue.length > 1 && TL.queue[1].start <= t) TL.queue.shift();
  const cur = TL.queue[0];
  if (cur && cur.start <= t && cur !== TL.cur) {
    TL.cur = cur;
    enterStep(cur, t);
  }
}

function enterStep(step, t) {
  S.phase = step.phase;
  phaseDur = step.open || step.dur === Infinity ? 0 : step.dur * 1000;
  phaseStart = performance.now() - Math.max(0, t - step.start) * 1000;
  window.phaseStart = phaseStart;
  window.phaseDur = phaseDur;
  step.enter && step.enter();
}

// Reprogramar pasos futuros (cambio de BPM, ratio o retenciones en vivo)
function replan() {
  if (!TL) return;
  const t = audioNow();
  const future = TL.queue.filter(s => s.start > t + 0.02);
  if (!future.length) return;
  future.forEach(unscheduleStep);
  TL.queue = TL.queue.filter(s => !future.includes(s));
  TL.gen.rewind(future[0]);
  TL.nextStart = future[0].start;
  TL.done = false;
  pump();
}

// Terminar el paso actual ahora (botón "Inhalar ahora" de Wim Hof)
function endCurrentStepNow() {
  if (!TL || !TL.cur) return;
  const t = audioNow();
  const cur = TL.cur;
  const future = TL.queue.filter(s => s !== cur);
  future.forEach(unscheduleStep);
  unscheduleStep(cur);
  if (future.length) TL.gen.rewind(future[0]);
  cur.end = t;
  TL.queue = [cur];
  TL.nextStart = t + 0.05;
  TL.done = false;
  pump();
}

// Pitido on/off en vivo
function rescheduleCues() {
  if (TL) TL.queue.forEach(scheduleStep);
}

function audioNow() {
  return getAC() ? getAC().currentTime : 0;
}

function bumpCycle() {
  S.cycles++;
  setText('sCycles', S.cycles);
}

// ─── Generador: técnicas genéricas (coherencia, box, 478, nadi…) ────
const PHASE_BEEP = {
  inhale:    [520, 0.28],
  holdFull:  [440, 0.20],
  exhale:    [360, 0.20],
  holdEmpty: [280, 0.18],
};

function genericGen() {
  return {
    st: { i: 0, first: true },
    next() {
      const seq = getPhaseSequence(S);
      if (!seq.length) return null;
      const cursor = { ...this.st };
      const i = this.st.i % seq.length;
      const phase = seq[i];
      const wrap = i === 0 && !this.st.first;
      this.st = { i: (i + 1) % seq.length, first: false };
      const [f, v] = PHASE_BEEP[phase];
      return {
        cursor, phase,
        dur: getPhaseDuration(phase, S) / 1000,
        cues: [{ at: 0, play: (t) => beepAt(f, v, t) }],
        enter: () => {
          if (wrap) bumpCycle();
          showPhase(phase);
          updatePhaseInfo();
        },
      };
    },
    rewind(step) { this.st = { ...step.cursor }; },
  };
}

function showPhase(phase) {
  const orb = document.getElementById('orb');
  const bar = document.getElementById('bBar');
  const lbl = document.getElementById('orbLbl');
  if (!orb || !bar || !lbl) return;

  orb.classList.remove('hold-full', 'hold-empty', 'idle');
  orb.style.transition = `transform ${phaseDur}ms ease-in-out, box-shadow ${phaseDur}ms ease-in-out, border-color ${phaseDur}ms ease-in-out`;

  switch (phase) {
    case 'inhale':
      orb.style.transform = 'scale(1.42)';
      orb.style.boxShadow = '0 0 40px rgba(80,180,200,.3)';
      orb.style.borderColor = 'rgba(80,180,200,.7)';
      bar.style.background = 'var(--cyan)';
      lbl.textContent = t('phaseInhale');
      lbl.style.color = 'var(--cyan)';
      break;
    case 'holdFull':
      orb.classList.add('hold-full');
      orb.style.transform = 'scale(1.42)';
      lbl.textContent = t('phaseHoldFull');
      lbl.style.color = 'var(--gold)';
      bar.style.background = 'var(--gold)';
      break;
    case 'exhale':
      orb.style.transform = 'scale(1.0)';
      orb.style.boxShadow = '0 0 12px rgba(68,136,204,.15)';
      orb.style.borderColor = 'rgba(68,136,204,.25)';
      bar.style.background = 'var(--blue)';
      lbl.textContent = t('phaseExhale');
      lbl.style.color = 'var(--cyan)';
      break;
    case 'holdEmpty':
      orb.classList.add('hold-empty');
      orb.style.transform = 'scale(1.0)';
      lbl.textContent = t('phaseHoldEmpty');
      lbl.style.color = 'var(--purple)';
      bar.style.background = 'var(--purple)';
      break;
  }
}

// ─── Texto bajo el orbe: programa · técnica · ciclo ─────────────────
export function updatePhaseInfo() {
  const phaseTxt = document.getElementById('phaseTxt');
  const phaseCycle = document.getElementById('phaseCycle');
  if (!phaseTxt || !S.activePreset) return;
  // Wim Hof gestiona su propio texto mientras corre
  if (S.playing && S.breathPreset === 'wimhof') return;

  const card = document.querySelector(`.preset-card[data-preset-id="${S.activePreset.id}"] .pc-benefit`);
  const name = card ? card.textContent.trim() : S.activePreset.id;
  const tech = (BREATH_PRESETS[S.breathPreset] || {}).name || '';
  phaseTxt.textContent = tech && tech !== name ? `${name} · ${tech}` : name;
  if (phaseCycle) phaseCycle.textContent = S.playing ? `${t('cycleLbl')} ${S.cycles + 1}` : '';
}

function stopBreathing() {
  stopTimeline();
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  const whContinueBtn = document.getElementById('whContinueBtn');
  if (whContinueBtn) {
    whContinueBtn.style.display = 'none';
    whContinueBtn.classList.remove('visible');
  }

  S.phase = 'idle';
  S.wh.active = false;
  setText('phaseCycle', '');

  const orb = document.getElementById('orb');
  if (orb) {
    orb.classList.remove('hold-full', 'hold-empty');
    orb.classList.add('idle');
    orb.style.transition = 'transform .6s ease, box-shadow .6s ease, border-color .6s ease';
    orb.style.transform = 'scale(1.0)';
    orb.style.boxShadow = '0 0 12px rgba(68,136,204,.15)';
    orb.style.borderColor = 'rgba(68,136,204,.25)';
  }
  const lbl = document.getElementById('orbLbl');
  if (lbl) { lbl.textContent = t('orbReady'); lbl.style.color = ''; }
  setText('orbSec', '–');
  const bar = document.getElementById('bBar');
  if (bar) bar.style.width = '0%';
}

// Loop de animación: planificador + contador + barra
function startBreathLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  const barEl = document.getElementById('bBar');
  const orbSec = document.getElementById('orbSec');
  function loop() {
    if (!S.playing) return;
    pump();

    const elapsed = performance.now() - phaseStart;
    if (S.phase === 'idle' && !phaseDur) {
      // sin fase activa (p. ej. Wim Hof completado)
    } else if (phaseDur > 0) {
      const prog = Math.min(elapsed / phaseDur, 1);
      if (barEl) {
        barEl.style.transition = 'none';
        // inhale/holdFull llenan hacia adelante; exhale/holdEmpty drenan
        barEl.style.width = (S.phase === 'inhale' || S.phase === 'holdFull' ? prog : 1 - prog) * 100 + '%';
      }
      if (orbSec) orbSec.textContent = Math.max(0, (phaseDur - elapsed) / 1000).toFixed(1);
    } else {
      // Retención abierta: tiempo transcurrido
      if (orbSec) orbSec.textContent = Math.floor(elapsed / 1000) + 's';
      if (barEl) barEl.style.width = '50%';
    }
    rafId = requestAnimationFrame(loop);
  }
  loop();
}

// ─── Generador: Wim Hof ─────────────────────────────────────────────
// Ronda: N respiraciones rápidas → retención en vacío abierta (▶ para
// terminar, máximo holdEmptyMax) → inhala de recuperación → retención
// llena recoveryHold s → suelta → cuenta regresiva → siguiente ronda.
const WH_TICKS = [
  [10, 'soft'], [20, 'soft'], [30, 'soft'], [40, 'soft'], [50, 'soft'],
  [60, 'warning'], [70, 'soft'], [80, 'invite'],
];

function wimHofGen() {
  const wh = S.wh;
  return {
    st: { stage: 'rep-in', round: 0, rep: 0 },
    next() {
      const cursor = { ...this.st };
      const { stage, round, rep } = this.st;
      const roundTxt = `${t('whRound')} ${round + 1} / ${wh.totalRounds}`;

      switch (stage) {
        case 'rep-in': {
          const roundStart = rep === 0 && round > 0;
          this.st = { ...this.st, stage: 'rep-out' };
          return {
            cursor, phase: 'inhale', dur: 1.4,
            cues: [{ at: 0, play: (t0) => roundStart ? beepAt(600, 0.28, t0) : beepAt(520, 0.15, t0) }],
            enter: () => {
              wh.mode = 'reps'; wh.round = round; wh.repCount = rep;
              setText('phaseTxt', roundTxt);
              setText('phaseCycle', `${rep + 1}/${wh.totalReps}`);
              updateOrbSimple(t('phaseInhale'), 'scale(1.35)', '0 0 30px rgba(80,180,200,.4)', 'var(--cyan)');
            },
          };
        }
        case 'rep-out': {
          const last = rep === wh.totalReps - 1;
          this.st = { ...this.st, rep: rep + 1, stage: last ? 'retention' : 'rep-in' };
          return {
            cursor, phase: 'exhale', dur: last ? 1.4 : 0.8,
            cues: [{ at: 0, play: (t0) => beepAt(360, last ? 0.22 : 0.12, t0) }],
            enter: () => updateOrbSimple(t('phaseExhale'), 'scale(1.0)', '0 0 12px rgba(68,136,204,.2)', 'var(--cyan)'),
          };
        }
        case 'retention': {
          const max = wh.holdEmptyMax;
          this.st = { ...this.st, stage: 'recover' };
          return {
            cursor, phase: 'holdEmpty', dur: max, open: true, kind: 'retention',
            cues: [
              { at: 0, play: (t0) => beepAt(280, 0.25, t0) },
              ...WH_TICKS.filter(([s]) => s < max).map(([s, type]) => ({ at: s, play: (t0) => whRetentionTickAt(type, t0) })),
            ],
            enter: () => {
              wh.mode = 'retention';
              document.getElementById('orb')?.classList.add('hold-empty');
              updateOrbSimple(t('phaseHoldFull'), 'scale(0.9)', '0 0 20px rgba(155,125,232,.5)', 'var(--purple)');
              setText('phaseTxt', t('whRetentionHint'));
              setText('phaseCycle', roundTxt);
              showWhContinue(true);
            },
          };
        }
        case 'recover':
          this.st = { ...this.st, stage: 'hold' };
          return {
            cursor, phase: 'inhale', dur: 2.0,
            cues: [{ at: 0, play: (t0) => whRecoveryToneAt(t0) }],
            enter: () => {
              wh.mode = 'recovery';
              showWhContinue(false);
              document.getElementById('orb')?.classList.remove('hold-empty');
              updateOrbSimple(t('phaseRecover'), 'scale(1.5)', '0 0 40px rgba(80,180,200,.6)', 'var(--cyan)');
              setText('phaseTxt', t('whRecoveryTxt'));
            },
          };
        case 'hold': {
          const dur = wh.recoveryHold;
          this.st = { ...this.st, stage: 'release' };
          return {
            cursor, phase: 'holdFull', dur,
            cues: [
              { at: 0, play: (t0) => beepAt(440, 0.25, t0) },
              ...[5, 10].filter(s => s < dur).map(s => ({ at: s, play: (t0) => whRetentionTickAt('soft', t0) })),
            ],
            enter: () => {
              document.getElementById('orb')?.classList.add('hold-full');
              updateOrbSimple(t('phaseHoldFull'), 'scale(1.5)', '0 0 35px rgba(212,168,75,.6)', 'var(--gold)');
            },
          };
        }
        case 'release': {
          const lastRound = round + 1 >= wh.totalRounds;
          this.st = { stage: lastRound ? 'done' : 'transition', round: round + 1, rep: 0 };
          return {
            cursor, phase: 'exhale', dur: 3.0,
            cues: [{ at: 0, play: (t0) => whReleaseBeepAt(t0) }],
            enter: () => {
              document.getElementById('orb')?.classList.remove('hold-full', 'hold-empty');
              updateOrbSimple(t('phaseExhale'), 'scale(1.0)', '0 0 12px rgba(68,136,204,.2)', 'var(--cyan)');
              setText('phaseTxt', roundTxt);
              bumpCycle();
              wh.round = round + 1;
              updateWhDots();
            },
          };
        }
        case 'transition':
          this.st = { ...this.st, stage: 'rep-in' };
          return {
            cursor, phase: 'idle', dur: 5.0,
            // Pitidos ascendentes en los últimos 3 s: 560, 520, 480 Hz
            cues: [[2, 560], [3, 520], [4, 480]].map(([s, f]) => ({ at: s, play: (t0) => beepAt(f, 0.2, t0) })),
            enter: () => {
              updateOrbSimple('', 'scale(1.0)', '0 0 15px rgba(80,180,200,.25)', 'rgba(80,180,200,.4)');
              setText('phaseTxt', `${t('whPreparing')} ${round + 1}…`);
              setText('phaseCycle', '');
            },
          };
        case 'done':
          this.st = { ...this.st, stage: 'end' };
          return {
            cursor, phase: 'idle', dur: Infinity, open: true,
            enter: () => {
              wh.active = false;
              updateOrbSimple('✓', 'scale(1.0)', '0 0 20px rgba(78,203,138,.35)', 'var(--green)');
              setText('phaseTxt', t('whDone'));
              setText('phaseCycle', '');
              setText('orbSec', '');
            },
          };
        default:
          return null;
      }
    },
    rewind(step) { this.st = { ...step.cursor }; },
  };
}

function showWhContinue(show) {
  const btn = document.getElementById('whContinueBtn');
  if (!btn) return;
  btn.style.display = show ? 'flex' : 'none';
  btn.classList.toggle('visible', show);
}

// Botón "Inhalar ahora" durante la retención en vacío
export function whContinue() {
  if (S.playing && TL && TL.cur && TL.cur.kind === 'retention') {
    endCurrentStepNow();
  }
}

function updateWhDots() {
  const wh = S.wh;
  setText('whLbl', `${Math.min(wh.round + 1, wh.totalRounds)} / ${wh.totalRounds}`);
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`whD${i}`);
    if (dot) {
      dot.classList.remove('done', 'current');
      if (i < wh.round) dot.classList.add('done');
      if (i === wh.round) dot.classList.add('current');
    }
  }
}

function updateOrbSimple(label, transform, shadow, color) {
  const orb = document.getElementById('orb');
  const lbl = document.getElementById('orbLbl');
  if (orb) {
    orb.classList.remove('idle');
    orb.style.transition = 'transform 0.8s ease-in-out, box-shadow 0.8s ease-in-out, border-color 0.8s ease-in-out';
    orb.style.transform = transform;
    orb.style.boxShadow = shadow;
    orb.style.borderColor = color;
  }
  if (lbl) {
    lbl.textContent = label;
    lbl.style.color = color;
  }
}

// ─── SLIDER HANDLERS ────────────────────────────────────────────────
export function onSliderChange(id, value) {
  switch (id) {
    case 'sBpm':
      S.bpm = parseFloat(value);
      S.customTiming = true;
      break;
    case 'sRatio':
      S.ratio = parseFloat(value);
      S.customTiming = true;
      break;
    case 'sHoldFull':
      S.holdFull = parseInt(value);
      break;
    case 'sHoldEmpty':
      S.holdEmpty = parseInt(value);
      break;
    case 'sCarrier':
      S.carrier = parseInt(value);
      // En presets solfeggio la portadora real es S.tone: mover este
      // slider pasa a modo binaural libre con la nueva portadora.
      if (S.tone) S.tone = null;
      if (S.playing && S.binaural && !retune(S.carrier, S.beat)) {
        startBinaural(S.carrier, S.beat);
      }
      break;
    case 'sBeat':
      S.beat = parseFloat(value);
      if (S.playing && S.binaural && !retune(S.tone || S.carrier, S.beat)) {
        if (S.tone) startTone(S.tone, S.beat);
        else        startBinaural(S.carrier, S.beat);
      }
      break;
    case 'sVol':
      S.vol = parseInt(value) / 100;
      setVolume(S.vol);
      saveSettings();
      break;
  }
  // Cambios de respiración: reprogramar las fases futuras ya planificadas
  if (['sBpm', 'sRatio', 'sHoldFull', 'sHoldEmpty'].includes(id) && S.playing && S.breathPreset !== 'wimhof') {
    replan();
  }
  updateSliderDisplays();
  updateReadout();
  updateSliderFill(id);
}

// ─── TOGGLE HANDLERS ────────────────────────────────────────────────
export function tog(id) {
  switch (id) {
    case 'binaural':
      S.binaural = !S.binaural;
      if (S.playing) {
        if (S.binaural) {
          if (S.tone) startTone(S.tone, S.beat);
          else        startBinaural(S.carrier, S.beat);
        } else {
          stopBinaural();
        }
      }
      break;
    case 'beep':
      S.beep = !S.beep;
      rescheduleCues();
      break;
    case 'noise':
      S.noise = !S.noise;
      if (S.playing) {
        if (S.noise) startNoise();
        else         stopNoise();
      }
      break;
  }
  
  syncToggle(id);
  saveSettings();
}

function syncToggle(id) {
  const track = document.getElementById(`t${id.charAt(0).toUpperCase() + id.slice(1)}`);
  if (track) {
    track.classList.toggle('on', S[id]);
    const row = track.closest('.tog-row');
    if (row) row.setAttribute('aria-checked', S[id] ? 'true' : 'false');
  }
}

// Relleno del track del slider (la parte recorrida en color)
function updateSliderFill(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const min = parseFloat(el.min) || 0, max = parseFloat(el.max) || 100;
  const pct = ((parseFloat(el.value) - min) / (max - min)) * 100;
  el.style.setProperty('--fill', `${Math.max(0, Math.min(100, pct))}%`);
}

// ─── AJUSTES PERSISTENTES ───────────────────────────────────────────
// Volumen, pitido, binaural, ruido, último preset y visualización.
const SETTINGS_KEY = 'coherencia_settings';

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
  catch (e) { return {}; }
}

export function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      vol: S.vol,
      beep: S.beep,
      binaural: S.binaural,
      noise: S.noise,
      preset: S.activePreset ? S.activePreset.id : null,
      viz: currentVizName,
    }));
  } catch (e) {}
}

let currentVizName = 'lissajous';
export function setVizAndSave(name) {
  currentVizName = name;
  setViz(name);
  saveSettings();
}

// ─── LEFT TAB SWITCHER ──────────────────────────────────────────────
export function switchLeftTab(tab) {
  const presetsPanel = document.getElementById('presetsPanel');
  const ctrlPanel = document.getElementById('ctrlPanel');
  const tabPrograms = document.getElementById('tabPrograms');
  const tabControls = document.getElementById('tabControls');

  if (tab === 'programs') {
    if (presetsPanel) presetsPanel.style.display = 'block';
    if (ctrlPanel) ctrlPanel.style.display = 'none';
    if (tabPrograms) tabPrograms.classList.add('active');
    if (tabControls) tabControls.classList.remove('active');
  } else {
    if (presetsPanel) presetsPanel.style.display = 'none';
    if (ctrlPanel) ctrlPanel.style.display = 'flex';
    if (tabPrograms) tabPrograms.classList.remove('active');
    if (tabControls) tabControls.classList.add('active');
  }
}

// ─── INIT ───────────────────────────────────────────────────────────
export function init() {
  // Cargar idioma guardado
  const savedLang = localStorage.getItem('coherencia_lang') || 'es';
  setLang(savedLang);

  // Inicializar visualizaciones
  initViz();

  // Restaurar ajustes guardados (volumen, toggles, último preset, viz)
  const saved = loadSettings();
  if (typeof saved.vol === 'number') S.vol = Math.max(0, Math.min(1, saved.vol));
  ['beep', 'binaural', 'noise'].forEach(k => {
    if (typeof saved[k] === 'boolean') S[k] = saved[k];
    syncToggle(k);
  });
  const startPreset = saved.preset && PRESETS.some(p => p.id === saved.preset) ? saved.preset : 'alpha10';
  applyPreset(startPreset);
  if (saved.viz) {
    currentVizName = saved.viz;
    setViz(saved.viz);
  }

  // Attach slider listeners
  const sliders = ['sBpm', 'sRatio', 'sHoldFull', 'sHoldEmpty', 'sCarrier', 'sBeat', 'sVol'];
  sliders.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => onSliderChange(id, e.target.value));
    }
  });

  // Accesibilidad: elementos clicables que son <div> → foco y teclado
  const roles = [
    ['.preset-card', 'button'], ['.tog-row', 'switch'], ['.left-tab', 'tab'],
    ['.mob-tab', 'tab'], ['.bib-tab', 'tab'], ['.mob-sheet-handle', 'button'],
  ];
  roles.forEach(([sel, role]) => document.querySelectorAll(sel).forEach(el => {
    el.setAttribute('role', role);
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
  }));
  document.addEventListener('keydown', (e) => {
    const el = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && el.matches && el.matches(roles.map(r => r[0]).join(','))) {
      e.preventDefault();
      el.click();
    }
    if (e.key === 'Escape') {
      closeWizard();
      closeBib();
      closeMobSheet();
    }
  });
  document.querySelector('.mob-sheet-handle')?.setAttribute('aria-label', 'Cerrar');

  // Layout móvil/escritorio
  if (MOBILE_MQ) {
    if (MOBILE_MQ.addEventListener) MOBILE_MQ.addEventListener('change', onLayoutChange);
    else if (MOBILE_MQ.addListener) MOBILE_MQ.addListener(onLayoutChange);
  }

  // Al volver a la app: reanudar audio y re-pedir wake lock
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && S.playing) {
      resumeAC();
      requestWakeLock();
    }
  });

  // Resize handler
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
  });

}

// Re-exportar funciones de viz para uso global
export { setViz };

// ════════════════════════════════════════════════════════════════════════════
// WIZARD OVERLAY — Sistema educativo de 4 pasos generado desde presets.js
// ════════════════════════════════════════════════════════════════════════════

let currentWizard = null;
let currentWizardStep = 0;
const WIZARD_STORAGE_KEY = 'coherencia_wizards_seen';

// Obtener wizards ya vistos
function getSeenWizards() {
  try {
    const seen = localStorage.getItem(WIZARD_STORAGE_KEY);
    return seen ? JSON.parse(seen) : {};
  } catch (e) {
    return {};
  }
}

// Marcar wizard como visto
function markWizardAsSeen(presetId) {
  try {
    const seen = getSeenWizards();
    seen[presetId] = true;
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(seen));
  } catch (e) {
    console.warn('No se pudo guardar preferencia de wizard:', e);
  }
}

// Verificar si un wizard ya fue visto
function hasSeenWizard(presetId) {
  const seen = getSeenWizards();
  return seen[presetId] === true;
}

// Resetear todos los wizards (para el botón de "ver wizards")
export function resetAllWizards() {
  try {
    localStorage.removeItem(WIZARD_STORAGE_KEY);
    alert('Todos los wizards se mostrarán nuevamente al seleccionar presets.');
  } catch (e) {
    console.warn('No se pudo resetear wizards:', e);
  }
}

export function openWizard(presetId, forceOpen = false) {
  // Si no es forzado y ya fue visto, no abrir
  if (!forceOpen && hasSeenWizard(presetId)) {
    return;
  }

  // Importar la función generadora desde presets.js
  import('./presets.js').then(module => {
    const lang = getCurrentLang();
    currentWizard = module.generateWizard(presetId, lang);
    
    if (!currentWizard) {
      console.error('Wizard not found for preset:', presetId);
      return;
    }

    currentWizardStep = 0;
    renderWizard();
    
    const overlay = document.getElementById('wizardOverlay');
    if (overlay) overlay.classList.add('open');
  });
}

export function closeWizard() {
  // Verificar si el checkbox está marcado
  const checkbox = document.getElementById('wizDontShowCheckbox');
  if (checkbox && checkbox.checked && currentWizard) {
    markWizardAsSeen(currentWizard.id);
  }

  const overlay = document.getElementById('wizardOverlay');
  if (overlay) overlay.classList.remove('open');
  currentWizard = null;
  currentWizardStep = 0;
}

function renderWizard() {
  if (!currentWizard) return;

  const step = currentWizard.steps[currentWizardStep];
  
  // Actualizar color del dot
  const dot = document.getElementById('wizDot');
  if (dot) dot.style.background = currentWizard.color;

  // Actualizar título
  const title = document.getElementById('wizTitle2');
  if (title) title.textContent = currentWizard.band;

  // Actualizar indicadores de paso
  const stepsContainer = document.getElementById('wizSteps');
  if (stepsContainer) {
    stepsContainer.innerHTML = '';
    currentWizard.steps.forEach((s, i) => {
      const dotEl = document.createElement('div');
      dotEl.className = 'wiz-step-dot';
      if (i === currentWizardStep) dotEl.classList.add('active');
      if (i < currentWizardStep) dotEl.classList.add('done');
      dotEl.onclick = () => wizardGoToStep(i);
      stepsContainer.appendChild(dotEl);
    });
  }

  // Actualizar contenido del paso
  const stepContainer = document.getElementById('wizStepContent');
  if (stepContainer) {
    stepContainer.innerHTML = `
      <div class="wiz-step-label">${step.label}</div>
      <div class="wiz-step-title">${step.title}</div>
      <div class="wiz-step-body">${step.body}</div>
    `;
  }

  // Actualizar botones de navegación
  const prevBtn = document.getElementById('wizPrev');
  const nextBtn = document.getElementById('wizNext');
  const applyBtn = document.getElementById('wizApply');
  const navContainer = document.getElementById('wizNav');

  if (prevBtn) {
    prevBtn.style.display = currentWizardStep === 0 ? 'none' : 'inline-block';
  }

  const isLastStep = currentWizardStep === currentWizard.steps.length - 1;

  if (nextBtn) {
    nextBtn.style.display = isLastStep ? 'none' : 'inline-block';
  }

  if (applyBtn) {
    applyBtn.style.display = isLastStep ? 'inline-block' : 'none';
  }

  // Añadir checkbox "No mostrar más" en el último paso
  let checkboxContainer = document.getElementById('wizDontShowAgain');
  if (isLastStep) {
    if (!checkboxContainer && navContainer) {
      checkboxContainer = document.createElement('div');
      checkboxContainer.id = 'wizDontShowAgain';
      checkboxContainer.className = 'wiz-dont-show';
      checkboxContainer.innerHTML = `
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-family:var(--mono);font-size:8px;color:var(--muted);">
          <input type="checkbox" id="wizDontShowCheckbox" style="cursor:pointer;">
          <span data-i18n="wizDontShow">No mostrar este wizard nuevamente</span>
        </label>
      `;
      navContainer.insertBefore(checkboxContainer, navContainer.firstChild);
    }
  } else {
    if (checkboxContainer) {
      checkboxContainer.remove();
    }
  }
}

function wizardGoToStep(stepIndex) {
  if (!currentWizard) return;
  if (stepIndex < 0 || stepIndex >= currentWizard.steps.length) return;
  currentWizardStep = stepIndex;
  renderWizard();
}

// Exportar para uso en window
export function wizStep(direction) {
  wizardGoToStep(currentWizardStep + direction);
}

export function wizardApply() {
  if (!currentWizard) return;
  
  // Verificar si el checkbox está marcado
  const checkbox = document.getElementById('wizDontShowCheckbox');
  if (checkbox && checkbox.checked) {
    markWizardAsSeen(currentWizard.id);
  }
  
  // Aplicar el preset
  import('./presets.js').then(module => {
    const preset = module.PRESETS.find(p => p.id === currentWizard.id);
    if (preset) {
      // Aquí se aplicaría el preset (esta función debe existir en tu código)
      if (window.applyPreset) {
        window.applyPreset(currentWizard.id);
      }
    }
  });
  
  closeWizard();
}

function getCurrentLang() {
  // Obtener el idioma actual de la UI
  const activeLangBtn = document.querySelector('.lang-btn.active');
  if (activeLangBtn) {
    return activeLangBtn.dataset.lang || 'es';
  }
  return 'es'; // default
}

// ════════════════════════════════════════════════════════════════════════════
// BIBLIOGRAPHY & OTHER OVERLAYS
// ════════════════════════════════════════════════════════════════════════════

export function openBib() {
  if (!document.querySelector('#bibBody .bib-section')) renderBib(LANG);
  const overlay = document.getElementById('bibOverlay');
  if (overlay) overlay.classList.add('open');
}

export function closeBib() {
  const overlay = document.getElementById('bibOverlay');
  if (overlay) overlay.classList.remove('open');
}

// ─── MOBILE BOTTOM SHEET ────────────────────────────────────────────
// Antes el sheet se abría vacío: en móvil no había forma de elegir
// presets ni mover controles. Ahora movemos (no clonamos, para conservar
// ids y listeners) los paneles de la columna izquierda dentro del sheet.
const MOBILE_MQ = typeof window !== 'undefined' ? window.matchMedia('(max-width:700px)') : null;
let mobTab = 'presets';

function movePanelsTo(container) {
  const presets = document.getElementById('presetsPanel');
  const ctrl = document.getElementById('ctrlPanel');
  if (!container || !presets || !ctrl) return;
  if (presets.parentElement !== container) container.appendChild(presets);
  if (ctrl.parentElement !== container) container.appendChild(ctrl);
}

export function openMobSheet(tab = 'presets') {
  const sheet = document.getElementById('mobSheet');
  if (!sheet) return;
  movePanelsTo(document.getElementById('mobSheetBody'));
  mobSwitchTab(tab);
  sheet.classList.add('open');
}

export function closeMobSheet() {
  const sheet = document.getElementById('mobSheet');
  if (sheet) sheet.classList.remove('open');
}

export function toggleMobSheet(tab = 'presets') {
  const sheet = document.getElementById('mobSheet');
  if (sheet && sheet.classList.contains('open')) closeMobSheet();
  else openMobSheet(tab);
}

export function mobSwitchTab(tab) {
  mobTab = tab === 'controls' ? 'controls' : 'presets';
  const presets = document.getElementById('presetsPanel');
  const ctrl = document.getElementById('ctrlPanel');
  if (presets) presets.style.display = mobTab === 'presets' ? 'block' : 'none';
  if (ctrl) ctrl.style.display = mobTab === 'controls' ? 'flex' : 'none';
  document.getElementById('mobTabPresets')?.classList.toggle('active', mobTab === 'presets');
  document.getElementById('mobTabControls')?.classList.toggle('active', mobTab === 'controls');
  const body = document.getElementById('mobSheetBody');
  if (body) body.scrollTop = 0;
}

// Al pasar a escritorio, devolver los paneles a la columna izquierda
function onLayoutChange() {
  if (MOBILE_MQ && !MOBILE_MQ.matches) {
    closeMobSheet();
    movePanelsTo(document.getElementById('leftBody'));
    const programsActive = document.getElementById('tabPrograms')?.classList.contains('active');
    switchLeftTab(programsActive === false ? 'controls' : 'programs');
  }
}

export function isMobileLayout() {
  return !!(MOBILE_MQ && MOBILE_MQ.matches);
}

// ─── WAKE LOCK ──────────────────────────────────────────────────────
// En móvil, si la pantalla se apaga el sistema suspende el audio y los
// temporizadores → los pitidos se retrasan o desaparecen. Mantener la
// pantalla encendida mientras la sesión está activa.
let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator && !wakeLock && document.visibilityState === 'visible') {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    }
  } catch (e) { wakeLock = null; }
}

function releaseWakeLock() {
  try { wakeLock && wakeLock.release(); } catch (e) {}
  wakeLock = null;
}

export function handleOverlayClick(event) {
  if (event.target.classList.contains('wizard-overlay')) {
    closeWizard();
  }
}

export function handleBibOverlayClick(event) {
  if (event.target.classList.contains('bib-overlay')) {
    closeBib();
  }
}

export function switchBibTab(tabElement) {
  const targetTab = tabElement.dataset.btab;
  
  // Update tab buttons
  document.querySelectorAll('.bib-tab').forEach(tab => {
    tab.classList.toggle('active', tab === tabElement);
  });
  
  // Update sections
  document.querySelectorAll('.bib-section').forEach(section => {
    section.classList.remove('active');
  });
  
  const targetSection = document.getElementById(`bib-${targetTab}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}
