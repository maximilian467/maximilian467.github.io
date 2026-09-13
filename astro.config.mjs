import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://maximilian467.github.io',
  output: 'static',
  trailingSlash: 'always',
  i18n: { defaultLocale: 'de', locales: ['de', 'en'], routing: { prefixDefaultLocale: false } },
  integrations: [sitemap({ i18n: { defaultLocale: 'de', locales: { de: 'de-DE', en: 'en' } } })],
});
