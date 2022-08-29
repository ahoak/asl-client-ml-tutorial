import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `

async function trainModel(
  model: LayersModel,
  xTrainData: number[][], 
  yTrainData: number[][], 
  xValidationData: number[][], 
  yValidationData: number[][], 
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 5
): Promise<History> {

  const xTrainTensor = tf.tensor(xTrainData);
  const yTrainTensor = tf.tensor(yTrainData);
  const xValidationTensor = tf.tensor(xValidationData);
  const yValidationTensor = tf.tensor(yValidationData);

  const modelHistory = await model.fit( /*✨INSERT_HERE✨*/, /*✨INSERT_HERE✨*/, {
    epochs: numEpochs, // default = 5 
    batchSize: 128, 
    verbose: 1,
    validationData: [/*✨INSERT_HERE✨*/, /*✨INSERT_HERE✨*/],
    callbacks: callbacks
   });

  xTrainTensor.dispose()
  yTrainTensor.dispose()
  xValidationTensor.dispose()
  yValidationTensor.dispose() 

  return modelHistory
}

`;

export const solution = `
 async function trainModelSolution(
  model: LayersModel,
  xTrainData: number[][], 
  yTrainData: number[][], 
  xValidationData: number[][], 
  yValidationData: number[][], 
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 3,
): Promise<History> {

  const xTrainTensor = tf.tensor(xTrainData);
  const yTrainTensor = tf.tensor(yTrainData);
  const xValidationTensor = tf.tensor(xValidationData);
  const yValidationTensor = tf.tensor(yValidationData);


  // Since our data fits in memory, we can use the model.fit() api. 
  // https://js.tensorflow.org/api/latest/#tf.LayersModel.fit
  const modelHistory = await model.fit(xTrainTensor, yTrainTensor, {
    epochs: numEpochs, 
    batchSize: 128,
    verbose: 1,
    validationData: [xValidationTensor, yValidationTensor],
    callbacks: callbacks
  });
  
  // Free up memory resources by cleaning up intermediate tensors (i.e the tensors above)
  xTrainTensor.dispose()
  yTrainTensor.dispose()
  xValidationTensor.dispose()
  yValidationTensor.dispose() 
  
  return modelHistory
}

/* 
Under the hood, model.fit() can do a lot for us:

 Splits the data into a train and validation set, and uses the validation set to measure progress during training.
 Shuffles the data but only after the split. To be safe, you should pre-shuffle the data before passing it to fit().
 Splits the large data tensor into smaller tensors of size batchSize.
 Calls optimizer.minimize() while computing the loss of the model with respect to the batch of data.
 It can notify you on the start and end of each epoch or batch. In our case, we are notified at the end of every batch using the callbacks.onBatchEndoption. Other options include: onTrainBegin, onTrainEnd, onEpochBegin, onEpochEnd and onBatchBegin.
 It yields to the main thread to ensure that tasks queued in the JS event loop can be handled in a timely manner.
 Read more: https://www.tensorflow.org/js/guide/train_models
*/


`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(
  code: string,
  model: LayersModel,
  xTrainData: number[][],
  yTrainData: number[][],
  xValidationData: number[][],
  yValidationData: number[][],
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs: number,
): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'model',
    'xTrainData',
    'yTrainData',
    'xValidationData',
    'yValidationData',
    'callbacks',
    'numEpochs',
    'tf',
    'tfjs',
    `return (${code.replace(/export/g, '')})`,
  );
  return wrapper(
    model,
    xTrainData,
    yTrainData,
    xValidationData,
    yValidationData,
    callbacks,
    numEpochs,
    tf,
    tf,
  ) as T;
}

type trainModel = (
  model: LayersModel,
  xTrainData: number[][],
  yTrainData: number[][],
  xValidationData: number[][],
  yValidationData: number[][],
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs?: number,
) => Promise<History>;

export async function validate(
  impl: trainModel,
  model: LayersModel,
  xTrainData: number[][],
  yTrainData: number[][],
  xValidationData: number[][],
  yValidationData: number[][],
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs?: number,
): Promise<ValidationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const history = await impl(
      model,
      xTrainData,
      yTrainData,
      xValidationData,
      yValidationData,
      callbacks,
      numEpochs,
    );

    //TODO: Add validation method here??

    if (!history) {
      return createIncompleteImplValidationError(`
      Looks like you didn't return anything. Please return value from model.fit()'
      `);
    } else if (!history.params) {
      return createIncompleteImplValidationError(`
      Looks like you didn't put any parameters in your fit function'
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
    data: [],
  };
}
