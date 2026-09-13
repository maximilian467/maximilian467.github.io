// Explicit content import. Not run during builds: project files remain directly editable.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const source = await readFile('docs/CONTENT.md', 'utf8');
const blocks = source.split(/\n### \d+\. /).slice(1).map(b => b.split('\n---')[0]);
const slugs = ['waechter', 'baulify', 'planen-editor', '3d-druck', 'wispr-flow', 'n8n'];
const titles = ['Wächter', 'Baulify', 'Tarp editor', '3D printer: nozzle offset calibration', 'My Wispr Flow clone', 'AI automations with n8n'];
const statuses = { fertig: 'completed', Prototyp: 'prototype', läuft: 'in progress', 'täglich im Einsatz': 'in daily use' };
await mkdir('src/content/projects', { recursive: true });
for (const [i, b] of blocks.entries()) {
  const meta = b.match(/- Status: (.+?) · Zeitraum: (.+?) · (.+)/);
  const tech = b.match(/- Tech: (.+)/)[1];
  const item = { order: i + 1, running: meta[1] === 'läuft', measurements: i === 0,
    de: { title: b.split('\n')[0].trim(), description: b.match(/- \*\*DE:\*\* (.+)/)[1], date: meta[2], status: meta[1], role: meta[3], tech },
    en: { title: titles[i], description: b.match(/- \*\*EN:\*\* (.+)/)[1], date: meta[2].replace('seit Mai', 'since May'), status: statuses[meta[1]], role: { Allein: 'Solo', 'im Team': 'Team', 'mit KUKA': 'With KUKA' }[meta[3]], tech: tech.replace('lokales Sprachmodell', 'local language model').replace('LLM über', 'LLM via').replace('Feder-Masse-Simulation', 'spring-mass simulation').replace('eine einzige HTML-Datei', 'a single HTML file').replace('3D-Druck · Kalibrierung', '3D printing · calibration') },
  };
  if (i === 5) item.code = 'https://github.com/maximilian467/n8n-automation-portfolio';
  await writeFile(`src/content/projects/${slugs[i]}.json`, JSON.stringify(item, null, 2) + '\n');
}
