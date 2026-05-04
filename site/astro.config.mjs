import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.risingventure.com.br',

  // Site uses plain <img> tags only (no Astro Image component), so we can skip
  // sharp and avoid pulling a heavy native dep into the build.
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },

  // Legacy Jekyll permalinks → new Astro slugs.
  // Astro emits these as static HTML pages with a meta-refresh redirect,
  // which works on GitHub Pages without server config.
  redirects: {
    '/2023/01/30/searchfund-update.html': '/posts/searchfund-update',
    '/2017/08/20/b4a-formation.html': '/posts/b4a-formation',
    '/2017/04/13/itaro-exit.html': '/posts/itaro-exit',
    '/2017/05/09/multiple-store-brand-positioning-ecommerce.html': '/posts/multi-vertical-ecommerce',
    '/2017/03/29/Brazil.html': '/posts/searchfund-asset-class-brazil',
    '/2017/03/29/performance.html': '/posts/searchfund-performance',
    '/2017/03/18/performance.html': '/posts/searchfund-performance',
    '/2017/03/29/links.html': '/posts/external-links',
    '/2017/03/17/links.html': '/posts/external-links',
  },
});
