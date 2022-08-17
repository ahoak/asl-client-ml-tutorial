import { CodeStepBaseComponent } from '../codeStepBase';
import { defaultCode } from './code';
import { defaultState } from './state';
import type { ExtractAndProcessJointPositionsStepState } from './types';
import { validate } from './validate';

export class ExtractAndProcessJointPositionsStep extends CodeStepBaseComponent<ExtractAndProcessJointPositionsStepState> {
  constructor() {
    super({
      defaultCode,
      defaultState,
      validate,
      readonly: true,
    });
  }
}

customElements.define(
  'extract-and-process-joint-positions-step',
  ExtractAndProcessJointPositionsStep,
);
