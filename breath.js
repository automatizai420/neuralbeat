// ════════════════════════════════════════════════════
// breath.js — Motor de respiración · Coherencia v8
// Técnicas + Wim Hof State Machine corregida v3
// ════════════════════════════════════════════════════

// ─── DEFINICIÓN DE TÉCNICAS ──────────────────────────
// pattern: id que usa app.js para seleccionar el motor
// sequence: orden de fases para el motor genérico
// fixedDurations: ms exactos (ignoran BPM) — 478, box
// getHoldFull/Empty: devuelven segundos desde S
export const BREATH_PRESETS = {

  coherencia: {
    name: 'Coherencia Cardíaca',
    sequence: ['inhale', 'exhale'],
    getHoldFull:  (S) => S.holdFull  || 0,
    getHoldEmpty: (S) => S.holdEmpty || 0,
  },

  nadi: {
    name: 'Nadi Shodhana',
    sequence: ['inhale', 'exhale'],
    getHoldFull:  () => 0,
    getHoldEmpty: () => 0,
    forcedRatio: 1.0,
  },

  '478': {
    name: '4-7-8 Pranayama',
    sequence: ['inhale', 'holdFull', 'exhale'],
    fixedDurations: { inhale: 4000, holdFull: 7000, exhale: 8000 },
    getHoldFull:  () => 7,
    getHoldEmpty: () => 0,
  },

  box: {
    name: 'Box Breathing',
    sequence: ['inhale', 'holdFull', 'exhale', 'holdEmpty'],
    fixedDurations: { inhale: 4000, holdFull: 4000, exhale: 4000, holdEmpty: 4000 },
    getHoldFull:  (S) => S.holdFull  || 4,
    getHoldEmpty: (S) => S.holdEmpty || 4,
  },

  dispenza: {
    name: 'Maha Bandha · Dispenza',
    sequence: ['inhale', 'exhale', 'holdEmpty'],
    getHoldFull:  () => 0,
    getHoldEmpty: (S) => S.holdEmpty || 20,
  },

  bhastrika: {
    name: 'Bhastrika',
    sequence: ['inhale', 'exhale'],
    getHoldFull:  () => 0,
    getHoldEmpty: () => 0,
  },

  // Motor especial — gestionado por WimHof SM, no por runPhase genérico
  wimhof: {
    name: 'Wim Hof Method',
    sequence: ['inhale', 'exhale'],
    special: 'wimhof',
    getHoldFull:  () => 0,
    getHoldEmpty: () => 0,
  },

  ujjayi: {
    name: 'Ujjayi',
    sequence: ['inhale', 'exhale'],
    getHoldFull:  (S) => S.holdFull  || 0,
    getHoldEmpty: (S) => S.holdEmpty || 0,
  },
};

// ─── ESTADO WIM HOF (default) ────────────────────────
// Flujo corregido v3:
//   Ronda: 30 resp rápidas → exhala → HOLDEMPIY libre (▶ para terminar)
//   → inhala profundo → HOLDFULL 15s fijos (recovery)
//   → repite totalRounds veces
export const WH_DEFAULT = {
  active:           false,
  round:            0,        // 0-indexed
  totalRounds:      4,
  repCount:         0,        // respiraciones dentro de la ronda actual
  totalReps:        30,
  // Target sugerido por ronda — el usuario puede retener MÁS
  // y presiona ▶ cuando necesite respirar
  holdEmptyTarget:  [30, 45, 60, 60],
  holdEmptyMax:     120,      // límite de seguridad (auto-avanza)
  recoveryHold:     15,       // holdFull fijo en recovery breath
  mode:             'reps',   // 'reps' | 'retention' | 'recovery'
};

// ─── CÁLCULO DE DURACIONES ───────────────────────────
// Retención efectiva en ms, con la misma regla que se usa para
// reproducir la fase (fixedDurations → sliders; si no, getHold*).
function holdMs(phase, S, tech) {
  if (!tech.sequence.includes(phase)) return 0;
  if (tech.fixedDurations) return ((phase === 'holdFull' ? S.holdFull : S.holdEmpty) || 0) * 1000;
  return ((phase === 'holdFull' ? tech.getHoldFull(S) : tech.getHoldEmpty(S)) || 0) * 1000;
}

// Resp/min describe el ciclo COMPLETO: las retenciones que forman parte
// de la técnica se descuentan del ciclo y el resto se reparte entre
// inhalar y exhalar según el ratio.
export function breathDur(S) {
  const tech = BREATH_PRESETS[S.breathPreset] || BREATH_PRESETS.coherencia;
  const cycleMs = (60 / S.bpm) * 1000;
  // Mínimo 2 s para inhalar+exhalar si las retenciones superan el ciclo
  const breathingTimeMs = Math.max(2000, cycleMs - holdMs('holdFull', S, tech) - holdMs('holdEmpty', S, tech));
  const r = S.ratio;
  return {
    inhale: breathingTimeMs * (r / (r + 1)),
    exhale: breathingTimeMs * (1 / (r + 1)),
  };
}

export function getPhaseDuration(phase, S) {
  const tech = BREATH_PRESETS[S.breathPreset] || BREATH_PRESETS.coherencia;
  // fixedDurations (478, box) son los valores por defecto:
  //  · Retenciones: siempre se respetan los sliders (applyPreset los
  //    inicializa con los valores fijos).
  //  · Inhala/exhala: fijos hasta que el usuario mueve BPM o ratio.
  if (phase === 'holdFull' || phase === 'holdEmpty') return holdMs(phase, S, tech);
  if (tech.fixedDurations && !S.customTiming && tech.fixedDurations[phase] !== undefined) {
    return tech.fixedDurations[phase];
  }
  const d = breathDur(S);
  return phase === 'inhale' ? d.inhale : d.exhale;
}

// Filtra fases con duración 0 para evitar flicker
export function getPhaseSequence(S) {
  const tech = BREATH_PRESETS[S.breathPreset] || BREATH_PRESETS.coherencia;
  return tech.sequence.filter(ph => getPhaseDuration(ph, S) > 0);
}