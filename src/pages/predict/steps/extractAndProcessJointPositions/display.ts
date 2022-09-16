import { CodeStepBaseComponent } from '../codeStepBase';
import type { StepDisplayElement } from '../types';
import { defaultCode } from './code';
import instructions from './instructions.md';
import { defaultState } from './state';
import type { ExtractAndProcessJointPositionsStepState } from './types';
import { validate } from './validate';

export class ExtractAndProcessJointPositionsStep
  extends CodeStepBaseComponent<ExtractAndProcessJointPositionsStepState>
  implements StepDisplayElement
{
  constructor() {
    super({
      defaultCode,
      defaultState,
      validate,
      readonly: true,
      instructionsMarkdown: instructions,
    });
  }
}

customElements.define(
  'extract-and-process-joint-positions-step',
  ExtractAndProcessJointPositionsStep,
);
