import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `
/**
 * Normalizes a flattened set of joint positions from -1 to 1
 * @param {number[]} flattened The flattened set of joint positions
 * @returns {number[]} The flattened positions normalized from -1 to 1
 */
function normalizeTensor(flattened: number[]): Tensor {
	// solution in solutions/normalizeTensor.js
	// 1. Normalize values from -1 to 1
	// 2. Load into a tensorflowjs tensor1d
	// there is a normalize function available
	return tf.tensor1d([])
}
`;

export const solution = `
/**
 * Normalizes a flattened set of joint positions from -1 to 1
 * @param {number[]} flattened The flattened set of joint positions
 * @returns {number[]} The flattened positions normalized from -1 to 1
 */
function normalizeTensor(flattened: number[]): Tensor {
  const normalized = normalize(flattened);
  const tensor = tf.tensor1d(normalized).expandDims(0);
  return tensor
}
`;

const correctTensorLength = 63;
const rawHandTensor = Array.from({ length: correctTensorLength }).map((n) => Math.random() * 10);

type normalizeTensor = (flattened: number[]) => Tensor;
export async function validate(impl: normalizeTensor): Promise<ValidationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const normalized = await impl(rawHandTensor.slice(0));
    if (!normalized || normalized.size !== correctTensorLength) {
      return createIncompleteImplValidationError(`
		Your normalizeTensor didn't return anything, or the wrong size array.<br>
		It should normalize the values within the tensor parameter from -1 to 1.
	`);
    } else if (!normalized.dataSync) {
      return createIncompleteImplValidationError(
        `The return does not appear to be a tensorflowjs tensor.`,
      );
    } else if (normalized.dataSync().some((n) => Math.abs(n) > 1)) {
      return createIncompleteImplValidationError(
        `The return from normalizeTensor is not normalized correctly, the values should range from -1 to 1.`,
      );
    }
  } catch (e) {
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
  };
}
