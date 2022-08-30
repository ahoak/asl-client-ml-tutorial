import '../../utils/fluentBootstrap';

import type { Tab } from '@fluentui/web-components';
import type { LayersModel } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

import Settings from '../../../settings.json';
import type { CodeStepComponent } from '../../components';
import type { ProjectSettings, TrainTutorialSteps, ValidationResult } from '../../types';
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
} from './utils/dataLoader';

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
  #currentEpochCount = 1;
  #batchSize = 405 * 2;
  #startBatchTime = 0;

  #initTime = false;
  #currentStep?: TrainTutorialSteps;
  #isSolutionVisble = false;

  #mainEle = getOrCreateElement('#output-element') as HTMLElement;
  #trainingStatusElement = getOrCreateElement('.training-feedback-container') as HTMLElement;
  #timeElement = getOrCreateElement('.training-progress-bar') as HTMLElement;
  #codeStepEles = document.querySelectorAll('code-step') as NodeListOf<CodeStepComponent>;
  #progressBarElement = getOrCreateElement('.training-progress-bar') as HTMLProgressElement;
  #loadDataDescElement = getOrCreateElement('.load-data-description') as HTMLElement;
  #solutionTabPanel = getOrCreateElement('#solution-tab') as Tab;

  #actionButton = getOrCreateElement('.train-button') as HTMLButtonElement;
  #resetButton = getOrCreateElement('.reset-button') as HTMLButtonElement;
  #stopTrainingButton = getOrCreateElement('.training-stop-button') as HTMLButtonElement;
  #startTrainingButton = getOrCreateElement('.training-start-button') as HTMLButtonElement;
  #downloadButton = getOrCreateElement('.download-button') as HTMLButtonElement;
  #solveButton = getOrCreateElement('.solve-button') as HTMLButtonElement;

  #trainingEnabled = true;
  #trainingComplete = false;

  #data?: [number[][], number[][], number[][], number[][]]; //[X_train, X_val, y_train, y_val]

  #aslModel: LayersModel | undefined;
  #stepMap: Record<string, StepViewer> = {};
  #stepMapRef: Record<string, string> = {};

  constructor(options?: ModelBuilderOptions) {
    this.#epochs = options?.epochs ?? DefaultEpoch;
  }

  async init() {
    this.#actionButton.disabled = true;
    this.#actionButton.onclick = this.handleNextButtonClick;
    this.#resetButton.onclick = this.handleResetButtonClick;
    this.#stopTrainingButton.onclick = this.handleStopTrainingClick;
    this.#startTrainingButton.onclick = this.handlestartTrainingClick;
    this.#downloadButton.onclick = this.handleDownloadClick;
    this.#solveButton.onclick = this.handleSolveClick;
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
    const solutionMap = {} as { [key: string]: CodeStepComponent };
    this.#codeStepEles.forEach((codeStep) => {
      const name = codeStep.getAttribute('name') ?? '';
      const pattern = /-solution/;
      if (pattern.test(name)) {
        const primaryFunction = name.replace('-solution', '');
        solutionMap[primaryFunction] = codeStep;
      }
    });
    this.#codeStepEles.forEach((codeStep: CodeStepComponent) => {
      const name = codeStep.getAttribute('name') ?? '';
      const step = codeStep.getAttribute('step') ?? '';

      const stepDef = codeSteps[name];
      if (name && stepDef) {
        const stepImpl = stepImpls[name];
        let element;
        if (solutionMap[name]) {
          element = solutionMap[name];
          element.setAttribute('code', stepImpl.solution);
          element.toggleAttribute('readonly', true);
        }
        const StepViewerInstance = new StepViewer({
          stepRecord: stepImpl,
          element: codeStep,
          name,
          stepCount: +step,
          solutionElement: element,
        });

        this.#stepMap[name] = StepViewerInstance;
        this.#stepMapRef[step] = name;
        switch (name) {
          case 'loadData':
            StepViewerInstance.funcInput = [loadTensors, assetURL];
            StepViewerInstance.on(Validated, this.handleDataSplitValidation);
            StepViewerInstance.setCodeFromCacheOrDefault();

            break;
          case 'createModel':
            StepViewerInstance.funcInput = [tf, classes];
            StepViewerInstance.on(Validated, this.handleModelCreation);
            break;
          case 'configureModel':
            StepViewerInstance.on(Validated, this.handleConfigureModel);
            break;
          default:
            break;
        }

        // StepViewerInstance.on('validationInProgress', this.handleValidationStarted);
        StepViewerInstance.on('validationComplete', this.handleValidationComplete);
      } else {
        // console.error('Expected code-step to have a step attribute!');
      }
    });
  }

  handleValidationStarted = (name: string, step: number) => {
    if (this.#currentStep?.step === step) {
      handleValidatingStep();
      if (name === 'trainModel') {
        this.#stopTrainingButton.style.display = 'inline-flex';
      }
    }
  };

  handleValidationComplete = (name: string, step: number, passedValidation: boolean) => {
    if (this.#currentStep?.step === step) {
      let successStatement = 'validation failed';
      if (passedValidation) {
        successStatement = getSuccessStatement(name);
      }
      if (name === 'trainModel' && this.#trainingComplete) {
        handleValidationgComplete(step, passedValidation, successStatement);
      } else {
        handleValidationgComplete(step, passedValidation, successStatement);
      }
    }
  };

  handleResetButtonClick = () => {
    const name = this.#currentStep?.name ?? '';
    const currentInstance = this.#stepMap[name];
    currentInstance.resetCodeToDefault();
  };

  handleSolveClick = () => {
    const name = this.#currentStep?.name ?? '';
    const currentInstance = this.#stepMap[name];
    if (currentInstance) {
      currentInstance.solve();
    }
  };

  handleStopTrainingClick = () => {
    this.#trainingEnabled = false;
    this.#startTrainingButton.disabled = false;
  };

  onBatchEnd = (batch: number, logs?: Logs) => {
    if (!this.#initTime) {
      this.#initTime = true;
      this.#trainingStatusElement.style.display = 'inline-block';
    }
    if (!this.#trainingEnabled && this.#aslModel) {
      this.#aslModel.stopTraining = true;
    }

    const currentIncrement = this.#currentEpochCount * this.#batchSize + (batch + 1);

    const totalIncrements = this.#epochs * this.#batchSize;
    const progressValue = (currentIncrement / totalIncrements) * 100;
    this.#progressBarElement.value = progressValue;
    this.#trainingStatusElement.innerHTML = `
      Epoch: ${this.#currentEpochCount} Batch: ${batch}
      <br>
      Loss: ${logs?.loss.toFixed(3) ?? ''}
      <br>
      Accuracy: ${logs?.acc.toFixed(3) ?? ''}
      <br>
      `;
  };

  onEpochEnd = (epoch: number) => {
    const batchDuration = Date.now() - this.#startBatchTime;
    this.#currentEpochCount = epoch + 2;
    const remainingIncrements = this.#epochs - epoch;
    const msRemaining = batchDuration * remainingIncrements;
    const [time, hasMinutes] = millisToMinutesAndSeconds(msRemaining);

    this.#timeElement.innerHTML = `${time} ${hasMinutes ? 'minutes' : 'seconds'} remaining`;
    this.#startBatchTime = Date.now();
    if (epoch === this.#epochs - 1) {
      this.#trainingComplete = true;
    }
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
    if (result.valid && result.data && result.data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.#data = result.data[0];
    } else {
      console.log('no data provided to ModelBuilder, please retry load data function');
    }
  };

  handleNextButtonClick = async () => {
    const next = this.#currentStep?.step ?? 1;
    await this.onStepChange(next + 1);
  };

  async onStepChange(nextStep: number) {
    if (this.#currentStep) {
      const title = this.#currentStep.name;
      if (this.#isSolutionVisble) {
        this.toggleSolution(false, title);
      }
      const instructionsContainer = getOrCreateElement(`#${title}-image`) as HTMLElement;
      instructionsContainer.style.display = 'none';
      const currentInstance = this.#stepMap[title];
      currentInstance.show = false;
    }

    clearValidationFeedback();
    if (nextStep !== undefined) {
      await this.setCurrentStep(nextStep);
    }
  }

  handleSolutionButtonClick = () => {
    const state = !this.#isSolutionVisble;
    const name = this.#currentStep?.name ?? '';
    this.toggleSolution(state, name);
  };

  toggleSolution(isVisible: boolean, name: string) {
    this.#isSolutionVisble = isVisible;
    const currentInstance = this.#stepMap[name];
    currentInstance.showSolution(isVisible);
  }

  handlestartTrainingClick = async () => {
    const instance = this.#stepMap['trainModel'];
    if (this.#aslModel && instance) {
      this.#aslModel.stopTraining = false;
      this.#trainingEnabled = true;
      this.#currentEpochCount = 1;
      this.#startTrainingButton.disabled = true;
      this.#trainingComplete = false;
      this.#actionButton.disabled = true;
      await instance.runCachedCode();
    }
  };

  handleDownloadClick = async () => {
    const instance = this.#stepMap['exportModel'];
    if (this.#aslModel && instance) {
      await instance.runCachedCode();
    }
  };

  async handleStepChange(name: string, readOnly = 'false') {
    const instance = this.#stepMap[name];
    if (instance) {
      const instructionsContainer = getOrCreateElement(`#${name}-image`) as HTMLElement;
      instructionsContainer.style.display = 'flex';
      instance.setCodeFromCacheOrDefault();
      if (readOnly) {
        instance.readonly = readOnly === 'true';
      }
      if (name === 'loadData') {
        this.#loadDataDescElement.style.display = 'block';
        await instance.runCachedCode();
      } else {
        this.#loadDataDescElement.style.display = 'none';
      }

      if (name === 'exportModel' && this.#aslModel) {
        instance.funcInput = [this.#aslModel, tf];
      }
      if (name === 'trainModel' && this.#aslModel && this.#data) {
        const [x_train, x_val, y_train, y_val] = this.#data;
        instance.funcInput = [
          this.#aslModel,
          x_train,
          y_train,
          x_val,
          y_val,
          // callbacks
          {
            onBatchEnd: this.onBatchEnd,
            onEpochEnd: this.onEpochEnd,
          },
          this.#epochs,
        ];
        instance.overrideEventListener = true;
        this.#startTrainingButton.style.display = 'inline-flex';
        this.#stopTrainingButton.style.display = 'inline-flex';
      } else {
        this.#stopTrainingButton.style.display = 'none';
        this.#startTrainingButton.style.display = 'none';
        this.#trainingStatusElement.style.display = 'none';
      }
      if (name === 'exportModel') {
        instance.overrideEventListener = true;
        this.#downloadButton.style.display = 'inline-flex';
        this.#actionButton.style.display = 'none';
      }
      if (readOnly === 'true') {
        this.#resetButton.style.display = 'none';
        this.#solveButton.style.display = 'none';

        this.#solutionTabPanel.style.display = 'none';
      } else {
        this.#resetButton.style.display = 'inline-flex';
        this.#solveButton.style.display = 'inline-flex';
        this.#solutionTabPanel.style.display = 'inline-flex';
      }

      instance.show = true;
    } else {
      console.error(`Instance of StepViewer for ${name} is not found`);
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
      this.#mainEle.innerHTML = `${this.#currentStep.step}. ${this.#currentStep.description} `;
      await this.handleStepChange(this.#currentStep.name, this.#currentStep.readOnly);
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
