import instructions from '../../../../layout/extractJointInstructions.html?raw';
import { CodeStepBaseComponent } from '../codeStepBase';
import type { StepDisplayElement } from '../types';
import { defaultCode } from './code';
import { defaultState } from './state';
import type { ExtractAndProcessJointPositionsStepState } from './types';
import { validate } from './validate';

const instructionsUrl = `${import.meta.env.BASE_URL}instructions/extractJointPositions.png`;
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
      instructionsUrl,
      instructionsMarkdown: instructions,
    });
  }
}

customElements.define(
  'extract-and-process-joint-positions-step',
  ExtractAndProcessJointPositionsStep,
);
