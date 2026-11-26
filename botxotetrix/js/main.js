// main.js — Bucle, estados, controles e interfaz de BotxoTetrix.
import {
  CASAS,
  createGameState,
  gravityMs,
  hardDrop,
  levelInfo,
  movePiece,
  rotatePiece,
  softDrop,
  startGame,
  tick,
} from './core.js';
import { createRenderer } from './render.js';
import { createAudio } from './audio.js';
import {
  fetchTopScores,
  getBestLocalScore,
  subscribeToScores,
  submitScore,
} from './scores.js';

const $ = (id) => document.getElementById(id);

const canvas = $('game-canvas');
const renderer = createRenderer(canvas);
const audio = createAudio(false);

let state = createGameState({ seed: Date.now() & 0xffffffff });
let acc = 0;
let lastTs = 0;
let rafId = 0;
let bannerTimer = 0;

function show(id) {
  const el = $(id);
  if (el) el.classList.remove('hidden');
}

function hide(id) {
  const el = $(id);
  if (el) el.classList.add('hidden');
}

function showOnly(overlayIds) {
  ['menu-screen', 'howto-screen', 'pause-screen', 'gameover-screen', 'scores-screen'].forEach((id) => {
    if (overlayIds.includes(id)) show(id);
    else hide(id);
  });
}

function updateHud() {
  $('hud-level').textContent = String(state.level);
  $('hud-lines').textContent = String(state.lines);
  $('hud-score').textContent = String(state.score);
  const type = state.piece && state.piece.type;
  const casa = type ? CASAS[type] : null;
  $('hud-casa-name').textContent = casa ? `${casa.emoji} ${casa.casa}` : '—';
}

function showLevelBanner() {
  const info = levelInfo(state.level);
  $('level-eyebrow').textContent = `NIVEL ${info.nivel}`;
  $('level-name').textContent = info.nombre;
  $('level-motto').textContent = info.lema;
  show('level-banner');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => hide('level-banner'), 2200);
}

function onLevelMaybeChanged(prevLevel) {
  if (state.level !== prevLevel) {
    showLevelBanner();
    audio.levelUp();
  }
}

function loop(ts) {
  rafId = requestAnimationFrame(loop);
  if (!lastTs) lastTs = ts;
  const dt = ts - lastTs;
  lastTs = ts;

  if (state.status === 'playing') {
    acc += dt;
    const interval = gravityMs(state.level);
    while (acc >= interval) {
      acc -= interval;
      const prev = state.level;
      const beforeLines = state.lines;
      tick(state);
      if (state.lines > beforeLines) {
        audio.lineClear(state.lastClear || 1);
        onLevelMaybeChanged(prev);
      }
      if (state.status === 'over') {
        onGameOver();
        break;
      }
    }
  }

  updateHud();
  renderer.render(state);
}

