// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify(),
  image: {
                service: {
                        entrypoint: '@astrojs/netlify/image-service',
                },
        },
});
