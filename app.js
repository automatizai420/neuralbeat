// ════════════════════════════════════════════════════
// app.js — Núcleo de la aplicación · Coherencia v8
// STATE + applyPreset + UI + Wim Hof SM + i18n
// ════════════════════════════════════════════════════

import { PRESETS } from './presets.js';
import { initAC, startBinaural, startTone, stopBinaural, startNoise, stopNoise, beep, setVolume, getAC, getMasterGain, resumeAC, whRecoveryTone, whRetentionTick, whReleaseBeep } from './audio.js';
import { BREATH_PRESETS, WH_DEFAULT, getPhaseDuration, getPhaseSequence, breathDur } from './breath.js';
import { I18N } from './i18n.js';
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
  activePreset:  null,      // NUEVO: referencia al objeto PRESETS[i] activo
  wh:            { ...WH_DEFAULT },
};

let LANG = 'es';

// ─── i18n ───────────────────────────────────────────────────────────
export function t(key) {
  return (I18N[LANG] && I18N[LANG][key]) || I18N.es[key] || key;
}

export function setLang(lang) {
  if (!I18N[lang]) return;
  LANG = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));
  applyLang();
  localStorage.setItem('coherencia_lang', lang);
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (val) el.textContent = val;
  });
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
    initAnalyser();
    S.playing = true;
    
    // Resetear contadores de sesión ANTES de iniciar respiración
    S.cycles = 0;
    S.sessionSec = 0;
    const sCycles = document.getElementById('sCycles');
    const sTime = document.getElementById('sTime');
    if (sCycles) sCycles.textContent = '0';
    if (sTime) sTime.textContent = '0:00';
    
    if (S.binaural) {
      if (S.tone) startTone(S.tone, S.beat);
      else        startBinaural(S.carrier, S.beat);
    }
    if (S.noise) startNoise();

    // Iniciar motor de respiración
    if (S.breathPreset === 'wimhof') {
      startWimHof();
    } else {
      startBreathing();
    }
    
    // Iniciar interval del contador de tiempo
    if (sessionIV) clearInterval(sessionIV);
    sessionIV = setInterval(() => {
      S.sessionSec++;
      const m = Math.floor(S.sessionSec / 60);
      const s = S.sessionSec % 60;
      const sTime = document.getElementById('sTime');
      if (sTime) sTime.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);

    // Iniciar visualizaciones
    animateViz();

    // UI updates
    document.getElementById('playBtn').classList.add('on');
    document.getElementById('playBtn').textContent = '⏸';
    document.getElementById('statusDot').classList.add('live');
    
    const statusTxt = document.getElementById('statusTxt');
    if (statusTxt) statusTxt.textContent = t('statusActive');
    
    const whRow = document.getElementById('whRow');
    if (whRow && S.breathPreset === 'wimhof') {
      whRow.classList.add('visible');
    }
  } else {
    S.playing = false;
    stopBinaural();
    stopNoise();
    stopBreathing();
    
    // Detener contador de sesión
    if (sessionIV) {
      clearInterval(sessionIV);
      sessionIV = null;
    }

    document.getElementById('playBtn').classList.remove('on');
    document.getElementById('playBtn').textContent = '▶';
    document.getElementById('statusDot').classList.remove('live');
    
    const statusTxt = document.getElementById('statusTxt');
    if (statusTxt) statusTxt.textContent = t('statusInactive');
    
    const whRow = document.getElementById('whRow');
    if (whRow) whRow.classList.remove('visible');
  }
}

// ─── BREATHING ENGINE ───────────────────────────────────────────────
let breathTO = null;
let _seqIndex = 0;
let phaseStart = 0;
let phaseDur = 0;
let rafId = null;
let sessionIV = null; // Interval para contador de tiempo de sesión
let whTickTimeouts = []; // Timeouts para ticks de orientación en Wim Hof
let whCountdownIV = null; // Interval para cuenta regresiva entre rondas

// Exponer para viz.js
if (typeof window !== 'undefined') {
  window.phaseStart = 0;
  window.phaseDur = 0;
}

function startBreathing() {
  _seqIndex = 0;
  const seq = getPhaseSequence(S);
  if (seq.length > 0) {
    runPhase(seq[0]);
    startBreathLoop();
  }
}

