import * as tf from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { classes } from '../../../utils/constants';
import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `
function createModel(classes: string[]):LayersModel {
 
  const model = tf.sequential({
    layers: [
 
      tf.layers.dense({ inputShape: [/*✨INSERT_HERE✨*/], units: /*✨INSERT_HERE✨*/, activation: 'relu' }),

      tf.layers.dense({ units: /*✨INSERT_HERE✨*/, activation: 'relu' }),

      tf.layers.dense({ units: /*✨INSERT_HERE✨*/, activation: 'softmax' }),
    ],
  });

  model.compile({

    optimizer:  /*✨INSERT_HERE✨*/, 

    loss:  /*✨INSERT_HERE✨*/,

    metrics: ['accuracy'],
  });

  return model;
}
`;

export const solution = `
function createModelSolution(classes: string[]):LayersModel {
  // Create a feed-forward model using the tf.sequential (https://js.tensorflow.org/api/latest/#sequential)
  const model = tf.sequential({
    layers: [
      // Fill in the inputShape and units (hint this is equal to mediapipe hands output per image = 63)
      // Want to play with other activation functions, go for it!
      tf.layers.dense({ inputShape: [63], units: 63, activation: 'relu' }),
      // Fill in units (neurons) in range 100-300
      tf.layers.dense({ units: 256, activation: 'relu' }),
      // Add a final dense layer wtih number of neurons equal to classes (i.e classes.length )
      tf.layers.dense({ units: classes.length, activation: 'softmax' }),
    ],
  });

  model.compile({
    // Adam changes the learning rate over time which is useful.
    // https://js.tensorflow.org/api/latest/#Training-Optimizers
    optimizer: 'adam', //optimizer options: 'sgd', 'momentum', 'adagrad', 'ada', 'adam', 'adamax', 'rmsprop'

    // Use the correct loss function. https://js.tensorflow.org/api/latest/#Training-Losses
    // If 2 classes of data, use 'binaryCrossentropy' else use 'categoricalCrossentropy' if more than 2 classes and output of our model is a probability distribution.
    loss: 'categoricalCrossentropy',
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: ['accuracy'],
  });

  /* Uncomment below statement to check the output. */
  // console.log(model.summary())

  return model;
}`;

export const solve = `
function createModel(classes: string[]):LayersModel {

  const model = tf.sequential({

    layers: [

      tf.layers.dense({ inputShape: [63], units: 63, activation: 'relu' }),

      tf.layers.dense({ units: 256, activation: 'relu' }),

      tf.layers.dense({ units: classes.length, activation: 'softmax' }),
    ],
  });

  model.compile({
  
    optimizer: 'adam', 

    loss: 'categoricalCrossentropy',
    
    metrics: ['accuracy'],
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
