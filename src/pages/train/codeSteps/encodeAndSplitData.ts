import * as tf from '@tensorflow/tfjs';

import type { TensorData, ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { classes } from '../../../utils/constants';
import { createIncompleteImplValidationError } from '../../../utils/utils';
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
  data: {[key: string]: number[][];},
  classes: string[],
  trainSplit = 0.8,
  valSplit = 0.1,
  testSplit = 0.1,
): [Tensor, Tensor, Tensor, Tensor, Tensor, Tensor] {
  const X: number[][] = [];
  const Y: number[] = [];

  Object.keys(data).forEach((cls, index) => {
    const clsData = data[cls];

    clsData.forEach((item) => {
      X.push(item);
      Y.push(index);
    });
  });
  tf.util.shuffleCombo(X, Y);
  // tensor shape [60581, 63]
  const xTensor = tf.tensor(X);
  console.log('xTensor', xTensor);
  // tensor shape [60581, 26]
  const oneHotOutputs = tf.oneHot(tf.tensor1d(Y, 'int32'), classes.length);

  const trainSize = Math.floor(trainSplit * X.length);
  const valSize = Math.floor(valSplit * X.length);
  const testSize = Math.floor(testSplit * X.length);
  const trainY = oneHotOutputs.slice([0], trainSize);
  const validationY = oneHotOutputs.slice([trainSize], valSize);
  const testY = oneHotOutputs.slice([X.length - testSize], testSize);

  const trainX = xTensor.slice([0], trainSize);
  const validationX = xTensor.slice([trainSize], valSize);
  const testX = xTensor.slice([X.length - testSize], testSize);

  return [trainX, trainY, validationX, validationY, testX, testY];
}
`;

// export const template = `
// // Step 3: Use One Hot Encoding to convert letters (i.e "A", "B", "C") to binary vector
// // Split Training data
// // use pre-built functions below to complete
// /*
//   Encodes data useing one hot encoding and splits data into training and test set
//   returns array of values [X_train, X_val, y_train, y_val];
// */
// function encodeAndSplitData(
//   data:  {[key: string]: number[][];},
//   applyOneHotEncoding: (data: { [key: string]: number[][];}) => { X: number[][]; Y: number[][] },
//   splitTrainingData: (
//     X: number[][],
//     Y: number[][],
//   ) => [number[][], number[][], number[][], number[][]],
// ) {
//   // apply one-hot encoding function below
//   // take the results from one-hot encoding and split data

//   // return resullt from data split
// }
//   `;

export const solution = `
// Step 3: Use One Hot Encoding to convert letters (i.e "A", "B", "C") to binary vector
// Split Training data
// use pre-built functions below to complete
/*
  Encodes data useing one hot encoding and splits data into training and test set
  returns array of values [X_train, X_val, y_train, y_val];
*/
export function encodeAndSplitDataSolution(
  data: {[key: string]: number[][];},
  classes: string[],
  trainSplit = 0.8,
  valSplit = 0.1,
  testSplit = 0.1,
): [Tensor, Tensor, Tensor, Tensor, Tensor, Tensor] {
  const X: number[][] = [];
  const Y: number[] = [];

  Object.keys(data).forEach((cls, index) => {
    const clsData = data[cls];

    clsData.forEach((item) => {
      X.push(item);
      Y.push(index);
    });
  });
  tf.util.shuffleCombo(X, Y);
  // tensor shape [60581, 63]
  const xTensor = tf.tensor(X);
  console.log('xTensor', xTensor);
  // tensor shape [60581, 26]
  const oneHotOutputs = tf.oneHot(tf.tensor1d(Y, 'int32'), classes.length);

  const trainSize = Math.floor(trainSplit * X.length);
  const valSize = Math.floor(valSplit * X.length);
  const testSize = Math.floor(testSplit * X.length);
  const trainY = oneHotOutputs.slice([0], trainSize);
  const validationY = oneHotOutputs.slice([trainSize], valSize);
  const testY = oneHotOutputs.slice([X.length - testSize], testSize);

  const trainX = xTensor.slice([0], trainSize);
  const validationX = xTensor.slice([trainSize], valSize);
  const testX = xTensor.slice([X.length - testSize], testSize);

  return [trainX, trainY, validationX, validationY, testX, testY];
}
  `;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(
  code: string,
  data: { [key: string]: number[][] },
): T {
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

type encodeAndSplitData = (
  data: TensorData,
  classes: string[],
) => [Tensor, Tensor, Tensor, Tensor, Tensor, Tensor];

export async function validate(
  impl: encodeAndSplitData,
  data: TensorData,
): Promise<ValidationResult> {
  let result = [];
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    result = await impl(data, classes);
    if (!result || result.length <= 0) {
      return createIncompleteImplValidationError(
        `It appears encodeAndSplitData() function may not be implemented or is not returning a result`,
      );
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
    data: result,
  };
}
