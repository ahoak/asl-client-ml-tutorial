import '../../utils/fluentBootstrap';

import type { LayersModel, Logs } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

import Settings from '../../../settings.json';
import type { ProjectSettings, TensorData, TrainTutorialSteps } from '../../types';
import { getOrCreateElement, loadTensorData, millisToMinutesAndSeconds } from '../../utils/utils';
import {
  configureModel,
  createModel,
  encodeAndSplitData,
  exportModel,
  setTensorFlowBackend,
  trainModel,
} from './train.js';
const ProjectSettingsConfig = Settings as unknown as ProjectSettings;

interface ModelBuilderOptions {
  epochs?: number;
}

const DefaultEpoch = 5;
export class ModelBuilder {
  #epochs = DefaultEpoch;
  #batchSize = 405 * 2;
  #startBatchTime = 0;

  #initTime = false;
  #trainingComplete = false;
  #currentStep?: { step: number; helperText: string; description: string };

  #mainEle = '#output-element';
  #loadingstring = '.loading-element';
  #helperTextstring = '.helper-text';
  #solutionFeedbackstring = '.solution-feedback';
  #trainingStatusstring = '.training-feedback';
  #trainingContainerstring = '.training-feedback-container';
  #actionButton = '.train-button';
  #loadActionButton = '.load-data-button';
  #outputContainer = '.output-container';
  #progressBarstring = '.training-progress-bar';
  #timestring = '.time-remaining';

  x_train: number[][] = [[]];
  y_train: number[][] = [[]];
  x_val: number[][] = [[]];
  y_val: number[][] = [[]];

  #aslModel: LayersModel | undefined;
  #inputData: TensorData | undefined;

  constructor(options?: ModelBuilderOptions) {
    this.#epochs = options?.epochs ?? DefaultEpoch;
    this.init();
  }

