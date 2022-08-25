import type { PredictStepName } from '../types';

export const name = 'run' as PredictStepName;
export const userMutable = false;
export { RunStep as Renderer } from './display';
export * from './state';
export * from './validate';
