import {
  HEROES,
  THEMES,
  animateIdle,
  buyDendaOffer,
  continueLevelWithHearts,
  createGameState,
  equipRanged,
  getMilestoneLevel,
  itemAvailable,
  nextLevel,
  setWorldWidth,
  step,
} from './core.js';
import { fitCanvas, render, drawHero, drawHeroPortrait } from './render.js';
import { loadProfile, recordRun, saveProfile } from './storage.js';
import { fetchTopScores, submitScore, subscribeToScores } from './scores.js';
import { createAudio } from './audio.js';

const $ = (id) => document.getElementById(id);

const canvas = $('game-canvas');
const ctx = canvas.getContext('2d', { alpha: false });

const hud = $('hud');
const hudLevel = $('hud-level');
const hudCoins = $('hud-coins');
const hudScore = $('hud-score');
const hudHearts = $('hud-hearts');
const levelBanner = $('level-banner');
const levelEyebrow = $('level-eyebrow');
const levelName = $('level-name');
const levelMotto = $('level-motto');

const menuScreen = $('menu-screen');
const heroSelectScreen = $('hero-select-screen');
const howtoScreen = $('howto-screen');
const pauseScreen = $('pause-screen');
const gameoverScreen = $('gameover-screen');
const levelclearScreen = $('levelclear-screen');
const dendaScreen = $('denda-screen');
const mapScreen = $('map-screen');
const scoresScreen = $('scores-screen');
const creditsScreen = $('credits-screen');

const btnMenuScores = $('btn-menu-scores');
const btnScoresClose = $('btn-scores-close');
const btnScoresRefresh = $('btn-scores-refresh');
const scoresTableBody = $('scores-table-body');
const scoresLiveBadge = $('scores-live-badge');
const btnSubmitScore = $('btn-submit-score');
const scorePlayerNameInput = $('score-player-name');
const scoreSubmitFeedback = $('score-submit-feedback');

const menuBestScore = $('menu-best-score');
const menuBestLevel = $('menu-best-level');
const menuTotalCoins = $('menu-total-coins');
const menuTotalRuns = $('menu-total-runs');

const btnSound = $('btn-sound');
const btnMotion = $('btn-motion');

const resultScore = $('result-score');
const resultLevel = $('result-level');
const resultCoins = $('result-coins');
const resultBest = $('result-best');
const resultTheme = $('result-theme');
const resultRecord = $('result-record');

const btnContinueLevel = $('btn-continue-level');
const continueLevelNum = $('continue-level-num');
const btnRestartMilestone = $('btn-restart-milestone');
const milestoneLevelNum = $('milestone-level-num');
const btnRestartRun = $('btn-restart-run');
const btnPlayMilestone = $('btn-play-milestone');
const menuMilestoneNum = $('menu-milestone-num');
const btnMenuMap = $('btn-menu-map');
const btnMenuCredits = $('btn-menu-credits');
const btnCreditsMenu = $('btn-credits-menu');

const pauseLevel = $('pause-level');
const pauseCoins = $('pause-coins');
const pauseScore = $('pause-score');

const clearLevel = $('clear-level');
const clearCoins = $('clear-coins');
const clearScore = $('clear-score');
const clearBonus = $('clear-bonus');

const dendaCoins = $('denda-coins');
const dendaHearts = $('denda-hearts');
const dendaOffers = $('denda-offers');
const dendaMessage = $('denda-message');
const dendaTitle = $('denda-title');

const btnAttack = $('btn-attack');
const btnShoot = $('btn-shoot');
const actionPad = $('action-pad');
const btnSwap = $('btn-swap-weapon');
const swapLabel = $('swap-label');

const prefersReducedMotionQuery = window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

const FIXED_STEP = 1 / 60;

let profile = loadProfile();
const audio = createAudio(profile.muted);

let selectedHeroId = profile.heroId || 'aritza';

let view = fitCanvas(canvas);
let game = createGameState({ worldWidth: view.logicalWidth, level: 1, heroId: selectedHeroId });
let uiState = 'menu';
let runActive = false;
let accumulator = 0;
let lastTime = performance.now();
let bannerTimeout = null;
let pendingLevelReward = 0;

const input = {
  left: false,
  right: false,
  jumpHeld: false,
  jumpQueued: false,
  attackQueued: false,
  shootQueued: false,
  dashQueued: false,
};

let lastDirectionTap = { left: -1000, right: -1000 };

function animationsEnabled() {
  const systemReduced = prefersReducedMotionQuery ? prefersReducedMotionQuery.matches : false;
  return !profile.reducedMotion && !systemReduced;
}

