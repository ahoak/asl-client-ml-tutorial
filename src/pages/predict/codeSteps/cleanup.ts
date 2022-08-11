export const template = `
/**
 * Cleans up the given _tensor_
 * @param {tf.Tensor} tensor The tensor to clean up
 */
function cleanup(tensor: Tensor) {
  // solution in solutions/cleanup.js
  // 1. https://js.tensorflow.org/api/latest/#tf.Tensor.dispose
}
`;

export const solution = `
/**
 * Cleans up the given _tensor_
 * @param {tf.Tensor} tensor The tensor to clean up
 */
function cleanup(tensor: Tensor) {
  tensor.dispose();
}
`;
