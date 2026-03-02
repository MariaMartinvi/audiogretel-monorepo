import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blogSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  date: z.coerce.date(),
  author: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  featuredImage: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  faq: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
});

const blogEs = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const blogEn = defineCollection({
  type: 'content',
  schema: blogSchema,
});

export const collections = {
  blogEs,
  blogEn,
};
