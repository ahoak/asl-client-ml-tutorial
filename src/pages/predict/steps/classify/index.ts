import type { PredictStepName } from '../types';

export const name = 'classify' as PredictStepName;
export { ClassifyStep as Renderer } from './display';
export * from './state';
export * from './validate';
