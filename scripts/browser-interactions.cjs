async page => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const origin = 'http://127.0.0.1:4321';
  const output = { keyboard: [], legal: [], labNotes: [], simulation: {} };
  const steps = () => page.locator('[data-double-pendulum]').getAttribute('data-steps');
  const checked = () => page.locator('[data-pose][aria-checked="true"]').getAttribute('data-pose');
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  for (const lang of ['en', 'de']) {
    await page.goto(`${origin}/${lang === 'de' ? 'de/' : ''}`);
    await page.waitForFunction(() => document.querySelector('[data-double-pendulum]')?.dataset.state === 'running');
    const labels = [];
    // Radio buttons outside the checked one are reachable with the arrow keys, not with Tab.
    const total = await page.locator('a,button:not([tabindex="-1"])').count();
    for (let i = 0; i < total; i++) {
      await page.keyboard.press('Tab');
      const item = await page.evaluate(() => {
        const el = document.activeElement, style = getComputedStyle(el), rect = el.getBoundingClientRect();
        return { tag: el.tagName, label: el.getAttribute('aria-label') || el.textContent.trim(), outline: style.outlineStyle, outlineWidth: style.outlineWidth, visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight };
      });
      assert(item.outline !== 'none' && item.outlineWidth !== '0px', `Missing keyboard focus: ${lang} ${item.label}`);
      assert(item.visible, `Focus offscreen: ${lang} ${item.label}`);
      labels.push(item.label);
    }
    output.keyboard.push({ lang, count: labels.length, steps: labels });
  }
  await page.goto(`${origin}/`);
  await page.waitForFunction(() => Number(document.querySelector('[data-double-pendulum]')?.dataset.steps) > 0);
  await page.locator('[data-toggle]').focus();
  await page.keyboard.press('Enter');
  assert(await page.locator('[data-double-pendulum]').getAttribute('data-state') === 'paused', 'Pause via keyboard failed');
  const pausedCount = await steps();
  await page.waitForTimeout(200);
  assert(await steps() === pausedCount, 'Paused simulation advances');
  await page.locator('[data-pose="2"]').click();
  assert(await checked() === '2', 'Pose click failed');
  assert((await page.locator('[data-target-readout]').textContent()).includes('down · up'), 'Pose readout not updated while paused');
  await page.waitForTimeout(200);
  assert(await steps() === pausedCount, 'Pose change resumed a paused simulation');
  await page.locator('[data-pose="2"]').focus();
  await page.keyboard.press('ArrowRight');
  assert(await checked() === '3' && await page.evaluate(() => document.activeElement.dataset.pose) === '3', 'Arrow key selection failed');
  await page.keyboard.press('1');
  assert(await checked() === '0', 'Digit selection failed');
  await page.locator('.language a').first().focus();
  await page.keyboard.press('3');
  assert(await checked() === '0', 'Digit selection must only work inside the figure');
  output.simulation.poseSelection = { click: true, arrows: true, digits: true, pausedSelectionStored: true };
  await page.locator('[data-toggle]').focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-nudge]').focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(250);
  assert(await steps() !== pausedCount, 'Simulation does not resume');
  const stage = await page.locator('.lab-hit').boundingBox();
  await page.mouse.click(stage.x + stage.width * .2, stage.y + stage.height * .3);
  output.simulation.keyboardPausePlayNudge = true;
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const outside = await steps();
  await page.waitForTimeout(200);
  assert(await steps() === outside, 'Simulation advances outside viewport');
  output.simulation.offscreenPause = true;
  await page.evaluate(() => scrollTo(0,0));
  await page.waitForTimeout(200);
  assert(await steps() !== outside, 'Simulation does not resume in viewport');
  const otherTab = await page.context().newPage();
  await otherTab.goto('about:blank'); await otherTab.bringToFront();
  await page.waitForTimeout(150);
  const visibility = await page.evaluate(() => document.visibilityState);
  const backgroundCount = await steps();
  await page.waitForTimeout(250);
  output.simulation.backgroundTab = { visibility, stable: await steps() === backgroundCount };
  await otherTab.close(); await page.bringToFront();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForFunction(() => document.querySelector('[data-double-pendulum]')?.dataset.state === 'paused');
  assert(await page.locator('[data-toggle]').textContent() === 'Play', 'Reduced motion is not paused');
  await page.waitForTimeout(2000);
  assert(await checked() === '3', 'Reduced motion must not switch the pose automatically');
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
  assert(!await nojs.locator('[data-pose-group]').isVisible(), 'Inert pose buttons visible without JavaScript');
  await nojs.screenshot({ path:'docs/qa/screenshots/no-js-mobile.png' });
  output.noJavaScript = true;
  await nojsContext.close();
  await page.route('**/models/double-pendulum-policy.json', route => route.abort());
  await page.goto(`${origin}/`);
  await page.waitForFunction(() => document.querySelector('[data-message]')?.textContent.includes('Reload'));
  assert(await page.locator('.lab-still').isVisible(), 'Model error loses static SVG');
  assert(!await page.locator('.lab-controls').isVisible(), 'Broken controls after failed load');
  assert(!await page.locator('[data-pose-group]').isVisible(), 'Pose buttons visible after failed load');
  output.modelFailureFallback = true;
  await page.unroute('**/models/double-pendulum-policy.json');
  await page.goto(`${origin}/`);
  const assets = {};
  for (const route of ['/cv/maximilian-koehlenbeck-cv.pdf','/cv/maximilian-koehlenbeck-lebenslauf.pdf','/og.png','/favicon.svg','/robots.txt','/sitemap-index.xml','/models/double-pendulum-policy.json']) {
    const response = await page.request.get(`${origin}${route}`);
    assert(response.ok(), `Missing asset ${route}`); assets[route] = response.status();
  }
  output.assets = assets;
  return output;
}
