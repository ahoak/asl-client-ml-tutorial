import '../../utils/fluentBootstrap';

import type { LayersModel } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

import Settings from '../../../settings.json';
import type { CodeStepComponent } from '../../components';
import type {
  ProjectSettings,
  TensorData,
  TrainTutorialSteps,
  ValidationResult,
} from '../../types';
import { assetURL, classes } from '../../utils/constants';
import { getOrCreateElement, loadTensors, millisToMinutesAndSeconds } from '../../utils/utils';
import type { CodeStepRecord } from './codeSteps';
import { codeSteps } from './codeSteps';
import { StepViewer, Validated } from './StepViewer';
import {
  clearValidationFeedback,
  getSuccessStatement,
  handleValidatingStep,
  handleValidationgComplete,
} from './utils/DataLoader';

const ProjectSettingsConfig = Settings as unknown as ProjectSettings;

interface ModelBuilderOptions {
  epochs?: number;
}
export interface StepImplementationRecord extends CodeStepRecord {
  valid?: boolean;
  impl?: <T = (...args: any[]) => any>(code: string, ...args: any) => T;
}
type StepImplementation = Record<keyof typeof codeSteps, StepImplementationRecord>;

const DefaultEpoch = 5;
export class ModelBuilder {
  #epochs = DefaultEpoch;
  #batchSize = 405 * 2;
  #startBatchTime = 0;

  #initTime = false;
  #currentStep?: TrainTutorialSteps;

  #mainEle = '#output-element';
  #trainingStatusstring = '.training-feedback';
  #progressBarstring = '.training-progress-bar';
  #timestring = '.time-remaining';

  #trainingStatusElement = getOrCreateElement(this.#trainingStatusstring) as HTMLElement;
  #actionButton = getOrCreateElement('.train-button') as HTMLButtonElement;
  #codeStepEles = document.querySelectorAll('code-step') as NodeListOf<CodeStepComponent>;
  #progressBarElement = getOrCreateElement(this.#progressBarstring) as HTMLProgressElement;

  #timeElement = getOrCreateElement(this.#timestring) as HTMLElement;

  x_train: number[][] = [[]];
  y_train: number[][] = [[]];
  x_val: number[][] = [[]];
  y_val: number[][] = [[]];

  #aslModel: LayersModel | undefined;
  #inputData: TensorData | undefined;
  #stepMap: Record<string, StepViewer> = {};

  constructor(options?: ModelBuilderOptions) {
    this.#epochs = options?.epochs ?? DefaultEpoch;
  }

  async init() {
    this.#actionButton.disabled = true;
    this.#actionButton.onclick = this.handleNextButtonClick;
    this.mapCodeSteps();
    await this.setCurrentStep(1);
  }

  mapCodeSteps() {
    const stepImpls = Object.keys(codeSteps).reduce((acc, item) => {
      acc[item] = {
        valid: false,
        ...codeSteps[item],
      };
      return acc;
    }, {} as StepImplementation);
    this.initCodeSteps(stepImpls);
  }

