import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { classes } from '../../../utils/constants';
import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `
// Create a feed-forward model using the tf.sequential (https://js.tensorflow.org/api/latest/#sequential)
function createModel(classes: string[]):LayersModel {

  // Create a feed-forward model using tf.sequential api
  // The input layer is connected to 63 nuerons and has an input of 63 input feature values
  // The second dense layer is connectected to 512 nuerons
  // The third dense layer is connectected to 256 nuerons
  // After this layer add a dropout to avoid overfitting and improve generalization 
  // Add a fourth dense layer connected to 128 nuerons
  // Add a final dense layer wtih number of nuerons equal to classes (i.e classes.length )




  // Uncomment below statement to check the output. 
  // console.log(model.summary())
  // return model;
}`;

export const solution = `
// Create a feed-forward model using the tf.sequential (https://js.tensorflow.org/api/latest/#sequential)
function createModelSolution(classes: string[]):LayersModel {
  // Create a feed-forward model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [63], units: 63, activation: 'relu' }),
      tf.layers.dense({ units: 512, activation: 'relu' }),
      tf.layers.dense({ units: 256, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.3 }),
      tf.layers.dense({ units: 128, activation: 'relu' }),
      tf.layers.dense({ units: classes.length, activation: 'softmax' }),
    ],
  });
  return model;
}`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function('classes', 'tf', 'tfjs', `return (${code.replace(/export/g, '')})`);
  return wrapper(classes, tf, tf) as T;
}

type createModel = (classes: string[]) => LayersModel;

export async function validate(impl: createModel): Promise<ValidationResult> {
  let result;
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    result = await impl(classes);
    if (!result) {
      return createIncompleteImplValidationError(
        `"We couldn't find your model. Did you implement createModel function? If so, check that you return your model`,
      );
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
