import type { ValidationError } from '../../../types';
import type { CodeIssue } from '../components';

/**
 * The raw names of the steps
 */
export type PredictStepName =
  | 'importModel'
  | 'extractAndProcessJointPositions'
  | 'classify'
  | 'cleanup'
  | 'run';

/**
 * Represents the state of a given step
 */
export interface StepState<DataType = unknown> {
  /**
   * True, if the user inputted code has been validated, and it is valid
   */
  valid: boolean;

  /**
   * The set of validation issues (if any)
   */
  validationIssues?: ValidationError[] | null;

  /**
   * The result of executing the step
   */
  data?: DataType | null;
}

export interface CodeStepState<DataType = unknown, T = (...args: any[]) => any>
  extends StepState<DataType> {
  /**
   * The un-transpiled original code
   */
  code?: string;

  /**
   * The transpiled code
   */
  transpiledCode?: string;

  /**
   * The set of syntax issues (if any)
   */
  syntaxIssues?: CodeIssue[] | null;

  /**
   * The eval'd instance of the user's code
   */
  instance?: T | null;
}

/**
 * The state of the individual steps
 */
export interface PredictPipelineState {
  steps: Record<PredictStepName, StepState>;
}

/**
 * Represents an element which displays a step
 */
export interface StepDisplayElement extends HTMLElement {
  stepState: StepState<unknown>;
  pipelineState?: PredictPipelineState | null;
}
