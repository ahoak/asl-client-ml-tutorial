/**
 * These are the types used for our templates
 */
declare interface LayersModel {
  predict(tensor: Tensor): Tensor;
}

declare interface Tensor {
  dispose(): void;
  dataSync(): number[];
  expandDims(dims: number): Tensor;
  size: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface Tensor1D extends Tensor {}

interface tfjs {
  tensor1d(arr: number[]): Tensor1D;
  oneHot(): any;
}

declare const tf: tfjs;
