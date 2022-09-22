import type { ImportStepState } from './types';
import { createNoModelSelectedError } from './validate';

export const defaultState: ImportStepState = {
  valid: false,
  validationIssues: createNoModelSelectedError().errors,
};

/**
 * Serializes the given state
 * @param state The state to serialize
 * @returns
 */
export function serialize(state: ImportStepState | null): string | null {
  if (state) {
    const serializedState: Record<string, any> = {
      ...state,
    };
    if (state.data) {
      serializedState.data = arrayBufferToBase64(state.data);
    }
    return JSON.stringify(serializedState);
  }
  return null;
}

/**
 * Deserializes the given state data
 * @param data The data to seserialize
 * @returns
 */
export function deserialize(serializedState: string | null): ImportStepState {
  if (serializedState) {
    try {
      const parsed = JSON.parse(serializedState) as Record<string, any>;
      if (parsed.data) {
        parsed.data = toArrayBuffer(parsed.data as string) as ArrayBuffer;
      }
      return parsed as ImportStepState;
    } catch (e) {
      console.error('could not deserialize state', e);
    }
  }
  return defaultState;
}

// https://stackoverflow.com/a/21797381/1848576
function toArrayBuffer(base64: string) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// https://stackoverflow.com/a/9458996
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
