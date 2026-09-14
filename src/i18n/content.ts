import raw from '../../docs/CONTENT.md?raw';
import type { Locale } from './ui';

// Git on Windows may check the file out with CRLF; the parsers below expect LF.
const source = raw.replace(/\r\n/g, '\n');

function section(heading: string) {
  const start = source.indexOf(`## ${heading}`);
  if (start < 0) throw new Error(`Missing content: ${heading}`);
  const next = source.indexOf('\n## ', start + 3);
  return source.slice(start, next < 0 ? undefined : next);
}
function localized(text: string, lang: Locale) {
  const marker = lang === 'de' ? '**DE**' : '**EN**';
  const start = text.indexOf(marker);
  const rest = text.slice(start + marker.length).replace(/^ \([^\n]+\)/, '');
  return rest.split(/\n\*\*EN\*\*|\n---/)[0]!.trim();
}
function field(text: string, name: string) {
  const line = text.split('\n').find(line => line.startsWith(`- ${name}: `));
  if (!line) throw new Error(`Missing content field: ${name}`);
  return line.slice(name.length + 4).trim();
}
export function content(lang: Locale) {
  const de = lang === 'de';
  const hero = localized(section('Hero'), lang);
  const now = localized(section('Gerade dran'), lang).split(/\n\s*\n/).map(p => {
    const match = p.match(/^\*\*(.+?)\*\*\s*([\s\S]+)$/);
    if (!match) throw new Error('Invalid now entry');
    return { title: match[1]!.replace(/\.$/, ''), body: match[2]! };
  });
  const skills = localized(section('Werkzeuge und Technologien'), lang).split('\n').filter(l => l.startsWith('- **')).map(l => {
    const match = l.match(/^- \*\*(.+?):\*\* (.+)$/)!;
    return { title: match[1]!, body: match[2]! };
  });
  const contact = section('Kontakt').match(new RegExp(`\\*\\*${lang.toUpperCase()}:\\*\\* (.+)`))![1]!;
  return {
    headline: field(hero, de ? 'Überschrift' : 'Headline'),
    hero: field(hero, de ? 'Satz' : 'Sentence'),
    meta: field(hero, de ? 'Metazeile' : 'Meta line'),
    caption: field(hero, de ? 'Bildunterschrift' : 'Caption'),
    about: localized(section('Über mich'), lang).split(/\n\s*\n/),
    method: localized(section('KI-gestützte Entwicklung'), lang),
    now, skills, contact,
  };
}
