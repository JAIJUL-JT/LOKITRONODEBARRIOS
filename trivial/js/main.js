// El Trivial del Botxo — aplicación independiente del arcade Botxitrono.
// 52 barrios, 5 aciertos por barrio, 10 fallos. 10 segundos por pregunta.
import { createAudio } from './audio.js';
import { BARRIOS_TRIVIA } from './trivia-barrios.js';
import { BILBAO_GENERAL, BILBAO_HISTORIA } from './trivia-data.js';
import { pintxoArt } from './pintxo-art.js';
import {
  QUESTIONS_PER_VISIT,
  advanceWithDice,
  answerQuestion,
  beginRound,
  barrioIsComplete,
  correctForBarrio,
  createTrivialGame,
  questionsNeeded,
  rollDice,
  totalAciertos,
} from './trivial-core.js';

const $ = (id) => document.getElementById(id);
const audio = createAudio(false);
const TRIVIA_DURATION_MS = 10000; // 10 segundos por pregunta

// Polyfill roundRect para Safari < 15.4
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    const rad = Array.isArray(r) ? r[0] : (r || 0);
    this.beginPath();
    this.moveTo(x + rad, y);
    this.lineTo(x + w - rad, y);
    this.quadraticCurveTo(x + w, y, x + w, y + rad);
    this.lineTo(x + w, y + h - rad);
    this.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    this.lineTo(x + rad, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - rad);
    this.lineTo(x, y + rad);
    this.quadraticCurveTo(x, y, x + rad, y);
    this.closePath();
    return this;
  };
}

// -----------------------------------------------------------------
// Pantallas exclusivas del Trivial
// -----------------------------------------------------------------
const SCREEN_IDS = {
  trivia: 'trivia-screen',
  board: 'trivial-board-screen',
  trivialend: 'trivial-end-screen',
};

function setUiState(target) {
  Object.entries(SCREEN_IDS).forEach(([key, id]) => {
    const el = $(id);
    if (el) el.classList.toggle('hidden', key !== target);
  });
}

// -----------------------------------------------------------------
// Coordenadas aproximadas de los 52 barrios en el mapa de Bilbao
// -----------------------------------------------------------------
const BARRIO_COORDS = [
  // Deusto (distrito 1) - orilla norte de la Ría
  { x: 0.14, y: 0.28 }, { x: 0.09, y: 0.20 }, { x: 0.08, y: 0.38 },
  { x: 0.14, y: 0.42 }, { x: 0.21, y: 0.22 }, { x: 0.21, y: 0.38 },
  { x: 0.28, y: 0.28 }, { x: 0.28, y: 0.42 },
  // Casco Viejo (distrito 2) - centro histórico
  { x: 0.42, y: 0.52 }, { x: 0.48, y: 0.48 }, { x: 0.48, y: 0.58 },
  { x: 0.42, y: 0.60 }, { x: 0.36, y: 0.55 },
  // Ibaiondo (distrito 3) - este de la ría
  { x: 0.55, y: 0.45 }, { x: 0.62, y: 0.40 }, { x: 0.62, y: 0.52 },
  { x: 0.69, y: 0.42 }, { x: 0.69, y: 0.55 }, { x: 0.76, y: 0.46 },
  // Basurto (distrito 4) - sur
  { x: 0.42, y: 0.70 }, { x: 0.48, y: 0.72 }, { x: 0.36, y: 0.72 },
  { x: 0.30, y: 0.68 }, { x: 0.55, y: 0.68 },
  // Begoña (distrito 5) - colinas norte
  { x: 0.56, y: 0.28 }, { x: 0.62, y: 0.22 }, { x: 0.69, y: 0.28 },
  { x: 0.76, y: 0.22 }, { x: 0.76, y: 0.34 }, { x: 0.83, y: 0.28 },
  // Errekalde (distrito 6) - suroeste
  { x: 0.22, y: 0.72 }, { x: 0.16, y: 0.68 }, { x: 0.10, y: 0.72 },
  { x: 0.16, y: 0.78 }, { x: 0.22, y: 0.82 }, { x: 0.28, y: 0.78 },
  // Uribarri (distrito 7) - este colinas
  { x: 0.76, y: 0.60 }, { x: 0.83, y: 0.55 }, { x: 0.83, y: 0.68 },
  { x: 0.90, y: 0.60 }, { x: 0.76, y: 0.72 }, { x: 0.83, y: 0.78 },
  // Abando / Ensanche (sur ría)
  { x: 0.35, y: 0.45 }, { x: 0.42, y: 0.40 }, { x: 0.48, y: 0.36 },
  { x: 0.35, y: 0.35 }, { x: 0.28, y: 0.42 }, { x: 0.21, y: 0.48 },
  { x: 0.14, y: 0.52 }, { x: 0.08, y: 0.56 }, { x: 0.56, y: 0.36 },
];

