import opentype from 'opentype.js';
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
const readFont = name => { const b = readFileSync(`node_modules/@fontsource/instrument-serif/files/${name}`); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const normal = readFont('instrument-serif-latin-400-normal.woff');
const italic = readFont('instrument-serif-latin-400-italic.woff');
function letters(font, text, x, y, size, fill) {
  let cursor = x;
  return Array.from(text).map(char => {
    const glyph = font.charToGlyph(char);
    const path = glyph.getPath(cursor, y, size); path.fill = fill;
    cursor += (glyph.advanceWidth || 0) * size / font.unitsPerEm;
    return path.toSVG({ flipY: false });
  }).join('');
}
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#F6F4EF"/>${letters(normal,'MK',7,47,45,'#1C1B18')}<path d="M8 55H56" stroke="#B4471D" stroke-width="2"/></svg>`;
await writeFile('public/favicon.svg', favicon);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F6F4EF"/><path d="M80 65H1120M80 535H1120" stroke="#DEDAD1"/>${letters(normal,'Maximilian',80,225,124,'#1C1B18')}${letters(italic,'Köhlenbeck',80,355,124,'#8F3614')}${letters(normal,'Automatisierung. Robotik. Physical AI.',84,452,38,'#6A665E')}<rect x="880" y="125" width="240" height="330" fill="#1C1B18"/><path d="M895 377H1105M974 352H1026V374H974Z" fill="none" stroke="#ECE8DF" stroke-width="2"/><path d="M1000 352L1012 208" stroke="#E0703F" stroke-width="4"/><circle cx="1000" cy="352" r="4" fill="#ECE8DF"/></svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og.png');
console.log('Created favicon.svg with outlined Instrument Serif and og.png (1200 × 630).');
