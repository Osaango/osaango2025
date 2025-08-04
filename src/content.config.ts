import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
        work: defineCollection({
                // Load Markdown files in the src/content/work directory.
                loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
                schema: ({ image }) =>
                        z.object({
                                title: z.string(),
                                description: z.string(),
                                publishDate: z.coerce.date(),
                                tags: z.array(z.string()),
                                img: image(),
                                img_alt: z.string().optional(),
                        }),
        }),
        blog: defineCollection({
                // Load Markdown files in the src/content/blog directory.
                loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
                schema: ({ image }) =>
                        z.object({
                                title: z.string(),
                                description: z.string(),
                                publishDate: z.coerce.date(),
                                tags: z.array(z.string()),
                                img: image(),
                                img_alt: z.string().optional(),
                                author: z.string().optional(),
                        }),
        }),
};