function drawMedievalMap(canvas, activeLvl, boardState = null) {
  if (!canvas) return;
  const W = canvas.width;
  const H = canvas.height;
  const ctx2 = canvas.getContext('2d');
  if (!ctx2) return;

  // Fondo pergamino medieval
  ctx2.fillStyle = '#3d2b1a';
  ctx2.fillRect(0, 0, W, H);

  // Textura de pergamino
  const grad = ctx2.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
  grad.addColorStop(0, 'rgba(190, 155, 85, 0.35)');
  grad.addColorStop(0.5, 'rgba(140, 100, 45, 0.20)');
  grad.addColorStop(1, 'rgba(60, 30, 10, 0.5)');
  ctx2.fillStyle = grad;
  ctx2.fillRect(0, 0, W, H);

  // Borde ornamental
  ctx2.strokeStyle = 'rgba(231, 200, 115, 0.6)';
  ctx2.lineWidth = 3;
  ctx2.strokeRect(6, 6, W - 12, H - 12);
  ctx2.strokeStyle = 'rgba(231, 200, 115, 0.3)';
  ctx2.lineWidth = 1;
  ctx2.strokeRect(10, 10, W - 20, H - 20);

  // La Ría del Nervión — sinuosa de izquierda a derecha
  ctx2.save();
  ctx2.beginPath();
  ctx2.moveTo(0, H * 0.48);
  ctx2.bezierCurveTo(W * 0.15, H * 0.42, W * 0.3, H * 0.5, W * 0.45, H * 0.52);
  ctx2.bezierCurveTo(W * 0.55, H * 0.53, W * 0.65, H * 0.50, W * 0.78, H * 0.52);
  ctx2.bezierCurveTo(W * 0.88, H * 0.53, W * 0.95, H * 0.50, W, H * 0.52);
  ctx2.lineWidth = 18;
  ctx2.strokeStyle = 'rgba(60, 120, 180, 0.65)';
  ctx2.stroke();
  ctx2.lineWidth = 10;
  ctx2.strokeStyle = 'rgba(90, 160, 220, 0.5)';
  ctx2.stroke();
  ctx2.restore();

  // Texto "Ría del Nervión"
  ctx2.save();
  ctx2.font = `italic ${Math.round(W * 0.018)}px Georgia, serif`;
  ctx2.fillStyle = 'rgba(140, 200, 255, 0.75)';
  ctx2.fillText('Ría del Nervión', W * 0.35, H * 0.49);
  ctx2.restore();

  // Montañas estilizadas al norte
  [[0.05, 0.14], [0.20, 0.10], [0.35, 0.12], [0.50, 0.08], [0.65, 0.12], [0.80, 0.09], [0.93, 0.14]].forEach(([mx, my]) => {
    ctx2.save();
    ctx2.beginPath();
    ctx2.moveTo(mx * W, my * H + H * 0.09);
    ctx2.lineTo(mx * W + W * 0.03, my * H);
    ctx2.lineTo(mx * W + W * 0.06, my * H + H * 0.09);
    ctx2.closePath();
    ctx2.fillStyle = 'rgba(80, 100, 60, 0.45)';
    ctx2.fill();
    ctx2.strokeStyle = 'rgba(60, 80, 40, 0.6)';
    ctx2.lineWidth = 1;
    ctx2.stroke();
    ctx2.restore();
  });

  // Dibujar los 52 barrios
  const total = Math.min(BARRIOS_TRIVIA.length, BARRIO_COORDS.length);
  const r = Math.round(Math.min(W, H) * 0.038);

  for (let i = 0; i < total; i++) {
    const lvl = i + 1;
    const coords = BARRIO_COORDS[i] || { x: 0.5, y: 0.5 };
    const cx = coords.x * W;
    const cy = coords.y * H;

    const completed = boardState ? boardState.pintxos.includes(i) : lvl < activeLvl;
    const current = boardState ? boardState.position === i : lvl === activeLvl;

    let fillColor, strokeColor, textColor;
    if (completed) {
      fillColor = 'rgba(74, 180, 100, 0.85)';
      strokeColor = '#4ade80';
      textColor = '#c8ffd4';
    } else if (current) {
      fillColor = 'rgba(255, 200, 50, 0.95)';
      strokeColor = '#ffd700';
      textColor = '#1a0d00';
    } else {
      fillColor = 'rgba(40, 25, 10, 0.75)';
      strokeColor = 'rgba(150, 110, 60, 0.6)';
      textColor = 'rgba(150, 130, 100, 0.7)';
    }

    // Círculo del barrio
    ctx2.save();
    ctx2.beginPath();
    ctx2.arc(cx, cy, r, 0, Math.PI * 2);
    ctx2.fillStyle = fillColor;
    ctx2.fill();
    ctx2.strokeStyle = strokeColor;
    ctx2.lineWidth = current ? 3 : 1.5;
    ctx2.stroke();

    // Número del nivel
    ctx2.font = `bold ${Math.round(r * 0.9)}px system-ui`;
    ctx2.fillStyle = textColor;
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';
    ctx2.fillText(current ? '📍' : (completed ? '✓' : String(lvl)), cx, cy);
    ctx2.restore();
  }

  // Ficha del jugador sobre el barrio actual
  if (boardState) {
    const coords = BARRIO_COORDS[boardState.position] || { x: 0.5, y: 0.5 };
    const cx = coords.x * W;
    const cy = coords.y * H;
    ctx2.save();
    ctx2.font = `${Math.round(r * 1.35)}px Georgia, serif`;
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'bottom';
    ctx2.lineWidth = 4;
    ctx2.strokeStyle = 'rgba(20, 12, 4, 0.9)';
    ctx2.strokeText('♟', cx, cy - r * 0.35);
    ctx2.fillStyle = BARRIOS_TRIVIA[boardState.position]?.pintxo?.color || '#ffd166';
    ctx2.fillText('♟', cx, cy - r * 0.35);
    ctx2.restore();
  }

  // Título del mapa estilo medieval
  ctx2.save();
  ctx2.font = `bold ${Math.round(W * 0.03)}px Georgia, serif`;
  ctx2.fillStyle = 'rgba(231, 200, 115, 0.9)';
  ctx2.textAlign = 'center';
  ctx2.textBaseline = 'bottom';
  ctx2.fillText('⚜ BILBAO · EL BOTXO ⚜', W / 2, H - 10);
  ctx2.restore();
}

