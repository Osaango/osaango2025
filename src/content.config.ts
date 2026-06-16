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
        events: defineCollection({
                // Load Markdown files in the src/content/events directory.
                loader: glob({ base: './src/content/events', pattern: '**/*.md' }),
                schema: ({ image }) =>
                        z.object({
                                title: z.string(),
                                description: z.string(),
                                eventName: z.string(),
                                startDate: z.coerce.date(),
                                endDate: z.coerce.date(),
                                location: z.string(),
                                format: z.string(),
                                fee: z.string(),
                                duration: z.string(),
                                registrationUrl: z.string().url(),
                                tags: z.array(z.string()),
                                img: image().optional(),
                                img_alt: z.string().optional(),
                                speaker: z.object({
                                        name: z.string(),
                                        title: z.string(),
                                        organization: z.string(),
                                        location: z.string(),
                                        profileUrl: z.string().url().optional(),
                                        bio: z.string(),
                                }),
                        }),
        }),
};
