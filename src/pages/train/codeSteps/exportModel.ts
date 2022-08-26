import * as tf from '@tensorflow/tfjs';
import JSZip from 'jszip';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { ArrayBufferModelSaver } from '../../../utils/tfArrayBufferLoaderSaver';
import { download } from '../train';
// import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `
// READ-ONLY
async function exportModel(model: LayersModel, ArrayBufferModelSaverInstance,  download: (filename: string, data: string)=> void): Promise<void> {
    // checkout https://www.tensorflow.org/js/guide/save_load for info on the async method 'save'
    // We can save the topology and weights of a model
    // Topology: This is a file describing the architecture of a model (i.e. what operations it uses). It contains references to the models's weights which are stored externally.
    // Weights: These are binary files that store the weights of a given model in an efficient format. They are generally stored in the same folder as the topology.


    // save to localstorage or downloads
    await model.save('localstorage://model');

    // custom Logic to save as zip folder

    const zip = new JSZip();
    const files = await model.save(ArrayBufferModelSaverInstance);
    const f = files as unknown as { data: { [key: string]: ArrayBuffer } };
  
    Object.keys(f.data).forEach((fileName, index) => {
      if (index === 0) {
        zip.file(fileName, JSON.stringify(f.data[fileName]));
      } else {
        zip.file(fileName, f.data[fileName]);
      }
    });

    // download to zip file for upload in part 2 of the tutorial

    await zip.generateAsync({ type: 'base64' }).then(
      function (base64) {
        download('model.zip', base64);
      },
      function (error) {
        console.warn(error);
      },
    );
    
}
`;

export const solution = `
// READ-ONLY
async function exportModel(model: LayersModel, ArrayBufferModelSaverInstance,  download: (filename: string, data: string)=> void): Promise<void> {
    // checkout https://www.tensorflow.org/js/guide/save_load for info on the async method 'save'
    // We can save the topology and weights of a model
    // Topology: This is a file describing the architecture of a model (i.e. what operations it uses). It contains references to the models's weights which are stored externally.
    // Weights: These are binary files that store the weights of a given model in an efficient format. They are generally stored in the same folder as the topology.


    // save to localstorage or downloads
    await model.save('localstorage://model');

    // custom Logic to save as zip folder

    const zip = new JSZip();
    const files = await model.save(ArrayBufferModelSaverInstance);
    const f = files as unknown as { data: { [key: string]: ArrayBuffer } };
  
    Object.keys(f.data).forEach((fileName, index) => {
      if (index === 0) {
        zip.file(fileName, JSON.stringify(f.data[fileName]));
      } else {
        zip.file(fileName, f.data[fileName]);
      }
    });

    // download to zip file for upload in part 2 of the tutorial

    await zip.generateAsync({ type: 'base64' }).then(
      function (base64) {
        download('model.zip', base64);
      },
      function (error) {
        console.warn(error);
      },
    );
    
}
`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(
  code: string,
  model: LayersModel,
  instance: ArrayBufferModelSaver,
  download: (filename: string, data: string) => void,
): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'model',
    'ArrayBufferModelSaver',
    'download',
    'tf',
    'tfjs',
    'JSZip',
    `return (${code.replace(/export/g, '')})`,
  );
  return wrapper(model, instance, download, tf, tf, JSZip, ArrayBufferModelSaver) as T;
}

type setTensorFlowBackend = (
  model: LayersModel,
  arg: ArrayBufferModelSaver,
  download: (filename: string, data: string) => void,
) => Promise<ValidationResult>;

export async function validate(
  impl: setTensorFlowBackend,
  model: LayersModel,
): Promise<ValidationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await impl(model, new ArrayBufferModelSaver(), download);
    // const modelSaved = localStorage.getItem('tensorflowjs_models/model/info');
    // if (!modelSaved) {
    //   return createIncompleteImplValidationError(`
    //   Hmm no model.json saved to localstorage.'
    //   `);
    // }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const error = `${e}`;
    return {
      valid: false,
      errors: [
        {
          type: ValidationErrorType.Unknown,
          detail: error,
        },
      ],
    };
  }

  return {
    valid: true,
    errors: [],
  };
}
