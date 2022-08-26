import * as tf from '@tensorflow/tfjs';
import * as jszip from 'jszip';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { assetURL } from '../../../utils/constants';
import { createIncompleteImplValidationError, loadTensors } from '../../../utils/utils';
import { applyOneHotEncoding, splitTrainingData } from '../train';

export const template = `
// READ-ONLY
// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets. Encodes Y-values (letter names) using one-hot encoding
// shuffles and splits data into training, validation, test sets
async function loadTensorData(
  loadTensors: (folder: jsZipInstance) => Promise<{ [key: string]: number[][] }>,
  assetURL: string,
  applyOneHotEncoding: (data: {  [key: string]: number[][]}) => { X: number[][]; Y: number[][] },
  splitTrainingData: (
    X: number[][],
    Y: number[][],
  ) => [number[][], number[][], number[][], number[][]],

): Promise<[number[][], number[][], number[][], number[][]]> {
  // Fetch pre-processed data, data is extracted using mediapipe hands model
  // https://google.github.io/mediapipe/solutions/hands.html from this dataset: 
  // https://www.kaggle.com/datasets/grassknoted/asl-alphabet
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  const zipFolder = await jszip.loadAsync(zippedModelBuffer);
  const data = await loadTensors(zipFolder);
  // Check inspector to view data
  console.log("data", data)

  // apply one-hot encoding function below
  const { X, Y } = applyOneHotEncoding(data);
  // take the results from one-hot encoding and split data
  return splitTrainingData(X, Y);
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
    'applyOneHotEncoding',
    'splitTrainingData',
    `return (${code.replace(/export/g, '')})`,
  );
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return wrapper(
    loadTensors,
    jszip,
    jszip,
    tf,
    tf,
    assetURL,
    applyOneHotEncoding,
    splitTrainingData,
  ) as T;
}
type loadData = (
  loadTensors: (folder: jszip) => Promise<{ [key: string]: number[][] }>,
  assetURL: string,
  applyOneHotEncoding: (data: { [key: string]: number[][] }) => { X: number[][]; Y: number[][] },
  splitTrainingData: (
    X: number[][],
    Y: number[][],
  ) => [number[][], number[][], number[][], number[][]],
) => Promise<[number[][], number[][], number[][], number[][]]>;
export async function validate(impl: loadData): Promise<ValidationResult> {
  let inputData;
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    inputData = await impl(loadTensors, assetURL, applyOneHotEncoding, splitTrainingData);
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
