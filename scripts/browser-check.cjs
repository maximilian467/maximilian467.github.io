async page => {
  const results = [];
  const external = new Set();
  const errors = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4321') && !request.url().startsWith('data:')) external.add(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  for (const lang of ['de', 'en']) {
    for (const [width, height] of [[390,844], [768,1024], [1366,768], [1440,900]]) {
      for (const scheme of ['light', 'dark']) {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await page.goto(`http://127.0.0.1:4321/${lang === 'en' ? 'en/' : ''}`);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => document.querySelector('[data-cartpole]')?.dataset.state === 'paused');
        const layout = await page.evaluate(() => {
          const h = document.querySelector('h1');
          const hero = document.querySelector('.hero');
          const hStyle = getComputedStyle(h);
          const overflow = [...document.querySelectorAll('main *')].filter(el => {
            const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
          }).map(el => ({ tag: el.tagName, class: el.className })).slice(0, 8);
          return {
            scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth,
            headingLines: Math.round(h.getBoundingClientRect().height / parseFloat(hStyle.lineHeight)),
            heroBottom: hero.getBoundingClientRect().bottom,
            bodyFont: getComputedStyle(document.querySelector('.intro')).fontSize,
            language: document.documentElement.lang, projects: document.querySelectorAll('#projects article').length,
            overflow,
          };
        });
        const id = `${lang}-${width}x${height}-${scheme}`;
        await page.screenshot({ path: `docs/qa/screenshots/${id}.png` });
        if (lang === 'de' && [390,1440].includes(width) && scheme === 'light') {
          await page.screenshot({ path: `docs/qa/screenshots/${id}-full.png`, fullPage: true });
          await page.locator('#project-waechter').scrollIntoViewIfNeeded();
          await page.screenshot({ path: `docs/qa/screenshots/${id}-projects.png` });
          await page.locator('.hero').screenshot({ path: `docs/qa/screenshots/${id}-hero.png` });
        }
        await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
        const a11y = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
        results.push({ id, ...layout, a11y });
      }
    }
  }
  return { results, external: [...external], errors };
}
