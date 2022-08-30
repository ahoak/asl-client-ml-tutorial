import type { ValidationResult } from '../../../types';
import * as createModel from './createModel';
import * as exportModel from './exportModel';
import * as loadData from './loadData';
import * as trainModel from './trainModel';

export type CodeStepRecord = {
  template: string;
  validate?: (impl: (...args: any[]) => any, ...props: any[]) => Promise<ValidationResult>;
  implementation: <T = (...args: any[]) => any>(code: string, ...args: any) => T;
  solution: string;
  solve?: string;
};
export type CodeStep = Record<string, CodeStepRecord>;

export const codeSteps: CodeStep = {
  createModel,
  exportModel,
  trainModel,
  loadData,
};
