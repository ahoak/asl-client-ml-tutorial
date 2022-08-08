import * as tf from "@tensorflow/tfjs";
import { normalize } from "../utils/misc";

export function normalizeTensor(flattened) {
  const normalized = normalize(flattened);
  const tensor = tf.tensor1d(normalized).expandDims(0);
  return tensor
}