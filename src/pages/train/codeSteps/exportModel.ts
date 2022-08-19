import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `
async function exportModel(model: LayersModel): Promise<void> {
    // checkout https://www.tensorflow.org/js/guide/save_load\
    // save to localstorage 
    // optional: save to downloads
    // await model.save('localstorage://model');
    // await model.save('downloads://model')
}
`;

export const solution = `
async function exportModelSolution(model: LayersModel): Promise<void> {
    // checkout https://www.tensorflow.org/js/guide/save_load
    await model.save('localstorage://model');
    await model.save('downloads://model')
}
`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string, model: LayersModel): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function('model', 'tf', 'tfjs', `return (${code.replace(/export/g, '')})`);
  return wrapper(model, tf, tf) as T;
}

type setTensorFlowBackend = (model: LayersModel) => void;

export async function validate(
  impl: setTensorFlowBackend,
  model: LayersModel,
): Promise<ValidationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await impl(model);
    const modelSaved = localStorage.getItem('tensorflowjs_models/model/info');
    if (!modelSaved) {
      return createIncompleteImplValidationError(`
      Hmm no model.json saved to localstorage.'
      `);
    }
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
