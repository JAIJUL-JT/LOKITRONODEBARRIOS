// Render vectorial en Canvas 2D. Sin imágenes externas.
// Paisaje medieval con parallax, heroína, trasgos, monedas y castillo meta.

import {
  GROUND_Y,
  HEROES,
  LOGICAL_HEIGHT,
  PLAYER,
  THEMES,
} from './core.js';

function roundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function fitCanvas(canvas) {
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
  const cssW = canvas.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 480);
  const cssH = canvas.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);
  const targetW = Math.max(1, Math.round(cssW * dpr));
  const targetH = Math.max(1, Math.round(cssH * dpr));
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  const scale = cssH / LOGICAL_HEIGHT;
  const logicalWidth = Math.max(320, cssW / scale);
  return { dpr, scale, logicalWidth, cssW, cssH };
}

function frac(value) {
  return value - Math.floor(value);
}

function drawSky(ctx, theme, width, time, reducedMotion) {
  const gradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  gradient.addColorStop(0, theme.sky[0]);
  gradient.addColorStop(1, theme.sky[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, GROUND_Y);

  // Sol / luna.
  const sunX = width * 0.78;
  const sunY = 132;
  const sunR = 48;
  const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 2.8);
  glow.addColorStop(0, 'rgba(255,255,255,0.85)');
  glow.addColorStop(0.35, 'rgba(255,255,255,0.22)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = theme.sun;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  // Nubes.
  const drift = reducedMotion ? 0 : (time * 10) % (width + 320);
  ctx.fillStyle = theme.cloud;
  ctx.globalAlpha = 0.7;
  drawCloud(ctx, ((width * 0.12 + drift) % (width + 300)) - 150, 104, 1.05);
  drawCloud(ctx, ((width * 0.52 + drift * 0.6) % (width + 300)) - 150, 172, 0.8);
  drawCloud(ctx, ((width * 0.84 + drift * 0.85) % (width + 300)) - 150, 82, 0.62);
  ctx.globalAlpha = 1;
}

function drawCloud(ctx, x, y, scale) {
  ctx.beginPath();
  ctx.arc(x, y, 25 * scale, 0, Math.PI * 2);
  ctx.arc(x + 30 * scale, y - 12 * scale, 33 * scale, 0, Math.PI * 2);
  ctx.arc(x + 68 * scale, y, 25 * scale, 0, Math.PI * 2);
  ctx.rect(x, y, 68 * scale, 24 * scale);
  ctx.fill();
}

function drawHillBand(ctx, color, baseY, amp, wavelength, parallax, cameraX, width) {
  const offset = cameraX * parallax;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-wavelength, GROUND_Y);
  for (let x = -wavelength; x <= width + wavelength; x += 22) {
    const phase = ((x + offset) / wavelength) * Math.PI * 2;
    const y = baseY - Math.sin(phase) * amp - Math.cos(phase * 0.5) * amp * 0.35;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width + wavelength, GROUND_Y);
  ctx.lineTo(-wavelength, GROUND_Y);
  ctx.closePath();
  ctx.fill();
}

function drawCastleSilhouette(ctx, x, baseY, scale, color) {
  ctx.fillStyle = color;
  const keepW = 88 * scale;
  const keepH = 150 * scale;
  const bodyTop = baseY - keepH;

  ctx.fillRect(x, bodyTop, keepW, keepH);

  // Almenas del cuerpo central.
  const merlon = 16 * scale;
  for (let mx = x; mx < x + keepW; mx += merlon * 2) {
    ctx.fillRect(mx, bodyTop - 14 * scale, merlon, 14 * scale);
  }

  // Torres laterales.
  const towerW = 30 * scale;
  const towerH = 190 * scale;
  for (const tx of [x - towerW + 8 * scale, x + keepW - 8 * scale]) {
    ctx.fillRect(tx, baseY - towerH, towerW, towerH);
    for (let mx = tx; mx < tx + towerW; mx += 12 * scale) {
      ctx.fillRect(mx, baseY - towerH - 11 * scale, 7 * scale, 11 * scale);
    }
    // Tejado cónico.
    ctx.beginPath();
    ctx.moveTo(tx - 6 * scale, baseY - towerH);
    ctx.lineTo(tx + towerW / 2, baseY - towerH - 46 * scale);
    ctx.lineTo(tx + towerW + 6 * scale, baseY - towerH);
    ctx.closePath();
    ctx.fill();
    // Mástil.
    ctx.fillRect(tx + towerW / 2 - 1 * scale, baseY - towerH - 70 * scale, 2 * scale, 26 * scale);
    ctx.beginPath();
    ctx.moveTo(tx + towerW / 2, baseY - towerH - 70 * scale);
    ctx.lineTo(tx + towerW / 2 + 20 * scale, baseY - towerH - 63 * scale);
    ctx.lineTo(tx + towerW / 2, baseY - towerH - 56 * scale);
    ctx.closePath();
    ctx.fill();
  }

  // Ventanas.
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#0b1018';
  for (let wy = bodyTop + 30 * scale; wy < baseY - 26 * scale; wy += 44 * scale) {
    ctx.fillRect(x + keepW * 0.28, wy, 9 * scale, 18 * scale);
    ctx.fillRect(x + keepW * 0.58, wy, 9 * scale, 18 * scale);
  }
  ctx.restore();
}

function drawCastleBand(ctx, color, parallax, cameraX, width, baseY) {
  const period = 640;
  const offset = ((cameraX * parallax) % period + period) % period;
  for (let base = -offset - period; base < width + period; base += period) {
    const index = Math.round((base + offset) / period);
    const scale = 0.82 + frac(Math.sin(index * 12.9898) * 43758.5453) * 0.35;
    drawCastleSilhouette(ctx, base + 130, baseY, scale, color);
  }
}

