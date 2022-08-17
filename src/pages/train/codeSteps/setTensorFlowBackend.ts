import '@tensorflow/tfjs-backend-wasm';

import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { createIncompleteImplValidationError } from '../../../utils/utils';

// setWasmPaths('/');
export const template = `
/*
Sets Tensorflow backend to use either webgl, cpu or wasm
*/
async function setTensorFlowBackend(): Promise<void> {
    // specify backend (not necessary, should default to webgl if available)
    //  const option = 'webgl' || 'cpu' || 'wasm';
}
`;

export const solution = `
/*
Sets Tensorflow backend to use either webgl, cpu or wasm
*/
async function setTensorFlowBackendSolution(): Promise<void> {
    // specify backend (not necessary, should default to webgl if available)
    //  const option = 'webgl' || 'cpu' || 'wasm';
    await tf.setBackend('webgl');
}
`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function('tf', 'tfjs', `return (${code.replace(/export/g, '')})`);
  return wrapper(tf, tf) as T;
}

type setTensorFlowBackend = () => void;

export async function validate(impl: setTensorFlowBackend): Promise<ValidationResult> {
  let backendInUse;
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await impl();
    backendInUse = tf.getBackend();
    if (!backendInUse) {
      return createIncompleteImplValidationError(`
      Hmm no backend detected. Please check solution.'
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
    data: [backendInUse],
  };
}