// -----------------------------------------------------------------
// Estado del juego
// -----------------------------------------------------------------
let triviaTimerInterval = null;
let triviaPlayerName = '';
let triviaAnswerLocked = false;
let trivialReturnTimer = null;

let trivialGame = createTrivialGame();

let triviaSession = {
  active: false,
  questions: [],
  currentIndex: 0,
};

// Referencias DOM del tablero
const trivialBoardCanvas  = $('trivial-board-canvas');
const trivialBoardSubtitle = $('trivial-board-subtitle');
const trivialBoardMessage = $('trivial-board-message');
const trivialBoardPintxos = $('trivial-board-pintxos');
const trivialBoardFallos  = $('trivial-board-fallos');
const trivialBoardAciertos = $('trivial-board-aciertos');
const trivialBoardProgress = $('trivial-board-progress');
const trivialPintxoGrid   = $('trivial-pintxo-grid');
const trivialVitrinaCount = $('trivial-vitrina-count');
const trivialDie1         = $('trivial-die-1');
const trivialDie2         = $('trivial-die-2');
const btnTrivialRoll      = $('btn-trivial-roll');
const btnTrivialBoardMenu = $('btn-trivial-board-menu');

// Referencias DOM del final
const trivialEndTitle    = $('trivial-end-title');
const trivialEndText     = $('trivial-end-text');
const trivialEndPintxos  = $('trivial-end-pintxos');
const trivialEndFallos   = $('trivial-end-fallos');
const trivialEndAciertos = $('trivial-end-aciertos');
const trivialEndBarrios  = $('trivial-end-barrios');
const btnTrivialEndAgain = $('btn-trivial-end-again');
const btnTrivialEndMenu  = $('btn-trivial-end-menu');

// Referencias DOM del trivial
const triviaNameEntry    = $('trivia-name-entry');
const triviaGamePanel    = $('trivia-game-panel');
const triviaPlayerInput  = $('trivia-player-input');
const btnTriviaStart     = $('btn-trivia-start');
const triviaEyebrow      = $('trivia-eyebrow');
const triviaTitle        = $('trivia-title');
const triviaQuestionEl   = $('trivia-question');
const triviaOptionsEl    = $('trivia-options');
const triviaFeedbackEl   = $('trivia-feedback');
const triviaScoreEl      = $('trivia-score');
const triviaBarrioName   = $('trivia-barrio-name');
const triviaBarrioCorrect = $('trivia-barrio-correct');
const triviaPintxosEl    = $('trivia-pintxos');
const triviaFallosEl     = $('trivia-fallos');
const triviaCurrentNumEl = $('trivia-current-num');
const triviaTotalNumEl   = $('trivia-total-num');
const triviaTimerCountEl = $('trivia-timer-count');
const triviaCandleCanvas = $('trivia-candle-canvas');
const btnTriviaNext   = $('btn-trivia-next');

// ---- Vela temporizadora con Canvas ----
let candleAnimFrame = null;
let candleStartTime = 0;

