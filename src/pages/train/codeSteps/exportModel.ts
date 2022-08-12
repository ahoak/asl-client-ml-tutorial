import * as tf from '@tensorflow/tfjs';

export const template = `
export async function exportModel(model: LayersModel): Promise<void> {
    // checkout https://www.tensorflow.org/js/guide/save_load
    await model.save('localstorage://model');
}
`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string, model: LayersModel): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function('model', 'tf', 'tfjs', `return (${code.replace(/export/g, '')})`);
  return wrapper(model, tf, tf) as T;
}
