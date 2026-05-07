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
export function breathDur(S) {
  const cycleMs = (60 / S.bpm) * 1000;
  const r = S.ratio;
  return {
    inhale: cycleMs * (r / (r + 1)),
    exhale: cycleMs * (1 / (r + 1)),
  };
}

export function getPhaseDuration(phase, S) {
  const tech = BREATH_PRESETS[S.breathPreset] || BREATH_PRESETS.coherencia;
  // fixedDurations tiene prioridad absoluta (478, box)
  if (tech.fixedDurations && tech.fixedDurations[phase] !== undefined) {
    return tech.fixedDurations[phase];
  }
  if (phase === 'holdFull')  return (tech.getHoldFull(S)  || 0) * 1000;
  if (phase === 'holdEmpty') return (tech.getHoldEmpty(S) || 0) * 1000;
  const d = breathDur(S);
  return phase === 'inhale' ? d.inhale : d.exhale;
}

// Filtra fases con duración 0 para evitar flicker
export function getPhaseSequence(S) {
  const tech = BREATH_PRESETS[S.breathPreset] || BREATH_PRESETS.coherencia;
  return tech.sequence.filter(ph => getPhaseDuration(ph, S) > 0);
}