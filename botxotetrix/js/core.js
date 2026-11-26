// core.js — Lógica pura de BotxoTetrix (sin DOM, sin red).
// Tetris clásico 10×20 con piezas = Casas Feudales de Bilbao.

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Puntuación estándar por nº de líneas de una vez (× nivel).
export const LINE_POINTS = [0, 100, 300, 500, 800];
export const LINES_PER_LEVEL = 10;

// Las 7 Casas Feudales (colores de sql/schema.sql). Forastero no compite.
export const CASAS = {
  I: { casa: 'Uribarri', emoji: '🦅', color: '#2980b9' },
  O: { casa: 'Indautxu', emoji: '🍷', color: '#d4af37' },
  T: { casa: 'Casco Viejo', emoji: '🏰', color: '#8b1e2f' },
  S: { casa: 'Deusto', emoji: '⚓', color: '#1b4d3e' },
  Z: { casa: 'Santutxu', emoji: '🛡️', color: '#c0392b' },
  J: { casa: 'Abando', emoji: '👑', color: '#2c3e50' },
  L: { casa: 'San Mamés', emoji: '🦁', color: '#e74c3c' },
};

export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Estados de rotación (celdas [x,y] dentro de la caja de la pieza).
const SHAPES = {
  I: [
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 0], [1, 1], [1, 2], [1, 3]],
  ],
  O: [
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
  ],
  T: [
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [1, 2]],
    [[1, 0], [0, 1], [1, 1], [1, 2]],
  ],
  S: [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[1, 0], [1, 1], [2, 1], [2, 2]],
    [[1, 1], [2, 1], [0, 2], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ],
  Z: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[2, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 0], [0, 1], [1, 1], [0, 2]],
  ],
  J: [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [0, 2], [1, 2]],
  ],
  L: [
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 1], [0, 2]],
    [[0, 0], [1, 0], [1, 1], [1, 2]],
  ],
};

// Wall-kicks: desplazamientos a probar al rotar (x primero, luego y).
const KICKS = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [-2, 0],
  [2, 0],
  [0, -1],
  [-1, -1],
  [1, -1],
];

// Escenarios de Bilbao por nivel (fondos dibujados en render.js).
export const NIVELES = [
  { nivel: 1, nombre: 'Puente de La Salve', lema: 'El Reino se alza sobre el Nervión', escena: 'salve' },
  { nivel: 2, nombre: 'Guggenheim Gótico', lema: 'Titanio bajo media luna', escena: 'guggenheim' },
  { nivel: 3, nombre: 'Siete Calles', lema: 'El laberinto del Casco Viejo', escena: 'casco' },
  { nivel: 4, nombre: 'Artxanda', lema: 'Las murallas ven todo el Botxo', escena: 'artxanda' },
  { nivel: 5, nombre: 'Zubizuri y la Ría', lema: 'El arco blanco del agua', escena: 'ria' },
  { nivel: 6, nombre: 'Azkuna Zentroa', lema: 'Pilares de la antigua casona', escena: 'azkuna' },
  { nivel: 7, nombre: 'Catedral de Santiago', lema: 'Piedra bendita y campanas', escena: 'catedral' },
  { nivel: 8, nombre: 'Torre Iberdrola', lema: 'Vigía de cristal del reino', escena: 'torre' },
  { nivel: 9, nombre: 'Monte Caramelo', lema: 'La sierra vigía el feudo', escena: 'caramelo' },
  { nivel: 10, nombre: 'Murallas del Reino', lema: 'Última guarda de LokiTrono', escena: 'murallas' },
];

export function nivelInfo(nivel) {
  const idx = Math.min(Math.max(1, Math.floor(nivel || 1)), NIVELES.length) - 1;
  return NIVELES[idx];
}

export const levelInfo = nivelInfo;

// Determinista si se pasa semilla (para tests).
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createBoard(width = BOARD_WIDTH, height = BOARD_HEIGHT) {
  return Array.from({ length: height }, () => Array(width).fill(null));
}

export function cloneBoard(board) {
  return board.map((row) => row.slice());
}

