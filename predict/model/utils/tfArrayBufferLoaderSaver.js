import { getModelJSONForModelArtifacts } from "@tensorflow/tfjs-core/dist/io/io_utils";
import * as tf from '@tensorflow/tfjs'

const getModelArtifactsForJSON = tf.io.getModelArtifactsForJSON;
const getModelArtifactsInfoForJSON = tf.io.getModelArtifactsInfoForJSON;
const concatenateArrayBuffers = tf.io.concatenateArrayBuffers;
const basename = function basename(path) {
  const SEPARATOR = "/";
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

/**
 * A model loader for tensorflow.js
 */
// Adapted from https://github.com/tensorflow/tfjs/blob/master/tfjs-core/src/io/browser_files.ts
export class ArrayBufferModelLoader /*implements IOHandler */ {
  #modelJsonFileName = null;
  #files = null
  #initPromise = null

  /**
   * 
   * @param {Record<string, ArrayBuffer | Function<Promise<ArrayBuffer>>} files The model files
   */
  constructor(files, fileNamePrefix = DEFAULT_FILE_NAME_PREFIX) {
    if (files == null || files.size < 1) {
      throw new Error(
        `When calling ArrayBufferModelLoader, at least 1 file is required, ` +
          `but received ${files}`
      );
    }

    this.#modelJsonFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
    this.#initPromise = this.#init(files)
  }
  
  /**
   * 
   * @param {Record<string, ArrayBuffer | Function<Promise<ArrayBuffer>>} files The model files
   */
  async #init(files) {
    // Load into model file and weights files
    this.weightsFiles = new Map();
    for (const fileName of Object.keys(files)) {
      let value = files[fileName]
      if (typeof value === 'function') {
        value = await value(fileName)
      } else if (typeof value === 'string') {
        value = JSON.parse(value)
      }
      
      if (fileName.indexOf(this.#modelJsonFileName) >= 0) {
        this.jsonFile = value;
      } else {
        this.weightsFiles.set(fileName, value);
      }
    }
  }
  
  async load() {
    await this.#initPromise
    return new Promise((resolve, reject) => {
      // const modelJSON = JSON.parse(
      //   new TextDecoder().decode(this.jsonFile)
      // ); /* as ModelJSON */
			const modelJSON = this.jsonFile
      const modelTopology = modelJSON.modelTopology;
      if (modelTopology == null) {
        //   reject(new Error(`modelTopology field is missing from file ${
        //       this.jsonFile.name}`));
        reject(
          new Error(`modelTopology field is missing from file model.json`)
        );
        return;
      }
      const weightsManifest = modelJSON.weightsManifest;
      if (weightsManifest == null) {
        //   reject(new Error(`weightManifest field is missing from file ${
        //       this.jsonFile.name}`));
        reject(
          new Error(`weightManifest field is missing from file model.json`)
        );
        return;
      }
      if (this.weightsFiles.size === 0) {
        resolve({ modelTopology });
        return;
      }
      const modelArtifactsPromise = getModelArtifactsForJSON(
        modelJSON,
        (weightsManifest) => this.loadWeights(weightsManifest)
      );
      resolve(modelArtifactsPromise);
    });
  }

  loadWeights(weightsManifest) {
    const weightSpecs = [];
    const paths = [];
    for (const entry of weightsManifest) {
      weightSpecs.push(...entry.weights);
      paths.push(...entry.paths);
    }
    const pathToFile = this.checkManifestAndWeightFiles(weightsManifest);
    const promises = paths.map((path) => pathToFile[path])
    return Promise.all(promises).then((buffers) => [
      weightSpecs,
      concatenateArrayBuffers(buffers),
    ]);
  }
  // loadWeightsFile(path, file) {
  //   return new Promise((resolve, reject) => {
  //     resolve(file.buffer);
  //   });
  // }
  /**
   * Check the compatibility between weights manifest and weight files.
   */
  checkManifestAndWeightFiles(manifest) {
    const basenames = [];
    const fileNames = Array.from(this.weightsFiles.keys()).map((fileName) =>
      basename(fileName)
    );
    const pathToFile = {};
    for (const group of manifest) {
      group.paths.forEach((path) => {
        const pathBasename = basename(path);
        if (basenames.indexOf(pathBasename) !== -1) {
          throw new Error(
            `Duplicate file basename found in weights manifest: ` +
              `'${pathBasename}'`
          );
        }
        basenames.push(pathBasename);
        if (fileNames.indexOf(pathBasename) === -1) {
          throw new Error(
            `Weight file with basename '${pathBasename}' is not provided.`
          );
        } else {
          pathToFile[path] = this.weightsFiles.get(pathBasename);
        }
      });
    }
    if (basenames.length !== this.weightsFiles.size) {
      throw new Error(
        `Mismatch in the number of files in weights manifest ` +
          `(${basenames.length}) and the number of weight files provided ` +
          `(${this.weightsFiles.size}).`
      );
    }
    return pathToFile;
  }
}


/**
 * A model saver for tensorflow.js
 */
 export class ArrayBufferModelSaver /*implements IOHandler */ {
  
  #modelJsonFileName = null;
  #weightDataFileName = null;

  /**
   * 
   * @param {Record<string, ArrayBuffer>} files The model files
   */
  constructor(fileNamePrefix = DEFAULT_FILE_NAME_PREFIX) {
    this.#modelJsonFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
    this.#weightDataFileName =
        fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
  }
  /**
   * 
   * @param {ModelArtifacts} modelArtifacts 
   * @returns {Promise<SaveResult>}
   */
  async save(modelArtifacts) {
    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
      throw new Error(
          'BrowserDownloads.save() does not support saving model topology ' +
          'in binary formats yet.');
    } else {

      /**
       * @type {WeightsManifestConfig}
       */
      const weightsManifest = [{
        paths: ['./' + this.#weightDataFileName],
        weights: modelArtifacts.weightSpecs
      }];

      /**
       * @type {ModelJSON}
       */
      const modelJSON =
          getModelJSONForModelArtifacts(modelArtifacts, weightsManifest);

      return {
        modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts),
        data: {
          [this.#modelJsonFileName]: modelJSON,
          [this.#weightDataFileName]: modelArtifacts.weightData,
        }
      };
    }
  }
}
