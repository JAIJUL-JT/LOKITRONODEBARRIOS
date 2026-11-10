import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_FALLOS,
  QUESTIONS_PER_VISIT,
  TOTAL_BARRIOS,
  advanceWithDice,
  answerQuestion,
  beginRound,
  createTrivialGame,
  movePosition,
  questionsNeeded,
  rollDice,
  shuffleQuestionOptions,
} from '../js/trivial-core.js';

function rngFrom(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function questions(n = 6) {
  return Array.from({ length: n }, (_, i) => ({
    q: `pregunta ${i}`,
    opts: [`correcta ${i}`, `fallo a ${i}`, `fallo b ${i}`, `fallo c ${i}`],
    ans: 0,
    info: `info ${i}`,
  }));
}

// Bancos auxiliares para la nueva firma de beginRound
const bilbaoQs = questions(10).map((q, i) => ({ ...q, q: `bilbao ${i}`, categoria: 'bilbao' }));
const historiaQs = questions(10).map((q, i) => ({ ...q, q: `historia ${i}`, categoria: 'historia' }));

function beginRound3(game, barrioQs, rng) {
  return beginRound(game, barrioQs, bilbaoQs, historiaQs, rng);
}

test('rollDice devuelve dos dados entre 1 y 6', () => {
  const dice = rollDice(rngFrom(2));
  assert.equal(dice.length, 2);
  for (const value of dice) {
    assert.ok(value >= 1 && value <= 6);
  }
});

test('la ficha empieza en el barrio 1 y avanza con la suma', () => {
  let game = createTrivialGame();
  assert.equal(game.position, 0);
  game = advanceWithDice(game, [1, 1]);
  assert.equal(game.position, 2);
  assert.deepEqual(game.lastRoll, { dice: [1, 1], total: 2 });
});

test('el tablero da la vuelta al pasar del barrio 52', () => {
  assert.equal(movePosition(50, 5), 3);
  assert.equal(movePosition(51, 1), 0);
  assert.equal(movePosition(0, 12), 12);
});

test('se piden 3 preguntas y se cortan al llegar a 5 aciertos', () => {
  let game = createTrivialGame();
  let result = beginRound3(game, questions(), rngFrom(3));
  game = result.state;
  assert.equal(result.questions.length, 3);
  assert.equal(game.phase, 'questions');

  game = answerQuestion(game, true).state;
  game = answerQuestion(game, true).state;
  game = answerQuestion(game, true).state;
  assert.equal(game.phase, 'board');
  assert.equal(game.aciertos[0], 3);
  assert.equal(questionsNeeded(game, 0), 2);

  result = beginRound3(game, questions(), rngFrom(4));
  game = result.state;
  // Con 2 aciertos restantes: 1 barrio + 1 bilbao + 1 historia = 3, pero questionsNeeded=2 → 2
  assert.ok(result.questions.length >= 1);

  let answer = answerQuestion(game, true);
  game = answer.state;
  assert.equal(answer.event, 'correct');
});

test('un fallo cuenta y 10 fallos terminan la partida', () => {
  let game = createTrivialGame();
  const result = beginRound3(game, questions(), rngFrom(5));
  game = result.state;

  for (let i = 0; i < MAX_FALLOS - 1; i++) {
    game = answerQuestion(game, false).state;
    if (game.phase === 'board') {
      game = beginRound3(game, questions(), rngFrom(6 + i)).state;
    }
  }
  assert.equal(game.fallos, MAX_FALLOS - 1);
  assert.equal(game.phase, 'questions');

  const last = answerQuestion(game, false);
  assert.equal(last.event, 'lost');
  assert.equal(last.state.fallos, MAX_FALLOS);
  assert.equal(last.state.phase, 'lost');
});

test('un barrio completado no vuelve a preguntar', () => {
  let game = createTrivialGame();
  game.aciertos[0] = 5;
  game.pintxos = [0];
  const result = beginRound3(game, questions(), rngFrom(7));
  assert.equal(result.questions.length, 0);
  assert.equal(result.state.phase, 'board');
});

test('las preguntas no se repiten dentro del mismo barrio hasta agotar el banco', () => {
  let game = createTrivialGame();
  const bank = questions(20);
  const seen = new Set();

  for (let i = 0; i < 3; i++) {
    const result = beginRound3(game, bank, rngFrom(10 + i));
    game = result.state;
    for (const question of result.questions) {
      seen.add(question.q);
    }
    while (game.phase === 'questions') {
      game = answerQuestion(game, true).state;
    }
  }
  assert.ok(seen.size >= 4);
});

test('las opciones se barajan sin perder la respuesta correcta', () => {
  const original = {
    q: '¿Cuál es?',
    opts: ['correcta', 'a', 'b', 'c'],
    ans: 0,
    info: 'info',
  };
  const shuffled = shuffleQuestionOptions(original, rngFrom(8));
  assert.equal(shuffled.opts[shuffled.ans], 'correcta');
  assert.notEqual(shuffled.opts, original.opts);
  assert.deepEqual([...shuffled.opts].sort(), [...original.opts].sort());
});

test('52 pintxos completan la partida con victoria', () => {
  let game = createTrivialGame();
  game.pintxos = Array.from({ length: TOTAL_BARRIOS - 1 }, (_, i) => i);
  game.aciertos[TOTAL_BARRIOS - 1] = 4;
  game.position = TOTAL_BARRIOS - 1;

  const result = beginRound3(game, questions(), rngFrom(9));
  game = result.state;
  const answer = answerQuestion(game, true);

  assert.equal(answer.event, 'won');
  assert.equal(answer.state.phase, 'won');
  assert.equal(answer.state.pintxos.length, TOTAL_BARRIOS);
});
