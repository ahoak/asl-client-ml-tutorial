import * as tf from '@tensorflow/tfjs';
import * as jszip from 'jszip';

import type { TensorData, ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { assetURL, classes } from '../../../utils/constants';
import { createIncompleteImplValidationError, loadTensors } from '../../../utils/utils';

export const template = `
// READ-ONLY
// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets. Encodes Y-values (letter names) using one-hot encoding
// shuffles and splits data into training, validation, test sets

async function loadTensorData(
  loadTensors: (folder: jsZipInstance) => Promise<{ [key: string]: number[][] }>,
  assetURL: string,
  classes: string[]
): Promise<[Tensor, Tensor, Tensor, Tensor, Tensor, Tensor]> {
  // Fetch pre-processed data, data is extracted using mediapipe hands model
  // https://google.github.io/mediapipe/solutions/hands.html from this dataset: 
  // https://www.kaggle.com/datasets/grassknoted/asl-alphabet
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  const zipFolder = await jszip.loadAsync(zippedModelBuffer);
  const data = await loadTensors(zipFolder);
  // Check inspector to view data
  console.log("data", data)
/*
  Encodes data useing one hot encoding and splits data into training and test set
  returns array of Tensors;
*/
  function encodeAndSplitData(
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

    // Use one-hot encoding to encode label data
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

  // call above function to get training data split 
  const [trainX, trainY, validationX, validationY, testX, testY] =  encodeAndSplitData(data, classes)

  
  return [trainX, trainY, validationX, validationY, testX, testY];
}


`;

export const solution = `
// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets
async function loadTensorDataSolution(
  loadTensors: (folder: jsZipInstance) => Promise<{ [key: string]: number[][] }>,
  assetURL: string,
  classes: string[]
): Promise<[Tensor, Tensor, Tensor, Tensor, Tensor, Tensor]> {
  // Fetch pre-processed data, data is extracted using mediapipe hands model
  // https://google.github.io/mediapipe/solutions/hands.html from this dataset: 
  // https://www.kaggle.com/datasets/grassknoted/asl-alphabet
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  const zipFolder = await jszip.loadAsync(zippedModelBuffer);
  const data = await loadTensors(zipFolder);
/*
  Encodes data useing one hot encoding and splits data into training and test set
  returns array of Tensors;
*/
  function encodeAndSplitData(
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

  // call above function to get training data split 
  const [trainX, trainY, validationX, validationY, testX, testY] =  encodeAndSplitData(data, classes)

  
  return [trainX, trainY, validationX, validationY, testX, testY];
}

`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'loadAsync',
    'jszip',
    'jsZipInstance',
    'tf',
    'tfjs',
    'assetURL',
    'classes',
    `return (${code.replace(/export/g, '')})`,
  );
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return wrapper(loadTensors, jszip, jszip, tf, tf, assetURL, classes) as T;
}
type loadData = (
  loadTensors: (folder: jszip) => Promise<TensorData>,
  assetURL: string,
  classes: string[],
) => Promise<[Tensor, Tensor, Tensor, Tensor, Tensor, Tensor]>;
export async function validate(impl: loadData): Promise<ValidationResult> {
  let inputData;
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    inputData = await impl(loadTensors, assetURL, classes);
    if (!inputData || inputData.length < 4) {
      return createIncompleteImplValidationError(`
          data did not load
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
    data: [inputData],
  };
}
