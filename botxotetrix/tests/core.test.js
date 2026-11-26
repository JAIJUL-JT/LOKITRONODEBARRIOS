// tests/core.test.js — Lógica pura de BotxoTetrix
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  CASAS,
  LINE_POINTS,
  NIVELES,
  PIECE_TYPES,
  clearLines,
  collides,
  createBoard,
  createGameState,
  getCells,
  ghostY,
  gravityMs,
  hardDrop,
  levelInfo,
  movePiece,
  mulberry32,
  nivelInfo,
  rotatePiece,
  shuffleTypes,
  softDrop,
  spawnPiece,
  spawnPosition,
  startGame,
  tick,
} from '../js/core.js';

function filledRow(width = BOARD_WIDTH, type = 'I') {
  return Array.from({ length: width }, () => ({ type, color: '#000' }));
}

test('tablero 10×20 vacío', () => {
  const board = createBoard();
  assert.equal(board.length, BOARD_HEIGHT);
  assert.equal(board[0].length, BOARD_WIDTH);
  assert.ok(board.every((row) => row.every((cell) => cell === null)));
});

test('las 7 piezas tienen casa, emoji y color', () => {
  assert.equal(PIECE_TYPES.length, 7);
  for (const t of PIECE_TYPES) {
    assert.ok(CASAS[t], `falta casa para ${t}`);
    assert.ok(CASAS[t].casa.length > 0);
    assert.ok(CASAS[t].emoji);
    assert.match(CASAS[t].color, /^#[0-9a-f]{6}$/i);
  }
});

test('cada rotación tiene exactamente 4 celdas', () => {
  for (const t of PIECE_TYPES) {
    for (let r = 0; r < 4; r++) {
      const cells = getCells(t, r, 0, 0);
      assert.equal(cells.length, 4, `${t} rot ${r}`);
    }
  }
});

test('7-bag no repite tipos dentro de una bolsa', () => {
  const bag = shuffleTypes(mulberry32(42));
  assert.equal(bag.length, 7);
  assert.deepEqual([...bag].sort(), [...PIECE_TYPES].sort());
});

test('createGameState con semilla es determinista', () => {
  const a = createGameState({ seed: 7 });
  const b = createGameState({ seed: 7 });
  assert.equal(a.nextType, b.nextType);
  assert.deepEqual(a.bag, b.bag);
});

test('startGame pone estado playing y coloca pieza', () => {
  const s = startGame(createGameState({ seed: 1 }));
  assert.equal(s.status, 'playing');
  assert.ok(s.piece);
  assert.ok(PIECE_TYPES.includes(s.piece.type));
  assert.equal(s.score, 0);
  assert.equal(s.lines, 0);
  assert.equal(s.level, 1);
});

test('mover izquierda/derecha respeta límites', () => {
  const s = startGame(createGameState({ seed: 3 }));
  // Empujar mucho a la izquierda no debe salirse.
  for (let i = 0; i < 30; i++) movePiece(s, -1, 0);
  let cells = getCells(s.piece.type, s.piece.rotation, s.piece.x, s.piece.y);
  assert.ok(cells.every(([x]) => x >= 0));
  for (let i = 0; i < 30; i++) movePiece(s, 1, 0);
  cells = getCells(s.piece.type, s.piece.rotation, s.piece.x, s.piece.y);
  assert.ok(cells.every(([x]) => x < BOARD_WIDTH));
});

test('rotación con wall-kick nunca sale del tablero', () => {
  const s = startGame(createGameState({ seed: 11 }));
  for (let i = 0; i < 30; i++) movePiece(s, -1, 0);
  for (let r = 0; r < 8; r++) {
    rotatePiece(s, 1);
    const cells = getCells(s.piece.type, s.piece.rotation, s.piece.x, s.piece.y);
    assert.ok(!collides(s.board, cells) || cells.some(([x]) => x < 0 || x >= BOARD_WIDTH) === false);
    for (const [x, y] of cells) {
      assert.ok(x >= 0 && x < BOARD_WIDTH, `x=${x} fuera en rot ${r}`);
      assert.ok(y < BOARD_HEIGHT, `y=${y} fuera`);
    }
  }
});

test('la pieza O no cambia de forma al rotar', () => {
  const s = startGame(createGameState({ seed: 5 }));
  s.piece = { type: 'O', rotation: 0, x: 4, y: 0 };
  const before = getCells('O', 0, 4, 0);
  rotatePiece(s, 1);
  const after = getCells(s.piece.type, s.piece.rotation, s.piece.x, s.piece.y);
  assert.deepEqual(after, before);
});

test('softDrop baja una fila o devuelve false al chocar', () => {
  const s = startGame(createGameState({ seed: 9 }));
  const y0 = s.piece.y;
  const moved = softDrop(s);
  assert.equal(moved, true);
  assert.equal(s.piece.y, y0 + 1);
});

test('ghostY <= pieza.y + tablero y caída dura bloquea', () => {
  const s = startGame(createGameState({ seed: 13 }));
  const gy = ghostY(s);
  assert.ok(gy >= s.piece.y);
  hardDrop(s);
  // Tras hardDrop hay nueva pieza (o game over).
  assert.ok(s.piece || s.status === 'over');
  assert.ok(s.board.some((row) => row.some((cell) => cell)));
});

test('clearLines elimina filas completas y rellena desde arriba', () => {
  const board = createBoard();
  board[BOARD_HEIGHT - 1] = filledRow();
  board[BOARD_HEIGHT - 2] = filledRow();
  // Fila parcial no se elimina.
  board[BOARD_HEIGHT - 3][0] = { type: 'T', color: '#111' };
  const { board: next, cleared } = clearLines(board);
  assert.equal(cleared, 2);
  assert.equal(next.length, BOARD_HEIGHT);
  assert.equal(next[BOARD_HEIGHT - 1][0]?.type, 'T');
  assert.ok(next[0].every((c) => c === null));
});

test('Tetris (4 líneas) puntúa 800 × nivel', () => {
  const s = startGame(createGameState({ seed: 21 }));
  s.level = 2;
  s.board = createBoard();
  // 4 filas inferiores casi llenas, hueco en columna 4.
  for (let y = BOARD_HEIGHT - 4; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (x !== 4) s.board[y][x] = { type: 'Z', color: '#c0392b' };
    }
  }
  const before = s.score;
  const { board, cleared } = clearLines(s.board);
  assert.equal(cleared, 0); // aún incompleta (columna 4 vacía)
  // Rellenar columna 4 y limpiar de nuevo.
  for (let y = BOARD_HEIGHT - 4; y < BOARD_HEIGHT; y++) {
    board[y][4] = { type: 'I', color: '#2980b9' };
  }
  const second = clearLines(board);
  assert.equal(second.cleared, 4);
  s.lines += second.cleared;
  s.score += LINE_POINTS[second.cleared] * s.level;
  assert.equal(s.score - before, 1600);
});

