import fs from 'fs';
import path from 'path';

const kbPath = path.join(process.cwd(), 'backend', 'data', 'knowledge_base.json');
let knowledgeBase = [];
try {
  knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
} catch (e) {
  knowledgeBase = [];
}

function matchPatterns(input) {
  const matches = [];
  for (const entry of knowledgeBase) {
    for (const pattern of entry.patrones) {
      if (input.toLowerCase().includes(pattern.toLowerCase())) {
        matches.push(entry);
        break;
      }
    }
  }
  return matches;
}

function calcRisk(entries) {
  if (!entries.length) return 0;
  const total = entries.reduce((sum, e) => sum + (e.riesgoBase || 0), 0);
  return Math.round(total / entries.length);
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  let input = '';
  try {
    input = req.body.input || '';
  } catch {
    input = '';
  }
  const matches = matchPatterns(input);
  const riesgoPromedio = calcRisk(matches);
  res.status(200).json({ matches, riesgoPromedio });
}
