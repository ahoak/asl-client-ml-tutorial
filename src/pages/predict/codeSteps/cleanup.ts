import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import {
  createIncompleteImplValidationError,
  createUnknownValidationError,
} from '../../../utils/utils';

export const template = `
/**
 * Cleans up the given _tensor_
 * @param {tf.Tensor} tensor The tensor to clean up
 */
function cleanup(tensor: Tensor) {
  // solution in solutions/cleanup.js
  // 1. https://js.tensorflow.org/api/latest/#tf.Tensor.dispose
}
`;

export const solution = `
/**
 * Cleans up the given _tensor_
 * @param {tf.Tensor} tensor The tensor to clean up
 */
function cleanup(tensor: Tensor) {
  tensor.dispose();
}
`;
type cleanup = (tensor: Tensor) => void;
export async function validate(impl: cleanup): Promise<ValidationResult> {
  try {
    const fakeTensor = tf.tensor1d([1, 2, 3]) as Tensor;
    let disposed = false;
    fakeTensor.dispose = () => (disposed = true);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await impl(fakeTensor);
    if (!disposed) {
      return createIncompleteImplValidationError(
        `Your function did not clean up the tensor that was passed in.`,
      );
    }
  } catch (e) {
    const error = `${e}`;
    return createUnknownValidationError(error);
  }

  return {
    valid: true,
    errors: [],
  };
}