function stopBreathing() {
  if (breathTO) {
    clearTimeout(breathTO);
    breathTO = null;
  }
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  
  // Limpiar ticks de Wim Hof
  whTickTimeouts?.forEach(clearTimeout);
  whTickTimeouts = [];
  
  // Limpiar cuenta regresiva de Wim Hof
  if (whCountdownIV) {
    clearInterval(whCountdownIV);
    whCountdownIV = null;
  }
  
  // Ocultar botón de continuar de Wim Hof
  const whContinueBtn = document.getElementById('whContinueBtn');
  if (whContinueBtn) {
    whContinueBtn.style.display = 'none';
    whContinueBtn.classList.remove('visible');
  }
  
  S.phase = 'idle';
  
  // Reset orb
  const orb = document.getElementById('orb');
  const orbSec = document.getElementById('orbSec');
  if (orb) {
    orb.classList.remove('hold-full', 'hold-empty');
    orb.classList.add('idle');
    orb.style.transform = 'scale(1.0)';
    orb.style.boxShadow = '0 0 12px rgba(68,136,204,.15)';
    orb.style.borderColor = 'rgba(68,136,204,.25)';
  }
  if (orbSec) {
    orbSec.textContent = '–';
  }
}

// Loop de animación para actualizar contador y barra
function startBreathLoop() {
  function loop() {
    if (!S.playing) return;
    
    const now = performance.now();
    const elapsed = now - phaseStart;
    
    // Actualizar barra de progreso
    if (phaseDur > 0) {
      const prog = Math.min(elapsed / phaseDur, 1);
      const barEl = document.getElementById('bBar');
      if (barEl) {
        barEl.style.transition = 'none';
        
        // inhale/holdFull llenan hacia adelante; exhale/holdEmpty drenan hacia atrás
        if (S.phase === 'inhale' || S.phase === 'holdFull') {
          barEl.style.width = prog * 100 + '%';
        } else {
          barEl.style.width = (1 - prog) * 100 + '%';
        }
      }
      
      // Contador de segundos en el orb
      const orbSec = document.getElementById('orbSec');
      if (orbSec) {
        const remaining = Math.max(0, (phaseDur - elapsed) / 1000).toFixed(1);
        orbSec.textContent = remaining;
      }
    } else {
      // Retención indefinida - mostrar tiempo transcurrido
      const orbSec = document.getElementById('orbSec');
      if (orbSec) {
        orbSec.textContent = (elapsed / 1000).toFixed(0) + 's';
      }
      const barEl = document.getElementById('bBar');
      if (barEl) {
        barEl.style.width = '50%';
      }
    }
    
    rafId = requestAnimationFrame(loop);
  }
  
  loop();
}

function runPhase(phase) {
  if (!S.playing) return;
  S.phase = phase;
  phaseDur = getPhaseDuration(phase, S);
  phaseStart = performance.now();
  
  // Actualizar variables globales para viz.js
  window.phaseStart = phaseStart;
  window.phaseDur = phaseDur;

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
      orb.style.background = 'transparent';
      bar.style.background = 'var(--cyan)';
      lbl.textContent = t('phaseInhale') || 'inhala';
      lbl.style.color = 'var(--cyan)';
      if (S.beep) beep(520, 0.28, S.vol);
      break;

    case 'holdFull':
      orb.classList.add('hold-full');
      orb.style.transform = 'scale(1.42)';
      lbl.textContent = t('phaseHoldFull') || 'retén';
      lbl.style.color = 'var(--gold)';
      bar.style.background = 'var(--gold)';
      if (S.beep) beep(440, 0.2, S.vol);
      break;

    case 'exhale':
      orb.style.transform = 'scale(1.0)';
      orb.style.boxShadow = '0 0 12px rgba(68,136,204,.15)';
      orb.style.borderColor = 'rgba(68,136,204,.25)';
      orb.style.background = 'transparent';
      bar.style.background = 'var(--blue)';
      lbl.textContent = t('phaseExhale') || 'exhala';
      lbl.style.color = 'var(--cyan)';
      if (S.beep) beep(360, 0.2, S.vol);
      break;

    case 'holdEmpty':
      orb.classList.add('hold-empty');
      orb.style.transform = 'scale(1.0)';
      lbl.textContent = t('phaseHoldEmpty') || 'vacío';
      lbl.style.color = 'var(--purple)';
      bar.style.background = 'var(--purple)';
      if (S.beep) beep(280, 0.18, S.vol);
      break;
  }

  breathTO = setTimeout(nextPhase, phaseDur);
}

