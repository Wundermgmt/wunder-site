import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output, no client framework, no runtime server.
// Concept reference: 04-konzept.md, section 6.1.
export default defineConfig({
  site: 'https://wundermgmt.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      // Legal pages and the post application confirmation stay out of the
      // index (Base.astro noindex prop), so they stay out of the sitemap too.
      filter: (page) =>
        !page.includes('/imprint') &&
        !page.includes('/privacy') &&
        !page.includes('/apply/thank-you'),
    }),
  ],
});
