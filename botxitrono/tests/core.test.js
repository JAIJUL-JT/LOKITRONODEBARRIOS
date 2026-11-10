import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ENEMY_DEFS,
  GROUND_Y,
  MAX_JUMP_DISTANCE,
  PLAYER,
  THEMES,
  animateIdle,
  clamp,
  createGameState,
  createLevel,
  enemyHitbox,
  finalScore,
  nextLevel,
  playerHitbox,
  rectsOverlap,
  setWorldWidth,
  step,
} from '../js/core.js';

function seededRng(seed = 12345) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function quietState(overrides = {}) {
  const s = createGameState({
    worldWidth: 480,
    level: 1,
    rng: seededRng(7),
    ...overrides,
  });
  return s;
}

function settle(state) {
  step(state, 1 / 60, {}, seededRng(1));
}

function makeGoblin(state, x, y = GROUND_Y - ENEMY_DEFS.goblin.h) {
  return {
    type: 'goblin',
    x,
    y,
    baseY: GROUND_Y,
    w: ENEMY_DEFS.goblin.w,
    h: ENEMY_DEFS.goblin.h,
    vx: 0,
    minX: 0,
    maxX: state.world.width,
    alive: true,
    phase: 0,
    score: ENEMY_DEFS.goblin.score,
  };
}

test('clamp limita por abajo y por arriba', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(42, 0, 10), 10);
});

test('createLevel es determinista', () => {
  const a = createLevel(3, seededRng(42));
  const b = createLevel(3, seededRng(42));
  assert.deepEqual(a, b);
  assert.equal(a.level, 3);
  assert.equal(a.themeIndex, 2 % THEMES.length);
});

test('cada nivel tiene suelo, spawn seguro y meta', () => {
  for (let level = 1; level <= 6; level += 1) {
    const world = createLevel(level, seededRng(100 + level));
    const ground = world.platforms.filter((p) => p.type === 'ground');
    assert.ok(ground.length >= 2);
    assert.equal(ground[0].x, 0);

    const spawnPlatform = ground.find(
      (p) => world.spawn.x >= p.x && world.spawn.x <= p.x + p.w
    );
    assert.ok(spawnPlatform, 'el spawn debe estar sobre el primer suelo');

    const goalPlatform = ground.find(
      (p) => world.goal.x >= p.x && world.goal.x + world.goal.w <= p.x + p.w
    );
    assert.ok(goalPlatform, 'la meta debe estar sobre suelo firme');
    assert.ok(world.goal.x + world.goal.w < world.width);
  }
});

test('los huecos son saltables', () => {
  for (let level = 1; level <= 8; level += 1) {
    const world = createLevel(level, seededRng(200 + level));
    const ground = world.platforms
      .filter((p) => p.type === 'ground')
      .sort((a, b) => a.x - b.x);
    for (let i = 1; i < ground.length; i += 1) {
      const gap = ground[i].x - (ground[i - 1].x + ground[i - 1].w);
      assert.ok(gap >= 0, 'el suelo no debe solaparse');
      assert.ok(
        gap <= MAX_JUMP_DISTANCE,
        `hueco ${gap} demasiado grande en nivel ${level}`
      );
    }
  }
});

test('createGameState arranca en juego con la heroína entera', () => {
  const state = quietState();
  assert.equal(state.status, 'playing');
  assert.equal(state.level, 1);
  assert.equal(state.score, 0);
  assert.equal(state.coins, 0);
  assert.equal(state.player.hearts, PLAYER.maxHearts);
  assert.equal(state.player.onGround, false);
});

test('la heroína cae y aterriza en el suelo', () => {
  const state = quietState();
  let landed = false;
  for (let i = 0; i < 120; i += 1) {
    const events = step(state, 1 / 60, {}, seededRng(i + 1));
    if (events.some((e) => e.type === 'land')) {
      landed = true;
      break;
    }
  }
  assert.equal(landed, true);
  assert.equal(state.player.onGround, true);
  assert.equal(state.player.y + state.player.h, GROUND_Y);
});

test('el salto impulsa hacia arriba y solo hay uno', () => {
  const state = quietState();
  settle(state);
  const rng = seededRng(2);
  const first = step(state, 1 / 60, { jump: true, jumpHeld: true }, rng);
  assert.ok(first.some((e) => e.type === 'jump'));
  assert.equal(state.player.onGround, false);
  assert.ok(state.player.vy < 0);

  const second = step(state, 1 / 60, { jump: true, jumpHeld: true }, rng);
  assert.equal(second.some((e) => e.type === 'jump'), false);
});

