import { CodeStepBaseComponent } from '../codeStepBase';
import type { StepDisplayElement } from '../types';
import { defaultCode, solutionCode } from './code';
import { defaultState } from './state';
import type { CleanupStepState } from './types';
import { validate } from './validate';

export class CleanupStep
  extends CodeStepBaseComponent<CleanupStepState>
  implements StepDisplayElement
{
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
