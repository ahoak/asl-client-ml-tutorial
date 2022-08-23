declare type Point3D = { x: number; y: number; z: number };
declare function extractAllJointPositions(
  imageSource: CanvasImageSource,
  loadMirrored: boolean,
): Promise<Point3D[][]>;

declare interface ExtractedJointPositions {
  jointPositionsFlat: Tensor1D | null;
  jointPositions: Point3D[] | null;
}

declare function extractAndProcessJointPositions(
  imageSource: CanvasImageSource,
  loadMirrored: boolean,
): ExtractedJointPositions | Promise<ExtractedJointPositions>;

declare interface ClassificationResult {
  classification: string;
  confidence: number;
}
declare function classify(
  model: LayersModel,
  classes: string[],
  tensor: Tensor1D,
): ClassificationResult | Promise<ClassificationResult>;
declare function cleanup(tensor: Tensor): void | Promise<void>;

declare function argMax(values: number[]): number;
declare function normalize(values: number[]): number[];