  initCodeSteps(stepImpls: StepImplementation) {
    this.#codeStepEles.forEach((codeStep: CodeStepComponent) => {
      const name = codeStep.getAttribute('name') ?? '';
      const step = codeStep.getAttribute('step') ?? '';
      const stepDef = codeSteps[name];
      if (name && stepDef) {
        const stepImpl = stepImpls[name];
        const StepViewerInstance = new StepViewer({
          stepRecord: stepImpl,
          element: codeStep,
          name,
          stepCount: +step,
        });

        this.#stepMap[step] = StepViewerInstance;
        StepViewerInstance.setCodeFromCacheOrDefault();
        switch (+step) {
          case 1:
            StepViewerInstance.funcInput = [loadTensors, assetURL];
            StepViewerInstance.on(Validated, this.handleDataValidation);
            StepViewerInstance.readonly = 'true';
            break;
          case 3:
            StepViewerInstance.on(Validated, this.handleDataSplitValidation);
            break;
          case 4:
            StepViewerInstance.funcInput = [tf, classes];
            StepViewerInstance.on(Validated, this.handleModelCreation);
            break;
          case 5:
            StepViewerInstance.on(Validated, this.handleConfigureModel);
            break;
          default:
            break;
        }
        StepViewerInstance.on('validationInProgress', this.handleValidationStarted);
        StepViewerInstance.on('validationComplete', this.handleValidationComplete);
      } else {
        console.error('Expected code-step to have a step attribute!');
      }
    });

    // loadStepFromHash();
  }

  handleValidationStarted = (name: string, step: number) => {
    if (this.#currentStep?.step === step) {
      handleValidatingStep();
    }
  };

  handleValidationComplete = (name: string, step: number, passedValidation: boolean) => {
    if (this.#currentStep?.step === step) {
      let successStatement = 'validation failed';
      if (passedValidation) {
        let backendInUse;
        if (step === 2) {
          backendInUse = tf.getBackend();
        }
        successStatement = getSuccessStatement(step, backendInUse);
      }
      handleValidationgComplete(step, passedValidation, successStatement);
    }
  };

  onBatchEnd = (epoch: number, batch: number, logs?: Logs) => {
    if (!this.#initTime) {
      this.#initTime = true;
      this.#trainingStatusElement.style.visibility = 'visible';
    }

    const currentIncrement = epoch * this.#batchSize + (batch + 1);

    const totalIncrements = this.#epochs * this.#batchSize;
    const progressValue = (currentIncrement / totalIncrements) * 100;
    this.#progressBarElement.value = progressValue;
    this.#trainingStatusElement.innerHTML = `
      Epoch: ${epoch} Batch: ${batch}
      <br>
      Loss: ${logs?.loss.toFixed(3) ?? ''}
      <br>
      Accuracy: ${logs?.acc.toFixed(3) ?? ''}
      <br>
      `;
  };

  onEpochEnd = (epoch: number) => {
    const batchDuration = Date.now() - this.#startBatchTime;
    const remainingIncrements = this.#epochs - epoch;
    const msRemaining = batchDuration * remainingIncrements;
    const [time, hasMinutes] = millisToMinutesAndSeconds(msRemaining);

    this.#timeElement.innerHTML = `${time} ${hasMinutes ? 'minutes' : 'seconds'} remaining`;
    this.#startBatchTime = Date.now();
  };

  handleConfigureModel = (result: ValidationResult) => {
    // console.log('model config validation complete', result);
    if (result.valid && result.data && result.data.length > 0) {
      this.#aslModel = result.data[0] as unknown as LayersModel;
    }
  };

  handleModelCreation = (result: ValidationResult) => {
    // console.log('model creation validation complete', result);
    if (result.valid && result.data && result.data.length > 0) {
      this.#aslModel = result.data[0] as unknown as LayersModel;
    } else {
      console.log('no data provided to ModelBuilder, please retry load data function');
    }
  };

  handleDataSplitValidation = (result: ValidationResult) => {
    // console.log('encode and split data validation complete', result);
    if (result.valid && result.data && result.data.length > 0) {
      [this.x_train, this.x_val, this.y_train, this.y_val] = result.data as [
        number[][],
        number[][],
        number[][],
        number[][],
      ];
    } else {
      console.log('no data provided to ModelBuilder, please retry load data function');
    }
  };

  handleDataValidation = (result: ValidationResult) => {
    // console.log('data load validation complete', result);
    if (result.valid && result.data && result.data.length > 0) {
      const data = result.data[0] as TensorData;
      this.#inputData = data;
    } else {
      console.log('no data provided to ModelBuilder, please retry load data function');
    }
  };

  handleNextButtonClick = async () => {
    const step = this.#currentStep?.step ?? 1;
    const currentInstance = this.#stepMap[step];
    currentInstance.show = false;
    const nextStep = step + 1;
    clearValidationFeedback();
    await this.setCurrentStep(nextStep);
  };

  async handleStepChange(currentStep: number) {
    const instance = this.#stepMap[currentStep];
    if (instance) {
      if (currentStep === 3 && this.#inputData) {
        instance.funcInput = [this.#inputData];
      }
      if ((currentStep === 5 || currentStep === 7) && this.#aslModel) {
        instance.funcInput = [this.#aslModel, tf];
      }
      if (currentStep === 6 && this.#aslModel)
        instance.funcInput = [
          this.#aslModel,
          this.x_train,
          this.x_val,
          this.y_train,
          this.y_val,
          this.#epochs,
          // callbacks
          {
            onBatchEnd: this.onBatchEnd,
            onEpochEnd: this.onEpochEnd,
          },
          // getCallback
        ];
      instance.show = true;
      await instance.runCachedCode();
    } else {
      console.error(`Instance of StepViewer for ${currentStep} is not found`);
    }
  }

  async setCurrentStep(stepcount: number) {
    const step = ProjectSettingsConfig.trainTutorialSteps.find(
      (tutorialStep) => tutorialStep.step === stepcount,
    );

    if (step != null) {
      this.#currentStep = step;
      highlightNavStep(this.#currentStep.step);
      unhighlightNavStep(this.#currentStep.step - 1);
      const mainEle = getOrCreateElement(this.#mainEle) as HTMLElement;
      mainEle.innerHTML = `${this.#currentStep.step}. ${this.#currentStep.description} `;
      await this.handleStepChange(this.#currentStep.step);
    }
  }
}

// Utils

function highlightNavStep(step: number): void {
  const step1Element: HTMLElement | null = document.querySelector(`#tutorial-step${step}`);
  if (step1Element) {
    step1Element.style.fontWeight = 'bold';
  }
}

function unhighlightNavStep(step: number): void {
  const step1Element: HTMLElement | null = document.querySelector(`#tutorial-step${step}`);
  if (step1Element) {
    step1Element.style.fontWeight = 'revert';
  }
}

// function loadStepFromHash() {
//     const hash = window.location.hash ?? null;
//     const step = hash.replace('#step', '');
//     stepController?.setAttribute('step', step ? step : '1');
//   }

//   addEventListener('hashchange', loadStepFromHash);
