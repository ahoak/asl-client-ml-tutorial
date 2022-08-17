import { CodeStepBaseComponent } from '../codeStepBase';
import { defaultCode, solutionCode } from './code';
import { defaultState } from './state';
import type { CleanupStepState } from './types';
import { validate } from './validate';

export class CleanupStep extends CodeStepBaseComponent<CleanupStepState> {
  constructor() {
    super({
      defaultCode,
      defaultState,
      solutionCode,
      validate,
    });
  }
}

customElements.define('cleanup-step', CleanupStep);
