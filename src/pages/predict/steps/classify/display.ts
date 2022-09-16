import { CodeStepBaseComponent } from '../codeStepBase';
import type { StepDisplayElement } from '../types';
import { defaultCode, fullyCommentedSolutionCode, hints, solutionCode } from './code';
import instructions from './instructions.md';
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
      fullyCommentedSolutionCode,
      validate,
      hints,
      instructionsMarkdown: instructions,
    });
  }
}

customElements.define('classify-step', ClassifyStep);
