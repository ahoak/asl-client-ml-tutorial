import type { CustomCallbackArgs, LayersModel, Logs, Tensor } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import * as jszip from 'jszip';
import JSZip from 'jszip';

import type { Callbacks, TensorData } from '../../types';
import { assetURL, classes } from '../../utils/constants.js';
import { ArrayBufferModelSaver } from '../../utils/tfArrayBufferLoaderSaver';
import { loadTensors, trainTestSplit } from '../../utils/utils.js';

export async function testFullPipeline() {
  // const data = await loadTensorDataSolution();
  // await setTensorFlowBackend();
  // const [trainX, trainY, validationX, validationY] = encodeAndSplitData(data);
  // const model = createModel();
  // configureModel(model);
  // await trainTestModel(model, [trainX, trainY, validationX, validationY], 1);
  // await exportModel(model);
}

export async function trainTestModel(
  model: LayersModel,
  data: [Tensor, Tensor, Tensor, Tensor],
  numEpochs = 2,
): Promise<void> {
  console.log('testing...');
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

export async function loadTensorDataSolution(): Promise<{ [key: string]: number[][] }> {
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const zipFolder = await jszip.loadAsync(zippedModelBuffer);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const output = await loadTensors(zipFolder);
  return output;
}

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

export function encodeAndSplitDataTF(
  data: TensorData,
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

  // const result = applyOneHotEncoding(data);
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

export function applyOneHotEncoding(data: TensorData): { inputs: number[][]; outputs: number[][] } {
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

  return { inputs: X, outputs: Y };
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

export function download(filename: string, data: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/zip;base64,' + data);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export async function exportModel(model: LayersModel): Promise<void> {
  // save to localstorage or downloads
  await model.save('localstorage://model');
  console.log('model saved to localstorage!');
  const zip = new JSZip();
  const files = await model.save(new ArrayBufferModelSaver());
  const f = files as unknown as { data: { [key: string]: ArrayBuffer } };

  Object.keys(f.data).forEach((fileName, index) => {
    if (index === 0) {
      zip.file(fileName, JSON.stringify(f.data[fileName]));
    } else {
      zip.file(fileName, f.data[fileName]);
    }
  });
  await zip.generateAsync({ type: 'base64' }).then(
    function (base64) {
      download('model.zip', base64);
    },
    function (error) {
      console.warn(error);
    },
  );
}

export async function trainModelSolution(
  model?: LayersModel,
  trainingData?: { inputs: number[][]; outputs: number[][] },
  validationData?: { inputs: number[][]; outputs: number[][] },
  callbacks?: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 5,
  batchSize = 128,
) {
  if (!model || !trainingData || !validationData) {
    return new Error('missing parameter for trainModel');
  }
  const inputs = tf.tensor(trainingData.inputs);
  const outputs = tf.tensor(trainingData.outputs);
  const inputValidation = tf.tensor(validationData.inputs);
  const outputValidation = tf.tensor(validationData.outputs);

  const modelHistory = await model.fit(inputs, outputs, {
    epochs: numEpochs,
    batchSize,
    verbose: 1,
    validationData: [inputValidation, outputValidation],
    callbacks: callbacks,
  });

  inputs.dispose();
  outputs.dispose();
  inputValidation.dispose();
  outputValidation.dispose();

  return modelHistory;
}
