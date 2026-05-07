// ════════════════════════════════════════════════════
// viz.js — Visualizaciones · Coherencia v8
// Canvas: lissajous, spectrum, cymatics, etc.
// ════════════════════════════════════════════════════

import { getAC, getMasterGain } from './audio.js';
import { S } from './app.js';

let analyser = null;
let dataArray = null;
let bufferLength = 0;
let currentViz = 'lissajous';

// Canvas references
let wcLissajous, wcSpectrum, wcOscillo, wcSpectrogram, wcVector, wcCymatics;
let ctxL, ctxS, ctxO, ctxSg, ctxV, ctxC;

// Cymatics state
let cymaticParticles = [];
const PARTICLE_COUNT = 800;

// Lissajous trail
const TRAIL_LEN = 120;
let trailX = new Array(TRAIL_LEN).fill(0);
let trailY = new Array(TRAIL_LEN).fill(0);
let trailHead = 0;

// ─── INIT ───────────────────────────────────────────────────────────
export function initViz() {
  wcLissajous = document.getElementById('wcLissajous');
  wcSpectrum = document.getElementById('wcSpectrum');
  wcOscillo = document.getElementById('wcOscillo');
  wcSpectrogram = document.getElementById('wcSpectrogram');
  wcVector = document.getElementById('wcVector');
  wcCymatics = document.getElementById('wcCymatics');

  if (wcLissajous) ctxL = wcLissajous.getContext('2d');
  if (wcSpectrum) ctxS = wcSpectrum.getContext('2d');
  if (wcOscillo) ctxO = wcOscillo.getContext('2d');
  if (wcSpectrogram) ctxSg = wcSpectrogram.getContext('2d');
  if (wcVector) ctxV = wcVector.getContext('2d');
  if (wcCymatics) ctxC = wcCymatics.getContext('2d');

  resizeCanvas();
  initCymaticParticles();
}

// ─── RESIZE ─────────────────────────────────────────────────────────
export function resizeCanvas() {
  const container = document.getElementById('vizContainer');
  if (!container) return;

  const w = container.clientWidth;
  const h = container.clientHeight;

  [wcLissajous, wcSpectrum, wcOscillo, wcSpectrogram, wcVector, wcCymatics].forEach(canvas => {
    if (!canvas) return;
    const isLeft = canvas.classList.contains('viz-left');
    const isRight = canvas.classList.contains('viz-right');
    
    if (isLeft) {
      canvas.width = w * 0.42;
      canvas.height = h;
    } else if (isRight) {
      canvas.width = w * 0.58;
      canvas.height = h;
    } else {
      canvas.width = w;
      canvas.height = h;
    }
  });
}

// ─── SET VIZ ────────────────────────────────────────────────────────
export function setViz(viz) {
  currentViz = viz;

  // Update buttons
  document.querySelectorAll('.viz-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.viz === viz);
  });

  // Hide all canvases and legends
  [wcLissajous, wcSpectrum, wcOscillo, wcSpectrogram, wcVector, wcCymatics].forEach(c => {
    if (c) c.style.display = 'none';
  });

  document.querySelectorAll('.wave-legend').forEach(l => l.style.display = 'none');

  // Reset spectrum classes
  if (wcSpectrum) {
    wcSpectrum.classList.remove('viz-full');
    wcSpectrum.classList.add('viz-right');
  }

  // Show selected
  switch (viz) {
    case 'lissajous':
      if (wcLissajous) wcLissajous.style.display = 'block';
      if (wcSpectrum) wcSpectrum.style.display = 'block';
      document.getElementById('legendLissajous')?.style.setProperty('display', 'flex');
      break;
    case 'oscilloscope':
      if (wcOscillo) wcOscillo.style.display = 'block';
      document.getElementById('legendOscillo')?.style.setProperty('display', 'flex');
      break;
    case 'spectrum':
      if (wcSpectrum) {
        wcSpectrum.style.display = 'block';
        wcSpectrum.classList.remove('viz-right');
        wcSpectrum.classList.add('viz-full');
      }
      document.getElementById('legendSpectrum')?.style.setProperty('display', 'flex');
      break;
    case 'spectrogram':
      if (wcSpectrogram) wcSpectrogram.style.display = 'block';
      document.getElementById('legendSpectrogram')?.style.setProperty('display', 'flex');
      break;
    case 'vectorscope':
      if (wcVector) wcVector.style.display = 'block';
      document.getElementById('legendVector')?.style.setProperty('display', 'flex');
      break;
    case 'cymatics':
      if (wcCymatics) wcCymatics.style.display = 'block';
      document.getElementById('legendCymatics')?.style.setProperty('display', 'flex');
      break;
  }

  resizeCanvas();
}