function drawPine(ctx, x, baseY, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - 2, baseY - h * 0.22, 4, h * 0.22);
  const tiers = 3;
  for (let i = 0; i < tiers; i += 1) {
    const tierW = w * (1 - i * 0.22);
    const tierTop = baseY - h + (h * 0.62 * i) / tiers;
    const tierBase = tierTop + h * 0.42;
    ctx.beginPath();
    ctx.moveTo(x, tierTop);
    ctx.lineTo(x - tierW / 2, tierBase);
    ctx.lineTo(x + tierW / 2, tierBase);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPineBand(ctx, color, parallax, cameraX, width, baseY) {
  const period = 138;
  const offset = ((cameraX * parallax) % period + period) % period;
  for (let x = -offset - period; x < width + period; x += period) {
    const index = Math.round((x + offset) / period);
    const seed = frac(Math.sin(index * 78.233) * 43758.5453);
    drawPine(ctx, x, baseY, 44 + seed * 24, 110 + seed * 90, color);
  }
}

function drawBackground(ctx, theme, width, time, reducedMotion, cameraX) {
  drawSky(ctx, theme, width, time, reducedMotion);

  drawHillBand(ctx, theme.far, 470, 70, 420, 0.08, cameraX, width);
  drawCastleBand(ctx, theme.far, 0.14, cameraX, width, 588);
  drawHillBand(ctx, theme.mid, 560, 54, 300, 0.22, cameraX, width);
  drawPineBand(ctx, theme.mid, 0.3, cameraX, width, 632);
  drawHillBand(ctx, theme.near, 640, 38, 210, 0.42, cameraX, width);
  drawPineBand(ctx, theme.near, 0.52, cameraX, width, 676);
}

function drawGrassTufts(ctx, platform, theme) {
  ctx.fillStyle = theme.groundTop;
  for (let x = platform.x + 12; x < platform.x + platform.w - 6; x += 46) {
    const h = 6 + frac(Math.sin(x * 3.17) * 91.7) * 8;
    ctx.beginPath();
    ctx.moveTo(x, platform.y);
    ctx.lineTo(x + 3, platform.y - h);
    ctx.lineTo(x + 6, platform.y);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPlatform(ctx, platform, theme) {
  if (platform.type === 'ground') {
    ctx.fillStyle = theme.ground;
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

    ctx.fillStyle = theme.groundTop;
    ctx.fillRect(platform.x, platform.y, platform.w, 16);

    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    for (let gx = platform.x + 20; gx < platform.x + platform.w - 20; gx += 58) {
      ctx.fillRect(gx, platform.y + 40, 28, 7);
      ctx.fillRect(gx + 20, platform.y + 72, 24, 7);
    }

    drawGrassTufts(ctx, platform, theme);
    return;
  }

  // Repisa de piedra flotante.
  ctx.fillStyle = theme.stone;
  roundRect(ctx, platform.x, platform.y, platform.w, platform.h, 9);
  ctx.fill();

  ctx.fillStyle = theme.stoneTop;
  roundRect(ctx, platform.x, platform.y, platform.w, 9, 6);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0,0,0,0.22)';
  ctx.lineWidth = 2;
  for (let gx = platform.x + 24; gx < platform.x + platform.w - 12; gx += 34) {
    ctx.beginPath();
    ctx.moveTo(gx, platform.y + 11);
    ctx.lineTo(gx, platform.y + platform.h - 4);
    ctx.stroke();
  }
}

function drawCoin(ctx, coin, time) {
  if (coin.collected) return;
  const bob = Math.sin(time * 4 + coin.x * 0.02) * 3;
  const cx = coin.x + coin.w / 2;
  const cy = coin.y + coin.h / 2 + bob;
  const spin = 0.35 + Math.abs(Math.cos(time * 3 + coin.x * 0.03)) * 0.65;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(spin, 1);

  const gradient = ctx.createRadialGradient(-4, -5, 2, 0, 0, 15);
  gradient.addColorStop(0, '#fff3b0');
  gradient.addColorStop(0.55, '#f3cf55');
  gradient.addColorStop(1, '#b8860b');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#8a5a0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#8a5a0b';
  ctx.font = 'bold 12px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A', 0, 1);
  ctx.restore();
}

function drawGoblin(ctx, enemy) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const wobble = Math.sin(enemy.phase) * 3;
  const dir = enemy.vx >= 0 ? 1 : -1;

  ctx.save();
  ctx.translate(cx, feetY);
  ctx.scale(dir, 1);

  // Patas.
  ctx.strokeStyle = '#3f5a24';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, -18);
  ctx.lineTo(-9 + wobble, -3);
  ctx.moveTo(8, -18);
  ctx.lineTo(9 - wobble, -3);
  ctx.stroke();

  // Cuerpo.
  ctx.fillStyle = '#6f9b3a';
  ctx.beginPath();
  ctx.ellipse(0, -27, 17, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Taparrabos.
  ctx.fillStyle = '#6b4a2a';
  ctx.fillRect(-13, -18, 26, 9);

  // Brazos.
  ctx.strokeStyle = '#6f9b3a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-13, -30);
  ctx.lineTo(-20, -20 + wobble * 0.5);
  ctx.moveTo(13, -30);
  ctx.lineTo(20, -22 - wobble * 0.5);
  ctx.stroke();

  // Cabeza.
  ctx.fillStyle = '#7ec850';
  ctx.beginPath();
  ctx.arc(0, -47, 13, 0, Math.PI * 2);
  ctx.fill();

  // Orejas.
  ctx.beginPath();
  ctx.moveTo(-11, -52);
  ctx.lineTo(-24, -60);
  ctx.lineTo(-12, -44);
  ctx.closePath();
  ctx.moveTo(11, -52);
  ctx.lineTo(24, -60);
  ctx.lineTo(12, -44);
  ctx.closePath();
  ctx.fill();

  // Ojos.
  ctx.fillStyle = '#f6e27a';
  ctx.beginPath();
  ctx.arc(-4, -49, 3.2, 0, Math.PI * 2);
  ctx.arc(5, -49, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a1414';
  ctx.beginPath();
  ctx.arc(-3.4, -49, 1.4, 0, Math.PI * 2);
  ctx.arc(5.6, -49, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Boca.
  ctx.strokeStyle = '#3f5a24';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-4, -41);
  ctx.lineTo(5, -41);
  ctx.stroke();

  // Garrote.
  ctx.strokeStyle = '#6b4a2a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(19, -22);
  ctx.lineTo(25, -42);
  ctx.stroke();
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath();
  ctx.arc(26, -45, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBat(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const cy = enemy.y + enemy.h / 2;
  const flap = Math.sin(time * 14 + enemy.phase) * 0.7;

  ctx.save();
  ctx.translate(cx, cy);

  // Alas.
  ctx.fillStyle = '#4a3560';
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side, 1);
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.quadraticCurveTo(20, -14 - flap * 12, 30, 2 - flap * 6);
    ctx.quadraticCurveTo(18, 4, 12, 10);
    ctx.quadraticCurveTo(8, 4, 2, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Cuerpo.
  ctx.fillStyle = '#5c4275';
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Orejas.
  ctx.beginPath();
  ctx.moveTo(-7, -8);
  ctx.lineTo(-4, -18);
  ctx.lineTo(0, -9);
  ctx.moveTo(7, -8);
  ctx.lineTo(4, -18);
  ctx.lineTo(0, -9);
  ctx.fill();

  // Ojos.
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(-3.5, -2, 2, 0, Math.PI * 2);
  ctx.arc(3.5, -2, 2, 0, Math.PI * 2);
  ctx.fill();

  // Colmillos.
  ctx.fillStyle = '#f4f1e8';
  ctx.beginPath();
  ctx.moveTo(-3, 6);
  ctx.lineTo(-1.5, 10);
  ctx.lineTo(0, 6);
  ctx.moveTo(3, 6);
  ctx.lineTo(1.5, 10);
  ctx.lineTo(0, 6);
  ctx.fill();

  ctx.restore();
}

function drawArcher(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);
  const wobble = Math.sin(enemy.phase) * 2;

  ctx.save();
  ctx.translate(cx, feetY);
  ctx.scale(dir, 1);

  // Piernas
  ctx.strokeStyle = '#2b2318';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, -18);
  ctx.lineTo(-7 + wobble, -2);
  ctx.moveTo(6, -18);
  ctx.lineTo(7 - wobble, -2);
  ctx.stroke();

  // Botas de cuero
  ctx.fillStyle = '#4a3319';
  roundRect(ctx, -10 + wobble, -4, 9, 5, 2);
  roundRect(ctx, 4 - wobble, -4, 9, 5, 2);
  ctx.fill();

  // Capa verde
  ctx.fillStyle = '#1e4828';
  ctx.beginPath();
  ctx.moveTo(-8, -44);
  ctx.quadraticCurveTo(-18, -28, -14, -12);
  ctx.lineTo(2, -18);
  ctx.closePath();
  ctx.fill();

  // Carcaj en la espalda
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(-12, -42, 6, 20);
  ctx.fillStyle = '#e5d7ba';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-13 + i * 2, -46, 1.5, 5);
  }

  // Túnica
  ctx.fillStyle = '#2f6336';
  ctx.beginPath();
  ctx.moveTo(-10, -44);
  ctx.lineTo(10, -44);
  ctx.lineTo(12, -18);
  ctx.lineTo(-12, -18);
  ctx.closePath();
  ctx.fill();

  // Cinturón
  ctx.fillStyle = '#3a2211';
  ctx.fillRect(-11, -28, 22, 5);
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(-3, -29, 6, 7);

  // Cabeza y capucha
  ctx.fillStyle = '#1e4828';
  ctx.beginPath();
  ctx.arc(0, -48, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -59);
  ctx.lineTo(12, -50);
  ctx.lineTo(2, -49);
  ctx.closePath();
  ctx.fill();

  // Rostro en sombra
  ctx.fillStyle = '#d9aa82';
  ctx.beginPath();
  ctx.arc(3, -48, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#112916';
  ctx.beginPath();
  ctx.arc(1, -49, 7.5, Math.PI * 0.7, Math.PI * 1.8);
  ctx.fill();

  // Ojo
  ctx.fillStyle = '#f7e27a';
  ctx.beginPath();
  ctx.arc(5, -48, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Arco
  ctx.strokeStyle = '#5c3a1e';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(16, -34, 18, -Math.PI * 0.38, Math.PI * 0.38);
  ctx.stroke();

  // Cuerda del arco
  ctx.strokeStyle = '#f0ebe1';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(27, -46);
  if (enemy.aiming) {
    ctx.lineTo(8, -34);
    ctx.lineTo(27, -22);
  } else {
    ctx.lineTo(27, -22);
  }
  ctx.stroke();

  if (enemy.aiming) {
    ctx.strokeStyle = '#8a5a2b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(7, -34);
    ctx.lineTo(32, -34);
    ctx.stroke();
    ctx.fillStyle = '#d4d8e0';
    ctx.beginPath();
    ctx.moveTo(35, -34);
    ctx.lineTo(31, -36);
    ctx.lineTo(31, -32);
    ctx.closePath();
    ctx.fill();
  }

  // Brazos
  ctx.strokeStyle = '#2f6336';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, -40);
  ctx.lineTo(enemy.aiming ? 8 : 12, -34);
  ctx.moveTo(6, -40);
  ctx.lineTo(22, -34);
  ctx.stroke();

  ctx.restore();
}

