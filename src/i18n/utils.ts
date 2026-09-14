import type { Locale } from './ui';
export type PageKey = 'home' | 'legal' | 'privacy' | 'labNotes';
export const routes: Record<Locale, Record<PageKey, string>> = {
  en: { home: '/', legal: '/legal-notice/', privacy: '/privacy/', labNotes: '/lab-notes/' },
  de: { home: '/de/', legal: '/de/impressum/', privacy: '/de/datenschutz/', labNotes: '/de/laborbuch/' },
};
/** A lab note lives under the overview of the language it is written in. */
export const labNoteUrl = (lang: Locale, id: string) => `${routes[lang].labNotes}${id}/`;