function startPartida() {
  state = createGameState({ seed: (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0 });
  startGame(state);
  acc = 0;
  lastTs = 0;
  $('hud').classList.remove('hidden');
  showOnly([]);
  showLevelBanner();
  audio.resume();
  audio.ui();
}

function onGameOver() {
  audio.gameOver();
  $('final-score').textContent = String(state.score);
  $('final-lines').textContent = String(state.lines);
  $('final-level').textContent = String(state.level);
  $('save-status').textContent = '';
  $('btn-save-score').disabled = false;
  $('btn-save-score').textContent = '🏆 Guardar en el Códice';
  showOnly(['gameover-screen']);
}

function pauseGame() {
  if (state.status !== 'playing') return;
  state.status = 'paused';
  showOnly(['pause-screen']);
  audio.ui();
}

function resumeGame() {
  if (state.status !== 'paused') return;
  state.status = 'playing';
  acc = 0;
  lastTs = 0;
  showOnly([]);
  audio.ui();
}

function quitGame() {
  state.status = 'ready';
  state.piece = null;
  $('hud').classList.add('hidden');
  $('menu-best-score').textContent = String(getBestLocalScore());
  showOnly(['menu-screen']);
  audio.ui();
}

function openScores() {
  showOnly(['scores-screen']);
  loadScores();
  audio.ui();
}

async function loadScores() {
  const tbody = $('scores-table-body');
  tbody.innerHTML = '<tr><td colspan="5" style="color:#bcb29c;">Cargando…</td></tr>';
  const { isLive, scores } = await fetchTopScores(25);
  const badge = $('scores-live-badge');
  badge.textContent = isLive ? '● EN VIVO' : '● LOCAL';
  badge.classList.toggle('is-local', !isLive);
  if (!scores.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:#bcb29c;">Aún no hay cronistas en el Códice.</td></tr>';
    return;
  }
  tbody.innerHTML = scores.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(s.player_name || '—')}</td>
      <td><b>${Number(s.score) || 0}</b></td>
      <td>${Number(s.lines) || 0}</td>
      <td>${Number(s.level) || 1}</td>
    </tr>
  `).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function saveScore() {
  const name = ($('player-name').value || '').trim() || 'Maestre anónimo';
  const btn = $('btn-save-score');
  btn.disabled = true;
  btn.textContent = 'Enviando…';
  const result = await submitScore({
    playerName: name,
    score: state.score,
    lines: state.lines,
    level: state.level,
  });
  $('save-status').textContent = result.isLive
    ? '✅ Grabado en el Códice del Reino (en vivo).'
    : '📜 Grabado en local (sin conexión al Códice).';
  btn.textContent = '✅ Guardado';
}

// ---------- Controles de teclado ----------

function onKeyDown(e) {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

  const key = e.key;
  if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(key)) {
    e.preventDefault();
  }

  // Overlays de menú
  if (!$('menu-screen').classList.contains('hidden')) {
    if (key === 'Enter') startPartida();
    return;
  }
  if (!$('howto-screen').classList.contains('hidden')) {
    if (key === 'Escape') showOnly(['menu-screen']);
    return;
  }
  if (!$('scores-screen').classList.contains('hidden')) {
    if (key === 'Escape') showOnly(['menu-screen']);
    return;
  }
  if (!$('pause-screen').classList.contains('hidden')) {
    if (key === 'Escape' || key === 'p' || key === 'P') resumeGame();
    return;
  }
  if (!$('gameover-screen').classList.contains('hidden')) {
    if (key === 'Enter') startPartida();
    return;
  }

  if (state.status === 'paused') {
    if (key === 'Escape' || key === 'p' || key === 'P') resumeGame();
    return;
  }
  if (state.status !== 'playing') return;

  switch (key) {
    case 'ArrowLeft':
      if (movePiece(state, -1, 0)) audio.move();
      break;
    case 'ArrowRight':
      if (movePiece(state, 1, 0)) audio.move();
      break;
    case 'ArrowDown':
      if (softDrop(state)) audio.softDrop();
      break;
    case 'ArrowUp':
    case 'x':
    case 'X':
      if (rotatePiece(state, 1)) audio.rotate();
      break;
    case 'z':
    case 'Z':
      if (rotatePiece(state, -1)) audio.rotate();
      break;
    case ' ':
      hardDrop(state);
      audio.hardDrop();
      break;
    case 'Escape':
    case 'p':
    case 'P':
      pauseGame();
      break;
    default:
      break;
  }
}

// ---------- Controles táctiles ----------

function bindRepeat(btnId, fn, delay = 160, first = 140) {
  const btn = $(btnId);
  if (!btn) return;
  let timer = 0;
  let interval = 0;

  const stop = () => {
    clearTimeout(timer);
    clearInterval(interval);
    timer = 0;
    interval = 0;
  };

  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    audio.resume();
    fn();
    timer = setTimeout(() => {
      interval = setInterval(fn, delay);
    }, first);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => {
    btn.addEventListener(ev, stop);
  });
}

function bindControls() {
  bindRepeat('btn-left', () => {
    if (state.status === 'playing' && movePiece(state, -1, 0)) audio.move();
  });
  bindRepeat('btn-right', () => {
    if (state.status === 'playing' && movePiece(state, 1, 0)) audio.move();
  });
  bindRepeat('btn-down', () => {
    if (state.status === 'playing' && softDrop(state)) audio.softDrop();
  }, 80, 90);

  const rot = $('btn-rotate');
  if (rot) {
    rot.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (state.status === 'playing' && rotatePiece(state, 1)) audio.rotate();
    });
  }
  const drop = $('btn-drop');
  if (drop) {
    drop.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (state.status === 'playing') {
        hardDrop(state);
        audio.hardDrop();
      }
    });
  }
}

function bindUi() {
  $('btn-play').addEventListener('click', startPartida);
  $('btn-howto').addEventListener('click', () => { showOnly(['howto-screen']); audio.ui(); });
  $('btn-howto-back').addEventListener('click', () => { showOnly(['menu-screen']); audio.ui(); });
  $('btn-menu-scores').addEventListener('click', openScores);
  $('btn-scores-close').addEventListener('click', () => { showOnly(['menu-screen']); audio.ui(); });
  $('btn-scores-refresh').addEventListener('click', loadScores);
  $('btn-pause').addEventListener('click', pauseGame);
  $('btn-resume').addEventListener('click', resumeGame);
  $('btn-quit').addEventListener('click', quitGame);
  $('btn-retry').addEventListener('click', startPartida);
  $('btn-gameover-menu').addEventListener('click', quitGame);
  $('btn-save-score').addEventListener('click', saveScore);

  const soundBtn = $('btn-sound');
  soundBtn.addEventListener('click', () => {
    const muted = audio.toggleMuted();
    soundBtn.textContent = muted ? '🔇 Sonido' : '🔊 Sonido';
    soundBtn.setAttribute('aria-pressed', String(!muted));
    if (!muted) audio.ui();
  });

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', () => renderer.resize());

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.status === 'playing') pauseGame();
  });
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

function init() {
  bindUi();
  bindControls();
  $('menu-best-score').textContent = String(getBestLocalScore());
  $('hud').classList.add('hidden');
  showOnly(['menu-screen']);
  renderer.render(state);
  registerSW();

  // Realtime del Códice si está visible más adelante.
  subscribeToScores(() => {
    if (!$('scores-screen').classList.contains('hidden')) loadScores();
  });

  rafId = requestAnimationFrame(loop);
}

init();

// Limpieza al recargar en iframe.
window.addEventListener('pagehide', () => {
  if (rafId) cancelAnimationFrame(rafId);
});
