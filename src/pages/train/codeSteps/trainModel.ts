import * as tf from '@tensorflow/tfjs';

import type { Callbacks } from '../../../types';

export const template = `
export async function trainModel(
    model: LayersModel,
    X_train: number[][],
    X_val: number[][],
    y_train: number[][],
    y_val: number[][],
    numEpochs: number,
    cbs: Callbacks,
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
    'tf',
    'tfjs',
    `return (${code.replace(/export/g, '')})`,
  );
  return wrapper(model, X_train, X_val, y_train, y_val, numEpochs, cbs, tf, tf) as T;
}
