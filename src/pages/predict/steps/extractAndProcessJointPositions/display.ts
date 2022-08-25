import { CodeStepBaseComponent } from '../codeStepBase';
import type { StepDisplayElement } from '../types';
import { defaultCode } from './code';
import { defaultState } from './state';
import template from './template.html?raw';
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
      showCodeToggleButton: true,
      template,
    });
  }
}

customElements.define(
  'extract-and-process-joint-positions-step',
  ExtractAndProcessJointPositionsStep,
);
