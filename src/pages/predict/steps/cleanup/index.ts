import type { PredictStepName } from '../types';

export const name = 'cleanup' as PredictStepName;
export { CleanupStep as Renderer } from './display';
export * from './state';
export * from './validate';
