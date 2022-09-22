import type { LayersModel } from '@tensorflow/tfjs';

import type { TrainTutorialSteps, ValidationResult } from '../../types';
import { defaultTrainEpochs } from '../../utils/constants';
import { getOrCreateElement, millisToMinutesAndSeconds } from '../../utils/utils';
import { exportModel, trainModelSolution } from './train';
import {
  getSuccessStatement,
  handleValidatingComplete,
  updateBreadcrumbStatus,
} from './utils/dataLoader';

interface ModelBuilderOptions {
  epochs?: number;
}

interface TrainingCallbacks {
  onBatchEnd: (batch: number, logs?: Logs) => void;
  onEpochEnd: (epoch: number) => void;
}

export class BuildState {
  #epochs = defaultTrainEpochs;
  #batchSize = 128;
  #currentEpochCount = 1;
  #startBatchTime = 0;

  #currentStep?: TrainTutorialSteps;

  #trainingEnabled = true;
  #trainingStatusElement = getOrCreateElement('.training-feedback-container') as HTMLElement;
  #timeElement = getOrCreateElement('.training-progress-bar') as HTMLElement;
  #startTrainingButton = getOrCreateElement('.training-start-button') as HTMLButtonElement;
  #stopTrainingButton = getOrCreateElement('.training-stop-button') as HTMLButtonElement;

  //   #trainingComplete = false;

  #stepCompleted: Record<string, boolean> = {};

  #data?: [number[][], number[][], number[][], number[][]]; //[X_train, X_val, y_train, y_val]

  #aslModel: LayersModel | undefined;

  constructor(options?: ModelBuilderOptions) {
    this.#epochs = options?.epochs ?? defaultTrainEpochs;
  }

  set aslModel(model: LayersModel | undefined) {
    this.#aslModel = model;
  }

  get aslModel(): LayersModel | undefined {
    return this.#aslModel;
  }

  set currentStep(step: TrainTutorialSteps | undefined) {
    this.#currentStep = step;
  }

  get currentStep() {
    return this.#currentStep;
  }

  get step() {
    return this.#currentStep?.step;
  }

  get stepName() {
    return this.#currentStep?.name;
  }

  get epochs() {
    return this.#epochs;
  }

  completedValidation(name: string, state: boolean) {
    this.#stepCompleted[name] = state;
  }

  getCompletedState(name: string): boolean {
    return this.#stepCompleted[name] ?? false;
  }

  handleReset(name: string) {
    if (name === 'createModel') {
      this.#aslModel = undefined;
    }
    this.completedValidation(name, false);
  }

  getTrainingData(): { inputs: number[][]; outputs: number[][] } | undefined {
    if (this.#data) {
      const [x_train, , y_train] = this.#data!;
      return { inputs: x_train, outputs: y_train };
    }
    return;
  }

  getValidationData(): { inputs: number[][]; outputs: number[][] } | undefined {
    if (this.#data) {
      //[X_train, X_val, y_train, y_val];
      const [, x_val, , y_val] = this.#data;
      return { inputs: x_val, outputs: y_val };
    }
    return;
  }

  handleModelResults = (result: ValidationResult) => {
    if (result.valid && result.data && result.data.length > 0) {
      this.#aslModel = result.data[0] as unknown as LayersModel;
    }
  };

  handleModelCreation = (result: ValidationResult) => {
    if (result.valid && result.data && result.data.length > 0) {
      this.#aslModel = result.data[0] as unknown as LayersModel;
    } else {
      console.log('no data provided to ModelBuilder, please retry load data function');
    }
  };

  handleDataSplitValidation = (result: ValidationResult) => {
    if (result.valid && result.data && result.data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.#data = result.data[0];
    } else {
      console.log('no data provided to ModelBuilder, please retry load data function');
    }
  };

  handleTrainValidation = (result: ValidationResult) => {
    if (result.valid && result.data && result.data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const [batchSize, epochs] = result.data as [number, number];
      this.#batchSize = batchSize;
      this.#epochs = epochs;
    } else {
      console.log('no data provided to ModelBuilder, please retry load data function');
    }
  };

