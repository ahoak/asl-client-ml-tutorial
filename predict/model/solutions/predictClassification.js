import { normalize, argMax } from "../utils/misc";

export function predictClassification(model, classes, tensor) {
  const prediction = model.predict(tensor);
  const predictionSynced = prediction.dataSync();
  const index = argMax(predictionSynced);
  if (index >= 0 && index < classes.length) {
    const confidence = predictionSynced[index]
    return {
      classification: classes[index],
      confidence,
    }
  }
  return null;
}