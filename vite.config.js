import { resolve } from "path";
import { defineConfig } from "vite";
// Slightly modified from https://github.com/alexlafroscia/vite-plugin-handlebars
import handlebarsPlugin from "vite-plugin-handlebars";
import handlebars from 'handlebars';
import layouts from 'handlebars-layouts'
import helpers from 'handlebars-helpers';
import vitePluginString from 'vite-plugin-string'


// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    plugins: [
      // vitePluginString(
      //   {
      //     /* Default */
      //     include: [
      //       '*.html',
      //       'layout/*.html',
      //     ],
  
      //     /* Default: undefined */
      //     exclude: 'node_modules/**',
  
      //     /* Default: true */
      //     // if true, using logic from rollup-plugin-glsl
      //     compress: false,
  
      //     // // if a function, will instead of default compress function
      //     // // returns string|Promise<string>
      //     // compress(code) {
      //     // 	return code.replace(/\n/g, '')
      //     // }
      //   }),
        // handlebars({partialDirectory: resolve(__dirname, "layout"), settingsFile: 'settings.json'})
        handlebarsPlugin({
            partialDirectory: resolve(__dirname, "layout"),
            // settingsFile: 'settings.json',
            context() {
              return {};
            },
            // helpers: {
            //   hostasclass: value => new URL(value).hostname.replace(/\./g, "_")
            // },
            ...helpers({ handlebars }),
            ...layouts(handlebars),
            reloadOnPartialChange: true
          })
    ],
    // plugins: [
    //   handlebars({
    //     partialDirectory: resolve(__dirname, "layout"),
    //     settingsFile: 'settings.json',
    //     // helpers: {
    //     //   hostasclass: value => new URL(value).hostname.replace(/\./g, "_")
    //     // },
    //     reloadOnPartialChange: true
    //   })
    //   // handlebars({ partialDirectory: resolve(__dirname, "layout")})
    // ],
    // build: {
    //   cssCodeSplit: false,
    //   outDir: "build"
    // },
    // optimizeDeps: {
    //   exclude: ['./settings.json']
    // },
    // server: { 
    //   strictPort: false,
    //   // hmr: {
    //   //   port: 443
    //   // }
    // }
  };
});
