export function cleanup(tensor) {
  // We're done with the tensor for now
  tensor.dispose();
}