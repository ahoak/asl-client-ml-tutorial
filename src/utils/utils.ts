import * as tf from '@tensorflow/tfjs';
import type JSZip from 'jszip';
import { loadAsync } from 'jszip';

import type { TensorData } from '../types/index.js';
import { assetURL, classes } from './constants.js';
import { npyJsParser } from './NpyJsParser.js';

export function millisToMinutesAndSeconds(millis: number): [string, boolean] {
  const minutes: number = Math.floor(millis / 60000);
  const seconds: number = +((millis % 60000) / 1000).toFixed(0);
  const timeString = `${minutes} : ${seconds < 10 ? '0' : ''} seconds`;
  const hasMinutes = minutes > 0;
  return [timeString, hasMinutes];
}

// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets
export async function loadTensorData() {
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  const zipFolder = await loadAsync(zippedModelBuffer);
  const output = await loadTensors(zipFolder);
  return output;
}

async function loadTensors(zipFolder: JSZip) {
  const np = new npyJsParser();
  const output: TensorData = {};
  const numJoints = 21;
  // x, y, z
  const numComponents = numJoints * 3;
  if (zipFolder) {
    await Promise.all(
      classes.map(async (n) => {
        const fetchedResult = await zipFolder.file(`${n}.npy`)?.async('arraybuffer');
        if (fetchedResult) {
          const result = np.parse(fetchedResult);
          const numItems = +result.shape[0];
          const data = [] as number[][];
          for (let i = 0; i < numItems; i++) {
            // x, y, z...xₙ, yₙ, zₙ for each joint
            const joints = result.data.slice(i * numComponents, (i + 1) * numComponents);
            const tensor = Array.from(joints);
            // Also push the mirror
            const mirror = tensor.slice(0) as number[];
            const wristX = mirror[0] as number;
            // Skip the wrist
            for (let j = 1; j < numJoints; j++) {
              // 3 for x, y, z
              // 1 for x
              const jointCoordIdx = j * 3;
              const xVal = mirror[jointCoordIdx] as number;
              // Mirror around wrist X
              mirror[jointCoordIdx] = wristX + (wristX - xVal);
            }
            data.push(mirror);
          }
          output[n] = data;
        }
      }),
    );
  }

  return output;
}

export function trainTestSplit(
  X: number[][],
  Y: number[][],
  options?: {
    testSize?: number;
    randomState?: number;
  },
): [number[][], number[][], number[], number[]] {
  const opts = options ?? {};

  const testSize = opts.testSize ?? 0.2;
  const randSeed = opts.randomState ?? Math.random() * Number.MAX_SAFE_INTEGER;

  const shuffled = [X, Y].map((n) => shuffle(n, null, randomGenerator(randSeed)));
  const output: (number[] | number[][])[] = [];
  shuffled.forEach((data) => {
    const train = data.slice(0, Math.floor((1 - testSize) * data.length));
    const test = data.slice(train.length);
    output.push(train, test);
  });
  const [x, xVal, y, yVal] = output as [number[][], number[][], number[], number[]];
  return [x, xVal, y, yVal];
}

// https://towardsdatascience.com/how-to-split-a-tensorflow-dataset-into-train-validation-and-test-sets-526c8dd29438
export async function getDatasetPartitions(
  X: number[][],
  Y: number[],
  train_split = 0.8,
  val_split = 0.1,
  test_split = 0.1,
  shuffle = true,
): Promise<[number[][], number[], number[][], number[], number[][], number[]]> {
  if (train_split + test_split + val_split !== 1) {
    throw Error('train_split + test_split + val_split must equal 1');
  }

  if (shuffle) {
    tf.util.shuffleCombo(X, Y);
  }

  const oneHotOutputs = tf.oneHot(tf.tensor1d(Y, 'int32'), classes.length);
  const YValues = Array.from(oneHotOutputs.dataSync());

  const trainSize = Math.floor(train_split * X.length);
  const valSize = Math.floor(val_split * X.length);
  const testSize = Math.floor(test_split * X.length);
  const trainX = await tf.data.array(X).take(trainSize).toArray();
  const trainY = await tf.data.array(YValues).take(trainSize).toArray();

  const validationX = await tf.data.array(X).skip(trainSize).take(valSize).toArray();
  const validationY = await tf.data.array(YValues).skip(trainSize).take(valSize).toArray();

  const testX = await tf.data
    .array(X)
    .skip(trainSize + valSize)
    .take(testSize)
    .toArray();

  const testY = await tf.data
    .array(YValues)
    .skip(trainSize + valSize)
    .take(testSize)
    .toArray();

  return [trainX, trainY, validationX, validationY, testX, testY];
}

function shuffle(items: number[][] | number[], seed = null, rand: () => number) {
  rand = rand ?? randomGenerator(seed);
  const copy = items.slice(0);
  for (let i = 0; i < copy.length; i++) {
    const idx1 = i == 0 ? 0 : Math.floor(rand() * copy.length);
    const idx2 = Math.floor(rand() * copy.length);
    const oldItem = copy[idx1];
    copy[idx1] = copy[idx2];
    copy[idx2] = oldItem;
  }
  return copy;
}

function randomGenerator(seed: number | null): () => number {
  const finalSeed = (seed ?? Math.random() * Number.MAX_SAFE_INTEGER) ^ 0xafbfcfdf;
  const rand = sfc32(0x9e3779b9, 0x243f6a88, 0xb7e15162, finalSeed);
  // let rand = () => Math.random()
  for (let i = 0; i < 15; i++) {
    rand();
  }
  return rand;
}

// https://stackoverflow.com/a/47593316
function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function shuffleTest() {
  // const counts = classes.reduce((acc, item) => {
  //   acc[item] = 0;
  //   return acc;
  // }, {});
  // for (let i = 0; i < 1000000; i++) {
  //   const shuffled = shuffle(classes);
  //   const item = shuffled[0];
  //   counts[item] = (counts[item] || 0) + 1;
  // }
  // let max = null;
  // classes.forEach((item) => {
  //   if (max == null || counts[item] > counts[max]) {
  //     max = item;
  //   }
  // });
  // const normalizedCounts = classes.reduce((acc, item) => {
  //   acc[item] = counts[item] / counts[max];
  //   return acc;
  // }, {});
  // const numSegments = 50;
  // classes.forEach((item) => {
  //   console.log(
  //     `${item} -> ${Array.from({
  //       length: Math.floor(numSegments * normalizedCounts[item]),
  //     }).join("█")}`
  //   );
  // });
}