  init() {
    const actionButton = getOrCreateElement(this.#actionButton) as HTMLButtonElement;
    actionButton.disabled = true;
    const loadActionButton = getOrCreateElement(this.#loadActionButton) as HTMLButtonElement;
    loadActionButton.onclick = this.handleLoadDataClick;
    this.setCurrentStep(1);
  }

  handleBeforeDataLoadingStyles() {
    const outputContainer = getOrCreateElement(this.#outputContainer) as HTMLElement;
    outputContainer.style.visibility = 'visible';
    const solutionFeedbackstring = getOrCreateElement(this.#solutionFeedbackstring) as HTMLElement;
    solutionFeedbackstring.innerHTML = `Loading data...`;
    const loadingstring = getOrCreateElement(this.#loadingstring) as HTMLElement;
    loadingstring.style.visibility = 'visible';
  }

  handleAfterDataLoadingStyles() {
    const solutionFeedbackstring = getOrCreateElement(this.#solutionFeedbackstring) as HTMLElement;
    solutionFeedbackstring.innerHTML = `Data loaded 😀`;
    const loadingstring = getOrCreateElement(this.#loadingstring) as HTMLElement;
    loadingstring.style.visibility = 'hidden';
    const actionButton = getOrCreateElement(this.#actionButton) as HTMLButtonElement;
    const loadActionButton = getOrCreateElement(this.#loadActionButton) as HTMLButtonElement;
    actionButton.style.visibility = 'visible';
    loadActionButton.disabled = true;
    actionButton.disabled = false;
    actionButton.onclick = this.validateBackend;
    const nextStep = this.#currentStep != undefined ? this.#currentStep.step + 1 : 0;
    this.setCurrentStep(nextStep);
  }

  handleLoadDataClick = async () => {
    this.handleBeforeDataLoadingStyles();
    this.#inputData = await loadTensorData();
    this.handleAfterDataLoadingStyles();
  };

  setCurrentStep(stepcount: number): void {
    const step = ProjectSettingsConfig.trainTutorialSteps.find(
      (tutorialStep) => tutorialStep.step === stepcount,
    );
    console.log('step', step);
    if (step != null) {
      this.#currentStep = step;
      highlightNavStep(this.#currentStep.step);
      unhighlightNavStep(this.#currentStep.step - 1);
      const helperTextElement = getOrCreateElement(this.#helperTextstring) as HTMLElement;
      helperTextElement.innerHTML = `${this.#currentStep.helperText}`;
      const mainEle = getOrCreateElement(this.#mainEle) as HTMLElement;
      mainEle.innerHTML = `${this.#currentStep.step}. ${this.#currentStep.description} `;
    }
  }

  validateBackend = async () => {
    await setTensorFlowBackend();
    const backendInUse = tf.getBackend();
    const solutionFeedbackElement = getOrCreateElement(this.#solutionFeedbackstring) as HTMLElement;
    const actionButton = getOrCreateElement(this.#actionButton) as HTMLButtonElement;
    const errorText = 'Hmm no backend detected. Please check solution.';
    if (backendInUse) {
      const nextStep = this.#currentStep != undefined ? this.#currentStep.step + 1 : 0;
      solutionFeedbackElement.innerHTML = `Nice work! You are using ${backendInUse}.`;

      this.setCurrentStep(nextStep);
      actionButton.onclick = this.handleTrainingDataSplit;
    } else {
      solutionFeedbackElement.innerHTML = errorText;
      throw new Error(errorText);
    }
  };

  handleTrainingDataSplit = () => {
    if (this.#inputData) {
      const result = encodeAndSplitData(this.#inputData);
      const solutionFeedbackElement = getOrCreateElement(
        this.#solutionFeedbackstring,
      ) as HTMLElement;
      const errorText = 'It appears encodeAndSplitData() function may not be implemented ';
      if (result && result.length > 0) {
        [this.x_train, this.x_val, this.y_train, this.y_val] = result;

        solutionFeedbackElement.innerHTML = 'Great job! Training data is ready';
        const nextStep = this.#currentStep != undefined ? this.#currentStep.step + 1 : 0;
        this.setCurrentStep(nextStep);
        const actionButton = getOrCreateElement(this.#actionButton) as HTMLButtonElement;
        actionButton.onclick = this.handleCreateModel;
      } else {
        solutionFeedbackElement.innerHTML = errorText;
        throw new Error(errorText);
      }
    } else {
      throw new Error('Data no loaded');
    }
  };

  handleCreateModel = () => {
    const model = createModel();
    const solutionFeedbackElement = getOrCreateElement(this.#solutionFeedbackstring) as HTMLElement;
    const actionButton = getOrCreateElement(this.#actionButton) as HTMLButtonElement;
    const errorText =
      "We couldn't find your model. Did you implement createModel function? If so, check that you return your model";
    if (model) {
      this.#aslModel = model;
      const nextStep = this.#currentStep != undefined ? this.#currentStep.step + 1 : 0;
      solutionFeedbackElement.innerHTML = 'Yay! Model created! 🎉';

      this.setCurrentStep(nextStep);
      actionButton.onclick = this.handleConfigureModel;
    } else {
      solutionFeedbackElement.innerHTML = errorText;
      throw new Error(errorText);
    }
  };

  handleConfigureModel = () => {
    if (this.#aslModel) {
      const solutionFeedbackElement = getOrCreateElement(
        this.#solutionFeedbackstring,
      ) as HTMLElement;
      const errorMsg =
        'The model needs to be compiled before being used. Check configureModel() method';
      const actionButton = getOrCreateElement(this.#actionButton) as HTMLButtonElement;

      try {
        configureModel(this.#aslModel);
        const output = this.#aslModel.evaluate(
          tf.truncatedNormal([1, 63]),
          tf.truncatedNormal([1, 26]),
        );
        if (output) {
          solutionFeedbackElement.innerHTML = 'Look at you go! Great work.';
          const nextStep = this.#currentStep != undefined ? this.#currentStep.step + 1 : 0;
          this.setCurrentStep(nextStep);
          actionButton.onclick = this.handleTrainModel;
        } else {
          throw new Error(errorMsg);
        }
      } catch (err) {
        solutionFeedbackElement.innerHTML = errorMsg;

        throw new Error(errorMsg);
      }
    } else {
      throw new Error('No model found');
    }
  };

  onBatchEnd = (epoch: number, batch: number, logs?: Logs) => {
    const trainingStatusElement = getOrCreateElement(this.#trainingStatusstring) as HTMLElement;

    if (!this.#initTime) {
      this.#initTime = true;
      const nextStep = this.#currentStep != undefined ? this.#currentStep.step + 1 : 0;
      this.setCurrentStep(nextStep);
      trainingStatusElement.style.visibility = 'visible';
    }

    const currentIncrement = epoch * this.#batchSize + (batch + 1);

    const totalIncrements = this.#epochs * this.#batchSize;
    const progressValue = (currentIncrement / totalIncrements) * 100;
    const progressBarElement = getOrCreateElement(this.#progressBarstring) as HTMLProgressElement;
    progressBarElement.value = progressValue;

    trainingStatusElement.innerHTML = `
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
    const timeElement = getOrCreateElement(this.#timestring) as HTMLElement;
    timeElement.innerHTML = `${time} ${hasMinutes ? 'minutes' : 'seconds'} remaining`;
    this.#startBatchTime = Date.now();
    if (epoch === this.#epochs - 1) {
      this.#trainingComplete = true;
    }
  };

  handleTrainModel = async () => {
    const trainingContainerElement = getOrCreateElement(
      this.#trainingContainerstring,
    ) as HTMLElement;
    trainingContainerElement.style.visibility = 'visible';
    const actionButton = getOrCreateElement(this.#actionButton) as HTMLButtonElement;

    this.#startBatchTime = Date.now();

    if (this.#aslModel) {
      await trainModel(
        this.#aslModel,
        this.x_train,
        this.x_val,
        this.y_train,
        this.y_val,
        this.#epochs,
        {
          onBatchEnd: this.onBatchEnd,
          onEpochEnd: this.onEpochEnd,
        },
      );
      if (this.#currentStep && this.#currentStep.step === 7 && this.#trainingComplete) {
        actionButton.style.visibility = 'visible';
        actionButton.innerText = 'Download model';
        actionButton.onclick = this.handleDownloadModelButtonClick;
      } else {
        // throw new Error("Training did not complete.")
      }
    }
  };

  handleDownloadModelButtonClick = async () => {
    const actionButton = getOrCreateElement(this.#actionButton) as HTMLButtonElement;
    if (this.#aslModel) {
      await exportModel(this.#aslModel);
      actionButton.innerText = 'Downloaded!';
    } else {
      console.log('no model to export');
    }
  };
}

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