// ─── INIT ANALYSER ──────────────────────────────────────────────────
export function initAnalyser() {
  const AC = getAC();
  const masterGain = getMasterGain();
  
  if (!AC || !masterGain) return;
  if (analyser) return;

  analyser = AC.createAnalyser();
  analyser.fftSize = 2048;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  
  masterGain.connect(analyser);
}

// ─── ANIMATION LOOP ─────────────────────────────────────────────────
export function animateViz() {
  if (!S.playing) return;

  switch (currentViz) {
    case 'lissajous':
      drawLissajous();
      drawSpectrum();
      break;
    case 'oscilloscope':
      drawOscilloscope();
      break;
    case 'spectrum':
      drawSpectrumFull();
      break;
    case 'spectrogram':
      drawSpectrogram();
      break;
    case 'vectorscope':
      drawVectorscope();
      break;
    case 'cymatics':
      drawCymatics();
      break;
  }

  requestAnimationFrame(animateViz);
}

// ─── LISSAJOUS ──────────────────────────────────────────────────────
function drawLissajous() {
  if (!ctxL || !wcLissajous) return;

  const w = wcLissajous.width;
  const h = wcLissajous.height;
  
  if (w === 0 || h === 0) return;

  const cx = w / 2;
  const cy = h / 2;

  // Fade background
  ctxL.fillStyle = 'rgba(6, 10, 16, 0.2)';
  ctxL.fillRect(0, 0, w, h);

  const r = Math.min(w, h) * 0.45; // Aumentado de 0.42 a 0.45

  // Draw reference circles and axes
  ctxL.strokeStyle = 'rgba(80, 180, 200, 0.05)';
  ctxL.lineWidth = 0.5;
  [1, 0.66, 0.33].forEach(f => {
    ctxL.beginPath();
    ctxL.arc(cx, cy, r * f, 0, Math.PI * 2);
    ctxL.stroke();
  });
  
  // Axes
  ctxL.beginPath();
  ctxL.moveTo(cx - r, cy);
  ctxL.lineTo(cx + r, cy);
  ctxL.moveTo(cx, cy - r);
  ctxL.lineTo(cx, cy + r);
  ctxL.stroke();

  // Usar datos REALES del analyser si está disponible
  let lv, rv;
  
  if (analyser && dataArray) {
    analyser.getByteTimeDomainData(dataArray);
    
    // Tomar muestras de diferentes puntos para simular L/R
    const sample1 = (dataArray[0] - 128) / 128;
    const sample2 = (dataArray[Math.floor(bufferLength / 4)] - 128) / 128;
    
    lv = sample1;
    rv = sample2;
  } else {
    // Fallback: simulación simple basada en tiempo
    const t = performance.now() / 1000;
    const speed = S.beat / 10; // Velocidad basada en beat
    lv = Math.sin(t * speed * 2);
    rv = Math.sin(t * speed * 2.5);
  }

  // Store in trail
  trailX[trailHead] = lv;
  trailY[trailHead] = rv;
  trailHead = (trailHead + 1) % TRAIL_LEN;

  // Breath modulation
  let breathMod = 1;
  if (S.playing && S.phase !== 'idle') {
    const elapsed = performance.now() - (window.phaseStart || 0);
    const duration = window.phaseDur || 5000;
    const progress = Math.min(elapsed / duration, 1);
    
    if (S.phase === 'inhale') {
      breathMod = 1 + progress * 0.18; // Aumentado de 0.12 a 0.18
    } else if (S.phase === 'exhale') {
      breathMod = 1.18 - progress * 0.18; // Aumentado de 0.12 a 0.18
    } else {
      breathMod = 1.18; // Aumentado de 1.12 a 1.18
    }
  }
  
  const rr = r * Math.max(0.85, Math.min(1.18, breathMod)); // Aumentado el rango de 0.88-1.12 a 0.85-1.18

  // Draw trail
  for (let i = 0; i < TRAIL_LEN - 1; i++) {
    const idx = (trailHead + i) % TRAIL_LEN;
    const idx2 = (trailHead + i + 1) % TRAIL_LEN;
    const age = i / TRAIL_LEN;
    
    const px1 = cx + trailX[idx] * rr;
    const py1 = cy + trailY[idx] * rr;
    const px2 = cx + trailX[idx2] * rr;
    const py2 = cy + trailY[idx2] * rr;
    
    const hue = 180 + age * 60;
    ctxL.strokeStyle = `hsla(${hue}, 70%, 60%, ${age * 0.85})`;
    ctxL.lineWidth = age > 0.85 ? 1.8 : 0.8;
    
    ctxL.beginPath();
    ctxL.moveTo(px1, py1);
    ctxL.lineTo(px2, py2);
    ctxL.stroke();
  }

  // Draw current point with glow
  const currentIdx = (trailHead - 1 + TRAIL_LEN) % TRAIL_LEN;
  const px = cx + trailX[currentIdx] * rr;
  const py = cy + trailY[currentIdx] * rr;
  
  const grd = ctxL.createRadialGradient(px, py, 0, px, py, 10);
  grd.addColorStop(0, 'rgba(80, 180, 200, 1)');
  grd.addColorStop(1, 'rgba(80, 180, 200, 0)');
  
  ctxL.fillStyle = grd;
  ctxL.beginPath();
  ctxL.arc(px, py, 10, 0, Math.PI * 2);
  ctxL.fill();
}

