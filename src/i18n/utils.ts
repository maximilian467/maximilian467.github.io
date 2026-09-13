import type { Locale } from './ui';
export type PageKey = 'home' | 'legal' | 'privacy';
export const routes: Record<Locale, Record<PageKey, string>> = {
  de: { home: '/', legal: '/impressum/', privacy: '/datenschutz/' },
  en: { home: '/en/', legal: '/en/legal-notice/', privacy: '/en/privacy/' },
};
