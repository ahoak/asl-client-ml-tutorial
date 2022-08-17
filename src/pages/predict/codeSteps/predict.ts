export const template = `
/**
 * Runs the ASL prediction with the given model and input image
 * @param {tf.LayersModel} model The model to run the prediction with
 * @param {CanvasImageSource} imageSource The image to run prediction on
 * @param {boolean=false} loadMirrored If the image should be mirrored before running prediction
 * @param {string[]} classes The list of classes this model can predict
 * @param {Record<StepNames, Function>} helpers The helpers that were created
 */
async function predict(
  model,
  imageSource,
  loadMirrored,
  classes
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
    const predictionResult = predictClassification(
      model,
      classes,
      tensor
    );

    // Cleanup the tensor that we created
    cleanup(tensor);

    // Were we able to classify at all
    if (predictionResult != null && predictionResult.classification != null) {
      return {
        ...predictionResult,
        jointPositions,
      };
    }
  }
  return null;
}
`;

export const solution = `
/**
 * Runs the ASL prediction with the given model and input image
 * @param {tf.LayersModel} model The model to run the prediction with
 * @param {CanvasImageSource} imageSource The image to run prediction on
 * @param {boolean=false} loadMirrored If the image should be mirrored before running prediction
 * @param {string[]} classes The list of classes this model can predict
 * @param {Record<StepNames, Function>} helpers The helpers that were created
 */
async function predict(
  model,
  imageSource,
  loadMirrored,
  classes
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
    const predictionResult = predictClassification(
      model,
      classes,
      tensor
    );

    // Cleanup the tensor that we created
    cleanup(tensor);

    // Were we able to classify at all
    if (predictionResult != null && predictionResult.classification != null) {
      return {
        ...predictionResult,
        jointPositions,
      };
    }
  }
  return null;
}
`;
