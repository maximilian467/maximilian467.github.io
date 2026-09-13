import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const normalize = text => text.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/\s+/g,' ').trim();
const source = readFileSync('docs/CONTENT.md','utf8');
for (const [filename, routeDE, routeEN] of [['impressum','impressum','en/legal-notice'],['datenschutz','datenschutz','en/privacy']]) {
  const legal = readFileSync(`docs/legal/${filename}.md`,'utf8');
  for (const [lang,route] of [['DE',routeDE],['EN',routeEN]]) {
    const expected = legal.split(`## ${lang}: `)[1].split(/\n---/)[0].split('\n').slice(1).join('\n').replace(/^#+ /gm,'').replace(/\*\*/g,'');
    const html = readFileSync(`dist/${route}/index.html`,'utf8');
    const actual = html.match(/<div class="legal-prose">([\s\S]*?)<\/div>/)[1];
    assert.equal(normalize(actual),normalize(expected),`Legal text differs: ${route}`);
  }
}
const projectFiles = readdirSync('src/content/projects').filter(f=>f.endsWith('.json'));
assert.ok(projectFiles.length > 0, 'Project collection is empty');
for (const file of projectFiles) {
  const project = JSON.parse(readFileSync(`src/content/projects/${file}`,'utf8'));
  assert.ok(source.includes(project.de.description),`DE project text not sourced: ${file}`);
  assert.ok(source.includes(project.en.description),`EN project text not sourced: ${file}`);
}
for (const route of ['','en/']) {
  const html = readFileSync(`dist/${route}index.html`,'utf8');
  assert.ok(!/4\. Platz|Dreijährigen|passionate|Elevate|Unleash|revolutionär|nahtlos/.test(html));
  assert.ok(!/\s[–—]\s/.test(normalize(html)), 'Stylistic dash in body');
  assert.ok(!/src=["']https?:/.test(html),'Externally loaded media');
  assert.ok(!html.includes('_private'),'Private path in output');
  assert.ok(html.includes('rel="canonical"') && html.includes('hreflang="de"') && html.includes('hreflang="en"'));
}
console.log(`Legal texts match verbatim in both languages. All ${projectFiles.length * 2} project descriptions are sourced. Text, metadata and external-media checks pass.`);
