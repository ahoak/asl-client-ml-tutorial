import * as tf from '@tensorflow/tfjs';

export const template = `
/*
Sets Tensorflow backend to use either webgl, cpu or wasm
*/
export async function setTensorFlowBackend(): Promise<void> {
    // specify backend (not necessary, should default to webgl if available)
    //  const option = 'webgl' || 'cpu' || 'wasm';
    await tf.setBackend('webgl');
}
`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function('tf', 'tfjs', `return (${code.replace(/export/g, '')})`);
  return wrapper(tf, tf) as T;
}