// ─── SPECTRUM ───────────────────────────────────────────────────────
function drawSpectrum() {
  if (!ctxS || !wcSpectrum || !analyser) return;

  const w = wcSpectrum.width;
  const h = wcSpectrum.height;

  analyser.getByteFrequencyData(dataArray);

  ctxS.fillStyle = 'rgba(6, 10, 16, 0.2)';
  ctxS.fillRect(0, 0, w, h);

  const barWidth = (w / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * h * 0.8;
    
    const hue = (i / bufferLength) * 60 + 180; // cyan to blue
    ctxS.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
    ctxS.fillRect(x, h - barHeight, barWidth, barHeight);
    
    x += barWidth + 1;
  }
}

// ─── SPECTRUM FULL ──────────────────────────────────────────────────
function drawSpectrumFull() {
  if (!ctxS || !wcSpectrum || !analyser) return;

  const w = wcSpectrum.width;
  const h = wcSpectrum.height;

  analyser.getByteFrequencyData(dataArray);

  ctxS.fillStyle = 'rgba(6, 10, 16, 0.2)';
  ctxS.fillRect(0, 0, w, h);

  const barWidth = w / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * h;
    
    const hue = (i / bufferLength) * 60 + 180;
    ctxS.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
    ctxS.fillRect(x, h - barHeight, barWidth, barHeight);
    
    x += barWidth;
  }
}

// ─── OSCILLOSCOPE ───────────────────────────────────────────────────
function drawOscilloscope() {
  if (!ctxO || !wcOscillo || !analyser) return;

  const w = wcOscillo.width;
  const h = wcOscillo.height;

  analyser.getByteTimeDomainData(dataArray);

  ctxO.fillStyle = 'rgba(6, 10, 16, 0.15)';
  ctxO.fillRect(0, 0, w, h);

  ctxO.lineWidth = 2;
  ctxO.strokeStyle = 'rgba(80, 180, 200, 0.8)';
  ctxO.beginPath();

  const sliceWidth = w / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * h) / 2;

    if (i === 0) ctxO.moveTo(x, y);
    else ctxO.lineTo(x, y);

    x += sliceWidth;
  }

  ctxO.lineTo(w, h / 2);
  ctxO.stroke();
}

// ─── SPECTROGRAM ────────────────────────────────────────────────────
let spectrogramData = [];

function drawSpectrogram() {
  if (!ctxSg || !wcSpectrogram || !analyser) return;

  const w = wcSpectrogram.width;
  const h = wcSpectrogram.height;

  analyser.getByteFrequencyData(dataArray);

  // Shift existing data left
  if (spectrogramData.length > w) {
    spectrogramData.shift();
  }

  // Add new column
  spectrogramData.push([...dataArray]);

  ctxSg.fillStyle = 'rgba(6, 10, 16, 1)';
  ctxSg.fillRect(0, 0, w, h);

  // Draw spectrogram
  spectrogramData.forEach((column, x) => {
    column.forEach((value, i) => {
      const y = (i / bufferLength) * h;
      const intensity = value / 255;
      
      let color;
      if (intensity < 0.25) color = `rgba(155, 125, 232, ${intensity * 4})`;
      else if (intensity < 0.5) color = `rgba(80, 180, 200, ${intensity})`;
      else if (intensity < 0.75) color = `rgba(212, 168, 75, ${intensity})`;
      else color = `rgba(224, 85, 85, ${intensity})`;
      
      ctxSg.fillStyle = color;
      ctxSg.fillRect(x, h - y, 1, h / bufferLength);
    });
  });
}