function nextPhase() {
  if (!S.playing) return;

  const seq = getPhaseSequence(S);
  _seqIndex = (_seqIndex + 1) % seq.length;

  if (_seqIndex === 0) {
    S.cycles++;
    const sCycles = document.getElementById('sCycles');
    if (sCycles) sCycles.textContent = S.cycles;
  }

  runPhase(seq[_seqIndex]);
}

// ─── WIM HOF STATE MACHINE ──────────────────────────────────────────
function startWimHof() {
  const wh = S.wh;
  wh.active = true;
  wh.round = 0;
  wh.repCount = 0;
  wh.mode = 'reps';
  updateWhDots();
  startBreathLoop(); // Iniciar loop del orb
  runWimHofRep();
}

function runWimHofRep() {
  const wh = S.wh;
  if (!S.playing) return;

  if (wh.repCount >= wh.totalReps) {
    wh.mode = 'retention';
    beginWimHofRetention();
    return;
  }

  const phaseCycle = document.getElementById('phaseCycle');
  if (phaseCycle) {
    phaseCycle.textContent = `${wh.repCount + 1}/${wh.totalReps}`;
  }

  // Última respiración (rep 30): exhale más larga y completa
  const isLastRep = (wh.repCount === wh.totalReps - 1);
  const exhaleTime = isLastRep ? 1400 : 800;

  // INHALE - EL ORB SE INFLA
  S.phase = 'inhale';
  phaseDur = 1400;
  phaseStart = performance.now();
  window.phaseStart = phaseStart;
  window.phaseDur = phaseDur;
  
  updateOrbSimple('inhala', 'scale(1.35)', '0 0 30px rgba(80,180,200,.4)', 'var(--cyan)');
  if (S.beep) beep(520, 0.15, S.vol);

  breathTO = setTimeout(() => {
    if (!S.playing) return;
    
    // EXHALE - EL ORB SE DESINFLA
    S.phase = 'exhale';
    phaseDur = exhaleTime;
    phaseStart = performance.now();
    window.phaseStart = phaseStart;
    window.phaseDur = phaseDur;
    
    updateOrbSimple('exhala', 'scale(1.0)', '0 0 12px rgba(68,136,204,.2)', 'var(--cyan)');
    
    // Pitido de exhale - más audible
    if (S.beep) {
      if (isLastRep) {
        beep(360, 0.22, S.vol); // Señal de última respiración: exhala completamente
      } else {
        beep(360, 0.12, S.vol); // Exhale normal
      }
    }
    
    breathTO = setTimeout(() => {
      wh.repCount++;
      runWimHofRep();
    }, exhaleTime);
  }, 1400);
}

function beginWimHofRetention() {
  if (!S.playing) return;
  S.phase = 'holdEmpty';
  
  // Retención indefinida - mostrar tiempo transcurrido
  phaseDur = 0;
  phaseStart = performance.now();
  window.phaseStart = phaseStart;
  window.phaseDur = phaseDur;

  const orb = document.getElementById('orb');
  if (orb) orb.classList.add('hold-empty');
  
  updateOrbSimple('retén', 'scale(0.9)', '0 0 20px rgba(155,125,232,.5)', 'var(--purple)');
  if (S.beep) beep(280, 0.25, S.vol);

  const phaseTxt = document.getElementById('phaseTxt');
  if (phaseTxt) phaseTxt.textContent = '⏸ Retención · presiona ▶ cuando necesites respirar';

  // Mostrar botón de continuar
  const whContinueBtn = document.getElementById('whContinueBtn');
  if (whContinueBtn) {
    whContinueBtn.style.display = 'flex';
    whContinueBtn.classList.add('visible');
  }

  // Programar ticks de orientación temporal
  const WH_TICKS = [
    { ms: 10000, type: 'soft' },
    { ms: 20000, type: 'soft' },
    { ms: 30000, type: 'soft' },
    { ms: 40000, type: 'soft' },
    { ms: 50000, type: 'soft' },
    { ms: 60000, type: 'warning' },
    { ms: 70000, type: 'soft' },
    { ms: 80000, type: 'invite' },
  ];
  
  whTickTimeouts = WH_TICKS.map(({ ms, type }) =>
    setTimeout(() => {
      if (S.phase === 'holdEmpty' && S.beep) whRetentionTick(type);
    }, ms)
  );

  // Auto-advance después de holdEmptyMax (seguridad)
  breathTO = setTimeout(finishWimHofRetention, S.wh.holdEmptyMax * 1000);
}

