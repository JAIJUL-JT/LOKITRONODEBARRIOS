export const TOTAL_BARRIOS = 52;
export const CORRECT_PER_BARRIO = 5;
export const MAX_FALLOS = 10;
export const QUESTIONS_PER_VISIT = 3;

export function createTrivialGame() {
  return {
    position: 0,
    fallos: 0,
    pintxos: [],
    aciertos: {},
    used: {},
    phase: 'board',
    round: null,
    lastRoll: null,
  };
}

export function cloneTrivialGame(state) {
  return {
    ...state,
    pintxos: [...state.pintxos],
    aciertos: { ...state.aciertos },
    used: Object.fromEntries(
      Object.entries(state.used).map(([key, value]) => [key, [...value]]),
    ),
    round: state.round
      ? { ...state.round, questions: [...state.round.questions] }
      : null,
    lastRoll: state.lastRoll ? { ...state.lastRoll, dice: [...state.lastRoll.dice] } : null,
  };
}

export function rollDice(rng = Math.random) {
  const d1 = 1 + Math.floor(rng() * 6);
  const d2 = 1 + Math.floor(rng() * 6);
  return [d1, d2];
}

export function movePosition(position, steps, total = TOTAL_BARRIOS) {
  return (position + steps) % total;
}

export function advanceWithDice(state, dice) {
  const next = cloneTrivialGame(state);
  const total = dice[0] + dice[1];
  next.position = movePosition(next.position, total);
  next.lastRoll = { dice: [...dice], total };
  return next;
}

export function barrioIsComplete(state, index) {
  return state.pintxos.includes(index);
}

export function correctForBarrio(state, index) {
  return state.aciertos[index] || 0;
}

export function totalAciertos(state) {
  return Object.values(state.aciertos).reduce((sum, value) => sum + value, 0);
}

export function questionsNeeded(state, index) {
  return Math.max(0, CORRECT_PER_BARRIO - correctForBarrio(state, index));
}

function shuffle(items, rng) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function shuffleQuestionOptions(question, rng = Math.random) {
  const correct = question.opts[question.ans];
  const opts = shuffle(question.opts, rng);
  return { ...question, opts, ans: opts.indexOf(correct) };
}

// beginRound selecciona exactamente 3 preguntas por ronda:
//   1. Una pregunta del barrio actual (barrioQuestions)
//   2. Una pregunta general sobre Bilbao (bilbaoQuestions)
//   3. Una pregunta de historia de Bilbao (historiaQuestions)
export function beginRound(state, barrioQuestions, bilbaoQuestions = [], historiaQuestions = [], rng = Math.random) {
  const next = cloneTrivialGame(state);
  const index = next.position;
  const need = questionsNeeded(next, index);

  if (need <= 0 || barrioIsComplete(next, index)) {
    next.phase = 'board';
    next.round = null;
    return { state: next, questions: [] };
  }

  if (!next.used[index]) next.used[index] = [];
  const usedSet = new Set(next.used[index]);

  // Selecciona 1 pregunta de un banco, evitando repeticiones
  function pickOne(pool, prefix) {
    const tagged = pool.map((q, i) => ({ ...q, _id: `${prefix}_${i}` }));
    let available = tagged.filter(q => !usedSet.has(q._id));
    if (available.length === 0) {
      // Resetea sólo las del mismo prefix si no quedan
      tagged.forEach(q => usedSet.delete(q._id));
      available = tagged;
    }
    const chosen = shuffle(available, rng)[0];
    if (chosen) {
      usedSet.add(chosen._id);
      const { _id, ...clean } = chosen;
      return shuffleQuestionOptions(clean, rng);
    }
    return null;
  }

  const questions = [
    pickOne(barrioQuestions,  'b'),
    pickOne(bilbaoQuestions,  'g'),
    pickOne(historiaQuestions,'h'),
  ].filter(Boolean);

  next.used[index] = [...usedSet];
  next.round = {
    barrio: index,
    questions,
    index: 0,
    asked: 0,
    correct: 0,
  };
  next.phase = 'questions';
  return { state: next, questions };
}

export function answerQuestion(state, isCorrect) {
  const next = cloneTrivialGame(state);
  const round = next.round;
  if (!round) return { state: next, event: 'none' };

  round.asked += 1;

  if (isCorrect) {
    round.correct += 1;
    next.aciertos[round.barrio] = correctForBarrio(next, round.barrio) + 1;

    if (next.aciertos[round.barrio] >= CORRECT_PER_BARRIO && !next.pintxos.includes(round.barrio)) {
      next.pintxos.push(round.barrio);
      next.phase = next.pintxos.length >= TOTAL_BARRIOS ? 'won' : 'board';
      return { state: next, event: next.phase === 'won' ? 'won' : 'pintxo', barrio: round.barrio };
    }
  } else {
    next.fallos += 1;
    if (next.fallos >= MAX_FALLOS) {
      next.phase = 'lost';
      return { state: next, event: 'lost', barrio: round.barrio };
    }
  }

  if (round.asked >= round.questions.length) {
    next.phase = 'board';
    return { state: next, event: 'roundEnd', barrio: round.barrio };
  }

  round.index += 1;
  return { state: next, event: isCorrect ? 'correct' : 'wrong', barrio: round.barrio };
}

export function abandonRound(state) {
  const next = cloneTrivialGame(state);
  next.round = null;
  next.phase = 'board';
  return next;
}
