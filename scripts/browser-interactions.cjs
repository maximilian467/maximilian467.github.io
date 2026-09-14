async page => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const origin = 'http://127.0.0.1:4321';
  const output = { keyboard: [], legal: [], labNotes: [], simulation: {} };
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  for (const lang of ['en', 'de']) {
    await page.goto(`${origin}/${lang === 'de' ? 'de/' : ''}`);
    await page.waitForFunction(() => document.querySelector('[data-cartpole]')?.dataset.state === 'running');
    const steps = [];
    const total = await page.locator('a,button').count();
    for (let i = 0; i < total; i++) {
      await page.keyboard.press('Tab');
      const item = await page.evaluate(() => {
        const el = document.activeElement, style = getComputedStyle(el), rect = el.getBoundingClientRect();
        return { tag: el.tagName, label: el.getAttribute('aria-label') || el.textContent.trim(), outline: style.outlineStyle, outlineWidth: style.outlineWidth, visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight };
      });
      assert(item.outline !== 'none' && item.outlineWidth !== '0px', `Missing keyboard focus: ${lang} ${item.label}`);
      assert(item.visible, `Focus offscreen: ${lang} ${item.label}`);
      steps.push(item.label);
    }
    output.keyboard.push({ lang, count: steps.length, steps });
  }
  await page.goto(`${origin}/`);
  await page.waitForFunction(() => document.querySelector('[data-step-label]')?.textContent !== 'Step 0');
  await page.locator('[data-toggle]').focus();
  await page.keyboard.press('Enter');
  assert(await page.locator('[data-cartpole]').getAttribute('data-state') === 'paused', 'Pause via keyboard failed');
  const pausedCount = await page.locator('[data-step-label]').textContent();
  await page.waitForTimeout(200);
  assert(await page.locator('[data-step-label]').textContent() === pausedCount, 'Paused simulation advances');
  await page.keyboard.press('Enter');
  await page.locator('[data-nudge]').focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  assert(await page.locator('[data-step-label]').textContent() !== pausedCount, 'Simulation does not resume');
  output.simulation.keyboardPausePlayNudge = true;
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const outside = await page.locator('[data-step-label]').textContent();
  await page.waitForTimeout(200);
  assert(await page.locator('[data-step-label]').textContent() === outside, 'Simulation advances outside viewport');
  output.simulation.offscreenPause = true;
  await page.evaluate(() => scrollTo(0,0));
  await page.waitForTimeout(200);
  assert(await page.locator('[data-step-label]').textContent() !== outside, 'Simulation does not resume in viewport');
  const otherTab = await page.context().newPage();
  await otherTab.goto('about:blank'); await otherTab.bringToFront();
  await page.waitForTimeout(150);
  const visibility = await page.evaluate(() => document.visibilityState);
  const backgroundCount = await page.locator('[data-step-label]').textContent();
  await page.waitForTimeout(250);
  output.simulation.backgroundTab = { visibility, stable: await page.locator('[data-step-label]').textContent() === backgroundCount };
  await otherTab.close(); await page.bringToFront();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForFunction(() => document.querySelector('[data-cartpole]')?.dataset.state === 'paused');
  assert(await page.locator('[data-toggle]').textContent() === 'Play', 'Reduced motion is not paused');
  output.simulation.reducedMotion = true;
  await page.locator('.language a[lang=de]').focus(); await page.keyboard.press('Enter');
  await page.waitForURL('**/de/');
  assert(await page.locator('html').getAttribute('lang') === 'de', 'Language switch failed');
  output.languageSwitch = true;
  for (const [from, to] of [['en/', '/'], ['impressum/', '/de/impressum/'], ['en/privacy/', '/privacy/']]) {
    await page.goto(`${origin}/${from}`);
    await page.waitForURL(`${origin}${to}`);
  }
  output.oldUrlsRedirect = true;
  for (const route of ['legal-notice/', 'privacy/', 'de/impressum/', 'de/datenschutz/']) {
    const response = await page.goto(`${origin}/${route}`);
    assert(response.status() === 200, `Broken legal route ${route}`);
    const text = await page.locator('.legal-prose').innerText();
    assert(!text.includes('Vorlage') && !text.includes('keine Rechtsberatung'), 'Draft notes published');
    assert(text.includes('Turnerstraße 9'), 'Legal address missing');
    await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } })).violations.map(v => v.id));
    assert(violations.length === 0, `Legal accessibility: ${violations}`);
    const alternate = await page.locator('.language a:not([aria-current])').getAttribute('href');
    output.legal.push({ route, title: await page.locator('h1').innerText(), alternate, violations });
  }
  for (const route of ['lab-notes/', 'de/laborbuch/']) {
    const response = await page.goto(`${origin}/${route}`);
    assert(response.status() === 200, `Broken Lab Notes route ${route}`);
    assert(await page.locator('.disclosure').isVisible(), 'Disclosure missing');
    assert(await page.locator('.anchors a[aria-current="page"]').count() === 1, 'Lab Notes nav state missing');
    await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } })).violations.map(v => v.id));
    assert(violations.length === 0, `Lab Notes accessibility: ${violations}`);
    output.labNotes.push({ route, title: await page.title(), violations });
  }
  const nojsContext = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width:390, height:844 }, colorScheme:'light' });
  const nojs = await nojsContext.newPage();
  await nojs.goto(`${origin}/`);
  assert(await nojs.locator('#projects article').count() === 6, 'No-JS content missing');
  assert(await nojs.locator('.lab-still').isVisible(), 'No-JS SVG missing');
  assert(!await nojs.locator('.lab-message').isVisible(), 'No-JS loading message visible');
  await nojs.screenshot({ path:'docs/qa/screenshots/no-js-mobile.png' });
  output.noJavaScript = true;
  await nojsContext.close();
  await page.route('**/models/cartpole-policy.json', route => route.abort());
  await page.goto(`${origin}/`);
  await page.waitForFunction(() => document.querySelector('[data-message]')?.textContent.includes('Reload'));
  assert(await page.locator('.lab-still').isVisible(), 'Model error loses static SVG');
  assert(!await page.locator('.lab-controls').isVisible(), 'Broken controls after failed load');
  output.modelFailureFallback = true;
  await page.unroute('**/models/cartpole-policy.json');
  await page.goto(`${origin}/`);
  const assets = {};
  for (const route of ['/cv/maximilian-koehlenbeck-lebenslauf.pdf','/og.png','/favicon.svg','/robots.txt','/sitemap-index.xml']) {
    const response = await page.request.get(`${origin}${route}`);
    assert(response.ok(), `Missing asset ${route}`); assets[route] = response.status();
  }
  output.assets = assets;
  return output;
}
