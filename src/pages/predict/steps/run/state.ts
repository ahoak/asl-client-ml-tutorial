import { code } from './code';
import type { RunStepState } from './types';

export const defaultState: RunStepState = {
  valid: null,
  validationIssues: [],
  code: code,
};

/**
 * Serializes the given state data
 * @param data The data to serialize
 * @returns
 */
export function serialize(data: RunStepState): string | null {
  return JSON.stringify(data);
}

/**
 * Deserializes the given state data
 * @param data The data to seserialize
 * @returns
 */
export function deserialize(data: string | null): RunStepState {
  if (data) {
    return JSON.parse(data) as RunStepState;
  }
  return defaultState;
}
