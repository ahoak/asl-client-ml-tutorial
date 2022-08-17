import type { ValidationResult } from '../../../types';
import * as cleanup from './cleanup';
import * as getFlattenedJointPositions from './getFlattenedJointPositions';
import * as normalizeTensor from './normalizeTensor';
import * as predict from './predict';
import * as predictClassification from './predictClassification';

type Impl = (...args: any[]) => any;
type StepType = {
  template: string;
  validate?: (impl: Impl) => Promise<ValidationResult>;
};

export type CodeStepName = typeof codeStepNames[number];

export const codeStepNames = [
  'getFlattenedJointPositions',
  'normalizeTensor',
  'predictClassification',
  'cleanup',
  'predict',
] as const;
export const codeSteps: Record<CodeStepName, StepType> = {
  getFlattenedJointPositions,
  normalizeTensor,
  predictClassification,
  cleanup,
  predict,
};
