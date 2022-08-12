import * as tf from '@tensorflow/tfjs';

import type { TensorData } from '../../../types';
import { applyOneHotEncoding, splitTrainingData } from '../train';

export const template = `
// Step 3: Use One Hot Encoding to convert letters (i.e "A", "B", "C") to binary vector
// Split Training data
// use pre-built functions below to complete
/*
  Encodes data useing one hot encoding and splits data into training and test set
  returns array of values [X_train, X_val, y_train, y_val];
*/
export function encodeAndSplitData(
  data: TensorData,
  applyOneHotEncoding: (data: TensorData) => { X: number[][]; Y: number[][] },
  splitTrainingData: (
    X: number[][],
    Y: number[][],
  ) => [number[][], number[][], number[][], number[][]],
) {
  // apply one-hot encoding function below
  const { X, Y } = applyOneHotEncoding(data);
  // take the results from one-hot encoding and split data
  return splitTrainingData(X, Y);
}
  `;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string, data: TensorData): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'data',
    'applyOneHotEncoding',
    'splitTrainingData',
    'defaultModelClasses',
    'tf',
    'tfjs',
    `return (${code.replace(/export/g, '')})`,
  );
  return wrapper(data, applyOneHotEncoding, splitTrainingData, tf, tf) as T;
}
