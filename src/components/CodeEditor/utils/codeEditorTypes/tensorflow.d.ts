/**
 * These are the types used for our templates
 */
declare interface LayersModel {
  predict(tensor: Tensor): Tensor;
  fit(x: Tensor | Tensor[], y: Tensor | Tensor[][], ModelFitArgs): Promise<History>;
  compile(arg0: {
    // Adam changes the learning rate over time which is useful.
    // optimizer: 'adam',
    optimizer: any;
    // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
    // Else categoricalCrossentropy is used if more than 2 classes.
    loss: string;
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: string[];
  }): void;
  evaluate(t1: Tensor<Rank>, t2: Tensor<Rank>): Tensor;
  save(url: string): Promise<void>;
}

declare type LayersModelType = LayersModel;
declare const sequentialModel: LayersModel;

interface ModelConfig {
  optimizer: any;
  loss: string;
  metrics: string[];
}

declare interface History {
  epoch: number[];
  history: {
    [key: string]: Array<number | Tensor>;
  };
  onTrainBegin(logs?: Logs): Promise<void>;
  onEpochEnd(epoch: number, logs?: Logs): Promise<void>;
  /**
   * Await the values of all losses and metrics.
   */
  syncData(): Promise<void>;
  params?: {
    samples?: number;
  };
}

declare interface Tensor {
  max(): Tensor;
  min(): Tensor;
  argMax(axis?: number): Tensor1D;
  sub(tensor: Tensor | number): Tensor;
  mul(tensor: Tensor | number): Tensor;
  div(tensor: Tensor | number): Tensor;
  dispose();
  dataSync(): number[];
  expandDims(dims: number): Tensor;
  size: number;
  slice(startIndex: number[], axis?: number): Tensor;
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

declare interface UtilFunc {
  shuffleCombo(x: number[][], y: number[]): void;
}

interface tfjs {
  tensor1d(arr: number[], dataType?: string): Tensor1D;
  oneHot(tensor: Tensor1D, classCount: number): any;
  sequential(config: SequentialArgs);
  setBackend(option: string);
  tensor(arr: number[][]): Tensor;
  train;
  layers: LayerFunc;
  util: UtilFunc;
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

declare interface JSZip {
  files: { [key: string]: JSZip.JSZipObject };

  /**
   * Get a file from the archive
   *
   * @param Path relative path to file
   * @return File matching path, null if no file found
   */
  file(path: string): JSZip.JSZipObject | null;

  /**
   * Get files matching a RegExp from archive
   *
   * @param path RegExp to match
   * @return Return all matching files or an empty array
   */
  file(path: RegExp): JSZip.JSZipObject[];

  /**
   * Add a file to the archive
   *
   * @param path Relative path to file
   * @param data Content of the file
   * @param options Optional information about the file
   * @return JSZip object
   */
  file<T extends JSZip.InputType>(
    path: string,
    data: InputByType[T] | Promise<InputByType[T]>,
    options?: JSZip.JSZipFileOptions,
  ): this;
  file<T extends JSZip.InputType>(
    path: string,
    data: null,
    options?: JSZip.JSZipFileOptions & { dir: true },
  ): this;

  /**
   * Returns an new JSZip instance with the given folder as root
   *
   * @param name Name of the folder
   * @return New JSZip object with the given folder as root or null
   */
  folder(name: string): JSZip | null;

  /**
   * Returns new JSZip instances with the matching folders as root
   *
   * @param name RegExp to match
   * @return New array of JSZipFile objects which match the RegExp
   */
  folder(name: RegExp): JSZip.JSZipObject[];

  /**
   * Call a callback function for each entry at this folder level.
   *
   * @param callback function
   */
  forEach(callback: (relativePath: string, file: JSZip.JSZipObject) => void): void;

  /**
   * Get all files which match the given filter function
   *
   * @param predicate Filter function
   * @return Array of matched elements
   */
  filter(
    predicate: (relativePath: string, file: JSZip.JSZipObject) => boolean,
  ): JSZip.JSZipObject[];

  /**
   * Removes the file or folder from the archive
   *
   * @param path Relative path of file or folder
   * @return Returns the JSZip instance
   */
  remove(path: string): JSZip;

  /**
   * Generates a new archive asynchronously
   *
   * @param options Optional options for the generator
   * @param onUpdate The optional function called on each internal update with the metadata.
   * @return The serialized archive
   */
  generateAsync<T extends JSZip.OutputType>(
    options?: JSZip.JSZipGeneratorOptions<T>,
    onUpdate?: JSZip.OnUpdateCallback,
  ): Promise<OutputByType[T]>;

  /**
   * Generates a new archive asynchronously
   *
   * @param options Optional options for the generator
   * @param onUpdate The optional function called on each internal update with the metadata.
   * @return A Node.js `ReadableStream`
   */
  generateNodeStream(
    options?: JSZip.JSZipGeneratorOptions<'nodebuffer'>,
    onUpdate?: JSZip.OnUpdateCallback,
  ): NodeJS.ReadableStream;

  /**
   * Generates the complete zip file with the internal stream implementation
   *
   * @param options Optional options for the generator
   * @return a StreamHelper
   */
  generateInternalStream<T extends JSZip.OutputType>(
    options?: JSZip.JSZipGeneratorOptions<T>,
  ): JSZip.JSZipStreamHelper<OutputByType[T]>;

  /**
   * Deserialize zip file asynchronously
   *
   * @param data Serialized zip file
   * @param options Options for deserializing
   * @return Returns promise
   */
  loadAsync(data: InputFileFormat, options?: JSZip.JSZipLoadOptions): Promise<JSZip>;

  /**
   * Create JSZip instance
   */
  new (): this;

  (): JSZip;

  prototype: JSZip;
  support: JSZipSupport;
  external: {
    Promise: PromiseConstructorLike;
  };
  version: string;
}

declare const JSZip: JSZip;
