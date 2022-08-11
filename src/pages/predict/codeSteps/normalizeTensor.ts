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
