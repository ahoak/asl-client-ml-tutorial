// import handlebars from 'handlebars';
// import helpers from 'handlebars-helpers';
// import layouts from 'handlebars-layouts';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebarsPlugin from 'vite-plugin-handlebars';
import mpa from 'vite-plugin-mpa';

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
      mpa(),
      handlebarsPlugin({
        // eslint-disable-next-line no-undef
        partialDirectory: resolve(__dirname, 'src/layout'),

        // context: { settings: Settings },
        context: (pagePath) => {
          console.log('pagePath', pagePath);
          return { settings: Settings };
        },

        reloadOnPartialChange: true,
      }),
    ],
  };
});