function drawGolem(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);
  const stomp = Math.sin(enemy.phase) * 3;

  ctx.save();
  ctx.translate(cx, feetY);
  ctx.scale(dir, 1);

  // Pies masivos
  ctx.fillStyle = '#4a4742';
  roundRect(ctx, -24 + stomp, -12, 18, 12, 4);
  roundRect(ctx, 6 - stomp, -12, 18, 12, 4);
  ctx.fill();

  // Piernas
  ctx.fillStyle = '#5c5850';
  ctx.fillRect(-22 + stomp * 0.5, -28, 14, 18);
  ctx.fillRect(8 - stomp * 0.5, -28, 14, 18);

  // Torso
  ctx.fillStyle = '#6b665c';
  ctx.beginPath();
  ctx.moveTo(-28, -62);
  ctx.lineTo(28, -62);
  ctx.lineTo(20, -26);
  ctx.lineTo(-20, -26);
  ctx.closePath();
  ctx.fill();

  // Musgo
  ctx.fillStyle = '#557038';
  ctx.beginPath();
  ctx.arc(-12, -54, 7, 0, Math.PI * 2);
  ctx.arc(8, -38, 6, 0, Math.PI * 2);
  ctx.fill();

  // Grietas con brillo
  ctx.strokeStyle = '#e7a838';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -56);
  ctx.lineTo(-6, -46);
  ctx.lineTo(2, -36);
  ctx.stroke();

  // Hombros
  ctx.fillStyle = '#7a7469';
  roundRect(ctx, -34, -66, 16, 16, 4);
  roundRect(ctx, 18, -66, 16, 16, 4);
  ctx.fill();

  // Cabeza
  ctx.fillStyle = '#5a554c';
  roundRect(ctx, -14, -72, 28, 18, 5);
  ctx.fill();

  // Ojos brillantes
  ctx.fillStyle = '#ffd152';
  ctx.beginPath();
  ctx.arc(4, -63, 3, 0, Math.PI * 2);
  ctx.arc(14, -63, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(5, -63, 1.2, 0, Math.PI * 2);
  ctx.arc(15, -63, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Brazos
  ctx.fillStyle = '#504c44';
  roundRect(ctx, 18, -52 - stomp * 0.5, 14, 28, 6);
  roundRect(ctx, -32, -52 + stomp * 0.5, 14, 28, 6);
  ctx.fill();

  ctx.restore();
}

function drawSkeleton(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);
  const hopBob = enemy.vy !== 0 ? -4 : Math.sin(enemy.phase * 2) * 2;

  ctx.save();
  ctx.translate(cx, feetY + hopBob);
  ctx.scale(dir, 1);

  const bone = '#dedad2';
  const iron = '#585c66';

  // Piernas
  ctx.strokeStyle = bone;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-6, -18);
  ctx.lineTo(-8, -2);
  ctx.moveTo(6, -18);
  ctx.lineTo(8, -2);
  ctx.stroke();

  // Pies
  ctx.fillStyle = bone;
  ctx.fillRect(-11, -3, 6, 3);
  ctx.fillRect(5, -3, 6, 3);

  // Columna
  ctx.strokeStyle = bone;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(0, -42);
  ctx.stroke();

  // Costillas
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 4; i++) {
    const ry = -24 - i * 5;
    ctx.beginPath();
    ctx.arc(0, ry, 9 - i * 0.5, 0, Math.PI);
    ctx.stroke();
  }

  // Cráneo
  ctx.fillStyle = bone;
  ctx.beginPath();
  ctx.arc(0, -50, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-4, -43, 8, 4);

  // Ojos rojos brillantes
  ctx.fillStyle = '#1c1b18';
  ctx.beginPath();
  ctx.arc(3, -50, 2.5, 0, Math.PI * 2);
  ctx.arc(-3, -50, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff2222';
  ctx.beginPath();
  ctx.arc(3.5, -50, 1.2, 0, Math.PI * 2);
  ctx.arc(-2.5, -50, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Casco con cuernos
  ctx.fillStyle = iron;
  ctx.beginPath();
  ctx.arc(0, -53, 9.5, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-9.5, -54, 19, 3);

  ctx.fillStyle = '#eae2cf';
  ctx.beginPath();
  ctx.moveTo(-8, -55);
  ctx.quadraticCurveTo(-16, -65, -12, -70);
  ctx.lineTo(-6, -56);
  ctx.moveTo(8, -55);
  ctx.quadraticCurveTo(16, -65, 12, -70);
  ctx.lineTo(6, -56);
  ctx.fill();

  // Escudo redondo
  ctx.fillStyle = '#423326';
  ctx.beginPath();
  ctx.arc(-14, -32, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = iron;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = iron;
  ctx.beginPath();
  ctx.arc(-14, -32, 3, 0, Math.PI * 2);
  ctx.fill();

  // Brazo y espada
  ctx.strokeStyle = bone;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(6, -38);
  ctx.lineTo(16, -32);
  ctx.stroke();

  ctx.strokeStyle = '#8a8e99';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(16, -32);
  ctx.lineTo(28, -44);
  ctx.stroke();
  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(14, -36);
  ctx.lineTo(20, -30);
  ctx.stroke();

  ctx.restore();
}

function drawFireSnake(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);
  const slither = Math.sin(time * 8 + enemy.phase) * 3;

  ctx.save();
  ctx.translate(cx, feetY);
  ctx.scale(dir, 1);

  const segments = 5;
  for (let i = segments; i >= 0; i--) {
    const t = i / segments;
    const sx = -22 + t * 40;
    const sy = -10 + Math.sin(time * 8 + i * 0.9) * 4;
    const r = 9 - i * 0.8;

    ctx.fillStyle = i % 2 === 0 ? '#ff4400' : '#ffaa00';
    ctx.beginPath();
    ctx.moveTo(sx, sy - r);
    ctx.lineTo(sx - 3, sy - r - 8 - Math.sin(time * 12 + i) * 3);
    ctx.lineTo(sx + 3, sy - r);
    ctx.fill();

    ctx.fillStyle = i % 2 === 0 ? '#992222' : '#c9381e';
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff7722';
    ctx.beginPath();
    ctx.arc(sx, sy, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const hx = 20;
  const hy = -12 + slither;
  ctx.fillStyle = '#b82a1a';
  ctx.beginPath();
  ctx.ellipse(hx, hy, 12, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffbb00';
  ctx.beginPath();
  ctx.moveTo(hx - 4, hy - 6);
  ctx.lineTo(hx - 10, hy - 16);
  ctx.lineTo(hx - 1, hy - 8);
  ctx.fill();

  ctx.fillStyle = '#ffee44';
  ctx.beginPath();
  ctx.arc(hx + 4, hy - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#220800';
  ctx.fillRect(hx + 4.5, hy - 4, 1.2, 4);

  if (Math.sin(time * 10) > 0.3) {
    ctx.strokeStyle = '#ff3300';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(hx + 11, hy);
    ctx.lineTo(hx + 17, hy - 1);
    ctx.lineTo(hx + 21, hy - 3);
    ctx.moveTo(hx + 17, hy - 1);
    ctx.lineTo(hx + 21, hy + 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGargantua(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);
  const breath = Math.sin(time * 3 + enemy.phase) * 3;

  ctx.save();
  ctx.translate(cx, feetY);
  ctx.scale(dir, 1);

  // Pies y zapatones
  ctx.fillStyle = '#2b1d0c';
  roundRect(ctx, -26, -14, 24, 14, 4);
  roundRect(ctx, 4, -14, 24, 14, 4);
  ctx.fill();

  // Pantalones bombachos
  ctx.fillStyle = '#3a506b';
  ctx.fillRect(-24, -36, 48, 24);

  // Gran barriga / Torso (Gargantúa)
  ctx.fillStyle = '#b33939';
  ctx.beginPath();
  ctx.ellipse(0, -50 + breath * 0.5, 34, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cinturón dorado
  ctx.fillStyle = '#f39c12';
  ctx.fillRect(-28, -40, 56, 8);
  ctx.fillStyle = '#f1c40f';
  ctx.fillRect(-8, -42, 16, 12);

  // Gran cabeza con boca abierta legendaria de tragar niños/pintxos
  ctx.fillStyle = '#e8b88a';
  ctx.beginPath();
  ctx.arc(0, -74 + breath, 22, 0, Math.PI * 2);
  ctx.fill();

  // Boina / Txapela gigante
  ctx.fillStyle = '#1c1c1c';
  ctx.beginPath();
  ctx.ellipse(0, -88 + breath, 26, 8, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-4, -94 + breath, 8, 7);

  // Gran boca cavernosa
  ctx.fillStyle = '#190a05';
  ctx.beginPath();
  ctx.arc(6, -72 + breath, 11, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#ffffff'; // Dientes
  ctx.fillRect(1, -73 + breath, 4, 3);
  ctx.fillRect(7, -73 + breath, 4, 3);

  // Ojos risueños y bigote
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(4, -80 + breath, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(5, -80 + breath, 2, 0, Math.PI * 2);
  ctx.fill();

  // Bigotazo
  ctx.fillStyle = '#4a2810';
  ctx.beginPath();
  ctx.moveTo(-6, -73 + breath);
  ctx.quadraticCurveTo(6, -70 + breath, 18, -75 + breath);
  ctx.lineTo(8, -71 + breath);
  ctx.fill();

  ctx.restore();
}

function drawBasajaun(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);
  const hop = enemy.vy < 0 ? -4 : 0;

  ctx.save();
  ctx.translate(cx, feetY);
  ctx.scale(dir, 1);

  // Pies (uno humano, otro de pezuña circular)
  ctx.fillStyle = '#422a1d';
  roundRect(ctx, -20, -12 + hop, 18, 12, 4);
  ctx.beginPath();
  ctx.arc(14, -6 + hop, 8, 0, Math.PI * 2); // Pezuña redondeada del Basajaun
  ctx.fill();

  // Gran cuerpo cubierto de denso pelaje de bosque
  ctx.fillStyle = '#5c3a21';
  ctx.beginPath();
  ctx.ellipse(0, -42 + hop, 26, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mechones de pelo / musgo
  ctx.fillStyle = '#3f5e28';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(-14 + i * 7, -35 - (i % 2) * 12 + hop, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Barba y melena hasta las rodillas
  ctx.fillStyle = '#7a5230';
  ctx.beginPath();
  ctx.moveTo(-22, -64 + hop);
  ctx.lineTo(22, -64 + hop);
  ctx.lineTo(14, -20 + hop);
  ctx.lineTo(-14, -20 + hop);
  ctx.closePath();
  ctx.fill();

  // Cabeza bondadosa pero imponente
  ctx.fillStyle = '#d49b6a';
  ctx.beginPath();
  ctx.arc(0, -66 + hop, 15, 0, Math.PI * 2);
  ctx.fill();

  // Ojos nobles protectores de los rebaños
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-6, -70 + hop, 4, 4);
  ctx.fillRect(4, -70 + hop, 4, 4);
  ctx.fillStyle = '#27ae60';
  ctx.fillRect(-5, -69 + hop, 2, 2);
  ctx.fillRect(5, -69 + hop, 2, 2);

  // Bastón o makila de pastor
  ctx.strokeStyle = '#c8a050';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(18, -75 + hop);
  ctx.lineTo(24, 0);
  ctx.stroke();

  ctx.restore();
}

function drawTartalo(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);

  ctx.save();
  ctx.translate(cx, feetY);
  ctx.scale(dir, 1);

  // Piernas ciclópeas
  ctx.fillStyle = '#3d312a';
  ctx.fillRect(-18, -26, 14, 26);
  ctx.fillRect(6, -26, 14, 26);

  // Torso de gigante cavernícola
  ctx.fillStyle = '#54463d';
  roundRect(ctx, -26, -58, 52, 34, 6);
  ctx.fill();

  // Cabeza con un solo ojo central en la frente
  ctx.fillStyle = '#7d6b5e';
  ctx.beginPath();
  ctx.arc(0, -65, 18, 0, Math.PI * 2);
  ctx.fill();

  // Gran ojo ciclópeo brillante (Tartalo)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(2, -66, 8, 0, Math.PI * 2);
  ctx.fill();
  const eyeGlow = Math.sin(time * 8) * 1.5;
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(3, -66, 4 + eyeGlow * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2c0b07';
  ctx.beginPath();
  ctx.arc(3.5, -66, 2, 0, Math.PI * 2);
  ctx.fill();

  // Gran maza de piedra
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(18, -60, 6, 40);
  ctx.fillStyle = '#2f3542';
  ctx.beginPath();
  ctx.arc(21, -64, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawIratxo(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);
  const hop = Math.abs(Math.sin(time * 10 + enemy.phase)) * 6;

  ctx.save();
  ctx.translate(cx, feetY - hop);
  ctx.scale(dir, 1);

  // Duendecillo travieso veloz (Iratxo)
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(-8, -20, 16, 14);

  // Cabeza con gorro puntiagudo rojo
  ctx.fillStyle = '#f5cd79';
  ctx.beginPath();
  ctx.arc(0, -25, 9, 0, Math.PI * 2);
  ctx.fill();

  // Gorro cónico tradicional
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.moveTo(-10, -28);
  ctx.lineTo(0, -42);
  ctx.lineTo(10, -28);
  ctx.closePath();
  ctx.fill();

  // Ojos pícaros
  ctx.fillStyle = '#111';
  ctx.fillRect(2, -26, 2, 3);

  // Piernas ágiles
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-4, -6);
  ctx.lineTo(-6, 0);
  ctx.moveTo(4, -6);
  ctx.lineTo(6, 0);
  ctx.stroke();

  ctx.restore();
}

function drawWorm(ctx, enemy, time) {
  const cx = enemy.x + enemy.w / 2;
  const feetY = enemy.y + enemy.h;
  const dir = enemy.facing || (enemy.vx >= 0 ? 1 : -1);

  ctx.save();
  ctx.translate(cx, feetY);
  ctx.scale(dir, 1);

  // Gusano rasante
  const segments = 4;
  for (let i = segments; i >= 0; i--) {
    const sx = -16 + i * 8;
    const sy = -6 + Math.sin(time * 8 + i * 1.2) * 3;
    ctx.fillStyle = i % 2 === 0 ? '#6ab04c' : '#badc58';
    ctx.beginPath();
    ctx.arc(sx, sy, 7 - i * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Ojo del gusano
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(14, -8, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEnemy(ctx, enemy, time) {
  if (!enemy.alive) return;
  if (enemy.hitFlash > 0) {
    ctx.save();
    ctx.filter = 'brightness(2.2)';
  }
  if (enemy.type === 'bat') drawBat(ctx, enemy, time);
  else if (enemy.type === 'archer') drawArcher(ctx, enemy, time);
  else if (enemy.type === 'golem') drawGolem(ctx, enemy, time);
  else if (enemy.type === 'skeleton') drawSkeleton(ctx, enemy, time);
  else if (enemy.type === 'fire_snake') drawFireSnake(ctx, enemy, time);
  else if (enemy.type === 'gargantua') drawGargantua(ctx, enemy, time);
  else if (enemy.type === 'basajaun') drawBasajaun(ctx, enemy, time);
  else if (enemy.type === 'tartalo') drawTartalo(ctx, enemy, time);
  else if (enemy.type === 'iratxo') drawIratxo(ctx, enemy, time);
  else if (enemy.type === 'worm') drawWorm(ctx, enemy, time);
  else drawGoblin(ctx, enemy);
  if (enemy.hitFlash > 0) {
    ctx.restore();
  }
}

function drawGoal(ctx, goal, theme, time, reducedMotion) {
  const { x, y, w, h } = goal;
  const baseY = y + h;

  // Resplandor del portal.
  const glow = ctx.createRadialGradient(
    x + w / 2,
    baseY - h * 0.36,
    10,
    x + w / 2,
    baseY - h * 0.36,
    w
  );
  glow.addColorStop(0, 'rgba(245, 215, 110, 0.35)');
  glow.addColorStop(1, 'rgba(245, 215, 110, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + w / 2, baseY - h * 0.36, w, 0, Math.PI * 2);
  ctx.fill();

  // Torres laterales.
  ctx.fillStyle = theme.stone;
  ctx.fillRect(x - 26, baseY - h, 40, h);
  ctx.fillRect(x + w - 14, baseY - h, 40, h);

  // Muro central.
  ctx.fillStyle = theme.stone;
  ctx.fillRect(x, baseY - h * 0.82, w, h * 0.82);

  // Almenas.
  ctx.fillStyle = theme.stone;
  for (let mx = x; mx < x + w; mx += 26) {
    ctx.fillRect(mx, baseY - h * 0.82 - 14, 16, 14);
  }
  for (const tx of [x - 26, x + w - 14]) {
    for (let mx = tx; mx < tx + 40; mx += 14) {
      ctx.fillRect(mx, baseY - h - 12, 8, 12);
    }
  }

  // Portal.
  ctx.fillStyle = '#141a22';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.3, baseY);
  ctx.lineTo(x + w * 0.3, baseY - h * 0.42);
  ctx.quadraticCurveTo(x + w * 0.5, baseY - h * 0.58, x + w * 0.7, baseY - h * 0.42);
  ctx.lineTo(x + w * 0.7, baseY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Estandarte.
  const wave = reducedMotion ? 0 : Math.sin(time * 4) * 3;
  ctx.fillStyle = theme.accent;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, baseY - h * 0.82 - 14);
  ctx.lineTo(x + w / 2, baseY - h - 34);
  ctx.lineTo(x + w / 2 + 30 + wave, baseY - h - 26);
  ctx.lineTo(x + w / 2, baseY - h - 18);
  ctx.closePath();
  ctx.fill();

  // Emblema del estandarte.
  ctx.fillStyle = '#7a2a2a';
  ctx.beginPath();
  ctx.arc(x + w / 2 + 10, baseY - h - 24, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawHazard(ctx, hazard, time) {
  if (hazard.type === 'spikes') {
    const { x, y, w, h } = hazard;
    ctx.save();
    ctx.fillStyle = '#363940';
    ctx.fillRect(x, y + h - 4, w, 4);

    const count = Math.max(3, Math.floor(w / 14));
    const step = w / count;
    for (let i = 0; i < count; i++) {
      const bx = x + i * step;
      ctx.fillStyle = '#7a7f8c';
      ctx.beginPath();
      ctx.moveTo(bx, y + h - 3);
      ctx.lineTo(bx + step * 0.5, y);
      ctx.lineTo(bx + step, y + h - 3);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#c5ccd8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + step * 0.5, y);
      ctx.lineTo(bx + step * 0.5, y + h - 3);
      ctx.stroke();
    }
    ctx.restore();
  } else if (hazard.type === 'fire') {
    const { x, y, w, h, active } = hazard;
    ctx.save();
    ctx.fillStyle = '#2b2622';
    ctx.fillRect(x - 2, y + h - 6, w + 4, 6);
    ctx.strokeStyle = '#181512';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 2, y + h - 6, w + 4, 6);

    if (active) {
      const flameHeight = h + Math.sin(time * 16) * 12;
      const glow = ctx.createLinearGradient(x + w / 2, y + h, x + w / 2, y + h - flameHeight);
      glow.addColorStop(0, 'rgba(255, 60, 0, 0.95)');
      glow.addColorStop(0.5, 'rgba(255, 160, 0, 0.9)');
      glow.addColorStop(1, 'rgba(255, 240, 100, 0.2)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.moveTo(x, y + h - 6);
      ctx.quadraticCurveTo(x - 6 + Math.sin(time * 20) * 4, y + h - flameHeight * 0.5, x + w / 2, y + h - flameHeight);
      ctx.quadraticCurveTo(x + w + 6 - Math.sin(time * 20) * 4, y + h - flameHeight * 0.5, x + w, y + h - 6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x + 6, y + h - 6);
      ctx.quadraticCurveTo(x + w / 2, y + h - flameHeight * 0.7, x + w / 2, y + h - flameHeight * 0.85);
      ctx.quadraticCurveTo(x + w / 2, y + h - flameHeight * 0.7, x + w - 6, y + h - 6);
      ctx.closePath();
      ctx.fill();
    } else {
      const pulse = (Math.sin(time * 4) + 1) * 0.5;
      ctx.fillStyle = `rgba(255, ${Math.floor(80 + pulse * 60)}, 0, ${0.4 + pulse * 0.4})`;
      ctx.fillRect(x + 2, y + h - 5, w - 4, 3);
    }
    ctx.restore();
  }
}

function drawDenda(ctx, denda, time) {
  const { x, y, w, h } = denda;
  ctx.save();

  // Base de piedra
  ctx.fillStyle = '#524b42';
  roundRect(ctx, x, y + h - 30, w, 30, 4);
  ctx.fill();

  // Paredes de yeso y vigas
  ctx.fillStyle = '#ded1ba';
  ctx.fillRect(x + 6, y + 20, w - 12, h - 50);

  ctx.strokeStyle = '#4a3319';
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 6, y + 20, w - 12, h - 50);
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 20);
  ctx.lineTo(x + 40, y + h - 30);
  ctx.moveTo(x + w - 6, y + 20);
  ctx.lineTo(x + w - 40, y + h - 30);
  ctx.stroke();

  // Puerta de roble
  ctx.fillStyle = '#3a2211';
  roundRect(ctx, x + w / 2 - 20, y + h - 45, 40, 45, 4);
  ctx.fill();
  ctx.strokeStyle = '#22140a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ventana iluminada
  ctx.fillStyle = '#ffea7a';
  roundRect(ctx, x + 20, y + 36, 26, 26, 3);
  ctx.fill();
  ctx.strokeStyle = '#4a3319';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 33, y + 36);
  ctx.lineTo(x + 33, y + 62);
  ctx.moveTo(x + 20, y + 49);
  ctx.lineTo(x + 46, y + 49);
  ctx.stroke();

  // Toldo a rayas
  const canopyY = y + 16;
  const stripes = 7;
  const stripeW = w / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#9b2b2b' : '#e6b840';
    ctx.beginPath();
    ctx.moveTo(x + i * stripeW, canopyY);
    ctx.lineTo(x + (i + 1) * stripeW, canopyY);
    ctx.lineTo(x + (i + 1) * stripeW + 4, canopyY + 16);
    ctx.arc(x + (i + 0.5) * stripeW + 2, canopyY + 16, stripeW * 0.5, 0, Math.PI);
    ctx.lineTo(x + i * stripeW, canopyY);
    ctx.closePath();
    ctx.fill();
  }

  // Tejado
  ctx.fillStyle = '#3a3d45';
  ctx.beginPath();
  ctx.moveTo(x - 8, canopyY);
  ctx.lineTo(x + w / 2, y - 10);
  ctx.lineTo(x + w + 8, canopyY);
  ctx.closePath();
  ctx.fill();

  // Cartel colgante
  ctx.fillStyle = '#3a2211';
  ctx.fillRect(x + w - 38, y + 38, 30, 20);
  ctx.strokeStyle = '#c99f36';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + w - 38, y + 38, 30, 20);
  ctx.fillStyle = '#e6b840';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DENDA', x + w - 23, y + 51);

  // Farolillo
  ctx.strokeStyle = '#1a1815';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + w / 2 + 28, y + 28);
  ctx.lineTo(x + w / 2 + 28, y + 35);
  ctx.stroke();
  ctx.fillStyle = '#ffcc44';
  ctx.beginPath();
  ctx.arc(x + w / 2 + 28, y + 38, 4, 0, Math.PI * 2);
  ctx.fill();

  // Barril
  ctx.fillStyle = '#5c3a1e';
  roundRect(ctx, x - 14, y + h - 22, 16, 22, 3);
  ctx.fill();
  ctx.strokeStyle = '#2b1b0d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 14, y + h - 16);
  ctx.lineTo(x + 2, y + h - 16);
  ctx.moveTo(x - 14, y + h - 6);
  ctx.lineTo(x + 2, y + h - 6);
  ctx.stroke();

  // Rótulo flotante
  const bob = Math.sin(time * 3) * 3;
  ctx.fillStyle = 'rgba(10, 8, 5, 0.88)';
  roundRect(ctx, x + w / 2 - 58, y - 36 + bob, 116, 22, 11);
  ctx.fill();
  ctx.strokeStyle = '#e6b840';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#f7d76b';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DENDA 🪙 ENTRAR', x + w / 2, y - 25 + bob);

  ctx.restore();
}

function drawProjectile(ctx, projectile, time) {
  const { x, y, w, h, type, vx, vy, owner } = projectile;
  ctx.save();
  const angle = Math.atan2(vy, vx);
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angle);

  if (type === 'bow' || (type === 'arrow' && owner === 'player')) {
    ctx.strokeStyle = '#5c3a1e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(w / 2 - 4, 0);
    ctx.stroke();

    ctx.fillStyle = '#e2e6ed';
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2 - 6, -3.5);
    ctx.lineTo(w / 2 - 6, 3.5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e6b840';
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(-w / 2 - 4, -4);
    ctx.lineTo(-w / 2 + 2, 0);
    ctx.lineTo(-w / 2 - 4, 4);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'daggers') {
    const spin = time * 24;
    ctx.rotate(spin);
    ctx.fillStyle = '#d4d8e0';
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(3.5, 0);
    ctx.lineTo(0, 9);
    ctx.lineTo(-3.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#5c3a1e';
    ctx.fillRect(-2, 4, 4, 6);
  } else if (type === 'arrow') {
    ctx.strokeStyle = '#3a2218';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(w / 2 - 4, 0);
    ctx.stroke();

    ctx.fillStyle = '#8a2b2b';
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2 - 5, -3);
    ctx.lineTo(w / 2 - 5, 3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#6b1c1c';
    ctx.fillRect(-w / 2 - 3, -3, 4, 6);
  } else if (type === 'fireball') {
    const rad = w / 2;
    const pulse = Math.sin(time * 18) * 2;
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, rad + 4);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#ffea44');
    grad.addColorStop(0.7, '#ff5500');
    grad.addColorStop(1, 'rgba(255, 30, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, rad + pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawHero(ctx, player, heroId, upgrades, weapons, time) {
  // Compatibilidad con llamadas antiguas (3 args: player, upgrades/time, weapons/time)
  if (typeof heroId === 'number') {
    time = heroId; heroId = 'aritza'; upgrades = {}; weapons = {};
  } else if (typeof upgrades === 'number') {
    time = upgrades; upgrades = {}; weapons = {};
  }
  upgrades = upgrades || {};
  weapons = weapons || {};
  time = typeof time === 'number' ? time : 0;

  const hero = HEROES[heroId] || HEROES.aritza;
  const { skin, hair, hairStyle, hasDiadem, diademColor } = hero;
  const tunic = upgrades.clothing === 'paños' ? '#c8b89a' : hero.tunic;
  const tunicDark = upgrades.clothing === 'paños' ? '#a0917a' : hero.tunicDark;
  const inPaños = upgrades.clothing === 'paños';

  const cx = player.x + player.w / 2;
  const feetY = player.y + player.h;
  const airborne = !player.onGround;

  // Sombra bajo los pies
  if (!airborne) {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(cx, feetY + 4, 24, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const blink = player.invulnerable > 0 && Math.floor(time * 18) % 2 === 0;
  ctx.save();
  if (blink) ctx.globalAlpha = 0.4;

  ctx.translate(cx, feetY);
  ctx.scale(player.facing, 1);
  const speedRatio = Math.min(1, Math.abs(player.vx) / PLAYER.maxSpeed);
  const swing = airborne ? 0.5 : Math.sin(player.runPhase) * (0.35 + speedRatio * 0.65);
  const bob = airborne ? 0 : Math.abs(Math.sin(player.runPhase)) * 1.6;
  const flutter = Math.sin(time * 7 + player.runPhase) * 5;

  ctx.translate(0, -bob);

  const gold = '#e7c15a';
  const hasBoots = Boolean(upgrades.doubleJump);
  const boots = hasBoots ? '#e7c15a' : '#2a1c18';

  // Capa (solo si está equipada)
  if (upgrades.cape) {
    ctx.fillStyle = '#8f2f3f';
    ctx.beginPath();
    ctx.moveTo(-9, -48);
    ctx.quadraticCurveTo(-32 - flutter, -30, -25 - flutter, 2);
    ctx.quadraticCurveTo(-13, -12, -3, -16);
    ctx.closePath();
    ctx.fill();
  }

  // Arma en la espalda
  if (weapons.equipped === 'bow') {
    ctx.strokeStyle = '#5c3a1e';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(-8, -38, 22, Math.PI * 0.6, Math.PI * 1.4);
    ctx.stroke();
  }

  // Piernas
  const legSwing = airborne ? 0.55 : Math.sin(player.runPhase);
  const legSwingBack = airborne ? -0.55 : Math.sin(player.runPhase + Math.PI);
  const footY = airborne ? -16 : -6;
  const backFootX = -4 + legSwing * 12;
  const frontFootX = 5 + legSwingBack * 12;

  // Color de piernas: pantalón largo (oscuro) o pantalón corto (claro)
  const pantColor = inPaños ? '#c8a87a' : '#3b2a25';
  ctx.strokeStyle = pantColor;
  ctx.lineWidth = inPaños ? 7 : 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-4, -24);
  ctx.lineTo(backFootX, footY);
  ctx.moveTo(5, -24);
  ctx.lineTo(frontFootX, footY);
  ctx.stroke();

  // Botas
  ctx.fillStyle = boots;
  roundRect(ctx, backFootX - 6, footY - 2, 15, 7, 3);
  roundRect(ctx, frontFootX - 6, footY - 2, 15, 7, 3);
  ctx.fill();

  if (hasBoots) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(backFootX - 6, footY);
    ctx.lineTo(backFootX - 12, footY - 6 + Math.sin(time * 12) * 2);
    ctx.lineTo(backFootX - 3, footY - 2);
    ctx.moveTo(frontFootX - 6, footY);
    ctx.lineTo(frontFootX - 12, footY - 6 - Math.sin(time * 12) * 2);
    ctx.lineTo(frontFootX - 3, footY - 2);
    ctx.fill();
  }

  // Cuerpo (túnica o camiseta)
  ctx.fillStyle = tunic;
  ctx.beginPath();
  if (inPaños) {
    // Camiseta corta: llega solo hasta la cadera
    ctx.moveTo(-11, -47);
    ctx.lineTo(11, -47);
    ctx.lineTo(14, -32);
    ctx.lineTo(-14, -32);
  } else {
    ctx.moveTo(-13, -47);
    ctx.lineTo(13, -47);
    ctx.lineTo(18, -20);
    ctx.lineTo(-18, -20);
  }
  ctx.closePath();
  ctx.fill();

  // Sombra lateral del cuerpo
  ctx.fillStyle = tunicDark;
  ctx.beginPath();
  if (inPaños) {
    ctx.moveTo(5, -47);
    ctx.lineTo(11, -47);
    ctx.lineTo(14, -32);
    ctx.lineTo(6, -32);
  } else {
    ctx.moveTo(6, -47);
    ctx.lineTo(13, -47);
    ctx.lineTo(18, -20);
    ctx.lineTo(7, -20);
  }
  ctx.closePath();
  ctx.fill();

  if (!inPaños) {
    // Cinturón
    ctx.fillStyle = gold;
    ctx.fillRect(-17, -33, 34, 6);
    ctx.fillStyle = '#8a5a0b';
    ctx.fillRect(-4, -34, 9, 8);

    if (weapons.equipped === 'daggers') {
      ctx.fillStyle = '#d4d8e0';
      ctx.fillRect(-8, -32, 3, 8);
      ctx.fillRect(5, -32, 3, 8);
    }

    // Ribete
    ctx.fillStyle = gold;
    ctx.fillRect(-18, -22, 36, 3.5);

    // Emblema
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(5, -37);
    ctx.lineTo(0, -32);
    ctx.lineTo(-5, -37);
    ctx.closePath();
    ctx.fill();
  } else {
    // Pantalón corto en paños menores
    ctx.fillStyle = '#a07850';
    ctx.fillRect(-14, -24, 28, 10);
  }

  // Armadura encima de la túnica
  if (upgrades.armorHits > 0) {
    ctx.fillStyle = '#7a8a9a';
    ctx.beginPath();
    ctx.moveTo(-14, -47);
    ctx.lineTo(14, -47);
    ctx.lineTo(16, -22);
    ctx.lineTo(-16, -22);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#a0b0c0';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Líneas decorativas del peto
    ctx.strokeStyle = '#5a6a7a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, -44); ctx.lineTo(-8, -24);
    ctx.moveTo(8, -44); ctx.lineTo(8, -24);
    ctx.moveTo(-14, -36); ctx.lineTo(14, -36);
    ctx.stroke();
  }

  // Ataque y Brazos
  const isAttacking = (player.attackTimer || 0) > 0;
  const armSwing = airborne ? -0.6 : Math.sin(player.runPhase + Math.PI) * 0.8;

  ctx.strokeStyle = tunic;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-11, -44);
  ctx.lineTo(-14 - armSwing * 10, -26);

  if (isAttacking) {
    ctx.moveTo(12, -44);
    ctx.lineTo(24, -34);
  } else {
    ctx.moveTo(12, -44);
    ctx.lineTo(16 + armSwing * 10, -26);
  }
  ctx.stroke();

  // Manos
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(-14 - armSwing * 10, -24, 4, 0, Math.PI * 2);
  if (isAttacking) {
    ctx.arc(24, -34, 4, 0, Math.PI * 2);
  } else {
    ctx.arc(16 + armSwing * 10, -24, 4, 0, Math.PI * 2);
  }
  ctx.fill();

  // Espada
  if (isAttacking) {
    const attackProgress = 1 - (player.attackTimer / 0.18);
    const isLong = upgrades.longSword;
    ctx.save();
    ctx.translate(24, -34);
    ctx.rotate(-0.35 + attackProgress * 0.95);

    // Guarda
    ctx.fillStyle = gold;
    ctx.fillRect(-3, -4, 6, isLong ? 14 : 12);
    // Hoja (más larga si es espada larga)
    const bladeLen = isLong ? 56 : 36;
    ctx.fillStyle = '#e8ecf4';
    ctx.beginPath();
    ctx.moveTo(3, -2);
    ctx.lineTo(bladeLen, -1);
    ctx.lineTo(bladeLen + 8, 1);
    ctx.lineTo(bladeLen, 3);
    ctx.lineTo(3, 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (isLong) {
      // Brillo adicional en la espada larga
      ctx.strokeStyle = 'rgba(150,200,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(6, 0); ctx.lineTo(bladeLen - 4, 0);
      ctx.stroke();
    }

    ctx.restore();

    // Estela luminosa
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 235, 170, 0.85)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(14, -32, isLong ? 58 : 44, -0.65, 0.65);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // Escudo frontal si tiene cargas
  if (upgrades.shieldHits > 0) {
    ctx.save();
    ctx.translate(isAttacking ? 2 : 18, -28);

    // Opacidad según cargas restantes
    const shieldAlpha = 0.5 + (upgrades.shieldHits / 3) * 0.5;
    ctx.globalAlpha = shieldAlpha;

    ctx.fillStyle = '#204b78';
    ctx.beginPath();
    ctx.moveTo(-9, -14);
    ctx.lineTo(9, -14);
    ctx.lineTo(9, 2);
    ctx.quadraticCurveTo(9, 16, 0, 22);
    ctx.quadraticCurveTo(-9, 16, -9, 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = gold;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.arc(0, 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Número de cargas
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(upgrades.shieldHits), 0, 4);

    if (player.shieldCooldown > 0) {
      ctx.strokeStyle = 'rgba(240, 210, 122, 0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 4, 26, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Cabeza — pelo trasero según estilo
  ctx.fillStyle = hair;
  if (hairStyle === 'long') {
    // Pelo largo Jainvs
    ctx.beginPath();
    ctx.moveTo(-8, -62);
    ctx.quadraticCurveTo(-28 - flutter * 0.5, -40, -22 - flutter * 0.3, -10);
    ctx.quadraticCurveTo(-8, -30, -1, -46);
    ctx.closePath();
    ctx.fill();
    // Segunda mecha
    ctx.beginPath();
    ctx.moveTo(6, -62);
    ctx.quadraticCurveTo(20 + flutter * 0.3, -40, 16, -18);
    ctx.quadraticCurveTo(10, -34, 2, -48);
    ctx.closePath();
    ctx.fill();
  } else if (hairStyle === 'medium') {
    // Pelo medio Aritza (original)
    ctx.beginPath();
    ctx.moveTo(-8, -62);
    ctx.quadraticCurveTo(-23 - flutter * 0.4, -48, -15 - flutter * 0.2, -23);
    ctx.quadraticCurveTo(-6, -38, -1, -46);
    ctx.closePath();
    ctx.fill();
  }
  // hairStyle 'short' (Jvlivs) no tiene pelo trasero largo

  // Cabeza
  const headW = heroId === 'jvlivs' ? 12 : 11;
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(1, -57, headW, 0, Math.PI * 2);
  ctx.fill();

  // Pelo superior
  ctx.fillStyle = hair;
  if (hairStyle === 'short') {
    // Pelo muy corto (Jvlivs)
    ctx.beginPath();
    ctx.arc(1, -58, headW + 0.5, Math.PI * 1.1, Math.PI * 1.9);
    ctx.lineTo(12, -54);
    ctx.quadraticCurveTo(2, -62, -10, -54);
    ctx.closePath();
    ctx.fill();
  } else {
    // Melena superior (Aritza / Jainvs)
    ctx.beginPath();
    ctx.arc(1, -58, headW + 0.5, Math.PI, Math.PI * 2);
    ctx.lineTo(12.5, -54);
    ctx.quadraticCurveTo(2, -64, -11, -54);
    ctx.closePath();
    ctx.fill();
    // Flequillo
    ctx.beginPath();
    ctx.moveTo(-8, -62);
    ctx.quadraticCurveTo(2, -70, 12, -62);
    ctx.quadraticCurveTo(6, -64, 0, -60);
    ctx.closePath();
    ctx.fill();
  }

  // Ojo
  ctx.fillStyle = '#2a1414';
  ctx.beginPath();
  ctx.arc(6, -56, 1.7, 0, Math.PI * 2);
  ctx.fill();

  // Mejilla (solo heroínas)
  if (heroId !== 'jvlivs') {
    ctx.fillStyle = 'rgba(220,120,120,0.5)';
    ctx.beginPath();
    ctx.arc(8, -52, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Diadema/barba según héroe
  if (hasDiadem && diademColor) {
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(1, -58, 10, Math.PI * 1.12, Math.PI * 1.9);
    ctx.stroke();
    ctx.fillStyle = diademColor;
    ctx.beginPath();
    ctx.arc(8, -66, 2.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (heroId === 'jvlivs') {
    // Barba corta Jvlivs
    ctx.fillStyle = 'rgba(60,30,10,0.5)';
    ctx.beginPath();
    ctx.arc(2, -50, 6, 0, Math.PI);
    ctx.fill();
  }

  ctx.restore();
}

export function drawHeroPortrait(ctx, heroId) {
  const dummyPlayer = {
    x: 0,
    y: 0,
    w: 90,
    h: 90,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: true,
    runPhase: 0,
    invulnerable: 0,
    attackTimer: 0,
    shieldCooldown: 0,
  };
  ctx.clearRect(0, 0, 90, 110);
  ctx.save();
  ctx.translate(0, 18);
  drawHero(ctx, dummyPlayer, heroId, { clothing: 'guerrero', cape: false, shieldHits: 0, armorHits: 0 }, {}, 0);
  ctx.restore();
}

function drawHeroine(ctx, player, upgradesOrTime, weaponsOrTime, maybeTime) {
  let upgrades = {}, weapons = {}, time = 0;
  if (typeof upgradesOrTime === 'number') {
    time = upgradesOrTime;
  } else {
    upgrades = upgradesOrTime || {};
    weapons = weaponsOrTime || {};
    time = typeof maybeTime === 'number' ? maybeTime : 0;
  }
  drawHero(ctx, player, 'aritza', upgrades, weapons, time);
}

function drawParticles(ctx, particles) {
  for (const particle of particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function render(ctx, state, view, time, options = {}) {
  const { reducedMotion = false, dimmed = false } = options;
  const width = view.logicalWidth;
  const theme = THEMES[state.themeIndex] || THEMES[0];
  const cameraX = state.cameraX || 0;

  ctx.setTransform(view.dpr * view.scale, 0, 0, view.dpr * view.scale, 0, 0);
  ctx.clearRect(0, 0, width, LOGICAL_HEIGHT);

  drawBackground(ctx, theme, width, time, reducedMotion, cameraX);

  ctx.save();
  ctx.translate(-cameraX, 0);

  const minX = cameraX - 80;
  const maxX = cameraX + width + 80;

  for (const platform of state.world.platforms) {
    if (platform.x + platform.w < minX || platform.x > maxX) continue;
    drawPlatform(ctx, platform, theme);
  }

  if (state.world.hazards) {
    for (const hazard of state.world.hazards) {
      if (hazard.x + hazard.w < minX || hazard.x > maxX) continue;
      drawHazard(ctx, hazard, time);
    }
  }

  if (state.world.denda) {
    drawDenda(ctx, state.world.denda, time);
  }

  drawGoal(ctx, state.world.goal, theme, time, reducedMotion);

  for (const coin of state.world.coins) {
    if (coin.x < minX || coin.x > maxX) continue;
    drawCoin(ctx, coin, time);
  }

  for (const enemy of state.world.enemies) {
    if (enemy.x + enemy.w < minX || enemy.x > maxX) continue;
    drawEnemy(ctx, enemy, time);
  }

  if (state.projectiles) {
    for (const projectile of state.projectiles) {
      if (projectile.x + projectile.w < minX || projectile.x > maxX) continue;
      drawProjectile(ctx, projectile, time);
    }
  }

  drawHero(ctx, state.player, state.heroId || 'aritza', state.upgrades || {}, state.weapons || {}, time);
  drawParticles(ctx, state.particles);

  ctx.restore();

  if (dimmed) {
    ctx.fillStyle = 'rgba(6, 8, 14, 0.6)';
    ctx.fillRect(0, 0, width, LOGICAL_HEIGHT);
  }
}
