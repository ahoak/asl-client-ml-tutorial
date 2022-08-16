import * as jszip from 'jszip';

import type { TensorData, ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { assetURL } from '../../../utils/constants';
import { createIncompleteImplValidationError, loadTensors } from '../../../utils/utils';

export const template = `
// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets
async function loadTensorData(
  loadTensors: (folder: jsZipInstance) => Promise<{ [key: string]: number[][] }>,
  assetURL: string
): Promise<{ [key: string]: number[][] }> {
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  const zipFolder = await jszip.loadAsync(zippedModelBuffer);
  const output = await loadTensors(zipFolder);
  return output;
}
`;

// eslint-disable-next-line @typescript-eslint/ban-types
export function implementation<T = (...args: any[]) => any>(code: string): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'loadAsync',
    'jszip',
    'jsZipInstance',
    'assetURL',
    `return (${code.replace(/export/g, '')})`,
  );
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return wrapper(loadTensors, jszip, jszip, assetURL) as T;
}
type loadData = (
  loadTensors: (folder: jszip) => Promise<TensorData>,
  assetURL: string,
) => TensorData;
export async function validate(impl: loadData): Promise<ValidationResult> {
  let inputData;
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    inputData = await impl(loadTensors, assetURL);
    if (!inputData) {
      return createIncompleteImplValidationError(`
          data did not load
      `);
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const error = `${e}`;
    return {
      valid: false,
      errors: [
        {
          type: ValidationErrorType.Unknown,
          detail: error,
        },
      ],
    };
  }

  return {
    valid: true,
    errors: [],
    data: [inputData],
  };
}
