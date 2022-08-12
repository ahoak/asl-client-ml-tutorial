import type { Logs } from '@tensorflow/tfjs';

export interface TensorData {
  [key: string]: number[][];
}

export interface Callbacks {
  onBatchEnd: (epoch: number, batch: number, logs?: Logs) => void;
  onEpochEnd: (epoch: number) => void;
}

export interface SocialLinks {
  [key: string]: string;
}

export interface TrainTutorialSteps {
  step: number;
  description: string;
  helperText: string;
  codeBlock?: string;
}

export interface ProjectSettings {
  metaTitle: string;
  metaDescription: string;
  name: string;
  theme: string;
  avatarImage: string;
  social: SocialLinks;
  showDataVideo: boolean;
  trainTutorialSteps: TrainTutorialSteps[];
}

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
  data?: any[];
};

export type ValidationError = {
  type: ValidationErrorType;
  detail: string;
};

export enum ValidationErrorType {
  IncompleteImplementation,
  Unknown,
}
