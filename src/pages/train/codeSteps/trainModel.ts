import { LayersModel } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

import type { Callbacks, ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { createIncompleteImplValidationError } from '../../../utils/utils';
import { getCallbacks } from '../train';

// export const template = `
// async function trainModel(
//     model: LayersModel,
//     X_train: number[][],
//     X_val: number[][],
//     y_train: number[][],
//     y_val: number[][],
//     numEpochs: number,
//     cbs: {
//       onBatchEnd: (epoch: number, batch: number, logs?: Logs) => void;
//       onEpochEnd: (epoch: number) => void;
//     },
//     getCallbacks: (epoch: number, cbs: {
//       onBatchEnd: (epoch: number, batch: number, logs?: Logs) => void;
//       onEpochEnd: (epoch: number) => void;
//     }) => void
//   ): Promise<void> {
//     const epoch = 0;
//     const callbacks = getCallbacks(epoch, cbs);

//     // Transform X_train, y_train, X_val, y_val to tensors

//     // call model.fit( )

//     // Free up memory resources

//   }
// `;

export async function trainTestModel(
  model: LayersModel,
  data: [Tensor, Tensor, Tensor, Tensor],
  numEpochs = 2,
): Promise<void> {
  const xTensor = data[0];
  const yTensor = data[1];
  const xValidateTensor = data[2];
  const yValidateTensor = data[3];

  await model.fit(xTensor, yTensor, {
    epochs: numEpochs,
    batchSize: 128,
    verbose: 1,
    validationData: [xValidateTensor, yValidateTensor],
  });
  // Free up memory resources

  xTensor.dispose();
  yTensor.dispose();
  xValidateTensor.dispose();
  yValidateTensor.dispose();
}

export const solution = `
async function trainModelSolution(
    model: LayersModel,
    X_train: number[][],
    X_val: number[][],
    y_train: number[][],
    y_val: number[][],
    numEpochs: number,
    cbs: {
      onBatchEnd: (epoch: number, batch: number, logs?: Logs) => void;
      onEpochEnd: (epoch: number) => void;
    },
    getCallbacks: (epoch: number, cbs: {
      onBatchEnd: (epoch: number, batch: number, logs?: Logs) => void;
      onEpochEnd: (epoch: number) => void;
    }) => void
  ): Promise<void> {
    const epoch = 0;
    const callbacks = getCallbacks(epoch, cbs);
  
    const xTensor = tf.tensor(X_train);
    const yTensor = tf.tensor(y_train);
    const xValidateTensor = tf.tensor(X_val);
    const yValidateTensor = tf.tensor(y_val);
  
    await model.fit(xTensor, yTensor, {
      epochs: numEpochs,
      batchSize: 128,
      verbose: 1,
      validationData: [xValidateTensor, yValidateTensor],
      callbacks: callbacks,
    });
    // Free up memory resources
  
    xTensor.dispose();
    yTensor.dispose();
    xValidateTensor.dispose();
    yValidateTensor.dispose();
  }
`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(
  code: string,
  model: LayersModel,
  X_train: number[][],
  X_val: number[][],
  y_train: number[][],
  y_val: number[][],
  numEpochs: number,
  cbs: Callbacks,
  getCallbacks: (
    epoch: number,
    cbs: {
      onBatchEnd: (epoch: number, batch: number, logs?: Logs) => void;
      onEpochEnd: (epoch: number) => void;
    },
  ) => void,
): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'model',
    'X_train',
    'X_val',
    'y_train',
    'y_val',
    'numEpochs',
    'cbs',
    'getCallbacks',
    'tf',
    'tfjs',
    'LayersModel',
    `return (${code.replace(/export/g, '')})`,
  );
  return wrapper(
    model,
    X_train,
    X_val,
    y_train,
    y_val,
    numEpochs,
    cbs,
    getCallbacks,
    tf,
    tf,
    LayersModel,
  ) as T;
}

type trainModel = (
  model: LayersModel,
  X_train: number[][],
  X_val: number[][],
  y_train: number[][],
  y_val: number[][],
  numEpochs: number,
  cbs: Callbacks,
  getCallbacks: (
    epoch: number,
    cbs: {
      onBatchEnd: (epoch: number, batch: number, logs?: Logs) => void;
      onEpochEnd: (epoch: number) => void;
    },
  ) => void,
) => void;

export async function validate(
  impl: trainModel,
  model: LayersModel,
  X_train: number[][],
  X_val: number[][],
  y_train: number[][],
  y_val: number[][],
  numEpochs: number,
  cbs: Callbacks,
): Promise<ValidationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await impl(model, X_train, X_val, y_train, y_val, numEpochs, cbs, getCallbacks);
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
