import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';
import htmlInclude from 'vite-plugin-html-include';

export default defineConfig(({ command }) => {
  // command === 'serve' -> dev server
  // otherwise -> build
  return {
    base: command === 'serve' ? '/' : '/services/',

    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },

    // исходники лежат в папке src
    root: 'src',

    build: {
      sourcemap: true,

      // Собираем в ../docs, чтобы GitHub Pages мог обслуживать main/docs
      outDir: '../docs',
      emptyOutDir: true,

      rollupOptions: {
        // входные html-шаблоны (относительно корня проекта)
        input: glob.sync('src/*.html'),

        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },

          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },

          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },

    plugins: [
      injectHTML(),
      htmlInclude(),
      // следим за всеми html в src
      FullReload(['src/**/*.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});
