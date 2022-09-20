/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *
 * Adapted from https://github.com/tensorflow/tfjs/blob/96d03123d7de379728007c496bb3ef22f500e9a0/tfjs-core/src/io/browser_files.ts
 */

import * as tf from '@tensorflow/tfjs';
import { getModelJSONForModelArtifacts } from '@tensorflow/tfjs-core/dist/io/io_utils';
import type {
  IOHandler,
  ModelArtifacts,
  ModelJSON,
  WeightsManifestConfig,
  WeightsManifestEntry,
} from '@tensorflow/tfjs-core/dist/io/types';

const getModelArtifactsForJSON = tf.io.getModelArtifactsForJSON;
const getModelArtifactsInfoForJSON = tf.io.getModelArtifactsInfoForJSON;
const concatenateArrayBuffers = tf.io.concatenateArrayBuffers;
const basename = function basename(path: string): string {
  const SEPARATOR = '/';
  path = path.trim();
  while (path.endsWith(SEPARATOR)) {
    path = path.slice(0, path.length - 1);
  }
  const items = path.split(SEPARATOR);
  return items[items.length - 1];
};
const DEFAULT_FILE_NAME_PREFIX = 'model';
const DEFAULT_JSON_EXTENSION_NAME = '.json';
const DEFAULT_WEIGHT_DATA_EXTENSION_NAME = '.weights.bin';

export type RawFiles = Record<
  string,
  string | ArrayBuffer | ((name: string) => Promise<ArrayBuffer>)
>;

/**
 * A model loader for tensorflow.js
 */
export class ArrayBufferModelLoader implements IOHandler {
  #modelJsonFileName: string;
  #initPromise: Promise<any>;
  weightsFiles: Map<string, ArrayBuffer> = new Map();
  jsonFile!: tf.io.ModelJSON;

  /**
   *
   * @param {Record<string, ArrayBuffer | Function<Promise<ArrayBuffer>>} files The model files
   */
  constructor(files: RawFiles, fileNamePrefix = DEFAULT_FILE_NAME_PREFIX) {
    this.#modelJsonFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
    this.#initPromise = this.#init(files);
  }

  /**
   *
   * @param {} files The model files
   */
  async #init(files: RawFiles) {
    // Load into model file and weights files
    this.weightsFiles = new Map();
    for (const fileName of Object.keys(files)) {
      let value: unknown = files[fileName];
      if (typeof value === 'function') {
        value = await value(fileName);
      } else if (typeof value === 'string') {
        value = JSON.parse(value);
      }

      if (fileName.indexOf(this.#modelJsonFileName) >= 0) {
        this.jsonFile = value as ModelJSON;
      } else {
        this.weightsFiles.set(fileName, value as ArrayBuffer);
      }
    }
  }

  async load(): Promise<ModelArtifacts> {
    await this.#initPromise;
    return new Promise((resolve, reject) => {
      const modelJSON = this.jsonFile;
      const modelTopology = modelJSON.modelTopology;
      if (modelTopology == null) {
        reject(new Error(`modelTopology field is missing from file model.json`));
        return;
      }
      const weightsManifest = modelJSON.weightsManifest;
      if (weightsManifest == null) {
        reject(new Error(`weightManifest field is missing from file model.json`));
        return;
      }
      if (this.weightsFiles.size === 0) {
        resolve({ modelTopology });
        return;
      }
      const modelArtifactsPromise = getModelArtifactsForJSON(modelJSON, (weightsManifest) =>
        this.loadWeights(weightsManifest),
      );
      resolve(modelArtifactsPromise);
    });
  }

  loadWeights(
    weightsManifest: WeightsManifestConfig,
  ): Promise<[tf.io.WeightsManifestEntry[], /* weightData */ ArrayBuffer]> {
    const weightSpecs: WeightsManifestEntry[] = [];
    const paths: string[] = [];
    for (const entry of weightsManifest) {
      weightSpecs.push(...entry.weights);
      paths.push(...entry.paths);
    }
    const pathToFile = this.checkManifestAndWeightFiles(weightsManifest);
    const promises = paths.map((path) => pathToFile[path]);
    return Promise.all(promises).then((buffers) => [weightSpecs, concatenateArrayBuffers(buffers)]);
  }

  /**
   * Check the compatibility between weights manifest and weight files.
   */
  checkManifestAndWeightFiles(manifest: WeightsManifestConfig): Record<string, ArrayBuffer> {
    const basenames: string[] = [];
    const fileNames = Array.from(this.weightsFiles.keys()).map((fileName) => basename(fileName));
    const pathToFile: Record<string, ArrayBuffer> = {};
    for (const group of manifest) {
      group.paths.forEach((path: string) => {
        const pathBasename = basename(path);
        if (basenames.indexOf(pathBasename) !== -1) {
          throw new Error(`Duplicate file basename found in weights manifest: '${pathBasename}'`);
        }
        basenames.push(pathBasename);
        if (fileNames.indexOf(pathBasename) === -1) {
          throw new Error(`Weight file with basename '${pathBasename}' is not provided.`);
        } else {
          pathToFile[path] = this.weightsFiles.get(pathBasename)!;
        }
      });
    }
    if (basenames.length !== this.weightsFiles.size) {
      throw new Error(
        `Mismatch in the number of files in weights manifest ` +
          `(${basenames.length}) and the number of weight files provided ` +
          `(${this.weightsFiles.size}).`,
      );
    }
    return pathToFile;
  }
}

/**
 * A model saver for tensorflow.js
 */
export class ArrayBufferModelSaver /*implements IOHandler */ {
  #modelJsonFileName: string;
  #weightDataFileName: string;

  /**
   *
   * @param {Record<string, ArrayBuffer>} files The model files
   */
  constructor(fileNamePrefix = DEFAULT_FILE_NAME_PREFIX) {
    this.#modelJsonFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
    this.#weightDataFileName = fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
  }
  /**
   *
   * @param {ModelArtifacts} modelArtifacts
   * @returns {Promise<SaveResult>}
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async save(modelArtifacts: ModelArtifacts) {
    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
      throw new Error(
        'BrowserDownloads.save() does not support saving model topology ' +
          'in binary formats yet.',
      );
    } else {
      /**
       * @type {WeightsManifestConfig}
       */
      const weightsManifest: WeightsManifestConfig = [
        {
          paths: [this.#weightDataFileName],
          weights: modelArtifacts.weightSpecs!,
        },
      ];

      /**
       * @type {ModelJSON}
       */
      const modelJSON = getModelJSONForModelArtifacts(modelArtifacts, weightsManifest);

      return {
        modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts),
        data: {
          [this.#modelJsonFileName]: modelJSON,
          [this.#weightDataFileName]: modelArtifacts.weightData,
        },
      };
    }
  }
}
