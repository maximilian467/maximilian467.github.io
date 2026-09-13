import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const localizedProject = z.object({
  title: z.string(), description: z.string(), date: z.string(), status: z.string(), role: z.string(), tech: z.string(),
});
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    order: z.number(), running: z.boolean().default(false),
    de: localizedProject, en: localizedProject,
    code: z.literal('https://github.com/maximilian467/n8n-automation-portfolio').optional(),
    measurements: z.boolean().default(false),
  }),
});
export const collections = { projects };