test('soltar el salto acorta la altura', () => {
  const held = quietState();
  settle(held);
  step(held, 1 / 60, { jump: true, jumpHeld: true }, seededRng(3));
  for (let i = 0; i < 12; i += 1) {
    step(held, 1 / 60, { jumpHeld: true }, seededRng(3));
  }
  const heldRise = held.player.y;

  const released = quietState();
  settle(released);
  step(released, 1 / 60, { jump: true, jumpHeld: false }, seededRng(3));
  for (let i = 0; i < 12; i += 1) {
    step(released, 1 / 60, { jumpHeld: false }, seededRng(3));
  }
  const releasedRise = released.player.y;

  assert.ok(releasedRise > heldRise, 'sin mantener el botón sube menos');
});

test('moverse a la derecha e izquierda cambia la posición', () => {
  const state = quietState();
  settle(state);
  const startX = state.player.x;

  for (let i = 0; i < 20; i += 1) {
    step(state, 1 / 60, { right: true }, seededRng(4));
  }
  assert.ok(state.player.x > startX);
  assert.equal(state.player.facing, 1);

  const rightX = state.player.x;
  for (let i = 0; i < 40; i += 1) {
    step(state, 1 / 60, { left: true }, seededRng(4));
  }
  assert.ok(state.player.x < rightX);
  assert.equal(state.player.facing, -1);
});

test('las monedas suman puntos y solo se recogen una vez', () => {
  const state = quietState();
  settle(state);
  const coin = {
    x: state.player.x + 10,
    y: GROUND_Y - 50,
    w: 26,
    h: 26,
    collected: false,
  };
  state.world.coins.push(coin);

  const events = step(state, 1 / 60, {}, seededRng(5));
  assert.equal(state.coins, 1);
  assert.equal(state.score, 10);
  assert.equal(coin.collected, true);
  assert.ok(events.some((e) => e.type === 'coin'));

  step(state, 1 / 60, {}, seededRng(5));
  assert.equal(state.coins, 1);
});

test('aplastar desde arriba derrota al trasgo y rebota', () => {
  const state = quietState();
  settle(state);
  const enemy = makeGoblin(state, state.player.x + 5);
  state.world.enemies.push(enemy);

  state.player.y = enemy.y - 54;
  state.player.vy = 300;
  state.player.onGround = false;

  const events = step(state, 1 / 60, {}, seededRng(6));
  assert.equal(enemy.alive, false);
  assert.equal(state.defeated, 1);
  assert.equal(state.score, ENEMY_DEFS.goblin.score);
  assert.equal(state.player.vy, PLAYER.stompBounce);
  assert.ok(events.some((e) => e.type === 'stomp'));
});

test('un golpe lateral rompe la ropa de guerrero y deja en paños menores', () => {
  const state = quietState();
  settle(state);
  state.world.enemies.push(makeGoblin(state, state.player.x + 5));

  const events = step(state, 1 / 60, {}, seededRng(8));
  assert.equal(state.player.hearts, PLAYER.maxHearts);
  assert.equal(state.upgrades.clothing, 'paños');
  assert.equal(state.status, 'playing');
  assert.ok(state.player.invulnerable > 0);
  assert.ok(events.some((e) => e.type === 'clothinglost'));

  // Segundo impacto ya en paños menores resta corazón
  state.player.invulnerable = 0;
  const events2 = step(state, 1 / 60, {}, seededRng(8));
  assert.equal(state.player.hearts, PLAYER.maxHearts - 1);
  assert.ok(events2.some((e) => e.type === 'hurt' && e.reason === 'enemy'));
});

test('sin corazones la aventura termina', () => {
  const state = quietState();
  settle(state);
  state.upgrades.clothing = 'paños';
  state.player.hearts = 1;
  state.world.enemies.push(makeGoblin(state, state.player.x + 5));

  const events = step(state, 1 / 60, {}, seededRng(9));
  assert.equal(state.status, 'dead');
  assert.equal(state.player.hearts, 0);
  assert.ok(events.some((e) => e.type === 'gameover'));

  const after = step(state, 1 / 60, {}, seededRng(9));
  assert.equal(after.length, 0);
});

test('caer al abismo cuesta un corazón y reaparece en el checkpoint', () => {
  const state = quietState();
  settle(state);
  const checkpoint = { x: state.checkpoint.x, y: state.checkpoint.y };

  state.player.y = 1200;
  const events = step(state, 1 / 60, {}, seededRng(10));

  assert.equal(state.player.hearts, PLAYER.maxHearts - 1);
  assert.ok(events.some((e) => e.type === 'hurt' && e.reason === 'fall'));
  assert.ok(events.some((e) => e.type === 'respawn'));
  assert.equal(state.player.x, checkpoint.x);
  assert.equal(state.player.y, checkpoint.y);
});

