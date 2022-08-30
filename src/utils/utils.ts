import * as tf from '@tensorflow/tfjs';
import type { ModelJSON } from '@tensorflow/tfjs-core/dist/io/types.js';
import type JSZip from 'jszip';
import { loadAsync } from 'jszip';

import type { TensorData, ValidationResult } from '../types';
import { ValidationErrorType } from '../types';
import { assetURL, classes } from './constants.js';
import { npyJsParser } from './NpyJsParser.js';
import type { RawFiles } from './tfArrayBufferLoaderSaver.js';
import { ArrayBufferModelLoader } from './tfArrayBufferLoaderSaver.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const DEFAULT_MODEL_URL = `${import.meta.env.BASE_URL}data/model.zip`;

export function millisToMinutesAndSeconds(millis: number): [string, boolean] {
  const minutes: number = Math.floor(millis / 60000);
  const seconds: number = +((millis % 60000) / 1000).toFixed(0);
  const timeString = `${minutes} : ${seconds < 10 ? '0' : ''} seconds`;
  const hasMinutes = minutes > 0;
  return [timeString, hasMinutes];
}

// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets
export async function loadTensorData(
  loadTensors: (folder: JSZip) => Promise<{ [key: string]: number[][] }>,
): Promise<{ [key: string]: number[][] }> {
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  const zipFolder = await loadAsync(zippedModelBuffer);
  const output = await loadTensors(zipFolder);
  return output;
}

export async function loadTensors(zipFolder: JSZip) {
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
            const joints = result.data.slice(
              i * numComponents,
              (i + 1) * numComponents,
            ) as unknown as number[];
            const tensor = Array.from(joints);
            data.push(tensor);
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
): [number[][], number[][], number[][], number[][]] {
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
  const [x, xVal, y, yVal] = output as [number[][], number[][], number[][], number[][]];
  return [x, xVal, y, yVal];
}

function shuffle(items: number[][] | number[], seed = null, rand: () => number) {
  rand = rand ?? randomGenerator(seed);
  const copy = items.slice(0);
  for (let i = 0; i < copy.length; i++) {
    const idx1 = i === 0 ? 0 : Math.floor(rand() * copy.length);
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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function fastDebounce<T extends (...args: any[]) => any>(callback: T, delay = 100): T {
  let lastUpdate = 0;
  let startLoop = true;
  let lastArgs: IArguments | null = null;
  let lastThis: any = null;

  function loop() {
    const timeSinceLastUpdate = Date.now() - lastUpdate;
    if (timeSinceLastUpdate < delay) {
      // Set timeout for the remaining time
      setTimeout(loop, delay - timeSinceLastUpdate);
    } else {
      startLoop = true;
      if (lastArgs != null && lastArgs.length > 0) {
        callback.apply(lastThis, Array.prototype.slice.call(lastArgs));
      } else {
        callback.call(lastThis);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return function (this: any) {
    // eslint-disable-next-line prefer-rest-params
    lastArgs = arguments;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
    lastThis = this;
    lastUpdate = Date.now();
    if (startLoop) {
      startLoop = false;
      loop();
    }
  } as any;
}

/**
 * Loads the default inference model
 */
export async function loadDefaultModel() {
  const resp = await fetch(DEFAULT_MODEL_URL);
  if (resp.ok) {
    return loadModelFromZip(await resp.arrayBuffer());
  } else {
    throw new Error('could not find the default model.zip!');
  }
}

/**
 * Loads a model from a zipped archive
 * @param {ArrayBuffer} zippedModelBuffer The zipped model file
 */
export async function loadModelFromZip(zippedModelBuffer: ArrayBuffer): Promise<LayersModel> {
  const modelZip = await loadAsync(zippedModelBuffer);
  const fileNames = Object.keys(modelZip.files);
  const modelPath = fileNames.find((n) => n.indexOf('.json') >= 0) as string;
  const jsonStr = await modelZip.file(modelPath)!.async('string');
  const modelData = JSON.parse(jsonStr) as ModelJSON;

  const loaderData: RawFiles = {
    [modelPath]: JSON.stringify(modelData),
  };
  const weightsManifest = modelData.weightsManifest || [];
  for (const manifest of weightsManifest) {
    for (let path of manifest.paths) {
      // replace any leading "./" with ""
      path = path.replace(/^\.\//, '');
      loaderData[path] = await modelZip.file(path)!.async('arraybuffer');
    }
  }

  const modelLoader = new ArrayBufferModelLoader(loaderData);
  return tf.loadLayersModel(modelLoader) as unknown as LayersModel;
}
// function shuffleTest() {
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
// }

export function getOrCreateElement(query: string, type?: keyof HTMLElementTagNameMap): Element {
  const tag = type ?? 'div';
  let element = document.querySelector(query);
  if (!element) {
    element = document.createElement(tag);
    const regexId = /#/g;
    const regexClass = /\./g;
    const isId = regexId.exec(query);
    const isClass = regexClass.exec(query);
    if (isId) {
      element.id = query.replace('#', '');
    } else if (isClass) {
      element.className = query.replace('.', '');
    }
  }
  return element;
}

export function createIncompleteImplValidationError(detail: string): ValidationResult {
  return {
    valid: false,
    errors: [
      {
        type: ValidationErrorType.IncompleteImplementation,
        detail,
      },
    ],
  };
}
export function createUnknownValidationError(detail: string): ValidationResult {
  return {
    valid: false,
    errors: [
      {
        type: ValidationErrorType.Unknown,
        detail,
      },
    ],
  };
}

export function styleNavOnChange(target: string) {
  const navElements = document.querySelector('.nav-links');

  const children = navElements?.children;

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      const id = element.id;
      if (id === target) {
        element.className = 'active-page';
      } else {
        element.className = 'inactive-page';
      }
    }
  }
}
