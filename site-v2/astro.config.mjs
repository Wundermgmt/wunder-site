import { defineConfig } from 'astro/config';

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
});