function resetInput() {
  input.left = false;
  input.right = false;
  input.jumpHeld = false;
  input.jumpQueued = false;
  input.attackQueued = false;
  input.shootQueued = false;
  input.dashQueued = false;
}

function registerDirectionTap(direction) {
  const now = performance.now();
  if (now - lastDirectionTap[direction] < 240) {
    if (game.upgrades.dash) input.dashQueued = true;
    lastDirectionTap[direction] = -1000;
  } else {
    lastDirectionTap[direction] = now;
  }
}

function updateActionButtons() {
  if (!btnAttack || !btnShoot) return;
  const hasSword = game.weapons.sword;
  const ranged = game.weapons.equipped;
  btnAttack.classList.toggle('hidden', !hasSword);
  btnShoot.classList.toggle('hidden', !ranged);
  actionPad.classList.toggle('has-melee', hasSword);
  actionPad.classList.toggle('has-ranged', Boolean(ranged));
  if (ranged) {
    btnShoot.querySelector('.touch-arrow').textContent =
      ranged === 'bow' ? '🏹' : '🗡';
    btnShoot.setAttribute(
      'aria-label',
      ranged === 'bow' ? 'Disparar flecha' : 'Lanzar puñal'
    );
  }
  const bothRanged = game.weapons.bow && game.weapons.daggers;
  if (btnSwap) btnSwap.classList.toggle('hidden', !bothRanged);
  if (swapLabel) {
    swapLabel.textContent = ranged === 'bow' ? 'Arco' : 'Puñales';
  }
}

function swapRanged() {
  if (!(game.weapons.bow && game.weapons.daggers)) return;
  equipRanged(game, game.weapons.equipped === 'bow' ? 'daggers' : 'bow');
  updateActionButtons();
  audio.ui();
}

function updateSoundButton() {
  const on = !profile.muted;
  btnSound.textContent = on ? '🔊 Sonido' : '🔇 Silencio';
  btnSound.setAttribute('aria-pressed', String(on));
}

function updateMotionButton() {
  const on = !profile.reducedMotion;
  btnMotion.textContent = on ? '✨ Animación' : '🌙 Sin animación';
  btnMotion.setAttribute('aria-pressed', String(on));
}

function updateMenuStats() {
  menuBestScore.textContent = profile.bestScore.toLocaleString('es-ES');
  menuBestLevel.textContent = String(Math.max(1, profile.bestLevel));
  menuTotalCoins.textContent = profile.totalCoins.toLocaleString('es-ES');
  menuTotalRuns.textContent = profile.totalRuns.toLocaleString('es-ES');

  const milestone = getMilestoneLevel(profile.bestLevel);
  if (btnPlayMilestone) {
    const canMilestone = milestone > 1;
    btnPlayMilestone.classList.toggle('hidden', !canMilestone);
    if (menuMilestoneNum) menuMilestoneNum.textContent = String(milestone);
  }
}

function showOverlay(target) {
  if (heroSelectScreen) heroSelectScreen.classList.toggle('hidden', target !== 'heroselect');
  menuScreen.classList.toggle('hidden', target !== 'menu');
  howtoScreen.classList.toggle('hidden', target !== 'howto');
  pauseScreen.classList.toggle('hidden', target !== 'pause');
  gameoverScreen.classList.toggle('hidden', target !== 'over');
  levelclearScreen.classList.toggle('hidden', target !== 'levelclear');
  dendaScreen.classList.toggle('hidden', target !== 'denda');
  if (mapScreen) mapScreen.classList.toggle('hidden', target !== 'map');
  if (scoresScreen) scoresScreen.classList.toggle('hidden', target !== 'scores');
  if (creditsScreen) creditsScreen.classList.toggle('hidden', target !== 'credits');
  hud.classList.toggle('hidden', target !== 'playing' && target !== 'paused');
}

function syncMusic() {
  if (uiState === 'playing' && !profile.muted) audio.startMusic();
  else audio.stopMusic();
}

function setUiState(next) {
  uiState = next;
  if (next === 'menu') showOverlay('menu');
  else if (next === 'heroselect') showOverlay('heroselect');
  else if (next === 'howto') showOverlay('howto');
  else if (next === 'paused') showOverlay('pause');
  else if (next === 'over') showOverlay('over');
  else if (next === 'levelclear') showOverlay('levelclear');
  else if (next === 'denda') showOverlay('denda');
  else if (next === 'map') showOverlay('map');
  else if (next === 'scores') showOverlay('scores');
  else if (next === 'credits') showOverlay('credits');
  else showOverlay('playing');
  syncMusic();
}

