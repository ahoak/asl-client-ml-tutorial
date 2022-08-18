import type { Tensor } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `

async function trainModel(
  model: LayersModel,
  data: [Tensor, Tensor, Tensor, Tensor],
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 2
): Promise<void> {
  const [xTensor, yTensor, xValidateTensor, yValidateTensor] = data


  //Implement model.fit to train the model a given number of epochs
  // https://js.tensorflow.org/api/latest/#tf.LayersModel.fit


  // await model.fit(xTensor, yTensor, {
  //   epochs: numEpochs,
  //   batchSize: 128,
  //   verbose: 1,
  //   validationData: [xValidateTensor, yValidateTensor],
  //   callbacks: callbacks
  // });



}`;
// Free up memory resources
// Free up memory resources by cleaning up intermediate tensors (i.e the tensors above)

// Free up memory resources

// xTensor.dispose();
// yTensor.dispose();
// xValidateTensor.dispose();
// yValidateTensor.dispose();
export const solution = `
 async function trainModelSolution(
  model: LayersModel,
  data: [Tensor, Tensor, Tensor, Tensor],
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 2,
): Promise<void> {
  const [xTensor, yTensor, xValidateTensor, yValidateTensor] = data

  await model.fit(xTensor, yTensor, {
    epochs: numEpochs,
    batchSize: 128,
    verbose: 1,
    validationData: [xValidateTensor, yValidateTensor],
    callbacks: callbacks
  });

}`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(
  code: string,
  model: LayersModel,
  data: [Tensor, Tensor, Tensor, Tensor],
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs: number,
): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'model',
    'data',
    'callbacks',
    'numEpochs',
    'tf',
    'tfjs',
    `return (${code.replace(/export/g, '')})`,
  );
  return wrapper(model, data, callbacks, numEpochs, tf, tf) as T;
}

type trainModel = (
  model: LayersModel,
  data: [Tensor, Tensor, Tensor, Tensor],
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs?: number,
) => Promise<void>;

export async function validate(
  impl: trainModel,
  model: LayersModel,
  data: [Tensor, Tensor, Tensor, Tensor],
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs?: number,
): Promise<ValidationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await impl(model, data, callbacks, numEpochs);
    //TODO: Add validation method here??

    // if (!backendInUse) {
    //   return createIncompleteImplValidationError(`
    //   Hmm no backend detected. Please check solution.'
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
    data: [],
  };
}