  onBatchEnd = (batch: number, logs?: Logs) => {
    this.#trainingStatusElement.style.display = 'inline-block';

    if (!this.#trainingEnabled && this.#aslModel) {
      this.#aslModel.stopTraining = true;
    }

    this.#trainingStatusElement.innerHTML = `
      Epoch: ${this.#currentEpochCount} Batch: ${batch}
      <br>
      Loss: ${logs?.loss.toFixed(3) ?? ''}
      <br>
      Accuracy: ${logs?.acc.toFixed(3) ?? ''}
      <br>
      `;
  };

  async onDownload() {
    const model = this.#aslModel;
    if (model) {
      await exportModel(model);
      handleValidatingComplete(this.step ?? 1, true, getSuccessStatement('exportModel'));
    } else {
      handleValidatingComplete(this.step ?? 1, false, 'no model loaded');
    }
  }

  onEpochEnd = (epoch: number) => {
    const batchDuration = Date.now() - this.#startBatchTime;
    this.#currentEpochCount = epoch + 2;
    const remainingIncrements = this.#epochs - epoch;
    const msRemaining = batchDuration * remainingIncrements;
    const [time, hasMinutes] = millisToMinutesAndSeconds(msRemaining);

    this.#timeElement.innerHTML = `${time} ${hasMinutes ? 'minutes' : 'seconds'} remaining`;
    this.#startBatchTime = Date.now();
    if (epoch === this.#epochs - 1) {
      //   this.#trainingComplete = true;
      handleValidatingComplete(this.step ?? 1, true, getSuccessStatement('trainModel'));
    }
  };

  getCallbacks(): TrainingCallbacks {
    return { onBatchEnd: this.onBatchEnd, onEpochEnd: this.onEpochEnd };
  }

  handleValidationComplete = (name: string, step: number, passedValidation: boolean) => {
    if (this.#currentStep?.step === step) {
      const successStatement = passedValidation ? getSuccessStatement(name) : 'validation failed';

      if (passedValidation && name === 'trainModel') {
        this.enableTrainingButtons();
      } else {
        this.disableTrainingButtons();
      }

      if (name === 'trainModel') {
        updateBreadcrumbStatus(step, passedValidation);
      } else if (name !== 'exportModel') {
        handleValidatingComplete(step, passedValidation, successStatement);
      }
    }
  };

  disableTrainingButtons() {
    this.#startTrainingButton.disabled = true;
    this.#stopTrainingButton.disabled = true;
  }

  enableTrainingButtons() {
    this.#startTrainingButton.disabled = false;
    this.#stopTrainingButton.disabled = false;
  }
  handleTrainingStopped() {
    this.#trainingEnabled = false;
    this.#startTrainingButton.disabled = false;
    // this.#trainingComplete = true;
    handleValidatingComplete(this.step ?? 1, true, getSuccessStatement('trainModel'));
  }

  getTrainingInputs(): [
    LayersModel | undefined,
    { inputs: number[][]; outputs: number[][] } | undefined,
    { inputs: number[][]; outputs: number[][] } | undefined,
    TrainingCallbacks,
    number,
  ] {
    return [
      this.#aslModel,
      this.getTrainingData(),
      this.getValidationData(),
      this.getCallbacks(),
      this.#epochs,
    ];
  }

  async onTrainingClick() {
    const [model, trainingData, validationData, cbs, epochs] = this.getTrainingInputs();
    if (model) {
      model.stopTraining = false;
      this.#trainingEnabled = true;
      this.#currentEpochCount = 1;
      this.#startTrainingButton.disabled = true;
      //   this.#trainingComplete = false;

      await trainModelSolution(model, trainingData, validationData, cbs, epochs, this.#batchSize);
    }
  }

  set trainingEnabled(state: boolean) {
    this.#trainingEnabled = state;
  }
}