function updateHud() {
  hudLevel.textContent = String(game.level);
  hudCoins.textContent = String(game.coins);
  hudScore.textContent = game.score.toLocaleString('es-ES');
  const maxHearts = game.player.maxHearts;
  const hearts = Math.max(0, Math.min(maxHearts, game.player.hearts));
  hudHearts.textContent = '❤'.repeat(hearts) + '♡'.repeat(Math.max(0, maxHearts - hearts));
  hudHearts.setAttribute('aria-label', `${hearts} de ${maxHearts} corazones`);
}

function showLevelBanner() {
  const theme = THEMES[game.themeIndex] || THEMES[0];
  levelEyebrow.textContent = `NIVEL ${game.level}`;
  levelName.textContent = theme.nombre;
  levelMotto.textContent = theme.lema;
  levelBanner.classList.remove('hidden');
  levelBanner.style.animation = 'none';
  void levelBanner.offsetWidth;
  levelBanner.style.animation = '';
  clearTimeout(bannerTimeout);
  bannerTimeout = setTimeout(() => levelBanner.classList.add('hidden'), 2400);
}

function processEvents(events) {
  for (const event of events) {
    switch (event.type) {
      case 'jump':
        audio.jump();
        break;
      case 'airjump':
        audio.airjump();
        break;
      case 'dash':
        audio.dash();
        break;
      case 'coin':
        audio.coin();
        break;
      case 'stomp':
        audio.stomp();
        break;
      case 'slash':
        audio.slash();
        break;
      case 'shoot':
        audio.shoot(event.weapon);
        break;
      case 'shieldblock':
        audio.shieldblock();
        break;
      case 'enemyhit':
        audio.enemyhit();
        break;
      case 'enemydeath':
        audio.enemydeath(event.enemy);
        break;
      case 'enemyshoot':
        audio.bow();
        break;
      case 'hurt':
        audio.hurt();
        break;
      case 'revive':
        audio.revive();
        break;
      case 'denda-heal':
        audio.heal();
        break;
      case 'denda':
        openDenda();
        break;
      case 'goal':
        pendingLevelReward = event.reward;
        audio.goal();
        handleLevelClear();
        break;
      case 'gameover':
        handleGameOver();
        break;
      default:
        break;
    }
  }
}

function finishRun() {
  if (!runActive) return { isBestScore: false };
  const result = recordRun(profile, {
    score: game.score,
    level: game.level,
    coinsCollected: game.coinsCollected,
  });
  profile = result.profile;
  saveProfile(profile);
  runActive = false;
  updateMenuStats();
  return result;
}

function handleGameOver() {
  if (uiState === 'over') return;
  const currentLvl = game.level;
  const record = finishRun();

  resultScore.textContent = game.score.toLocaleString('es-ES');
  resultLevel.textContent = String(currentLvl);
  resultCoins.textContent = String(game.coinsCollected);
  resultBest.textContent = profile.bestScore.toLocaleString('es-ES');
  resultTheme.textContent = (THEMES[game.themeIndex] || THEMES[0]).nombre;
  const hasRecord = record.isBestScore || record.isBestLevel;
  resultRecord.textContent = record.isBestScore ? '¡Nuevo récord!' : '¡Mejor nivel!';
  resultRecord.classList.toggle('hidden', !hasRecord);

  if (continueLevelNum) {
    continueLevelNum.textContent = String(currentLvl);
  }

  const milestone = getMilestoneLevel(currentLvl);
  if (btnRestartMilestone) {
    const hasMilestone = milestone > 1;
    btnRestartMilestone.classList.toggle('hidden', !hasMilestone);
    if (milestoneLevelNum) milestoneLevelNum.textContent = String(milestone);
  }

  setUiState('over');
  audio.gameOver();

  if (scoreSubmitFeedback) {
    scoreSubmitFeedback.classList.add('hidden');
    scoreSubmitFeedback.textContent = '';
  }
  if (btnSubmitScore) btnSubmitScore.disabled = false;
}

function handleLevelClear() {
  if (uiState !== 'playing') return;
  finishRun();
  if (game.level >= 52) {
    showCredits();
    return;
  }
  clearLevel.textContent = String(game.level);
  clearCoins.textContent = String(game.coins);
  clearScore.textContent = game.score.toLocaleString('es-ES');
  clearBonus.textContent = `+${pendingLevelReward.toLocaleString('es-ES')}`;

  setUiState('levelclear');
}

