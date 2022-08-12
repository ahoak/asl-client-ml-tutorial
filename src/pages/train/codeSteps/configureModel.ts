import * as tf from '@tensorflow/tfjs';

export const template = `
// https://js.tensorflow.org/api/latest/#tf.LayersModel.compile
export function configureModel(model: LayersModel):void {
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
  }
  `;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string, model: LayersModel): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function('model', 'tf', 'tfjs', `return (${code.replace(/export/g, '')})`);
  return wrapper(model, tf, tf) as T;
}