// ─── VECTORSCOPE ────────────────────────────────────────────────────
function drawVectorscope() {
  if (!ctxV || !wcVector || !analyser) return;

  const w = wcVector.width;
  const h = wcVector.height;
  const cx = w / 2;
  const cy = h / 2;

  analyser.getByteTimeDomainData(dataArray);

  ctxV.fillStyle = 'rgba(6, 10, 16, 0.1)';
  ctxV.fillRect(0, 0, w, h);

  ctxV.strokeStyle = 'rgba(80, 180, 200, 0.6)';
  ctxV.lineWidth = 1;
  ctxV.beginPath();

  for (let i = 0; i < bufferLength; i += 2) {
    const left = (dataArray[i] - 128) / 128;
    const right = (dataArray[i + 1] - 128) / 128;
    
    const x = cx + (left + right) * (w * 0.4);
    const y = cy + (left - right) * (h * 0.4);
    
    if (i === 0) ctxV.moveTo(x, y);
    else ctxV.lineTo(x, y);
  }

  ctxV.stroke();
}

// ─── CYMATICS (NUEVO) ───────────────────────────────────────────────
/**
 * Visualización cimática: simula patrones de Chladni en agua
 * Los patrones cambian según la frecuencia (carrier o tone)
 */

function initCymaticParticles() {
  cymaticParticles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    cymaticParticles.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5
    });
  }
}

function drawCymatics() {
  if (!ctxC || !wcCymatics) return;

  const w = wcCymatics.width;
  const h = wcCymatics.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.45;

  // Fade effect
  ctxC.fillStyle = 'rgba(6, 10, 16, 0.08)';
  ctxC.fillRect(0, 0, w, h);

  // Get frequency (tone or carrier)
  const freq = S.tone || S.carrier;
  const beat = S.beat;
  const t = performance.now() / 1000;

  // Calculate Chladni pattern parameters based on frequency
  // Lower frequencies = fewer nodes, higher = more complex patterns
  const modeX = Math.floor(freq / 100) + 1;
  const modeY = Math.floor(freq / 120) + 1;
  const beatInfluence = Math.sin(t * beat * 0.5) * 0.3;

  // Draw particles in cymatic pattern
  cymaticParticles.forEach(p => {
    // Update phase
    p.phase += 0.02 * p.speed;

    // Calculate position using Chladni equation
    const r = p.radius * maxRadius;
    const theta = p.angle + p.phase * 0.1;
    
    // Chladni pattern: sin(mx*θ) * sin(ny*θ)
    const pattern = Math.sin(modeX * theta) * Math.sin(modeY * theta);
    const amplitude = Math.abs(pattern);
    
    // Beat modulation
    const beatMod = 1 + beatInfluence * Math.sin(p.phase + t * beat);
    
    // Final position
    const finalR = r * (0.3 + amplitude * 0.7) * beatMod;
    const x = cx + Math.cos(theta) * finalR;
    const y = cy + Math.sin(theta) * finalR;

    // Color based on amplitude and frequency
    const hue = 180 + (amplitude * 60); // cyan to blue
    const saturation = 60 + amplitude * 30;
    const lightness = 50 + amplitude * 20;
    const alpha = 0.4 + amplitude * 0.4;

    // Draw particle
    ctxC.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    ctxC.beginPath();
    ctxC.arc(x, y, 1.5 + amplitude * 1.5, 0, Math.PI * 2);
    ctxC.fill();

    // Draw connecting lines for nodes
    if (amplitude < 0.15) {
      ctxC.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.3})`;
      ctxC.lineWidth = 0.5;
      ctxC.beginPath();
      ctxC.moveTo(cx, cy);
      ctxC.lineTo(x, y);
      ctxC.stroke();
    }
  });

  // Draw center point
  ctxC.fillStyle = 'rgba(80, 180, 200, 0.8)';
  ctxC.beginPath();
  ctxC.arc(cx, cy, 3, 0, Math.PI * 2);
  ctxC.fill();

  // Draw frequency label
  ctxC.fillStyle = 'rgba(80, 180, 200, 0.6)';
  ctxC.font = '12px "DM Mono", monospace';
  ctxC.textAlign = 'center';
  ctxC.fillText(`${freq} Hz`, cx, cy + maxRadius + 20);
  
  if (beat > 0) {
    ctxC.fillStyle = 'rgba(212, 168, 75, 0.6)';
    ctxC.fillText(`Beat: ${beat.toFixed(1)} Hz`, cx, cy + maxRadius + 35);
  }
}
