import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://maximilian467.github.io',
  output: 'static',
  trailingSlash: 'always',
  i18n: { defaultLocale: 'en', locales: ['en', 'de'], routing: { prefixDefaultLocale: false } },
  // URLs from the earlier German-first version keep working.
  redirects: {
    '/en': '/',
    '/en/legal-notice': '/legal-notice/',
    '/en/privacy': '/privacy/',
    '/impressum': '/de/impressum/',
    '/datenschutz': '/de/datenschutz/',
  },
  markdown: {
    // Code blocks in lab notes follow the site theme through CSS variables (see base.css).
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', de: 'de-DE' } } })],
});
