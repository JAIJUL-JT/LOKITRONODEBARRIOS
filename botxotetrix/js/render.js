// render.js — Dibujo Canvas de BotxoTetrix: tablero, piezas y escenas de Bilbao.
import { BOARD_HEIGHT, BOARD_WIDTH, CASAS, getCells, ghostY, nivelInfo } from './core.js';

const CELL = 32;

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  let W = 0;
  let H = 0;
  let boardPx = { x: 0, y: 0, w: 0, h: 0, cell: CELL };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const touchH = H < 700 ? 170 : 150;
    const topH = 64;
    const sideW = W > 720 ? 130 : 0;
    const maxCell = Math.floor(Math.min(
      (H - topH - touchH) / BOARD_HEIGHT,
      (W - sideW - 24) / BOARD_WIDTH,
      40
    ));
    const cell = Math.max(14, maxCell);
    const w = cell * BOARD_WIDTH;
    const h = cell * BOARD_HEIGHT;
    const x = Math.round((W - sideW - w) / 2);
    const y = Math.round(topH + (H - topH - touchH - h) / 2);
    boardPx = { x, y, w, h, cell };
  }

  function drawScene(level) {
    const info = nivelInfo(level);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a1020');
    grad.addColorStop(0.55, '#141018');
    grad.addColorStop(1, '#050506');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Estrellas / brumas
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 97) % 100) / 100 * W;
      const sy = ((i * 53) % 100) / 100 * (H * 0.55);
      const r = (i % 3) * 0.6 + 0.4;
      ctx.fillRect(sx, sy, r, r);
    }

    drawLandmark(info.escena, H);
  }

  function drawLandmark(escena, h) {
    const baseY = h * 0.78;
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.fillStyle = 'rgba(20, 18, 24, 0.9)';
    ctx.lineWidth = 3;

    switch (escena) {
      case 'salve': {
        // Arco del Puente de La Salve + torre.
        ctx.beginPath();
        ctx.moveTo(W * 0.1, baseY);
        ctx.quadraticCurveTo(W * 0.5, baseY - h * 0.28, W * 0.9, baseY);
        ctx.stroke();
        ctx.fillRect(W * 0.46, baseY - h * 0.42, W * 0.08, h * 0.42);
        ctx.strokeRect(W * 0.46, baseY - h * 0.42, W * 0.08, h * 0.42);
        break;
      }
      case 'guggenheim': {
        // Bloques ondulados estilo titanio.
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const x0 = W * (0.15 + i * 0.14);
          ctx.moveTo(x0, baseY);
          ctx.bezierCurveTo(x0 + 20, baseY - 90, x0 + 50, baseY - 30, x0 + 70, baseY - 100);
          ctx.lineTo(x0 + 70, baseY);
        }
        ctx.stroke();
        ctx.fillRect(W * 0.2, baseY - 70, W * 0.55, 70);
        break;
      }
      case 'casco': {
        // Filas de casas apretadas con tejados a dos aguas.
        for (let i = 0; i < 8; i++) {
          const bw = W * 0.09;
          const bx = W * 0.08 + i * (bw + 6);
          const bh = 70 + (i % 3) * 25;
          ctx.fillRect(bx, baseY - bh, bw, bh);
          ctx.beginPath();
          ctx.moveTo(bx - 4, baseY - bh);
          ctx.lineTo(bx + bw / 2, baseY - bh - 28);
          ctx.lineTo(bx + bw + 4, baseY - bh);
          ctx.closePath();
          ctx.stroke();
        }
        break;
      }
      case 'artxanda': {
        // Colinas + cruz/antena.
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.quadraticCurveTo(W * 0.3, baseY - 140, W * 0.55, baseY - 60);
        ctx.quadraticCurveTo(W * 0.8, baseY - 160, W, baseY - 40);
        ctx.lineTo(W, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }
      case 'ria': {
        // Arco del Zubizuri + ondas.
        ctx.beginPath();
        ctx.moveTo(W * 0.2, baseY);
        ctx.quadraticCurveTo(W * 0.5, baseY - 80, W * 0.8, baseY);
        ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const y = baseY + 20 + i * 16;
          ctx.moveTo(0, y);
          for (let x = 0; x <= W; x += 40) {
            ctx.quadraticCurveTo(x + 20, y + (i % 2 ? 8 : -8), x + 40, y);
          }
        }
        ctx.strokeStyle = 'rgba(41, 128, 185, 0.45)';
        ctx.stroke();
        break;
      }
      case 'azkuna': {
        // Columnas / patios.
        for (let i = 0; i < 6; i++) {
          const cx = W * (0.15 + i * 0.14);
          ctx.fillRect(cx, baseY - 130, 22, 130);
          ctx.strokeRect(cx, baseY - 130, 22, 130);
        }
        ctx.fillRect(W * 0.12, baseY - 150, W * 0.76, 24);
        break;
      }
      case 'catedral': {
        // Torres gemelas.
        ctx.fillRect(W * 0.35, baseY - 150, 50, 150);
        ctx.fillRect(W * 0.55, baseY - 150, 50, 150);
        ctx.strokeRect(W * 0.35, baseY - 150, 50, 150);
        ctx.strokeRect(W * 0.55, baseY - 150, 50, 150);
        ctx.beginPath();
        ctx.moveTo(W * 0.35, baseY - 150);
        ctx.lineTo(W * 0.4, baseY - 190);
        ctx.lineTo(W * 0.45, baseY - 150);
        ctx.moveTo(W * 0.55, baseY - 150);
        ctx.lineTo(W * 0.6, baseY - 190);
        ctx.lineTo(W * 0.65, baseY - 150);
        ctx.stroke();
        break;
      }
      case 'torre': {
        // Torre Iberdrola.
        ctx.beginPath();
        ctx.moveTo(W * 0.42, baseY);
        ctx.lineTo(W * 0.46, baseY - 220);
        ctx.lineTo(W * 0.54, baseY - 220);
        ctx.lineTo(W * 0.58, baseY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }
      case 'caramelo': {
        // Monte.
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.lineTo(W * 0.35, baseY - 160);
        ctx.lineTo(W * 0.5, baseY - 90);
        ctx.lineTo(W * 0.7, baseY - 180);
        ctx.lineTo(W, baseY - 40);
        ctx.lineTo(W, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }
      default: {
        // Murallas del Reino.
        ctx.fillRect(W * 0.05, baseY - 90, W * 0.9, 90);
        for (let i = 0; i < 12; i++) {
          ctx.fillRect(W * 0.05 + i * (W * 0.075), baseY - 118, W * 0.04, 30);
        }
        ctx.strokeRect(W * 0.05, baseY - 90, W * 0.9, 90);
        break;
      }
    }
    ctx.restore();
  }

  function drawBoardFrame() {
    const { x, y, w, h, cell } = boardPx;
    ctx.save();
    // Fondo del tablero
    ctx.fillStyle = 'rgba(5, 5, 6, 0.72)';
    ctx.fillRect(x, y, w, h);
    // Rejilla
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * cell, y);
      ctx.lineTo(x + i * cell, y + h);
      ctx.stroke();
    }
    for (let j = 0; j <= BOARD_HEIGHT; j++) {
      ctx.beginPath();
      ctx.moveTo(x, y + j * cell);
      ctx.lineTo(x + w, y + j * cell);
      ctx.stroke();
    }
    // Marco dorado
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
    ctx.restore();
  }

  function drawCell(cx, cy, color, cell, opts = {}) {
    const px = cx;
    const py = cy;
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(px + 1, py + 1, cell - 2, cell - 2);
    // Sillería medieval: bisel + mortero
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 2, py + 2, cell - 4, cell - 4);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + 3, py + 3);
    ctx.lineTo(px + cell - 3, py + 3);
    ctx.moveTo(px + 3, py + 3);
    ctx.lineTo(px + 3, py + cell - 3);
    ctx.stroke();
    if (opts.ghost) {
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(px + 2, py + 2, cell - 4, cell - 4);
    }
    if (opts.active) {
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1, py + 1, cell - 2, cell - 2);
    }
    ctx.restore();
  }

  function drawPlayfield(state) {
    const { x, y, cell } = boardPx;
    // Celdas fijas
    for (let r = 0; r < BOARD_HEIGHT; r++) {
      for (let c = 0; c < BOARD_WIDTH; c++) {
        const v = state.board[r][c];
        if (v) drawCell(x + c * cell, y + r * cell, v.color, cell);
      }
    }
    if (!state.piece || state.status === 'over') return;

    // Fantasma
    const gy = ghostY(state);
    const ghostCells = getCells(state.piece.type, state.piece.rotation, state.piece.x, gy);
    const gColor = (CASAS[state.piece.type] || {}).color || '#888';
    for (const [cx, cy] of ghostCells) {
      if (cy >= 0) drawCell(x + cx * cell, y + cy * cell, gColor, cell, { ghost: true });
    }

    // Pieza activa
    const cells = getCells(state.piece.type, state.piece.rotation, state.piece.x, state.piece.y);
    for (const [cx, cy] of cells) {
      if (cy >= 0) drawCell(x + cx * cell, y + cy * cell, gColor, cell, { active: true });
    }
  }

  function drawNext(type, canvasNext) {
    if (!canvasNext) return;
    const c = canvasNext.getContext('2d');
    const w = canvasNext.width;
    const h = canvasNext.height;
    c.clearRect(0, 0, w, h);
    if (!type) return;
    const cells = getCells(type, 0, 0, 0);
    const xs = cells.map((p) => p[0]);
    const ys = cells.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const size = 20;
    const pw = (maxX - minX + 1) * size;
    const ph = (maxY - minY + 1) * size;
    const ox = (w - pw) / 2 - minX * size;
    const oy = (h - ph) / 2 - minY * size;
    const color = (CASAS[type] || {}).color || '#888';
    for (const [cx, cy] of cells) {
      const px = ox + cx * size;
      const py = oy + cy * size;
      c.fillStyle = color;
      c.fillRect(px + 1, py + 1, size - 2, size - 2);
      c.strokeStyle = 'rgba(0,0,0,0.5)';
      c.strokeRect(px + 2, py + 2, size - 4, size - 4);
      c.strokeStyle = 'rgba(255,255,255,0.2)';
      c.strokeRect(px + 3, py + 3, size - 6, size - 6);
    }
  }

  function render(state) {
    resize();
    drawScene(state.level || 1);
    drawBoardFrame();
    drawPlayfield(state);
    drawNext(state.nextType, document.getElementById('next-canvas'));
  }

  resize();
  return { render, resize, drawNext, get boardPx() { return boardPx; } };
}
