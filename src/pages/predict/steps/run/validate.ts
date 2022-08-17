import { tensor1d } from '@tensorflow/tfjs-core';

import type { ValidationResult } from '../../../../types';
import {
  createIncompleteImplValidationError,
  createUnknownValidationError,
} from '../../../../utils/utils';
import type { RunStepState } from './types';

type cleanup = (tensor: Tensor) => void;
export async function validate(state: RunStepState): Promise<ValidationResult> {
  try {
    if (state.instance) {
      const impl = state.instance as cleanup;
      const fakeTensor = tensor1d([1, 2, 3]) as Tensor;
      let disposed = false;
      fakeTensor.dispose = () => (disposed = true);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await impl(fakeTensor);
      if (!disposed) {
        return createNotCleanedUpError();
      }
    } else {
      return createIncompleteImplValidationError(`Missing Implementation!`);
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

export const createNotCleanedUpError = () =>
  createIncompleteImplValidationError(
    `Your function did not clean up the tensor that was passed in.`,
  );
