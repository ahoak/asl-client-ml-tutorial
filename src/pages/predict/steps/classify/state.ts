import { createImplForStepCode } from '../helpers/createImplForCode';
import type { CodeStepState } from '../types';
import { defaultCode } from './code';
import type { ClassifyStepState } from './types';
import { createIncorrectReturnTypeError } from './validate';

export const defaultState: CodeStepState = {
  valid: false,
  validationIssues: createIncorrectReturnTypeError().errors,
  code: defaultCode,
};

/**
 * Serializes the given state data
 * @param data The data to serialize
 * @returns
 */
export function serialize(data: ClassifyStepState): string | null {
  return JSON.stringify(data);
}

/**
 * Deserializes the given state data
 * @param data The data to seserialize
 * @returns
 */
export function deserialize(data: string | null): ClassifyStepState {
  if (data) {
    const parsed = JSON.parse(data) as ClassifyStepState;
    if (parsed.transpiledCode) {
      try {
        parsed.instance = createImplForStepCode(parsed.transpiledCode);
      } catch (e) {
        console.error(e);
      }
    }
    return parsed;
  }
  return defaultState;
}
