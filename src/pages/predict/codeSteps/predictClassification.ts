import { tensor1d } from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { classes } from '../../../utils/constants';
import {
  createIncompleteImplValidationError,
  createUnknownValidationError,
  loadDefaultModel,
} from '../../../utils/utils';

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
	classification: string,
	confidence: number,
} {
  // 1. Call tensor flow model prediction
  // 2. Find the index of the highest confidence
  // 3. Convert the index to a class (ASL sign)
  // 3. return the classification and confidence
  // There is an argMax utility function available
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
  classification: string,
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

const correctTensorLength = 63;
const normalizedHandTensor = tensor1d(
  Array.from({ length: correctTensorLength }).map((n) => Math.random() * 10),
).expandDims(0) as Tensor1D;
type predictClassificaiton = (
  model: LayersModel,
  classes: string[],
  tensor: Tensor1D,
) => {
  classification: number;
  confidence: number;
};
export async function validate(impl: predictClassificaiton): Promise<ValidationResult> {
  const model = await loadDefaultModel();
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/await-thenable
    const prediction = await impl(model, classes, normalizedHandTensor);
    if (!prediction || !prediction.classification) {
      return createIncompleteImplValidationError(`
Your predictClassification didn't return anything.<br>
It should return an object of the form: <br>
<pre>
return {
  classification: "&lt;Some sign&gt;",
  confidence: &lt;some number from 0 - 1&gt;
}
</pre>
`);
    }
  } catch (e) {
    const error = `${e}`;
    if (error.indexOf('Implement') >= 0) {
      return createIncompleteImplValidationError(`Your implementation is incomplete`);
    } else {
      return createUnknownValidationError(error);
    }
  }

  return {
    valid: true,
    errors: [],
  };
}