test('llegar al castillo completa el nivel', () => {
  const state = quietState();
  const goal = state.world.goal;
  state.player.x = goal.x + 20;
  state.player.y = GROUND_Y - state.player.h;
  state.player.vy = 0;

  const events = step(state, 1 / 60, {}, seededRng(11));
  assert.equal(state.status, 'won');
  assert.ok(events.some((e) => e.type === 'goal'));
  assert.ok(state.score >= 50 + state.level * 25);
});

test('nextLevel avanza, conserva puntos y cura un corazón', () => {
  const state = quietState();
  state.score = 120;
  state.coins = 4;
  state.player.hearts = 1;

  const beforeLevel = state.level;
  nextLevel(state, seededRng(12));

  assert.equal(state.level, beforeLevel + 1);
  assert.equal(state.status, 'playing');
  assert.equal(state.score, 120);
  assert.equal(state.coins, 4);
  assert.equal(state.player.hearts, 2);
  assert.equal(state.player.x, state.world.spawn.x);
  assert.equal(state.player.y, state.world.spawn.y);
});

test('la puntuación final usa los puntos acumulados', () => {
  const state = quietState();
  state.score = 345;
  assert.equal(finalScore(state), 345);
});

test('setWorldWidth recoloca la cámara sin salirse del mundo', () => {
  const state = quietState();
  setWorldWidth(state, 900);
  assert.equal(state.worldWidth, 900);
  assert.ok(state.cameraX >= 0);
  assert.ok(state.cameraX <= state.world.width - 900);
});

test('las hitboxes son más indulgentes que el dibujo', () => {
  const state = quietState();
  const body = { x: state.player.x, y: state.player.y, w: state.player.w, h: state.player.h };
  const box = playerHitbox(state.player);
  assert.ok(box.x > body.x);
  assert.ok(box.w < body.w);
  assert.ok(box.h < body.h);

  const enemy = makeGoblin(state, 100);
  const ebox = enemyHitbox(enemy);
  assert.ok(ebox.w < enemy.w);
  assert.ok(ebox.h < enemy.h);
});

// --- Tests añadidos para crouch y gusano ---

test('crouch se activa y desactiva correctamente', () => {
  const state = quietState();
  // Primer paso: pulsamos crouch (agacharse)
  step(state, 1 / 60, { crouchQueued: true, crouchHeld: true }, seededRng(20));
  assert.equal(state.player.crouching, true, 'el jugador debe estar agachado después del input');
  // Segundo paso: soltamos la tecla (no hay crouchQueued ni crouchHeld)
  step(state, 1 / 60, {}, seededRng(21));
  assert.equal(state.player.crouching, false, 'el jugador debe volver a estar de pie cuando se suelta el input');
});

// Helper para crear un gusano en el nivel
function makeWorm(state, x) {
  return {
    type: 'worm',
    x,
    y: GROUND_Y - ENEMY_DEFS.worm.h,
    baseY: GROUND_Y,
    w: ENEMY_DEFS.worm.w,
    h: ENEMY_DEFS.worm.h,
    vx: 0,
    minX: 0,
    maxX: state.world.width,
    alive: true,
    phase: 0,
    score: ENEMY_DEFS.worm.score,
  };
}

test('disparo mientras está agachado mata al gusano', () => {
  const state = quietState();
  state.weapons.bow = true;
  state.weapons.equipped = 'bow';
  settle(state);
  // colocar gusano a la derecha del jugador, a distancia de disparo
  const worm = makeWorm(state, state.player.x + 80);
  state.world.enemies.push(worm);
  // agacharse y disparar
  const events = step(state, 1 / 60, { crouchQueued: true, crouchHeld: true, shoot: true }, seededRng(22));
  // avanzar varios frames para que la flecha alcance al gusano
  for (let i = 0; i < 30; i++) {
    step(state, 1 / 60, {}, seededRng(22 + i));
  }
  assert.equal(worm.alive, false, 'el gusano debe estar derrotado después del disparo mientras el jugador estaba agachado');
});

test('rectsOverlap detecta intersección y separación', () => {
  const a = { x: 0, y: 0, w: 10, h: 10 };
  assert.equal(rectsOverlap(a, { x: 5, y: 5, w: 10, h: 10 }), true);
  assert.equal(rectsOverlap(a, { x: 10, y: 0, w: 10, h: 10 }), false);
  assert.equal(rectsOverlap(a, { x: -20, y: 0, w: 10, h: 10 }), false);
  assert.equal(rectsOverlap(a, { x: 0, y: -5, w: 10, h: 3 }), false);
});

