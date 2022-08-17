import { createImplForStepCode } from '../helpers/createImplForCode';
import type { CodeStepState } from '../types';
import { defaultCode } from './code';
import type { CleanupStepState } from './types';
import { createNotCleanedUpError } from './validate';

export const defaultState: CodeStepState = {
  valid: false,
  validationIssues: createNotCleanedUpError().errors,
  code: defaultCode,
};

/**
 * Serializes the given state data
 * @param data The data to serialize
 * @returns
 */
export function serialize(data: CleanupStepState): string | null {
  return JSON.stringify(data);
}

/**
 * Deserializes the given state data
 * @param data The data to seserialize
 * @returns
 */
export function deserialize(data: string | null): CleanupStepState {
  if (data) {
    const parsed = JSON.parse(data) as CleanupStepState;
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
