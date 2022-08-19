import type { Tensor } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
// import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `

function cleanupTensors(
  data: [Tensor, Tensor, Tensor, Tensor]
): void {
  const [xTensor, yTensor, xValidateTensor, yValidateTensor] = data

  // Free up memory resources by cleaning up intermediate tensors (i.e the tensors above)
  xTensor.dispose();
  yTensor.dispose();
  xValidateTensor.dispose();
  yValidateTensor.dispose();
    

}`;

export const solution = `
 function cleanupTensorsSolution(
  data: [Tensor, Tensor, Tensor, Tensor],

): void {
  const [xTensor, yTensor, xValidateTensor, yValidateTensor] = data

  xTensor.dispose();
  yTensor.dispose();
  xValidateTensor.dispose();
  yValidateTensor.dispose();

}`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(
  code: string,
  data: [Tensor, Tensor, Tensor, Tensor],
): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function('data', 'tf', 'tfjs', `return (${code.replace(/export/g, '')})`);
  return wrapper(data, tf, tf) as T;
}

type trainModel = (data: [Tensor, Tensor, Tensor, Tensor]) => void;

export async function validate(
  impl: trainModel,
  data: [Tensor, Tensor, Tensor, Tensor],
): Promise<ValidationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await impl(data);
    //TODO: Add validation method here??
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
    data: [],
  };
}
