import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `
// https://js.tensorflow.org/api/latest/#tf.LayersModel.compile
/**
 * @param {tf.LayersModel} model The model to run the compile with

 */
function configureModel(model: LayersModel):LayersModel {
    // Compile the model with the defined optimizer and specify a loss function to use.
   
    // return model
  }
  `;

export const solution = `
  // https://js.tensorflow.org/api/latest/#tf.LayersModel.compile
  /**
   * @param {tf.LayersModel} model The model to run the compile with
  
   */
  function configureModelSolution(model: LayersModel):LayersModel {
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
      return model
    }
    `;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(
  code: string,
  layerModel: LayersModel,
): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function('model', 'tf', 'tfjs', `return (${code.replace(/export/g, '')})`);
  return wrapper(layerModel, tf, tf) as T;
}

type configureModel = (model: LayersModel) => LayersModel;

export async function validate(
  impl: configureModel,
  model: LayersModel,
): Promise<ValidationResult> {
  let result = model;
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    result = await impl(model);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const output = model.evaluate(tf.truncatedNormal([1, 63]), tf.truncatedNormal([1, 26]));
    if (!output) {
      return createIncompleteImplValidationError(`
      The model does not seemed to be compiled or compiled correctly'
      `);
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const error = `${e}`;
    return {
      valid: false,
      errors: [
        {
          type: ValidationErrorType.Unknown,
          detail: error,
        },
      ],
    };
  }

  return {
    valid: true,
    errors: [],
    data: [result],
  };
}
