import { existsSync, readdirSync } from 'node:fs';
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob, type Loader } from 'astro/loaders';

// Code links stay on an allowlist: only repositories that may be public are linked (see AGENTS.md).
const githubLink = z.enum(['https://github.com/maximilian467/n8n-automation-portfolio']);
const flow = z.object({ label: z.string().optional(), nodes: z.array(z.string()).min(2) });
const metric = z.object({ label: z.string(), value: z.string(), highlight: z.string().optional() });

const localizedProject = z.object({
  title: z.string(), description: z.string(), date: z.string(), status: z.string(), role: z.string(), tech: z.string(),
  // Engineering depth. Only fill with facts from docs/CONTENT.md; empty fields are not rendered.
  goal: z.string().optional(),
  built: z.string().optional(),
  architecture: z.array(flow).optional(),
  decisions: z.array(z.string()).optional(),
  metrics: z.array(metric).optional(),
  learned: z.array(z.string()).optional(),
  next: z.array(z.string()).optional(),
});
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    order: z.number(), running: z.boolean().default(false),
    en: localizedProject, de: localizedProject,
    links: z.object({
      demo: z.url().optional(),
      github: githubLink.optional(),
      /** Id of a lab note (its file name without .md), shown as "Technical write-up". */
      writeup: z.string().optional(),
    }).default({}),
  }),
});

const labNotesBase = './src/content/lab-notes';
const labNotesGlob = glob({ pattern: '*.md', base: labNotesBase });
// The glob loader warns on an empty folder. Skip it until the first note exists
// (restart the dev server after adding that first note).
const labNotesLoader: Loader = {
  name: 'lab-notes',
  load: async context => {
    if (existsSync(labNotesBase) && readdirSync(labNotesBase).some(file => file.endsWith('.md'))) return labNotesGlob.load(context);
    context.store.clear();
  },
};
const labNotes = defineCollection({
  loader: labNotesLoader,
  schema: z.object({
    title: z.string(),
    /** Lead paragraph shown under the title. */
    summary: z.string(),
    /** Shorter text for the overview card; defaults to summary. */
    description: z.string().optional(),
    /** Full browser and search title; replaces "Title · Maximilian Köhlenbeck". */
    metaTitle: z.string().optional(),
    /** Search description; defaults to description, then summary. */
    metaDescription: z.string().optional(),
    lang: z.enum(['en', 'de']),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    project: reference('projects').optional(),
    stack: z.array(z.string()).default([]),
    architecture: z.array(flow).optional(),
    metrics: z.array(metric).optional(),
    links: z.object({ demo: z.url().optional(), github: githubLink.optional() }).default({}),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, labNotes };
