import type { PredictStepName } from '../types';

export const name = 'classify' as PredictStepName;
export const userMutable = true;
export { ClassifyStep as Renderer } from './display';
export * from './state';
export * from './validate';