test('animateIdle mueve enemigos y no colisiona', () => {
  const state = quietState();
  const enemy = makeGoblin(state, 300);
  enemy.vx = 80;
  state.world.enemies.push(enemy);
  const beforeX = enemy.x;
  const beforeHearts = state.player.hearts;

  animateIdle(state, 1 / 30);

  assert.notEqual(enemy.x, beforeX);
  assert.equal(state.player.hearts, beforeHearts);
  assert.equal(state.status, 'playing');
});

test('ataque con espada inflige daño y emite evento slash', () => {
  const state = quietState();
  settle(state);
  const enemy = makeGoblin(state, state.player.x + 36);
  state.world.enemies.push(enemy);

  const events = step(state, 1 / 60, { attack: true }, seededRng(15));
  assert.ok(events.some((e) => e.type === 'slash'));
  assert.equal(enemy.alive, false);
});

test('disparo con arco genera proyectil y daña al enemigo', () => {
  const state = quietState();
  state.weapons.bow = true;
  state.weapons.equipped = 'bow';
  settle(state);
  const enemy = makeGoblin(state, state.player.x + 120);
  state.world.enemies.push(enemy);

  const events = step(state, 1 / 60, { shoot: true }, seededRng(16));
  assert.ok(events.some((e) => e.type === 'shoot' && e.weapon === 'bow'));
  assert.ok(state.projectiles.length > 0);

  for (let i = 0; i < 20; i += 1) {
    step(state, 1 / 60, {}, seededRng(16 + i));
  }
  assert.equal(enemy.alive, false);
});

test('el escudo frontal bloquea proyectiles enemigos', () => {
  const state = quietState();
  state.upgrades.shieldHits = 3;
  settle(state);
  state.player.facing = 1;
  state.projectiles.push({
    owner: 'enemy',
    type: 'arrow',
    x: state.player.x + 20,
    y: state.player.y + 20,
    w: 20,
    h: 6,
    vx: -300,
    vy: 0,
    damage: 1,
    life: 2,
    hit: [],
  });

  const events = step(state, 1 / 60, {}, seededRng(17));
  assert.ok(events.some((e) => e.type === 'shieldblock'));
  assert.equal(state.upgrades.shieldHits, 2);
  assert.equal(state.player.hearts, PLAYER.maxHearts);
});

test('el doble salto permite saltar en el aire y consume airJumps', () => {
  const state = quietState();
  state.upgrades.doubleJump = true;
  settle(state);
  step(state, 1 / 60, { jump: true, jumpHeld: true }, seededRng(18));
  for (let i = 0; i < 10; i += 1) {
    step(state, 1 / 60, {}, seededRng(18));
  }
  assert.equal(state.player.onGround, false);
  assert.equal(state.player.airJumps, 1);

  const events = step(state, 1 / 60, { jump: true, jumpHeld: true }, seededRng(18));
  assert.ok(events.some((e) => e.type === 'airjump'));
  assert.equal(state.player.airJumps, 0);
  assert.ok(state.player.vy < 0);
});

test('peligro de pinchos daña a la heroína al contacto', () => {
  const state = quietState();
  state.upgrades.clothing = 'paños';
  settle(state);
  state.world.hazards = [{
    type: 'spikes',
    x: state.player.x,
    y: GROUND_Y - 16,
    w: 50,
    h: 16,
  }];

  const events = step(state, 1 / 60, {}, seededRng(19));
  assert.equal(state.player.hearts, PLAYER.maxHearts - 1);
  assert.ok(events.some((e) => e.type === 'hurt' && e.reason === 'spikes'));
});

test('culebra ígnea daña si se intenta aplastar por espinas', () => {
  const state = quietState();
  state.upgrades.clothing = 'paños';
  settle(state);
  const snake = {
    type: 'fire_snake',
    x: state.player.x + 4,
    y: GROUND_Y - ENEMY_DEFS.fire_snake.h,
    baseY: GROUND_Y,
    w: ENEMY_DEFS.fire_snake.w,
    h: ENEMY_DEFS.fire_snake.h,
    vx: 0,
    minX: 0,
    maxX: state.world.width,
    alive: true,
    phase: 0,
    hp: 2,
    score: 50,
  };
  state.world.enemies.push(snake);
  state.player.y = snake.y - 54;
  state.player.vy = 300;
  state.player.onGround = false;

  const events = step(state, 1 / 60, {}, seededRng(20));
  assert.equal(snake.alive, true);
  assert.equal(state.player.hearts, PLAYER.maxHearts - 1);
});
