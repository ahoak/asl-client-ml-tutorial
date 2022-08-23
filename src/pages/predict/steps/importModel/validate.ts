import { loadAsync } from 'jszip';

import {
  createIncompleteImplValidationError,
  createUnknownValidationError,
} from '../../../../utils/utils';
import type { PredictPipelineState } from '../types';
import type { ImportModelZip, ImportStepState } from './types';

/**
 * Validates the current state of this step
 * @param modelData The model data to set
 * @param _pipelineState The entire pipeline state
 */
export async function validate(
  modelData: ImportModelZip | null,
  _pipelineState?: PredictPipelineState,
): Promise<ImportStepState> {
  const state: ImportStepState = {
    valid: false,
    data: null,
  };

  if (modelData) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const zip = await loadAsync(modelData);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if ('model.json' in zip.files) {
        state.data = modelData;
        state.valid = true;
      } else {
        state.validationIssues = createInvalidModelFileError().errors;
      }
    } catch (e) {
      state.validationIssues = createUnknownValidationError(`${e}`).errors;
      console.error(e);
    }
  } else {
    state.validationIssues = createIncompleteImplValidationError('No model data selected!').errors;
  }
  return state;
}

export const createNoModelSelectedError = () =>
  createIncompleteImplValidationError('No model data selected!');
export const createInvalidModelFileError = () =>
  createIncompleteImplValidationError(
    'The file that was selected does not contain a model.json file!',
  );
