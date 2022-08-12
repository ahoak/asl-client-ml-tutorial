import type { ValidationResult } from '../../../types';
import * as configureModel from './configureModel';
import * as createModel from './createModel';
import * as encodeAndSplitData from './encodeAndSplitData';
import * as exportModel from './exportModel';
import * as setTensorFlowBackend from './setTensorFlowBackend';
import * as trainModel from './trainModel';

export type CodeStepRecord = {
  template: string;
  validate?: (impl: (...args: any[]) => any) => Promise<ValidationResult>;
  implementation: <T = (...args: any[]) => any>(code: string, ...args: any) => T;
};
export type CodeStep = Record<string, CodeStepRecord>;

export const codeSteps: CodeStep = {
  configureModel,
  createModel,
  encodeAndSplitData,
  exportModel,
  setTensorFlowBackend,
  trainModel,
};
