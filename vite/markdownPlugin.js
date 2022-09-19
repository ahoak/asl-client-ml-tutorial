// import { createFilter, dataToEsm, FilterPattern } from '@rollup/pluginutils';

import { dataToEsm } from '@rollup/pluginutils';

const markdown = require('helper-markdown');

function plugin(options) {
  return {
    transform(code, id) {
      if (id.endsWith('.md')) {
        return dataToEsm(markdown(code));
      }
    },
  };
}

export default plugin;