function finishWimHofRetention() {
  clearTimeout(breathTO);
  
  // Limpiar ticks de retención
  whTickTimeouts?.forEach(clearTimeout);
  whTickTimeouts = [];
  
  // Ocultar botón de continuar
  const whContinueBtn = document.getElementById('whContinueBtn');
  if (whContinueBtn) {
    whContinueBtn.style.display = 'none';
    whContinueBtn.classList.remove('visible');
  }
  
  if (!S.playing) return;

  const orb = document.getElementById('orb');
  if (orb) orb.classList.remove('hold-empty');

  // RECOVERY INHALE - EL ORB SE INFLA AL MÁXIMO
  S.phase = 'inhale';
  phaseDur = 2000;
  phaseStart = performance.now();
  window.phaseStart = phaseStart;
  window.phaseDur = phaseDur;
  
  updateOrbSimple('recupera', 'scale(1.5)', '0 0 40px rgba(80,180,200,.6)', 'var(--cyan)');
  
  // Tono de recuperación (sweep 600→520 Hz en 2s)
  if (S.beep) whRecoveryTone();

  breathTO = setTimeout(() => {
    if (!S.playing) return;
    
    // RECOVERY HOLD (holdFull 15s)
    S.phase = 'holdFull';
    phaseDur = S.wh.recoveryHold * 1000;
    phaseStart = performance.now();
    window.phaseStart = phaseStart;
    window.phaseDur = phaseDur;
    
    const orb = document.getElementById('orb');
    if (orb) orb.classList.add('hold-full');
    
    updateOrbSimple('retén', 'scale(1.5)', '0 0 35px rgba(212,168,75,.6)', 'var(--gold)');
    if (S.beep) beep(440, 0.25, S.vol);
    
    // Ticks durante holdFull 15s
    setTimeout(() => { if (S.phase === 'holdFull' && S.beep) whRetentionTick('soft'); }, 5000);
    setTimeout(() => { if (S.phase === 'holdFull' && S.beep) whRetentionTick('soft'); }, 10000);
    setTimeout(() => { if (S.phase === 'holdFull' && S.beep) whReleaseBeep(); }, 15000);

    breathTO = setTimeout(advanceWimHof, S.wh.recoveryHold * 1000);
  }, 2000);
}

function advanceWimHof() {
  const wh = S.wh;
  
  // Limpiar ticks pendientes
  whTickTimeouts?.forEach(clearTimeout);
  whTickTimeouts = [];
  
  const orb = document.getElementById('orb');
  if (orb) orb.classList.remove('hold-full', 'hold-empty');

  // Si completamos todas las rondas
  if (wh.round + 1 >= wh.totalRounds) {
    wh.round++;
    const phaseTxt = document.getElementById('phaseTxt');
    if (phaseTxt) phaseTxt.textContent = '✓ Wim Hof completado';
    wh.active = false;
    return;
  }

  // EXHALE LENTA después del recovery hold
  S.phase = 'exhale';
  phaseDur = 3000; // 3 segundos de exhale lenta
  phaseStart = performance.now();
  window.phaseStart = phaseStart;
  window.phaseDur = phaseDur;
  
  updateOrbSimple('exhala', 'scale(1.0)', '0 0 12px rgba(68,136,204,.2)', 'var(--cyan)');
  if (S.beep) beep(360, 0.18, S.vol);

  breathTO = setTimeout(() => {
    if (!S.playing) return;
    
    // PAUSA DE 5 SEGUNDOS CON CUENTA REGRESIVA
    wh.round++;
    wh.repCount = 0;
    wh.mode = 'reps';
    S.cycles++;
    
    const sCycles = document.getElementById('sCycles');
    if (sCycles) sCycles.textContent = S.cycles;
    
    updateWhDots();
    
    // Iniciar cuenta regresiva de 5 segundos
    beginRoundTransition();
  }, 3000);
}