function drawCandle(canvas, progress) {
  // progress: 1.0 = vela entera, 0.0 = vela apagada
  if (!canvas) return;
  const W = canvas.width;   // 80
  const H = canvas.height;  // 140
  const c = canvas.getContext('2d');
  if (!c) return;

  c.clearRect(0, 0, W, H);

  const candleW = 22;
  const candleX = (W - candleW) / 2;
  const maxWaxH = 90;       // altura máxima de la cera
  const baseY = H - 14;     // base de la vela

  const waxH = Math.max(4, maxWaxH * progress);
  const waxTop = baseY - waxH;

  // Sombra de la vela
  c.save();
  c.shadowColor = 'rgba(0,0,0,0.5)';
  c.shadowBlur = 8;
  c.shadowOffsetX = 3;

  // Cuerpo de la cera con gradiente
  const waxGrad = c.createLinearGradient(candleX, 0, candleX + candleW, 0);
  // Color cambia de blanco-crema a naranja oscuro según queda poco tiempo
  const r1 = Math.round(240 - (1 - progress) * 80);
  const g1 = Math.round(230 - (1 - progress) * 120);
  const b1 = Math.round(200 - (1 - progress) * 150);
  waxGrad.addColorStop(0, `rgb(${r1 - 30},${g1 - 30},${b1 - 30})`);
  waxGrad.addColorStop(0.4, `rgb(${r1},${g1},${b1})`);
  waxGrad.addColorStop(1, `rgb(${r1 - 40},${g1 - 40},${b1 - 50})`);

  c.fillStyle = waxGrad;
  c.beginPath();
  c.roundRect(candleX, waxTop, candleW, waxH, [4, 4, 2, 2]);
  c.fill();
  c.restore();

  // Mecha
  if (progress > 0.02) {
    const wickH = 10 + (1 - progress) * 4; // la mecha se alarga al consumirse
    c.save();
    c.strokeStyle = '#4a2c00';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(W / 2, waxTop);
    c.lineTo(W / 2 + 1, waxTop - wickH);
    c.stroke();
    c.restore();
  }

  // Llama (animada con oscilación senoidal)
  if (progress > 0.03) {
    const flameTime = (Date.now() / 300);
    const sway = Math.sin(flameTime * 2.1) * 2.5;
    const flicker = 0.85 + Math.sin(flameTime * 7.3) * 0.15;
    const flameH = (12 + progress * 8) * flicker;
    const flameW = 8 + progress * 4;
    const fx = W / 2 + sway;
    const fy = waxTop - (10 + (1 - progress) * 4) - flameH * 0.5;

    // Halo exterior
    const haloGrad = c.createRadialGradient(fx, fy + flameH * 0.3, 0, fx, fy, flameH * 1.4);
    haloGrad.addColorStop(0, `rgba(255,200,80,${0.25 * progress})`);
    haloGrad.addColorStop(1, 'rgba(255,100,0,0)');
    c.save();
    c.beginPath();
    c.ellipse(fx, fy + flameH * 0.3, flameW * 2.5, flameH * 2, 0, 0, Math.PI * 2);
    c.fillStyle = haloGrad;
    c.fill();
    c.restore();

    // Llama exterior naranja
    c.save();
    const outerGrad = c.createRadialGradient(fx, fy + flameH * 0.4, 0, fx, fy, flameH);
    outerGrad.addColorStop(0, `rgba(255,230,100,${flicker})`);
    outerGrad.addColorStop(0.5, `rgba(255,120,0,${0.9 * flicker})`);
    outerGrad.addColorStop(1, 'rgba(200,40,0,0)');
    c.beginPath();
    c.moveTo(fx, fy - flameH * 0.5);
    c.bezierCurveTo(fx + flameW, fy, fx + flameW * 0.6, fy + flameH * 0.7, fx, fy + flameH * 0.9);
    c.bezierCurveTo(fx - flameW * 0.6, fy + flameH * 0.7, fx - flameW, fy, fx, fy - flameH * 0.5);
    c.fillStyle = outerGrad;
    c.fill();
    c.restore();

    // Núcleo azul/blanco de la llama
    c.save();
    const coreGrad = c.createRadialGradient(fx, fy + flameH * 0.5, 0, fx, fy + flameH * 0.5, flameW * 0.6);
    coreGrad.addColorStop(0, `rgba(255,255,220,${flicker})`);
    coreGrad.addColorStop(0.5, `rgba(180,220,255,${0.7 * flicker})`);
    coreGrad.addColorStop(1, 'rgba(100,160,255,0)');
    c.beginPath();
    c.ellipse(fx, fy + flameH * 0.4, flameW * 0.4, flameH * 0.55, 0, 0, Math.PI * 2);
    c.fillStyle = coreGrad;
    c.fill();
    c.restore();
  } else {
    // Vela casi apagada — humo
    c.save();
    c.strokeStyle = 'rgba(200,200,200,0.4)';
    c.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.moveTo(W / 2 + i * 3 - 3, waxTop - 8);
      c.bezierCurveTo(W / 2 + i * 5, waxTop - 20, W / 2 - i * 4, waxTop - 32, W / 2 + i * 2, waxTop - 44);
      c.stroke();
    }
    c.restore();
  }

  // Base de la vela (platillo)
  c.save();
  c.fillStyle = '#6b4c1a';
  c.beginPath();
  c.ellipse(W / 2, baseY, candleW * 0.7 + 4, 5, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = '#8b6520';
  c.lineWidth = 1;
  c.stroke();
  c.restore();
}

