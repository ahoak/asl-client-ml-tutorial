import * as cleanup from './cleanup';
import * as getFlattenedJointPositions from './getFlattenedJointPositions';
import * as normalizeTensor from './normalizeTensor';
import * as predict from './predict';
import * as predictClassification from './predictClassification';

export const codeSteps: Record<
  string,
  {
    template: string;
  }
> = {
  getFlattenedJointPositions,
  normalizeTensor,
  predictClassification,
  cleanup,
  predict,
};
