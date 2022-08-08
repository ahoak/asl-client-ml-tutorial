import * as tf from "@tensorflow/tfjs";
import * as solutions from "./solutions";
import { normalize, argMax } from "./utils/misc";
import { extractAllJointPositions } from "./utils/extractAllJointPositions";
import { defaultModelClasses } from "./utils/constants";

/**
 * Runs the ASL prediction with the given model and input image
 * @param {tf.LayersModel} model The model to run the prediction with
 * @param {CanvasImageSource} imageSource The image to run prediction on
 * @param {boolean=false} loadMirrored If the image should be mirrored before running prediction
 * @param {string[]} classes The list of classes this model can predict
 */
export async function predict(
  model,
  imageSource,
  loadMirrored = false,
  classes = defaultModelClasses
) {
  const jointPositionsResult = await getFlattenedJointPositions(
    imageSource,
    loadMirrored
  );

  // Were any joint positions detected in the image?
  if (jointPositionsResult != null) {
    // Pull off the flattened, and the original joint positions from the jointPositionsResult
    const { jointPositionsFlat, jointPositions } = jointPositionsResult;

    // Normalize the flattened data from -1 to 1
    const tensor = normalizeTensor(jointPositionsFlat);

    // Run model prediction and get a class index
    const { classification, confidence } = predictClassification(
      model,
      classes,
      tensor
    );

    // Cleanup the tensor that we created
    cleanup(tensor);

    // Were we able to classify at all
    if (classification != null) {
      return {
        classification,
        confidence,
        jointPositions,
      };
    }
  }
  return null;
}

/**
 * Returns the hand joint locations in 3d space within the given _imageSource_
 * ** Note ** Only returns the first hand in the image
 * @param {CanvasImageSource} imageSource The image to detect hand joints within
 * @param {boolean} loadMirrored If the image should be mirrored before extracting joint positions
 * @returns {{
 *  jointPositionsFlat: number[],
 *  jointPositions: Point3D[]
 * }}}
 */
export async function getFlattenedJointPositions(imageSource, loadMirrored) {
  // solution in solutions/getFlattenedJointPositions.js

  // Uncomment the line below to extract joint positions for each hand in the imageSource
  // const allJointPositions = await extractAllJointPositions(imageSource, loadMirrored);
  // but we only need to process the first one

  return {
    // This should look like [x1, y1, z1, x2, y2, z2....xN, yN, zN]
    jointPositionsFlat: null,

    // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
    jointPositions: null,
  };
}

/**
 * Normalizes a flattened set of joint positions from -1 to 1
 * @param {number[]} flattened The flattened set of joint positions
 * @returns {number[]} The flattened positions normalized from -1 to 1
 */
export function normalizeTensor(flattened) {
  // solution in solutions/normalizeTensor.js
  // 1. Normalize values from -1 to 1
  // 2. Load into a tensorflowjs tensor1d
}

/**
 * Predicts the classification (ASL sign) of the given joint position tensor
 * @param {tf.LayersModel} model The model to run the prediction with
 * @param {string[]} classes The list of classes (ASL sign) the model supports
 * @param {tf.tensor1d} tensor The joint position tensor
 * @returns {{
 *   // The classification (ASL sign)
 *   classification: string,
 *   // The confidence 0 - 1
 *   confidence: number
 *}}
 */
export function predictClassification(model, classes, tensor) {
  // solution in solutions/predictClassification.js

  // 1. Call tensor flow model prediction
  // 2. Find the index of the highest confidence
  // 3. Convert the index to a class (ASL sign)
  // 3. return the classification and confidence
  return {
    classification: null,
    confidence: null,
  };
}

/**
 * Cleans up the given _tensor_
 * @param {tf.tensor} tensor The tensor to clean up
 */
export function cleanup(tensor) {
  // solution in solutions/cleanup.js
  // 1. https://js.tensorflow.org/api/latest/#tf.Tensor.dispose
}
