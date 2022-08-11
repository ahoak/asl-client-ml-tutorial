export const template = `
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
function predictClassification(model: LayersModel, classes: string[], tensor: Tensor1D): {
	classification: number,
	confidence: number,
} {
  // 1. Call tensor flow model prediction
  // 2. Find the index of the highest confidence
  // 3. Convert the index to a class (ASL sign)
  // 3. return the classification and confidence
  return {
    classification: null,
    confidence: null,
  };
}
`;

export const solution = `
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
function predictClassification(model: LayersModel, classes: string[], tensor: Tensor1D): {
  classification: number,
  confidence: number,
} {
  const prediction = model.predict(tensor);
  const predictionSynced = prediction.dataSync();
  const index = argMax(predictionSynced);
  if (index != null && index >= 0 && index < classes.length) {
    const confidence = predictionSynced[index]
    return {
      classification: classes[index],
      confidence,
    }
  }
  return {
    classification: null,
    confidence: null,
  };
}
`;