function renderDenda() {
  const denda = game.world.denda;
  if (!denda || !denda.offers) return;

  dendaCoins.textContent = String(game.coins);
  const maxHearts = game.player.maxHearts;
  const hearts = Math.max(0, Math.min(maxHearts, game.player.hearts));
  dendaHearts.textContent = '❤'.repeat(hearts) + '♡'.repeat(maxHearts - hearts);

  const labels = { pintxo: 'Pintxo', pocima: 'Pócima', equipo: 'Equipo' };
  dendaOffers.innerHTML = denda.offers
    .map((offer) => {
      const available = itemAvailable(game, offer);
      const disabled = offer.sold || !available || game.coins < offer.price;
      const buttonText = offer.sold
        ? 'Comprado'
        : !available
          ? 'No disponible'
          : 'Comprar';
      const classes = [
        'denda-card',
        offer.sold ? 'is-sold' : '',
        !available && !offer.sold ? 'is-locked' : '',
      ]
        .filter(Boolean)
        .join(' ');
      return `
        <article class="${classes}">
          <span class="denda-card__tag">${labels[offer.category] || 'Tesoro'}</span>
          <span class="denda-card__icon" aria-hidden="true">${offer.icon}</span>
          <h3>${offer.nombre}</h3>
          <p>${offer.desc}</p>
          <div class="denda-card__foot">
            <span class="denda-price">${offer.price} 🪙</span>
            <button class="btn btn--small btn--primary" data-buy="${offer.id}" ${
              disabled ? 'disabled' : ''
            }>${buttonText}</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function openDenda() {
  if (uiState !== 'playing') return;
  const denda = game.world.denda;
  if (!denda) return;
  const theme = THEMES[game.themeIndex] || THEMES[0];
  dendaTitle.textContent = `DENDA · ${theme.nombre}`;
  dendaMessage.textContent = denda.healed
    ? 'La casa invita: corazones recargados. Elige tu recompensa.'
    : 'Pintxos, pociones y equipo para seguir el camino.';
  resetInput();
  accumulator = 0;
  updateHud();
  renderDenda();
  setUiState('denda');
  audio.denda();
}

function closeDenda() {
  if (uiState !== 'denda') return;
  lastTime = performance.now();
  accumulator = 0;
  resetInput();
  updateHud();
  updateActionButtons();
  setUiState('playing');
  audio.ui();
}

function buyOffer(offerId) {
  const result = buyDendaOffer(game, offerId);
  if (result.ok) {
    dendaMessage.textContent = `¡${result.offer.nombre}! Añadido al equipo.`;
    audio.buy();
  } else if (result.reason === 'coins') {
    dendaMessage.textContent = 'No tienes monedas suficientes.';
    audio.ui();
  } else if (result.reason === 'max') {
    dendaMessage.textContent = 'Ya tienes el máximo de esa mejora.';
    audio.ui();
  } else if (result.reason === 'sold') {
    dendaMessage.textContent = 'Esa oferta ya está comprada.';
    audio.ui();
  }
  updateHud();
  updateActionButtons();
  renderDenda();
}

function continueCurrentLevel() {
  if (uiState !== 'over') return;
  audio.resume();
  audio.heal();
  continueLevelWithHearts(game, 2);
  runActive = true;
  accumulator = 0;
  lastTime = performance.now();
  resetInput();
  updateHud();
  updateActionButtons();
  setUiState('playing');
}

function renderHeroPortraits() {
  document.querySelectorAll('.hero-portrait').forEach((cvs) => {
    const heroId = cvs.dataset.hero;
    const ctx = cvs.getContext('2d');
    if (ctx) drawHeroPortrait(ctx, heroId);
  });
  document.querySelectorAll('.hero-card').forEach((card) => {
    card.classList.toggle('selected', card.dataset.hero === selectedHeroId);
  });
}

function openHeroSelect() {
  audio.ui();
  renderHeroPortraits();
  setUiState('heroselect');
}

function startRunAtLevel(level = 1, heroId = selectedHeroId) {
  audio.resume();
  audio.ui();
  view = fitCanvas(canvas);
  game = createGameState({ worldWidth: view.logicalWidth, level, heroId });
  runActive = true;
  accumulator = 0;
  pendingLevelReward = 0;
  resetInput();
  levelBanner.classList.add('hidden');
  updateHud();
  updateActionButtons();
  setUiState('playing');
  showLevelBanner();
}

function startGame() {
  openHeroSelect();
}

function goMenu() {
  if (runActive) finishRun();
  audio.ui();
  game = createGameState({ worldWidth: view.logicalWidth, level: 1 });
  runActive = false;
  accumulator = 0;
  resetInput();
  levelBanner.classList.add('hidden');
  updateActionButtons();
  updateMenuStats();
  updateSoundButton();
  updateMotionButton();
  setUiState('menu');
}

function pauseGame() {
  if (uiState !== 'playing') return;
  pauseLevel.textContent = String(game.level);
  pauseCoins.textContent = String(game.coins);
  pauseScore.textContent = game.score.toLocaleString('es-ES');
  resetInput();
  updateActionButtons();
  setUiState('paused');
  audio.ui();
}

function resumeGame() {
  if (uiState !== 'paused') return;
  lastTime = performance.now();
  accumulator = 0;
  resetInput();
  updateActionButtons();
  setUiState('playing');
  audio.ui();
}

function continueLevel() {
  if (uiState !== 'levelclear') return;
  audio.resume();
  audio.ui();
  game = nextLevel(game, Math.random);
  accumulator = 0;
  resetInput();
  updateHud();
  updateActionButtons();
  setUiState('playing');
  showLevelBanner();
}

function toggleSound() {
  profile.muted = !profile.muted;
  audio.setMuted(profile.muted);
  saveProfile(profile);
  updateSoundButton();
  if (!profile.muted) {
    audio.resume();
    audio.ui();
  }
  syncMusic();
}

function toggleMotion() {
  profile.reducedMotion = !profile.reducedMotion;
  saveProfile(profile);
  updateMotionButton();
  audio.ui();
}

// ------------------------------- Entrada ---------------------------------

// -----------------------------------------------------------------
// Botones y variables para el Mapa Medieval de los 52 Barrios
// -----------------------------------------------------------------
const btnMapClose = $('btn-map-close');
const mapDistrictsGrid = $('map-districts-grid');
const mapProgressBar = $('map-progress-bar');
const mapMedievalCanvas = $('map-medieval-canvas');
let mapReturnState = 'menu';

// Coordenadas aproximadas de los 52 barrios en el mapa de Bilbao
// Basadas en la geografía real (Ría en el centro, Deusto al norte, etc.)
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
  const total = Math.min(THEMES.length, BARRIO_COORDS.length);
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
    ctx2.fillStyle = THEMES[boardState.position]?.accent || '#ffd166';
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

function renderBilbaoMap(currentLvl) {
  if (!mapDistrictsGrid) return;
  const total = THEMES.length; // 52
  const activeLvl = Math.max(1, currentLvl || 1);
  const percentage = Math.min(100, Math.round((activeLvl / total) * 100));
  if (mapProgressBar) mapProgressBar.style.width = `${percentage}%`;

  const mapSub = $('map-subtitle');
  if (mapSub) {
    const curTheme = THEMES[(activeLvl - 1) % total];
    mapSub.innerHTML = `Barrio actual: <strong>${curTheme.nombre}</strong> (${activeLvl}/${total}) · <em>${curTheme.lema}</em>`;
  }

  // Dibujar mapa medieval en canvas
  drawMedievalMap(mapMedievalCanvas, activeLvl);

  mapDistrictsGrid.innerHTML = THEMES.map((theme, idx) => {
    const lvl = idx + 1;
    let statusClass = '';
    let icon = '🔒';
    if (lvl < activeLvl) {
      statusClass = 'conquered';
      icon = '✓';
    } else if (lvl === activeLvl) {
      statusClass = 'current';
      icon = '📍';
    }
    return `
      <div class="map-barrio-node ${statusClass}" title="${theme.nombre}: ${theme.lema}">
        <span>${icon} Nivel ${lvl}</span>
        <strong>${theme.nombre}</strong>
      </div>
    `;
  }).join('');
}

function showMapScreen(returnState = 'menu') {
  mapReturnState = returnState;
  const curLvl = game?.level || profile?.bestLevel || 1;
  renderBilbaoMap(curLvl);
  setUiState('map');
}

function closeMapScreen() {
  if (uiState !== 'map') return;
  if (mapReturnState === 'playing') {
    lastTime = performance.now();
    accumulator = 0;
    resetInput();
    updateHud();
    setUiState('playing');
    showLevelBanner();
  } else if (mapReturnState === 'levelclear') {
    setUiState('levelclear');
  } else {
    goMenu();
  }
  audio.ui();
}

if (btnMapClose) {
  btnMapClose.addEventListener('click', (e) => {
    e.preventDefault();
    closeMapScreen();
  });
}

if (btnMenuMap) {
  btnMenuMap.addEventListener('click', (e) => {
    e.preventDefault();
    audio.ui();
    showMapScreen('menu');
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function showCredits() {
  audio.ui();
  setUiState('credits');
}

if (btnMenuCredits) {
  btnMenuCredits.addEventListener('click', (e) => {
    e.preventDefault();
    showCredits();
  });
}

if (btnCreditsMenu) {
  btnCreditsMenu.addEventListener('click', (e) => {
    e.preventDefault();
    audio.ui();
    goMenu();
  });
}

// ------------------------------- Entrada ---------------------------------


window.addEventListener('keydown', (event) => {
  if (event.repeat) return;

  const code = event.code;

  if (uiState === 'denda') {
    if (code === 'Escape' || code === 'Enter' || code === 'KeyE') {
      event.preventDefault();
      closeDenda();
    } else if (code === 'Digit1' || code === 'Digit2' || code === 'Digit3') {
      event.preventDefault();
      const index = Number(code.slice(-1)) - 1;
      const offer = game.world.denda?.offers?.[index];
      if (offer && !offer.sold) buyOffer(offer.id);
    }
    return;
  }

  if (uiState === 'playing') {
    if (code === 'ArrowLeft' || code === 'KeyA') {
      event.preventDefault();
      registerDirectionTap('left');
      input.left = true;
    } else if (code === 'ArrowRight' || code === 'KeyD') {
      event.preventDefault();
      registerDirectionTap('right');
      input.right = true;
    } else if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
      event.preventDefault();
      input.jumpQueued = true;
      input.jumpHeld = true;
    } else if (code === 'ArrowDown' || code === 'KeyS') {
      event.preventDefault();
      input.crouchQueued = true;
      input.crouchHeld = true;
    } else if (code === 'KeyX' || code === 'KeyJ') {
      event.preventDefault();
      input.attackQueued = true;
    } else if (code === 'KeyC' || code === 'KeyK') {
      event.preventDefault();
      input.shootQueued = true;
    } else if (code === 'KeyQ') {
      event.preventDefault();
      swapRanged();
    } else if (code === 'ShiftLeft' || code === 'ShiftRight') {
      event.preventDefault();
      input.dashQueued = true;
    } else if (code === 'Escape' || code === 'KeyP') {
      event.preventDefault();
      pauseGame();
    }
    return;
  }

  if (uiState === 'paused') {
    if (code === 'Escape' || code === 'KeyP') {
      event.preventDefault();
      resumeGame();
    }
    return;
  }

  if (uiState === 'levelclear') {
    if (code === 'Enter' || code === 'Space') {
      event.preventDefault();
      continueLevel();
    } else if (code === 'Escape') {
      event.preventDefault();
      goMenu();
    }
    return;
  }

  if (uiState === 'menu') {
    if (code === 'Enter' || code === 'Space') {
      event.preventDefault();
      startGame();
    }
    return;
  }

  if (uiState === 'over') {
    if (code === 'Enter' || code === 'Space') {
      event.preventDefault();
      continueCurrentLevel();
    } else if (code === 'KeyR' || code === 'Digit1') {
      event.preventDefault();
      startRunAtLevel(1);
    } else if (code === 'KeyM' || code === 'Digit2') {
      event.preventDefault();
      const milestone = getMilestoneLevel(game.level);
      if (milestone > 1) startRunAtLevel(milestone);
    } else if (code === 'Escape') {
      event.preventDefault();
      goMenu();
    }
    return;
  }

  if (uiState === 'howto' || uiState === 'map' || uiState === 'credits') {
    if (code === 'Escape' || code === 'Enter' || code === 'Space') {
      event.preventDefault();
      if (uiState === 'map') closeMapScreen();
      else goMenu();
    }
  }
});

window.addEventListener('keyup', (event) => {
  const code = event.code;
  if (code === 'ArrowLeft' || code === 'KeyA') input.left = false;
  else if (code === 'ArrowRight' || code === 'KeyD') input.right = false;
  else if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
    input.jumpHeld = false;
  } else if (code === 'ArrowDown' || code === 'KeyS') {
    input.crouchHeld = false;
  }
});

window.addEventListener('blur', resetInput);

function bindHold(element, onDown, onUp) {
  if (!element) return;
  element.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    event.stopPropagation();
    audio.resume();
    if (uiState !== 'playing') return;
    try {
      element.setPointerCapture(event.pointerId);
    } catch (_) {
      /* ignorar */
    }
    onDown();
  });
  const release = (event) => {
    event.preventDefault();
    onUp();
  };
  element.addEventListener('pointerup', release);
  element.addEventListener('pointercancel', release);
}

bindHold(
  $('btn-left'),
  () => {
    registerDirectionTap('left');
    input.left = true;
  },
  () => {
    input.left = false;
  }
);

bindHold(
  $('btn-right'),
  () => {
    registerDirectionTap('right');
    input.right = true;
  },
  () => {
    input.right = false;
  }
);

bindHold(
  $('btn-jump'),
  () => {
    input.jumpHeld = true;
    input.jumpQueued = true;
  },
  () => {
    input.jumpHeld = false;
  }
);

function bindTap(element, action) {
  if (!element) return;
  element.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    event.stopPropagation();
    audio.resume();
    if (uiState !== 'playing') return;
    action();
  });
}

bindTap(btnAttack, () => {
  input.attackQueued = true;
});

bindTap(btnShoot, () => {
  input.shootQueued = true;
});

canvas.addEventListener('contextmenu', (event) => event.preventDefault());

// -----------------------------------------------------------------
// 🏆 Tabla de Puntuaciones (Score-Table)
// -----------------------------------------------------------------

const HERO_NAMES = {
  jainvs: 'Jainvs',
  jvlivs: 'Jvlivs',
  aritza: 'Aritza',
};

async function loadAndRenderScores() {
  if (!scoresTableBody) return;
  scoresTableBody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align: center; padding: 18px; color: var(--gold);">Cargando proezas...</td>
    </tr>
  `;

  const { isLive, scores } = await fetchTopScores(30);

  if (scoresLiveBadge) {
    scoresLiveBadge.textContent = isLive ? '● EN VIVO' : '○ MODO LOCAL';
    scoresLiveBadge.classList.toggle('is-live', isLive);
  }

  if (!scores || !scores.length) {
    scoresTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 18px; color: var(--muted);">Aún no hay proezas registradas. ¡Sé el primero en el Trono!</td>
      </tr>
    `;
    return;
  }

  scoresTableBody.innerHTML = scores.map((s, idx) => {
    const rank = idx + 1;
    let rankClass = '';
    let medal = String(rank);
    if (rank === 1) { rankClass = 'scores-rank-1'; medal = '🥇 1'; }
    else if (rank === 2) { rankClass = 'scores-rank-2'; medal = '🥈 2'; }
    else if (rank === 3) { rankClass = 'scores-rank-3'; medal = '🥉 3'; }

    const heroLabel = HERO_NAMES[s.hero_id] || s.hero_id || 'Aritza';
    const cleanPlayer = escapeHtml(s.player_name || 'Heroína');
    const scoreVal = Number(s.score || 0).toLocaleString('es-ES');
    const coinsVal = Number(s.coins || 0);
    const lvlVal = Number(s.level || 1);

    return `
      <tr class="${rankClass}">
        <td>${medal}</td>
        <td><strong>${cleanPlayer}</strong> <span class="scores-hero-tag">(${heroLabel})</span></td>
        <td>${lvlVal}</td>
        <td>${coinsVal}</td>
        <td><strong>${scoreVal}</strong></td>
      </tr>
    `;
  }).join('');
}

function openScoresScreen() {
  audio.ui();
  setUiState('scores');
  loadAndRenderScores();
}

if (btnMenuScores) {
  btnMenuScores.addEventListener('click', (e) => {
    e.preventDefault();
    openScoresScreen();
  });
}

if (btnScoresClose) {
  btnScoresClose.addEventListener('click', (e) => {
    e.preventDefault();
    goMenu();
  });
}

if (btnScoresRefresh) {
  btnScoresRefresh.addEventListener('click', (e) => {
    e.preventDefault();
    audio.ui();
    loadAndRenderScores();
  });
}

// Suscripción a puntuaciones en vivo
subscribeToScores(() => {
  if (uiState === 'scores') {
    loadAndRenderScores();
  }
});

// Guardar puntuación desde GameOver
if (btnSubmitScore) {
  btnSubmitScore.addEventListener('click', async () => {
    const name = (scorePlayerNameInput?.value || '').trim() || 'Aventurero del Botxo';
    btnSubmitScore.disabled = true;
    if (scoreSubmitFeedback) {
      scoreSubmitFeedback.classList.remove('hidden');
      scoreSubmitFeedback.textContent = 'Enviando proeza al Trono...';
    }

    await submitScore({
      playerName: name,
      heroId: game.heroId || selectedHeroId,
      score: game.score,
      level: game.level,
      coins: game.coinsCollected,
    });

    if (scoreSubmitFeedback) {
      scoreSubmitFeedback.textContent = '¡Proeza inscrita en el Trono Imperial!';
    }
    audio.heal();
  });
}

// ------------------------------- Botones ---------------------------------

$('btn-play').addEventListener('click', startGame);
if ($('btn-hero-back')) $('btn-hero-back').addEventListener('click', goMenu);

document.querySelectorAll('.hero-card').forEach((card) => {
  card.addEventListener('click', () => {
    selectedHeroId = card.dataset.hero || 'aritza';
    profile.heroId = selectedHeroId;
    saveProfile(profile);
    startRunAtLevel(1, selectedHeroId);
  });
});
$('btn-howto').addEventListener('click', () => {
  audio.ui();
  setUiState('howto');
});
$('btn-howto-close').addEventListener('click', goMenu);
$('btn-pause').addEventListener('click', pauseGame);
$('btn-resume').addEventListener('click', resumeGame);
$('btn-pause-menu').addEventListener('click', goMenu);
if ($('btn-again')) $('btn-again').addEventListener('click', startGame);
if (btnContinueLevel) btnContinueLevel.addEventListener('click', continueCurrentLevel);
if (btnRestartMilestone) btnRestartMilestone.addEventListener('click', () => {
  const milestone = getMilestoneLevel(game.level);
  startRunAtLevel(milestone > 1 ? milestone : 1);
});
if (btnRestartRun) btnRestartRun.addEventListener('click', () => startRunAtLevel(1));
if (btnPlayMilestone) btnPlayMilestone.addEventListener('click', () => {
  const milestone = getMilestoneLevel(profile.bestLevel);
  startRunAtLevel(milestone > 1 ? milestone : 1);
});
$('btn-gameover-menu').addEventListener('click', goMenu);
$('btn-next-level').addEventListener('click', continueLevel);
$('btn-clear-menu').addEventListener('click', goMenu);
$('btn-denda-close').addEventListener('click', closeDenda);
dendaOffers.addEventListener('click', (event) => {
  const button = event.target.closest('[data-buy]');
  if (!button) return;
  buyOffer(button.dataset.buy);
});
if (btnSwap) btnSwap.addEventListener('click', swapRanged);
btnSound.addEventListener('click', toggleSound);
btnMotion.addEventListener('click', toggleMotion);

// ------------------------------- Resize ----------------------------------

function handleResize() {
  view = fitCanvas(canvas);
  setWorldWidth(game, view.logicalWidth);
}

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => setTimeout(handleResize, 150));
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', handleResize);
}

// ------------------------------- Bucle -----------------------------------

function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  const time = now / 1000;
  const reducedMotion = !animationsEnabled();

  if (uiState === 'playing') {
    accumulator += dt;
    let guard = 0;
    while (accumulator >= FIXED_STEP && guard < 6) {
      const stepInput = {
        left: input.left,
        right: input.right,
        jump: input.jumpQueued,
        jumpHeld: input.jumpHeld,
        crouchQueued: input.crouchQueued,
        crouchHeld: input.crouchHeld,
        attack: input.attackQueued,
        shoot: input.shootQueued,
        dash: input.dashQueued,
      };
      input.jumpQueued = false;
      input.crouchQueued = false;
      input.attackQueued = false;
      input.shootQueued = false;
      input.dashQueued = false;
      const events = step(game, FIXED_STEP, stepInput, Math.random);
      processEvents(events);
      accumulator -= FIXED_STEP;
      guard += 1;
      if (uiState !== 'playing') {
        accumulator = 0;
        break;
      }
    }
    updateHud();
  } else if (uiState === 'menu' || uiState === 'howto') {
    animateIdle(game, dt);
  }

  render(ctx, game, view, time, {
    reducedMotion,
    dimmed: uiState === 'over' || uiState === 'denda',
  });
  requestAnimationFrame(frame);
}

// --------------------------- Visibilidad / PWA ---------------------------

document.addEventListener('visibilitychange', () => {
  if (document.hidden && uiState === 'playing') {
    pauseGame();
  }
});

if ('serviceWorker' in navigator) {
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (location.protocol === 'https:' || isLocal) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        /* sin conexión offline si falla */
      });
    });
  }
}

// ------------------------------- Arranque --------------------------------

window.__ARITZA__ = {
  getState: () => game,
  getUiState: () => uiState,
  getProfile: () => profile,
  getAudioState: () => ({
    muted: audio.isMuted(),
    music: audio.isMusicPlaying(),
    context: audio.getContextState(),
  }),
  start: startGame,
  goMenu,
  pause: pauseGame,
  resume: resumeGame,
  next: continueLevel,
  getDenda: () => game.world.denda,
  openDenda,
  closeDenda,
  buyDenda: (offerId) => {
    buyOffer(offerId);
    return game.world.denda;
  },
  swapRanged,
};

updateMenuStats();
updateSoundButton();
updateMotionButton();
updateActionButtons();
setUiState('menu');
requestAnimationFrame((now) => {
  lastTime = now;
  requestAnimationFrame(frame);
});