function stopCandleAnimation() {
  if (candleAnimFrame) {
    cancelAnimationFrame(candleAnimFrame);
    candleAnimFrame = null;
  }
}

function startCandleAnimation(durationMs) {
  stopCandleAnimation();
  candleStartTime = Date.now();

  function loop() {
    const elapsed = Date.now() - candleStartTime;
    const progress = Math.max(0, 1 - elapsed / durationMs);
    drawCandle(triviaCandleCanvas, progress);
    if (progress > 0 && triviaTimerInterval !== null) {
      candleAnimFrame = requestAnimationFrame(loop);
    } else {
      drawCandle(triviaCandleCanvas, 0);
    }
  }
  candleAnimFrame = requestAnimationFrame(loop);
}

// ---- Síntesis de voz ----
let ttsUtterance = null;

function speakQuestion(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // cancela cualquier lectura previa

  ttsUtterance = new SpeechSynthesisUtterance(text);
  ttsUtterance.lang = 'es-ES';
  ttsUtterance.rate = 0.95;
  ttsUtterance.pitch = 1.05;
  // Intentar usar voz española si está disponible
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang.startsWith('es') && v.localService) ||
                  voices.find(v => v.lang.startsWith('es'));
  if (esVoice) ttsUtterance.voice = esVoice;

  window.speechSynthesis.speak(ttsUtterance);
}

function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function setDiceFace(element, value) {
  if (!element) return;
  const face = DICE_FACES[value - 1] || DICE_FACES[0];
  element.textContent = face;
  element.setAttribute('aria-label', `Dado ${value}`);
}

function setBoardMessage(html) {
  if (trivialBoardMessage) trivialBoardMessage.innerHTML = html;
}

function renderVitrina() {
  if (!trivialPintxoGrid) return;
  const unlocked = new Set(trivialGame.pintxos);
  trivialPintxoGrid.innerHTML = BARRIOS_TRIVIA.map((barrio, index) => {
    const isUnlocked = unlocked.has(index);
    return `<div class="pintxo-slot${isUnlocked ? ' unlocked' : ''}" title="${barrio.nombre}: ${barrio.pintxo.nombre}">
      ${pintxoArt(index, barrio, { locked: !isUnlocked })}
      <span>${barrio.nombre}</span>
    </div>`;
  }).join('');
  if (trivialVitrinaCount) trivialVitrinaCount.textContent = `${trivialGame.pintxos.length}/52`;
}

function renderTrivialBoard() {
  const index = trivialGame.position;
  const barrio = BARRIOS_TRIVIA[index];
  if (!barrio) return;

  if (trivialBoardSubtitle) {
    trivialBoardSubtitle.innerHTML = `Casilla <strong>${index + 1}</strong> · <strong>${barrio.nombre}</strong> <em>${barrio.lema}</em>`;
  }
  if (trivialBoardPintxos) trivialBoardPintxos.textContent = `${trivialGame.pintxos.length}/52`;
  if (trivialBoardFallos) trivialBoardFallos.textContent = `${trivialGame.fallos}/10`;
  if (trivialBoardAciertos) trivialBoardAciertos.textContent = String(totalAciertos(trivialGame));
  if (trivialBoardProgress) trivialBoardProgress.textContent = `${correctForBarrio(trivialGame, index)}/5`;

  if (trivialGame.lastRoll) {
    setDiceFace(trivialDie1, trivialGame.lastRoll.dice[0]);
    setDiceFace(trivialDie2, trivialGame.lastRoll.dice[1]);
  } else {
    setDiceFace(trivialDie1, 1);
    setDiceFace(trivialDie2, 1);
  }

  if (btnTrivialRoll) {
    btnTrivialRoll.disabled = trivialGame.phase !== 'board'
      || trivialGame.pintxos.length >= 52
      || trivialGame.fallos >= 10;
  }

  if (trivialBoardCanvas) {
    drawMedievalMap(trivialBoardCanvas, 1, {
      position: trivialGame.position,
      pintxos: trivialGame.pintxos,
    });
  }

  renderVitrina();
}

