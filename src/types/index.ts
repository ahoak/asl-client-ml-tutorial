import { Logs } from '@tensorflow/tfjs';

export interface TensorData {
  [key: string]: number[][];
}

export interface Callbacks {
  onBatchEnd: (epoch: number, batch: number, logs?: Logs) => void;
  onEpochEnd: (epoch: number) => void;
}
