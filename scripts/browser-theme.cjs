async page => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  const origin = 'http://127.0.0.1:4321';
  const errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(origin) && !request.url().startsWith('data:')) external.push(request.url()); });
  await page.goto(origin);
  await page.evaluate(() => localStorage.removeItem('portfolio-theme'));
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.reload();
  const read = () => page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    lab: getComputedStyle(document.querySelector('.lab')).backgroundColor,
    theme: document.documentElement.dataset.theme,
    scheme: getComputedStyle(document.documentElement).colorScheme,
    saved: localStorage.getItem('portfolio-theme'),
  }));
  check((await read()).background === 'rgb(21, 20, 18)', 'System dark not applied');
  const toggle = page.locator('[data-theme-switch]');
  await toggle.focus();
  check(await toggle.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'), 'Missing keyboard focus');
  await toggle.press('Enter');
  let state = await read();
  check(state.background === 'rgb(246, 244, 239)' && state.saved === 'light' && state.scheme === 'light', 'Keyboard light switch failed');
  check(state.lab === 'rgb(28, 27, 24)', 'Experiment surface must remain dark');
  await page.reload();
  check((await read()).theme === 'light', 'Reload lost preference');
  await page.locator('.language a[lang="de"]').click();
  check((await read()).theme === 'light', 'Language navigation lost preference');
  check(await toggle.getAttribute('aria-label') === 'Zum dunklen Design wechseln', 'Wrong German button label');
  await page.locator('a[href="/de/datenschutz/"]').click();
  check(await toggle.isVisible(), 'Theme switch missing on legal page');
  await toggle.press('Space');
  check(await page.evaluate(() => getComputedStyle(document.body).backgroundColor) === 'rgb(21, 20, 18)', 'Legal page keyboard dark switch failed');
  await page.goto(origin + '/de/');
  await page.emulateMedia({ colorScheme: 'light' });
  check((await read()).background === 'rgb(21, 20, 18)', 'Explicit preference must override system');
  await page.evaluate(() => localStorage.removeItem('portfolio-theme'));
  await page.reload();
  check((await read()).background === 'rgb(246, 244, 239)', 'System light fallback failed');
  await page.emulateMedia({ colorScheme: 'dark' });
  check((await read()).background === 'rgb(21, 20, 18)', 'System change without preference failed');
  check(await page.locator('#projects .section-heading p').count() === 0, 'Project intro still visible');
  const blocked = await page.context().browser().newContext();
  await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }); });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(origin);
  await blockedPage.locator('[data-theme-switch]').click();
  check(await blockedPage.evaluate(() => !!document.documentElement.dataset.theme), 'Switch failed without storage');
  await blocked.close();
  const noJs = await page.context().browser().newContext({ javaScriptEnabled: false, colorScheme: 'light' });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(origin);
  check(!await noJsPage.locator('[data-theme-switch]').isVisible(), 'Inert no-JS control visible');
  check(await noJsPage.locator('.lab-still').isVisible(), 'No-JS figure missing');
  await noJs.close();
  check(errors.length === 0 && external.length === 0, 'Browser errors or external requests');
  return { passed: true, checks: ['system themes', 'keyboard Enter and Space', 'focus', 'persistent preference', 'language and legal navigation', 'dark experiment surface', 'blocked storage', 'no JavaScript', 'intro removed'], errors, external };
}
