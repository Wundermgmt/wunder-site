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
  /*
    /proof gibt es seit dem 08.09.2026 nicht mehr. Die Seite erklaerte, wie wir
    Zahlen berichten, und sagte dabei "no case is ready yet", waehrend
    /results voller Faelle steht. Zwei Seiten, die sich widersprechen, sind
    schlimmer als eine. Alte Links laufen jetzt auf /results.
  */
  redirects: {
    '/proof': '/results',
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