function updateTriviaHeader() {
  const index = trivialGame.position;
  const barrio = BARRIOS_TRIVIA[index];
  if (triviaBarrioName) triviaBarrioName.textContent = barrio ? barrio.nombre : '—';
  if (triviaBarrioCorrect) triviaBarrioCorrect.textContent = String(correctForBarrio(trivialGame, index));
  if (triviaPintxosEl) triviaPintxosEl.textContent = String(trivialGame.pintxos.length);
  if (triviaFallosEl) triviaFallosEl.textContent = String(trivialGame.fallos);
  if (triviaScoreEl) triviaScoreEl.textContent = String(totalAciertos(trivialGame));
}

function startTrivialGame() {
  stopTriviaTimer();
  clearTimeout(trivialReturnTimer);
  triviaAnswerLocked = false;
  trivialGame = createTrivialGame();
  triviaSession = { active: true, questions: [], currentIndex: 0 };
  setUiState('board');
  renderTrivialBoard();
  setBoardMessage(`¡Suerte, <strong>${escapeHtml(triviaPlayerName)}</strong>! Pulsa <strong>Lanzar dados</strong> para empezar el recorrido.`);
  audio.ui();
}

function showTriviaNameEntry() {
  if (triviaNameEntry) triviaNameEntry.classList.remove('hidden');
  if (triviaGamePanel) triviaGamePanel.classList.add('hidden');
  if (btnTriviaNext) btnTriviaNext.classList.add('hidden');
  if (triviaPlayerInput) {
    triviaPlayerInput.value = '';
    setTimeout(() => triviaPlayerInput.focus(), 150);
  }
}

function startTrivia() {
  stopTriviaTimer();
  triviaSession = { active: true, questions: [], currentIndex: 0 };
  audio.ui();
  setUiState('trivia');
  showTriviaNameEntry();
}

function beginTriviaGame() {
  triviaPlayerName = (triviaPlayerInput?.value || '').trim() || 'Jugadora';
  if (triviaNameEntry) triviaNameEntry.classList.add('hidden');
  startTrivialGame();
}

function openTrivialRound() {
  if (trivialGame.phase !== 'board') return;
  const index = trivialGame.position;
  const barrio = BARRIOS_TRIVIA[index];
  if (!barrio) return;

  const result = beginRound(trivialGame, barrio.preguntas, BILBAO_GENERAL, BILBAO_HISTORIA);
  if (!result.questions.length) {
    renderTrivialBoard();
    return;
  }

  trivialGame = result.state;
  triviaSession = {
    active: true,
    questions: result.questions,
    currentIndex: 0,
  };
  triviaAnswerLocked = false;

  if (triviaNameEntry) triviaNameEntry.classList.add('hidden');
  if (triviaGamePanel) triviaGamePanel.classList.remove('hidden');
  if (triviaEyebrow) triviaEyebrow.textContent = `Ronda en ${barrio.nombre}`;
  if (triviaTitle) triviaTitle.textContent = `🧠 ${barrio.nombre}`;

  setUiState('trivia');
  updateTriviaHeader();
  drawCandle(triviaCandleCanvas, 1.0);
  renderTriviaQuestion();
}

function returnToBoard(message) {
  stopTriviaTimer();
  clearTimeout(trivialReturnTimer);
  triviaAnswerLocked = false;

  if (trivialGame.phase === 'won') {
    showTrivialEnd(true);
    return;
  }
  if (trivialGame.phase === 'lost') {
    showTrivialEnd(false);
    return;
  }

  setUiState('board');
  renderTrivialBoard();
  setBoardMessage(message);
}

function showTrivialEnd(victory) {
  stopTriviaTimer();
  clearTimeout(trivialReturnTimer);
  triviaAnswerLocked = false;
  setUiState('trivialend');

  const pintxos = trivialGame.pintxos.length;
  if (trivialEndTitle) {
    trivialEndTitle.textContent = victory ? '🏆 ¡Has conquistado el Botxo!' : '💀 Te has quedado sin intentos';
  }
  if (trivialEndText) {
    trivialEndText.textContent = victory
      ? `Has reunido los 52 pintxos de Bilbao. El Botxo entero es tuyo, ${triviaPlayerName}.`
      : `Has conseguido ${pintxos} de 52 pintxos antes de llegar a los 10 fallos. El Botxo aún guarda secretos.`;
  }
  if (trivialEndPintxos) trivialEndPintxos.textContent = `${pintxos}/52`;
  if (trivialEndFallos) trivialEndFallos.textContent = `${trivialGame.fallos}/10`;
  if (trivialEndAciertos) trivialEndAciertos.textContent = String(totalAciertos(trivialGame));
  if (trivialEndBarrios) trivialEndBarrios.textContent = `${pintxos}/52`;
  if (btnTrivialEndMenu) btnTrivialEndMenu.textContent = 'Volver al menú';

  if (victory) audio.heal();
  else audio.hurt();
}

