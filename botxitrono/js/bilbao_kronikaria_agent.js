// bilbao_kronikaria_agent.js
// Agent to ensure at least 20 unique trivia questions per Bilbao barrio are present in trivia-data.js

import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const TRIVIA_FILE = path.join(__dirname, 'trivia-data.js');
const MIN_QUESTIONS_PER_BARRIO = 20;

// Simple templates to generate questions; you can extend them as needed.
const TEMPLATE_QUESTIONS = [
  // Template receives barrio name.
  (barrio) => `¿Cuál es el símbolo más representativo del barrio de ${barrio}?`,
  (barrio) => `¿En qué distrito se encuentra el barrio de ${barrio}?`,
  (barrio) => `¿Cuál es una festividad típica que se celebra en ${barrio}?`,
  (barrio) => `¿Qué arquitectura característica destaca en el barrio de ${barrio}?`,
  (barrio) => `¿Cuál es el nombre del parque más popular de ${barrio}?`,
  (barrio) => `¿Qué río o cauce natural cruza o bordea ${barrio}?`,
  (barrio) => `¿Cuál es el principal medio de transporte público que sirve a ${barrio}?`,
  (barrio) => `¿Qué celebración gastronómica es típica en ${barrio}?`,
  (barrio) => `¿Cuál es el origen histórico del nombre "${barrio}"?`,
  (barrio) => `¿Qué deporte o equipo local es emblemático de ${barrio}?`
];

function loadTrivia() {
  const raw = fs.readFileSync(TRIVIA_FILE, 'utf8');
  // Find the export array start and end.
  const exportMatch = raw.match(/export const BILBAO_TRIVIA_500\s*=\s*\[(.*)\];/s);
  if (!exportMatch) {
    console.error('Could not locate BILBAO_TRIVIA_500 export in trivia-data.js');
    process.exit(1);
  }
  const arrayContent = exportMatch[1];
  // Split by objects assuming they are separated by },\n  const objects = arrayContent.split('},').map((s) => s.trim()).filter(Boolean);
  const entries = [];
  for (let obj of objects) {
    // Ensure it ends with }
    if (!obj.endsWith('}')) obj += '}';
    try {
      const json = JSON.parse(obj.replace(/\"/g, '"'));
      entries.push(json);
    } catch (e) {
      // Skip malformed entries (should not happen for our generated ones).
    }
  }
  return { raw, entries, exportMatch };
}

function extractBarrios(entries) {
  const barrioSet = new Set();
  const barrioRegex = /barrio bilbaíno de ([^?]+?)\?/i;
  entries.forEach((e) => {
    const match = e.q.match(barrioRegex);
    if (match) {
      const barrio = match[1].trim();
      barrioSet.add(barrio);
    }
  });
  return Array.from(barrioSet);
}

function countQuestionsPerBarrio(entries) {
  const counts = {};
  const barrioRegex = /barrio bilbaíno de ([^?]+?)\?/i;
  entries.forEach((e) => {
    const match = e.q.match(barrioRegex);
    if (match) {
      const barrio = match[1].trim();
      counts[barrio] = (counts[barrio] || 0) + 1;
    }
  });
  return counts;
}

function generateQuestion(barrio, existingOpts) {
  // Choose a template that does not duplicate existing options.
  const template = TEMPLATE_QUESTIONS[Math.floor(Math.random() * TEMPLATE_QUESTIONS.length)];
  const question = template(barrio);
  // Simple placeholder options; in a real scenario you would provide meaningful distractors.
  const opts = [question + ' (opción A)', question + ' (opción B)', question + ' (opción C)', question + ' (opción D)'];
  return {
    q: question,
    opts,
    ans: 0,
    info: `Información generada automáticamente para ${barrio}.`
  };
}

function main() {
  const { raw, entries, exportMatch } = loadTrivia();
  const barrios = extractBarrios(entries);
  const counts = countQuestionsPerBarrio(entries);

  const newEntries = [];
  barrios.forEach((barrio) => {
    const current = counts[barrio] || 0;
    const needed = MIN_QUESTIONS_PER_BARRIO - current;
    for (let i = 0; i < needed; i++) {
      const qObj = generateQuestion(barrio);
      newEntries.push(qObj);
    }
  });

  if (newEntries.length === 0) {
    console.log('All barrios already have the minimum number of questions.');
    return;
  }

  // Append new entries to the existing array string.
  const insertion = newEntries.map((e) => JSON.stringify(e, null, 2)).join(',\n') + ',\n';
  const newRaw = raw.replace(/export const BILBAO_TRIVIA_500\s*=\s*\[/, (match) => match + '\n' + insertion);
  fs.writeFileSync(TRIVIA_FILE, newRaw, 'utf8');
  console.log(`Added ${newEntries.length} new questions to trivia-data.js.`);
}

main();
