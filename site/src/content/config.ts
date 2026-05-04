import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Jan Riehle'),
    summary: z.string().optional(),
    tag: z.string().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = { blog };