function leaveTrivial() {
  stopTriviaTimer();
  clearTimeout(trivialReturnTimer);
  triviaAnswerLocked = false;
  startTrivia();
}

function rollTrivialDice() {
  if (trivialGame.phase !== 'board') return;
  if (btnTrivialRoll && btnTrivialRoll.disabled) return;
  if (btnTrivialRoll) btnTrivialRoll.disabled = true;

  const dice = rollDice();
  setBoardMessage('Los dados ruedan por el Botxo...');
  trivialDie1?.classList.add('rolling');
  trivialDie2?.classList.add('rolling');

  let ticks = 0;
  const spin = setInterval(() => {
    setDiceFace(trivialDie1, 1 + Math.floor(Math.random() * 6));
    setDiceFace(trivialDie2, 1 + Math.floor(Math.random() * 6));
    ticks += 1;
    if (ticks >= 9) {
      clearInterval(spin);
      trivialDie1?.classList.remove('rolling');
      trivialDie2?.classList.remove('rolling');
      setDiceFace(trivialDie1, dice[0]);
      setDiceFace(trivialDie2, dice[1]);
      finalizeTrivialRoll(dice);
    }
  }, 65);
}

function finalizeTrivialRoll(dice) {
  trivialGame = advanceWithDice(trivialGame, dice);
  renderTrivialBoard();
  if (btnTrivialRoll) btnTrivialRoll.disabled = true;

  const index = trivialGame.position;
  const barrio = BARRIOS_TRIVIA[index];

  if (barrioIsComplete(trivialGame, index)) {
    setBoardMessage(`Has caído en <strong>${barrio.nombre}</strong>, que ya tiene su pintxo. ¡Vuelve a lanzar los dados!`);
    if (btnTrivialRoll) btnTrivialRoll.disabled = false;
    audio.ui();
    return;
  }

  const need = Math.min(QUESTIONS_PER_VISIT, questionsNeeded(trivialGame, index));
  setBoardMessage(`Has caído en <strong>${barrio.nombre}</strong>. Te esperan <strong>${need}</strong> pregunta${need === 1 ? '' : 's'} para conquistar su pintxo.`);
  audio.ui();
  trivialReturnTimer = setTimeout(openTrivialRound, 1100);
}

function stopTriviaTimer() {
  if (triviaTimerInterval) {
    clearInterval(triviaTimerInterval);
    triviaTimerInterval = null;
  }
  stopCandleAnimation();
  stopSpeech();
}

function startTriviaTimer() {
  if (triviaTimerInterval) {
    clearInterval(triviaTimerInterval);
    triviaTimerInterval = null;
  }
  stopCandleAnimation();
  if (triviaTimerCountEl) triviaTimerCountEl.textContent = String(Math.round(TRIVIA_DURATION_MS / 1000));

  const startTime = Date.now();

  triviaTimerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remainingMs = Math.max(0, TRIVIA_DURATION_MS - elapsed);
    const sec = Math.ceil(remainingMs / 1000);
    if (triviaTimerCountEl) triviaTimerCountEl.textContent = String(sec);

    if (remainingMs <= 0) {
      stopTriviaTimer();
      handleTriviaTimeout();
    }
  }, 100);

  // Iniciar animación de la vela
  startCandleAnimation(TRIVIA_DURATION_MS);
}

function handleTriviaTimeout() {
  submitTriviaAnswer(null);
}

function renderTriviaQuestion() {
  const current = triviaSession.questions[triviaSession.currentIndex];
  if (!current) return;

  triviaAnswerLocked = false;
  if (triviaCurrentNumEl) triviaCurrentNumEl.textContent = String(triviaSession.currentIndex + 1);
  if (triviaTotalNumEl) triviaTotalNumEl.textContent = String(triviaSession.questions.length);
  updateTriviaHeader();

  triviaQuestionEl.textContent = current.q;
  triviaFeedbackEl.classList.add('hidden');
  triviaFeedbackEl.textContent = '';
  if (btnTriviaNext) btnTriviaNext.classList.add('hidden');

  triviaOptionsEl.innerHTML = current.opts.map((opt, idx) => `
    <button class="trivia-opt-btn" type="button" data-idx="${idx}">${opt}</button>
  `).join('');

  triviaOptionsEl.querySelectorAll('.trivia-opt-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      submitTriviaAnswer(Number(btn.dataset.idx));
    });
  });

  if (window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speakQuestion(current.q);
      };
    } else {
      speakQuestion(current.q);
    }
  }

  startTriviaTimer();
}

