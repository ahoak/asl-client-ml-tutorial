import type { ValidationResult } from '../../../types';
import * as cleanup from './cleanup';
import * as getFlattenedJointPositions from './getFlattenedJointPositions';
import * as normalizeTensor from './normalizeTensor';
import * as predict from './predict';
import * as predictClassification from './predictClassification';

export const codeSteps: Record<
  string,
  {
    template: string;
    validate?: (impl: (...args: any[]) => any) => Promise<ValidationResult>;
  }
> = {
  getFlattenedJointPositions,
  normalizeTensor,
  predictClassification,
  cleanup,
  predict,
};