// Nueva función: cuenta regresiva de 5s entre rondas
function beginRoundTransition() {
  if (!S.playing) return;
  
  S.phase = 'idle';
  phaseDur = 5000;
  phaseStart = performance.now();
  window.phaseStart = phaseStart;
  window.phaseDur = phaseDur;
  
  const orb = document.getElementById('orb');
  const orbSec = document.getElementById('orbSec');
  const phaseTxt = document.getElementById('phaseTxt');
  
  if (orb) {
    orb.style.transform = 'scale(1.0)';
    orb.style.boxShadow = '0 0 15px rgba(80,180,200,.25)';
    orb.style.borderColor = 'rgba(80,180,200,.4)';
  }
  
  if (phaseTxt) {
    phaseTxt.textContent = `${t('whPreparing')} ${S.wh.round + 1}...`;
  }
  
  // Cuenta regresiva visual en el orb
  let countdown = 5;
  if (orbSec) orbSec.textContent = countdown;
  
  whCountdownIV = setInterval(() => {
    countdown--;
    if (orbSec) orbSec.textContent = countdown;
    
    // Pitidos en los últimos 3 segundos (3, 2, 1)
    if (countdown <= 3 && countdown > 0 && S.beep) {
      beep(440 + (countdown * 40), 0.20, S.vol); // Tono ascendente: 480, 520, 560 Hz
    }
  }, 1000);
  
  // Después de 5 segundos, iniciar la nueva ronda
  breathTO = setTimeout(() => {
    if (whCountdownIV) {
      clearInterval(whCountdownIV);
      whCountdownIV = null;
    }
    if (!S.playing) return;
    
    if (phaseTxt) {
      phaseTxt.textContent = `${t('whRound')} ${S.wh.round + 1} / ${S.wh.totalRounds}`;
    }
    
    // Pitido final más fuerte para señalar inicio
    if (S.beep) beep(600, 0.28, S.vol);
    
    // Iniciar primera respiración de la nueva ronda
    runWimHofRep();
  }, 5000);
}

// Función expuesta para el botón de continuar durante holdEmpty
export function whContinue() {
  if (S.wh.active && S.wh.mode === 'retention' && S.phase === 'holdEmpty') {
    finishWimHofRetention();
  }
}

function updateWhDots() {
  const wh = S.wh;
  const whLbl = document.getElementById('whLbl');
  if (whLbl) {
    whLbl.textContent = `${Math.min(wh.round + 1, wh.totalRounds)} / ${wh.totalRounds}`;
  }

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
      break;
    case 'sRatio':
      S.ratio = parseFloat(value);
      break;
    case 'sHoldFull':
      S.holdFull = parseInt(value);
      break;
    case 'sHoldEmpty':
      S.holdEmpty = parseInt(value);
      break;
    case 'sCarrier':
      S.carrier = parseInt(value);
      if (S.playing && S.binaural && !S.tone) {
        stopBinaural();
        startBinaural(S.carrier, S.beat);
      }
      break;
    case 'sBeat':
      S.beat = parseFloat(value);
      if (S.playing && S.binaural) {
        stopBinaural();
        if (S.tone) startTone(S.tone, S.beat);
        else        startBinaural(S.carrier, S.beat);
      }
      break;
    case 'sVol':
      S.vol = parseInt(value) / 100;
      setVolume(S.vol);
      break;
  }
  updateSliderDisplays();
  updateReadout();
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
      break;
    case 'noise':
      S.noise = !S.noise;
      if (S.playing) {
        if (S.noise) startNoise();
        else         stopNoise();
      }
      break;
  }
  
  const track = document.getElementById(`t${id.charAt(0).toUpperCase() + id.slice(1)}`);
  if (track) {
    track.classList.toggle('on', S[id]);
  }
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

  // Aplicar primer preset por defecto
  applyPreset('alpha10');

  // Attach slider listeners
  const sliders = ['sBpm', 'sRatio', 'sHoldFull', 'sHoldEmpty', 'sCarrier', 'sBeat', 'sVol'];
  sliders.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => onSliderChange(id, e.target.value));
    }
  });

  // Resize handler
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
  });

  console.log('🎵 Coherencia v8 modular loaded');
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
  const overlay = document.getElementById('bibOverlay');
  if (overlay) overlay.classList.add('open');
}

export function closeBib() {
  const overlay = document.getElementById('bibOverlay');
  if (overlay) overlay.classList.remove('open');
}

export function openMobSheet(tab) {
  const sheet = document.getElementById('mobSheet');
  if (sheet) sheet.classList.add('open');
}

export function closeMobSheet() {
  const sheet = document.getElementById('mobSheet');
  if (sheet) sheet.classList.remove('open');
}

export function mobSwitchTab(tab) {
  console.log('Mobile tab switch:', tab);
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
