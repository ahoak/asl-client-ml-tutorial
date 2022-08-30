import { CodeStepBaseComponent } from '../codeStepBase';
import type { StepDisplayElement } from '../types';
import { defaultCode, fullyCommentedSolutionCode, hints, solutionCode } from './code';
import { defaultState } from './state';
import type { ClassifyStepState } from './types';
import { validate } from './validate';

const instructionsUrl = `${import.meta.env.BASE_URL}instructions/classify.png`;
export class ClassifyStep
  extends CodeStepBaseComponent<ClassifyStepState>
  implements StepDisplayElement
{
  constructor() {
    super({
      defaultCode,
      defaultState,
      solutionCode,
      fullyCommentedSolutionCode,
      validate,
      hints,
      instructionsUrl,
    });
  }
}

customElements.define('classify-step', ClassifyStep);
