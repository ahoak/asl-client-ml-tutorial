import { CodeStepBaseComponent } from '../codeStepBase';
import type { StepDisplayElement } from '../types';
import { defaultCode, solutionCode } from './code';
import { defaultState } from './state';
import type { ClassifyStepState } from './types';
import { validate } from './validate';

export class ClassifyStep
  extends CodeStepBaseComponent<ClassifyStepState>
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

customElements.define('classify-step', ClassifyStep);
