/**
 * These are the types used for our templates
 */
declare interface LayersModel {
  predict(tensor: Tensor): Tensor;
  fit(x: Tensor | Tensor[], y: Tensor | Tensor[], ModelFitArgs): Promise<void>;
  compile(config: ModelConfig);
}

interface ModelConfig {
  optimizer: any;
  loss: string;
  metrics: string[];
}

declare interface Tensor {
  dispose();
  dataSync(): number[];
  expandDims(dims: number): Tensor;
  size: number;
}
declare type ActivationIdentifier =
  | 'elu'
  | 'hardSigmoid'
  | 'linear'
  | 'relu'
  | 'relu6'
  | 'selu'
  | 'sigmoid'
  | 'softmax'
  | 'softplus'
  | 'softsign'
  | 'tanh'
  | 'swish'
  | 'mish';
interface ModelFitArgs {
  batchSize?: number;
  epochs?: number;
  verbose?: 0 | 1;
  callbacks?: {
    onEpochEnd(epoch: number, logs?: any): Promise<void>;
    onBatchEnd(batch: number, logs?: any): Promise<void>;
  };
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface Tensor1D extends Tensor {}

declare interface Layer {
  inputShape?: number[];
  batchSize?: number;
  batchInputShape?: number;
  dtype?: 'float32' | 'int32' | 'bool' | 'complex64' | 'string';
  units?: number;
  activation?: ActivationIdentifier;
  weights?: Tensor[];
  rate?: number;
}

declare interface LayerFunc {
  elu(config: Layer);
  reLU(config: Layer);
  leakyReLU(config: Layer);
  prelu(config: Layer);
  softmax(config: Layer);
  thresholdedReLU(config: Layer);
  conv1d(config: Layer);
  conv2d(config: Layer);
  conv2dTranspose(config: Layer);
  conv3d(config: Layer);
  dense(config: Layer);
  dropout(config: Layer);
}

interface Layers {
  layers: LayerFunc;
}
declare interface SequentialArgs {
  layers?: Layers[];
  name?: string;
}

interface tfjs {
  tensor1d(arr: number[]): Tensor1D;
  oneHot(): any;
  sequential(config: SequentialArgs);
  setBackend(option: string);
  tensor(arr: number[][]): Tensor;
  train;
  layers: LayerFunc;
}

declare const tf: tfjs;

declare type Logs = {
  [key: string]: number;
};

// TODO: MOVE OUT OF FILE
declare interface jsZipInstance {
  loadAsync: (data: InputFileFormat, options?: any) => Promise<jsZip>;
}

declare type loadAsync = (data: InputFileFormat, options?: any) => Promise<jsZip>;

declare const jszip: jsZipInstance;