function submitTriviaAnswer(selectedIdx) {
  if (triviaAnswerLocked) return;
  triviaAnswerLocked = true;
  stopTriviaTimer();

  const current = triviaSession.questions[triviaSession.currentIndex];
  if (!current) return;

  const isTimeout = selectedIdx === null || selectedIdx === undefined;
  const isCorrect = !isTimeout && selectedIdx === current.ans;
  const buttons = triviaOptionsEl.querySelectorAll('.trivia-opt-btn');
  buttons.forEach((button) => (button.disabled = true));

  if (isTimeout) {
    drawCandle(triviaCandleCanvas, 0);
    audio.hurt();
    buttons[current.ans]?.classList.add('correct');
    triviaFeedbackEl.innerHTML = `<strong>¡Tiempo agotado! 🕯️</strong> La respuesta era <em>${current.opts[current.ans]}</em>. ${current.info}`;
  } else if (isCorrect) {
    audio.heal();
    buttons[selectedIdx]?.classList.add('correct');
    triviaFeedbackEl.innerHTML = `<strong>¡Correcto! ⭐</strong> ${current.info}`;
  } else {
    audio.hurt();
    buttons[selectedIdx]?.classList.add('wrong');
    buttons[current.ans]?.classList.add('correct');
    triviaFeedbackEl.innerHTML = `<strong>¡Casi! ❌</strong> La correcta era <em>${current.opts[current.ans]}</em>. ${current.info}`;
  }
  triviaFeedbackEl.classList.remove('hidden');

  const result = answerQuestion(trivialGame, isCorrect);
  trivialGame = result.state;
  if (trivialGame.round) {
    triviaSession.currentIndex = trivialGame.round.index;
  }
  updateTriviaHeader();

  const barrio = BARRIOS_TRIVIA[result.barrio ?? trivialGame.position];

  if (result.event === 'lost') {
    triviaFeedbackEl.innerHTML += '<br><strong>Has llegado a 10 fallos.</strong>';
    setTimeout(() => showTrivialEnd(false), 1400);
    return;
  }

  if (result.event === 'won') {
    triviaFeedbackEl.innerHTML += '<br><strong>¡Has reunido los 52 pintxos!</strong>';
    setTimeout(() => showTrivialEnd(true), 1400);
    return;
  }

  if (result.event === 'pintxo') {
    triviaFeedbackEl.innerHTML += `<br><strong>¡Pintxo conseguido! ${barrio.pintxo.nombre}</strong>`;
    const message = `¡Has conquistado <strong>${barrio.nombre}</strong>! Pintxo: <strong>${barrio.pintxo.nombre}</strong>.`;
    setTimeout(() => returnToBoard(message), 1600);
    return;
  }

  if (result.event === 'roundEnd') {
    const index = trivialGame.round?.barrio ?? trivialGame.position;
    const message = `Ronda terminada en <strong>${barrio.nombre}</strong>. Progreso del barrio: <strong>${correctForBarrio(trivialGame, index)}/5</strong>.`;
    setTimeout(() => returnToBoard(message), 1400);
    return;
  }

  if (btnTriviaNext) btnTriviaNext.classList.remove('hidden');
}

// -----------------------------------------------------------------
// Eventos de la interfaz
// -----------------------------------------------------------------
if (btnTriviaStart) {
  btnTriviaStart.addEventListener('click', () => {
    audio.ui();
    beginTriviaGame();
  });
}

// Permitir Enter en el input de nombre para comenzar
if (triviaPlayerInput) {
  triviaPlayerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      audio.ui();
      beginTriviaGame();
    }
  });
}

if (btnTriviaNext) {
  btnTriviaNext.addEventListener('click', () => {
    if (trivialGame.round) triviaSession.currentIndex = trivialGame.round.index;
    audio.ui();
    renderTriviaQuestion();
  });
}

if (btnTrivialRoll) {
  btnTrivialRoll.addEventListener('click', (e) => {
    e.preventDefault();
    rollTrivialDice();
  });
}

if (btnTrivialBoardMenu) {
  btnTrivialBoardMenu.addEventListener('click', (e) => {
    e.preventDefault();
    audio.ui();
    leaveTrivial();
  });
}

if (btnTrivialEndAgain) {
  btnTrivialEndAgain.addEventListener('click', (e) => {
    e.preventDefault();
    startTrivialGame();
  });
}

if (btnTrivialEndMenu) {
  btnTrivialEndMenu.addEventListener('click', (e) => {
    e.preventDefault();
    audio.ui();
    leaveTrivial();
  });
}

window.addEventListener('keydown', (event) => {
  const code = event.code;
  const boardVisible = !trivialBoardScreenHidden();
  if (boardVisible && (code === 'Enter' || code === 'Space')) {
    event.preventDefault();
    rollTrivialDice();
  }
});

function trivialBoardScreenHidden() {
  const el = $('trivial-board-screen');
  return !el || el.classList.contains('hidden');
}

// Arranque: mostrar la captura de nombre.
setUiState('trivia');
showTriviaNameEntry();
