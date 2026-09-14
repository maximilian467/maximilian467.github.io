import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

export type LabNote = CollectionEntry<'labNotes'>;

// Astro warns when an empty collection is queried, so check for files first.
const files = import.meta.glob('../content/lab-notes/*.md');

/** Published notes, newest first. Drafts are visible in `npm run dev` only. */
export async function getLabNotes(): Promise<LabNote[]> {
  if (Object.keys(files).length === 0) return [];
  const notes = await getCollection('labNotes', note => import.meta.env.DEV || !note.data.draft);
  return notes.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export async function labNotePaths(lang: Locale) {
  return (await getLabNotes())
    .filter(note => note.data.lang === lang)
    .map(note => ({ params: { slug: note.id }, props: { note } }));
}

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
export const formatDate = (date: Date, lang: Locale) =>
  new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
