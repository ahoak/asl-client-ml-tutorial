import type { CustomCallbackArgs, LayersModel, Logs } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

import type { Callbacks, TensorData } from '../../types';
import { classes } from '../../utils/constants.js';
import { trainTestSplit } from '../../utils/utils.js';

/*
  Modify below to build model
*/

// Step 2: Set TensorflowBackend
/*
  Sets Tensorflow backend to use either webgl, cpu or wasm
*/
export async function setTensorFlowBackend() {
  // specify backend (not necessary, should default to webgl if available)
  //   const option = 'webgl' || 'cpu' || 'wasm';
  await tf.setBackend('webgl');
}

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

// TFJS IMPLENTATION IN QUESTION
// export async function encodeAndSplitData(data: TensorData) : Promise<[number[][], number[], number[][], number[], number[][], number[]]>{
//   const X: number[][] = [];
//   const Y: number[] = []

//   Object.keys(data).forEach((cls, index) => {
//     const clsData = data[cls];

//     // const yVal = oneHotClasses[cls];
//     clsData.forEach((item) => {
//       X.push(item);
//       // Y.push(yVal);
//       Y.push(index)
//     });
//   });

// const [trainX, trainY, validationX, validationY, testX, testY] = await getDatasetPartitions(X,Y, 0.8, 0.1, 0.1, true)

// return [trainX, trainY, validationX, validationY, testX, testY]

// }

export function applyOneHotEncoding(data: TensorData): { X: number[][]; Y: number[][] } {
  const X: number[][] = [];
  const Y: number[][] = [];

  const oneHotClasses = classes.reduce((acc, item, i) => {
    acc[item] = Array.from({ length: classes.length }).fill(0) as number[];
    acc[item][i] = 1;
    return acc;
  }, {} as { [key: string]: number[] });
  // One=hot encoding to map classnames to numerical values
  Object.keys(data).forEach((cls) => {
    const clsData = data[cls];

    const yVal = oneHotClasses[cls];
    clsData.forEach((item: number[]) => {
      X.push(item);
      Y.push(yVal);
    });
  });

  return { X, Y };
}

export function splitTrainingData(
  X: number[][],
  Y: number[][],
): [number[][], number[][], number[][], number[][]] {
  //Split data between training and test set
  const [X_train_1, , y_train_1] = trainTestSplit(X, Y, {
    testSize: 0.1,
    randomState: 42,
  });

  const [X_train, X_val, y_train, y_val] = trainTestSplit(X_train_1, y_train_1, {
    testSize: 0.1,
    randomState: 42,
  });
  console.log('[X_train, X_val, y_train, y_val]', [X_train, X_val, y_train, y_val]);
  return [X_train, X_val, y_train, y_val];
}

// https://js.tensorflow.org/api/latest/#tf.LayersModel.compile
export function configureModel(model: LayersModel): void {
  // Compile the model with the defined optimizer and specify a loss function to use.
  model.compile({
    // Adam changes the learning rate over time which is useful.
    // optimizer: 'adam',
    optimizer: tf.train.adam(0.001),
    // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
    // Else categoricalCrossentropy is used if more than 2 classes.
    loss: 'categoricalCrossentropy',
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: ['accuracy'],
  });
}

// Create a feed-forward model using the tf.sequential (https://js.tensorflow.org/api/latest/#sequential)
export function createModel() {
  // Create a feed-forward model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [63], units: 63, activation: 'relu' }),
      tf.layers.dense({ units: 512, activation: 'relu' }),
      tf.layers.dense({ units: 256, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.3 }),
      tf.layers.dense({ units: 128, activation: 'relu' }),
      tf.layers.dense({ units: classes.length, activation: 'softmax' }),
    ],
  });
  return model;
}

export function getCallbacks(epoch: number, opts?: Callbacks): CustomCallbackArgs {
  function onBatchEnd(batch: number, logs?: Logs) {
    opts?.onBatchEnd && opts.onBatchEnd(epoch, batch, logs);
  }

  function onEpochEnd() {
    epoch = epoch + 1;
    opts?.onEpochEnd && opts.onEpochEnd(epoch);
  }
  return { onBatchEnd, onEpochEnd };
}

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

export async function exportModel(model: LayersModel): Promise<void> {
  // checkout https://www.tensorflow.org/js/guide/save_load
  await model.save('localstorage://model');
}
