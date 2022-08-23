import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebarsPlugin from 'vite-plugin-handlebars';
import mpa from 'vite-plugin-mpa';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

const Settings = require('./settings.json');

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      wasm(),
      topLevelAwait(),
      mpa(),
      handlebarsPlugin({
        // eslint-disable-next-line no-undef
        partialDirectory: resolve(__dirname, 'src/layout'),

        // context: { settings: Settings },
        context: (pagePath) => {
          return { settings: Settings };
        },

        reloadOnPartialChange: true,
      }),
    ],
    optimizeDeps: {
      exclude: ['@tensorflow/tfjs-backend-wasm/dist'],
    },
  };
});
