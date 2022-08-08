import * as tf from "@tensorflow/tfjs";
import { ArrayBufferModelLoader } from "./utils/tfArrayBufferLoaderSaver";
import { readAssetData, names as assetNames } from "../assets";
import { loadAsync } from "jszip";

/**
 * Loads a model from the given url
 * @param {string} url The url to load the model from
 */
export async function loadModelFromURL(url) {
  return tf.loadLayersModel(url);
}

/**
 * Loads a model from glitch assets
 * @param {string} name The name of the model to load
 */
export async function loadModelFromGlitch(name) {
  const modelPath = `${name.replace(".json", "")}.json`;
  const modelData = await (await readAssetData(modelPath)).json();
  const loaderData = {
    [modelPath]: JSON.stringify(modelData),
  };
  const weightsManifest = modelData.weightsManifest || [];
  for (const manifest of weightsManifest) {
    for (const path of manifest.paths) {
      loaderData[path] = await (await readAssetData(path)).arrayBuffer();
    }
  }

  const modelLoader = new ArrayBufferModelLoader(loaderData);
  return await tf.loadLayersModel(modelLoader)
}

/**
 * Loads a zipped model from glitch assets
 * @param {string} name The name of the model to load
 */
export async function loadZippedModelFromGlitch(name) {
  const modelPath = `${name.replace(".zip", "")}.zip`;
  const zippedModelBuffer = await (await readAssetData(modelPath)).arrayBuffer();
  return await loadModelFromZip(zippedModelBuffer);
}

/**
 * Loads a model from a zipped archive
 * @param {ArrayBuffer} zippedModelBuffer The zipped model file
 */
export async function loadModelFromZip(zippedModelBuffer) {
  const modelZip = await loadAsync(zippedModelBuffer);
  const fileNames = Object.keys(modelZip.files);
  const modelPath = fileNames.find(n => n.indexOf(".json") >= 0);
  const modelData = JSON.parse(await modelZip.file(modelPath).async("string"));

  const loaderData = {
    [modelPath]: JSON.stringify(modelData),
  };
  const weightsManifest = modelData.weightsManifest || [];
  for (const manifest of weightsManifest) {
    for (const path of manifest.paths) {
      loaderData[path] = await modelZip.file(path).async("arrayBuffer");
    }
  }

  const modelLoader = new ArrayBufferModelLoader(loaderData);
  return await tf.loadLayersModel(modelLoader)
}