import type { PredictStepName } from '../types';

export const name = 'extractAndProcessJointPositions' as PredictStepName;
export { ExtractAndProcessJointPositionsStep as Renderer } from './display';
export * from './state';
export * from './validate';