/** Baraja Fisher–Yates de los 7 tipos (7-bag). */
export function shuffleTypes(rng = Math.random) {
  const bag = PIECE_TYPES.slice();
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export function getCells(type, rotation, x, y) {
  const states = SHAPES[type];
  const shape = states[((rotation % 4) + 4) % 4];
  return shape.map(([cx, cy]) => [x + cx, y + cy]);
}

export function collides(board, cells) {
  const h = board.length;
  const w = board[0].length;
  for (const [cx, cy] of cells) {
    if (cx < 0 || cx >= w || cy >= h) return true;
    if (cy >= 0 && board[cy][cx]) return true;
  }
  return false;
}

export function spawnPosition(type) {
  // I usa caja 4×4, el resto 3×3 → centrar arriba.
  const boxW = type === 'I' || type === 'O' ? 4 : 3;
  return { x: Math.floor((BOARD_WIDTH - boxW) / 2), y: type === 'I' ? -1 : 0 };
}

/**
 * Crea el estado de partida.
 * @param {{seed?: number, rng?: () => number}} [options]
 */
export function createGameState(options = {}) {
  const rng = options.rng || mulberry32(options.seed != null ? options.seed : Date.now());
  const bag = [];
  const state = {
    board: createBoard(),
    bag,
    piece: null,
    nextType: null,
    score: 0,
    lines: 0,
    level: 1,
    status: 'ready', // ready | playing | paused | over
    rng,
    lastClear: null,
    pieceCount: 0,
  };
  refillBag(state);
  state.nextType = bag.shift();
  return state;
}

function refillBag(state) {
  while (state.bag.length < 7) {
    state.bag.push(...shuffleTypes(state.rng));
  }
}

function makePiece(type) {
  const { x, y } = spawnPosition(type);
  return { type, rotation: 0, x, y };
}

/** Coloca la pieza siguiente en juego. Devuelve false si hay game over. */
export function spawnPiece(state) {
  refillBag(state);
  const type = state.nextType || state.bag.shift();
  state.nextType = state.bag.shift();
  refillBag(state);
  const piece = makePiece(type);
  const cells = getCells(piece.type, piece.rotation, piece.x, piece.y);
  if (collides(state.board, cells)) {
    state.piece = piece;
    state.status = 'over';
    return false;
  }
  state.piece = piece;
  state.pieceCount += 1;
  return true;
}

export function startGame(state) {
  state.board = createBoard();
  state.score = 0;
  state.lines = 0;
  state.level = 1;
  state.status = 'playing';
  state.lastClear = null;
  state.pieceCount = 0;
  state.bag.length = 0;
  refillBag(state);
  state.nextType = state.bag.shift();
  refillBag(state);
  spawnPiece(state);
  return state;
}

export function movePiece(state, dx, dy) {
  if (state.status !== 'playing' || !state.piece) return false;
  const p = state.piece;
  const cells = getCells(p.type, p.rotation, p.x + dx, p.y + dy);
  if (collides(state.board, cells)) return false;
  p.x += dx;
  p.y += dy;
  return true;
}

export function rotatePiece(state, dir = 1) {
  if (state.status !== 'playing' || !state.piece) return false;
  const p = state.piece;
  const nextRot = (((p.rotation + dir) % 4) + 4) % 4;
  for (const [kx, ky] of KICKS) {
    const cells = getCells(p.type, nextRot, p.x + kx, p.y + ky);
    if (!collides(state.board, cells)) {
      p.rotation = nextRot;
      p.x += kx;
      p.y += ky;
      return true;
    }
  }
  return false;
}

/** Y de la posición fantasma (caída dura). */
export function ghostY(state) {
  if (!state.piece) return 0;
  const p = state.piece;
  let y = p.y;
  while (!collides(state.board, getCells(p.type, p.rotation, p.x, y + 1))) {
    y += 1;
  }
  return y;
}

export function hardDrop(state) {
  if (state.status !== 'playing' || !state.piece) return 0;
  const target = ghostY(state);
  const dist = target - state.piece.y;
  state.piece.y = target;
  // Caída dura no puntúa en esta variante (solo estética).
  lockPiece(state);
  return dist;
}

/** Baja una fila si es posible. Devuelve false si debe bloquear. */
export function softDrop(state) {
  if (state.status !== 'playing' || !state.piece) return false;
  return movePiece(state, 0, 1);
}

/** Paso de gravedad: baja o bloquea. */
export function tick(state) {
  if (state.status !== 'playing' || !state.piece) return;
  if (!movePiece(state, 0, 1)) {
    lockPiece(state);
  }
}

export function lockPiece(state) {
  const p = state.piece;
  if (!p) return;
  const cells = getCells(p.type, p.rotation, p.x, p.y);
  const color = (CASAS[p.type] && CASAS[p.type].color) || '#888';
  for (const [cx, cy] of cells) {
    if (cy >= 0 && cy < state.board.length && cx >= 0 && cx < state.board[0].length) {
      state.board[cy][cx] = { type: p.type, color };
    }
  }
  state.piece = null;
  const { board, cleared } = clearLines(state.board);
  state.board = board;
  state.lastClear = cleared;
  if (cleared > 0) {
    state.lines += cleared;
    const points = (LINE_POINTS[cleared] || 0) * state.level;
    state.score += points;
    state.level = Math.floor(state.lines / LINES_PER_LEVEL) + 1;
  }
  if (state.status === 'playing') {
    spawnPiece(state);
  }
}

/** Elimina filas completas. Devuelve { board, cleared }. */
export function clearLines(board) {
  const h = board.length;
  const w = board[0].length;
  const kept = board.filter((row) => row.some((cell) => !cell));
  const cleared = h - kept.length;
  while (kept.length < h) {
    kept.unshift(Array(w).fill(null));
  }
  return { board: kept, cleared };
}

/**
 * Intervalo de gravedad (ms) para un nivel.
 * Rápido pero jugable: 800ms → 100ms mínimo.
 */
export function gravityMs(level) {
  const n = Math.max(1, Math.floor(level || 1));
  return Math.max(100, 800 - (n - 1) * 70);
}

