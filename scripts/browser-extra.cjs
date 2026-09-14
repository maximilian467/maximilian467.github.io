async page => {
  await page.goto('http://127.0.0.1:4321/');
  await page.emulateMedia({ reducedMotion:'no-preference', colorScheme:'light' });
  await page.reload();
  await page.waitForFunction(() => document.querySelector('[data-cartpole]')?.dataset.state === 'running');
  await page.waitForTimeout(200);
  // Headless Chromium keeps all tabs visible. Inject only the visibility signal to verify the event handler.
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable:true, get:()=>true }); document.dispatchEvent(new Event('visibilitychange')); });
  const before = await page.locator('[data-step-label]').textContent();
  await page.waitForTimeout(250);
  const stopped = await page.locator('[data-step-label]').textContent() === before;
  if (!stopped) throw new Error('Visibility handler failed');
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForTimeout(250);
  const resumed = await page.locator('[data-step-label]').textContent() !== before;
  if (!resumed) throw new Error('Visibility handler does not resume');
  await page.emulateMedia({ reducedMotion:'reduce' });
  const shots = [];
  for (const [width,height] of [[390,844],[1440,900]]) {
    await page.setViewportSize({width,height});
    for (const route of ['de/impressum/','privacy/','lab-notes/','de/laborbuch/']) {
      await page.goto(`http://127.0.0.1:4321/${route}`);
      const filename = `docs/qa/screenshots/page-${width}-${route.replaceAll('/','-')}.png`;
      await page.screenshot({path:filename, fullPage:true}); shots.push(filename);
    }
  }
  await page.goto('http://127.0.0.1:4321/');
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.reload();
  await page.waitForFunction(() => document.querySelector('[data-step-label]').textContent !== 'Step 0');
  await page.screenshot({path:'docs/qa/screenshots/final-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.locator('.hero').screenshot({path:'docs/qa/screenshots/final-mobile-hero.png'});
  await page.setViewportSize({width:390,height:1160});
  await page.evaluate(() => scrollTo(0,0));
  await page.screenshot({path:'docs/qa/screenshots/final-mobile.png'});
  return {visibilitySignalTest:{stopped,resumed,method:'injected document.hidden and native visibilitychange event; headless tabs do not change visibility'},shots};
}
