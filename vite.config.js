import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebarsPlugin from 'vite-plugin-handlebars';
import handlebars from 'handlebars';
import layouts from 'handlebars-layouts';
import helpers from 'handlebars-helpers';
import Settings from './settings.json';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      handlebarsPlugin({
        // eslint-disable-next-line no-undef
        partialDirectory: resolve(__dirname, 'src/layout'),

        context: { settings: Settings },
        ...helpers({ handlebars }),
        ...layouts(handlebars),
        reloadOnPartialChange: true,
      }),
    ],
  };
});