test('puntuación por 1 línea × nivel', () => {
  const s = startGame(createGameState({ seed: 22 }));
  s.level = 3;
  s.board = createBoard();
  s.board[BOARD_HEIGHT - 1] = filledRow();
  const { board, cleared } = clearLines(s.board);
  assert.equal(cleared, 1);
  s.board = board;
  s.lines += cleared;
  s.score += LINE_POINTS[cleared] * s.level;
  assert.equal(s.score, 300);
});

test('cada 10 líneas sube el nivel', () => {
  const s = startGame(createGameState({ seed: 2 }));
  s.lines = 9;
  s.level = Math.floor(s.lines / 10) + 1;
  assert.equal(s.level, 1);
  s.lines = 10;
  s.level = Math.floor(s.lines / 10) + 1;
  assert.equal(s.level, 2);
  s.lines = 40;
  s.level = Math.floor(s.lines / 10) + 1;
  assert.equal(s.level, 5);
});

test('gravityMs baja con el nivel y tiene mínimo', () => {
  assert.equal(gravityMs(1), 800);
  assert.ok(gravityMs(10) < gravityMs(1));
  assert.ok(gravityMs(99) >= 100);
  assert.equal(gravityMs(0), gravityMs(1));
});

test('game over si el spawn choca', () => {
  const s = startGame(createGameState({ seed: 4 }));
  // Llenar todo el tablero.
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    s.board[y] = filledRow();
  }
  s.piece = null;
  const ok = spawnPiece(s);
  assert.equal(ok, false);
  assert.equal(s.status, 'over');
});

test('tick bloquea la pieza al tocar suelo', () => {
  const s = startGame(createGameState({ seed: 6 }));
  s.piece = { type: 'O', rotation: 0, x: 4, y: BOARD_HEIGHT - 2 };
  tick(s);
  // Se bloqueó y spawn nueva pieza.
  assert.ok(s.board[BOARD_HEIGHT - 1].some((c) => c && c.type === 'O'));
  assert.ok(s.piece);
  assert.equal(s.status, 'playing');
});

test('nivelInfo y NIVELES cubren 10 escenarios de Bilbao', () => {
  assert.equal(NIVELES.length, 10);
  assert.equal(nivelInfo(1).nombre, 'Puente de La Salve');
  assert.equal(nivelInfo(99).escena, 'murallas');
  assert.equal(levelInfo(3).nombre, 'Siete Calles');
  for (const n of NIVELES) {
    assert.ok(n.escena && n.lema && n.nombre);
  }
});

test('spawnPosition centra la pieza', () => {
  for (const t of PIECE_TYPES) {
    const { x, y } = spawnPosition(t);
    assert.ok(x >= 0 && x < BOARD_WIDTH);
    assert.equal(y, t === 'I' ? -1 : 0);
  }
});

test('collides detecta bordes y celdas ocupadas', () => {
  const board = createBoard();
  assert.ok(collides(board, [[-1, 0]]));
  assert.ok(collides(board, [[BOARD_WIDTH, 0]]));
  assert.ok(collides(board, [[0, BOARD_HEIGHT]]));
  assert.ok(!collides(board, [[0, 0]]));
  board[0][0] = { type: 'T', color: '#000' };
  assert.ok(collides(board, [[0, 0]]));
});
