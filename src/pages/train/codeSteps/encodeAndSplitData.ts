import * as tf from '@tensorflow/tfjs';

import type { TensorData, ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
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
function encodeAndSplitData(
  data:  {[key: string]: number[][];},
  applyOneHotEncoding: (data: { [key: string]: number[][];}) => { X: number[][]; Y: number[][] },
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

export const solution = `
// Step 3: Use One Hot Encoding to convert letters (i.e "A", "B", "C") to binary vector
// Split Training data
// use pre-built functions below to complete
/*
  Encodes data useing one hot encoding and splits data into training and test set
  returns array of values [X_train, X_val, y_train, y_val];
*/
function encodeAndSplitDataSolution(
  data:  {[key: string]: number[][];},
  applyOneHotEncoding: (data: { [key: string]: number[][];}) => { X: number[][]; Y: number[][] },
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
  applyOneHotEncoding: (data: TensorData) => { X: number[][]; Y: number[][] },
  splitTrainingData: (
    X: number[][],
    Y: number[][],
  ) => [number[][], number[][], number[][], number[][]],
) => [number[][], number[][], number[][], number[][]];

export async function validate(
  impl: encodeAndSplitData,
  data: TensorData,
): Promise<ValidationResult> {
  let result = [];
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    result = await impl(data, applyOneHotEncoding, splitTrainingData);
    if (result && result.length <= 0) {
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
