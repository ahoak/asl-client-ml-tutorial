import { resolve } from 'path';
import { defineConfig } from 'vite';
import indexHandlebarsPlugin from 'vite-plugin-handlebars';
import mpa from 'vite-plugin-mpa';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

import markdownPlugin from './vite/markdownPlugin';

const markdown = require('helper-markdown');

const Settings = require('./settings.json');

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const base = process.env.APP_BASE_URL || '/';
  const handlebarsOptions = {
    // eslint-disable-next-line no-undef
    partialDirectory: resolve(__dirname, 'src/layout'),

    // context: { settings: Settings },
    context: (pagePath) => {
      Settings['trainTutorialSteps'].forEach((element) => {
        element.baseUrl = base;
      });
      return { baseUrl: base, settings: Settings };
    },

    reloadOnPartialChange: true,
    helpers: {
      markdown: (value) => markdown(value),
      ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  }
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
      indexHandlebarsPlugin(handlebarsOptions),
      markdownPlugin(handlebarsOptions)
    ],
    base,
    optimizeDeps: {
      exclude: ['@tensorflow/tfjs-backend-wasm/dist'],
    },
  };
});
