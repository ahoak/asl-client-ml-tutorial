import {
  // train,
  exportModel,
  setTensorFlowBackend,
  encodeAndSplitData,
  createModel,
  configureModel,
  trainModel,
} from './train.js';
import * as tf from '@tensorflow/tfjs';
import { millisToMinutesAndSeconds, loadTensorData } from '../utils/utils';
// import { fillColor } from "@fluentui/web-components";
import Settings from '../../settings.json';
import '../utils/fluentBootstrap';
import { TensorData } from '../types';
import { LayersModel, Logs } from '@tensorflow/tfjs';

const tutorialSteps = Settings.tutorialSteps;

const epochs = 5;
const batchSize = 405 * 2;
let startBatchTime = 0;

const totalIncrements = epochs * batchSize;
let initTime = false;
let trainingComplete = false;
let currentStep: { step: number; helperText: string; description: string };

const mainEle = document.querySelector('#output-element');
const loadingElement: HTMLElement | null = document.querySelector('.loading-element');
const helperTextElement = document.querySelector('.helper-text');
const solutionFeedbackElement = document.querySelector('.solution-feedback');
const trainingStatusElement: HTMLElement | null = document.querySelector('.training-feedback');
const trainingContainerElement: HTMLElement | null = document.querySelector(
  '.training-feedback-container',
);
const actionButton = document.querySelector('.train-button') as HTMLButtonElement;
if (actionButton) {
  actionButton.disabled = true;
}

const loadActionButton = document.querySelector('.load-data-button') as HTMLButtonElement;
let x_train: number[][];
let y_train: number[];
let x_val: number[][];
let y_val: number[];

// if(actionButton && loadActionButton) {
//   fillColor.setValueFor(actionButton, "#ff7698");
//   fillColor.setValueFor(loadActionButton, "#ff7698");
// }

function highlightNavStep(step: number) {
  const step1Element: HTMLElement | null = document.querySelector(`#tutorial-step${step}`);

  step1Element ? (step1Element.style['font-weight'] = 'bold') : null;
}

function unhighlightNavStep(step: number) {
  const step1Element: HTMLElement | null = document.querySelector(`#tutorial-step${step}`);

  step1Element ? (step1Element.style['font-weight'] = 'revert') : null;
}

function setCurrentStep(stepcount: number) {
  const step = tutorialSteps.find((tutorialStep) => tutorialStep.step === stepcount);
  if (step != null) {
    currentStep = step;
    highlightNavStep(currentStep.step);
    unhighlightNavStep(currentStep.step - 1);
    if (helperTextElement) {
      helperTextElement.innerHTML = currentStep.helperText;
    }
    if (mainEle) {
      mainEle.innerHTML = `${currentStep.step}. ${currentStep.description} `;
    }
  }
}
// init highlighting of first step
setCurrentStep(1);

const progressBarElement = document.querySelector(
  '.training-progress-bar',
) as HTMLProgressElement | null;
const timeElement: HTMLElement | null = document.querySelector('.time-remaining');
const outputContainer: HTMLElement | null = document.querySelector('.output-container');
let aslModel: LayersModel | undefined;
let inputData: TensorData | undefined;

// Step 1: Load preprocessed data (we have done the image processing for you)
async function handleLoadDataClick() {
  handleBeforeDataLoadingStyles();
  // This loads tensor data
  inputData = await loadTensorData();
  // console.log('inputData', inputData);
  handleAfterDataLoadingStyles();
}

async function handleTrainModel() {
  if (trainingContainerElement) {
    trainingContainerElement.style.visibility = 'visible';
  }
  startBatchTime = Date.now();

  if (aslModel) {
    await trainModel(aslModel, x_train, x_val, y_train, y_val, epochs, {
      onBatchEnd,
      onEpochEnd,
    });
    if (currentStep.step === 7 && trainingComplete) {
      actionButton.style.visibility = 'visible';
      actionButton.innerText = 'Download model';
      actionButton.onclick = handleDownloadModelButtonClick;
    } else {
      // throw new Error("Training did not complete.")
    }
  }
}

function handleConfigureModel() {
  if (aslModel) {
    try {
      configureModel(aslModel);
      const output = aslModel.evaluate(tf.truncatedNormal([1, 63]), tf.truncatedNormal([1, 26]));
      if (output) {
        solutionFeedbackElement
          ? (solutionFeedbackElement.innerHTML = 'Look at you go! Great work.')
          : undefined;
        setCurrentStep(currentStep.step + 1);
        actionButton.onclick = handleTrainModel;
      } else {
        throw new Error(
          'The model needs to be compiled before being used. Check configureModel() method',
        );
      }
    } catch (err) {
      if (solutionFeedbackElement) {
        solutionFeedbackElement.innerHTML =
          'The model needs to be compiled before being used. Check configureModel() method';
      }
      throw new Error(
        'The model needs to be compiled before being used. Check configureModel() method',
      );
    }
  } else {
    throw new Error('No model found');
  }
}

function handleCreateModel() {
  const model = createModel();
  if (model) {
    aslModel = model;
    if (solutionFeedbackElement) {
      solutionFeedbackElement.innerHTML = 'Yay! Model created! 🎉';
    }
    setCurrentStep(currentStep.step + 1);
    actionButton.onclick = handleConfigureModel;
  } else {
    if (solutionFeedbackElement) {
      solutionFeedbackElement.innerHTML =
        "Whoops we couldn't find your model. Did you implement createModel function? If so, check that you return your model";
    }
    throw new Error(
      'No model detected. Did you implement createModel function? If so, check that you return your model',
    );
  }
}

async function handleTrainingDataSplit() {
  if (inputData) {
    const result = await encodeAndSplitData(inputData);
    if (result && result.length > 0) {
      [x_train, x_val, y_train, y_val] = result;
      // console.log(' [x_train,y_train,  x_val,  y_val]', [x_train, y_train, x_val, y_val]);
      if (solutionFeedbackElement) {
        solutionFeedbackElement.innerHTML = 'Great job! Training data is ready';
      }
      setCurrentStep(currentStep.step + 1);
      actionButton.onclick = handleCreateModel;
    } else {
      if (solutionFeedbackElement) {
        solutionFeedbackElement.innerHTML =
          'It appears encodeAndSplitData() function may not be implemented ';
      }
      throw new Error('It appears encodeAndSplitData() function may not be implemented');
    }
  } else {
    throw new Error('Data no loaded');
  }
}

function validateBackend() {
  setTensorFlowBackend();
  const backendInUse = tf.getBackend();
  const proceed = backendInUse != undefined;
  if (backendInUse) {
    solutionFeedbackElement
      ? (solutionFeedbackElement.innerHTML = `Nice work! You are using ${backendInUse}.`)
      : null;
  } else {
    solutionFeedbackElement
      ? (solutionFeedbackElement.innerHTML = 'Hmm no backend detected. Please check solution.')
      : null;
    throw new Error('no backend detected. Please check solution.');
  }
  if (proceed) {
    setCurrentStep(currentStep.step + 1);
    actionButton.onclick = handleTrainingDataSplit;
  }
}
function handleBeforeDataLoadingStyles() {
  outputContainer ? (outputContainer.style.visibility = 'visible') : null;
  solutionFeedbackElement ? (solutionFeedbackElement.innerHTML = `Loading data...`) : null;
  loadingElement ? (loadingElement.style.visibility = 'visible') : null;
}

function handleAfterDataLoadingStyles() {
  solutionFeedbackElement ? (solutionFeedbackElement.innerHTML = `Data loaded 😀`) : null;
  loadingElement ? (loadingElement.style.visibility = 'hidden') : null;
  actionButton.style.visibility = 'visible';
  loadActionButton.disabled = true;
  actionButton.disabled = false;
  actionButton.onclick = validateBackend;
  setCurrentStep(currentStep.step + 1);
}

function onBatchEnd(epoch: number, batch: number, logs?: Logs) {
  if (!initTime) {
    initTime = true;
    setCurrentStep(currentStep.step + 1);
    trainingStatusElement ? (trainingStatusElement.style.visibility = 'visible') : null;
  }

  const currentIncrement = epoch * batchSize + (batch + 1);

  const progressValue = (currentIncrement / totalIncrements) * 100;
  if (progressBarElement) {
    progressBarElement.value = progressValue;
  }

  trainingStatusElement
    ? (trainingStatusElement.innerHTML = `
    Epoch: ${epoch} Batch: ${batch}
    <br>
    Loss: ${logs?.loss.toFixed(3)}
    <br>
    Accuracy: ${logs?.acc.toFixed(3)}
    <br>
    `)
    : null;
}

function onEpochEnd(epoch: number) {
  const batchDuration = Date.now() - startBatchTime;
  const remainingIncrements = epochs - epoch;
  const msRemaining = batchDuration * remainingIncrements;
  const [time, hasMinutes] = millisToMinutesAndSeconds(msRemaining);
  timeElement
    ? (timeElement.innerHTML = `${time} ${hasMinutes ? 'minutes' : 'seconds'} remaining`)
    : null;
  startBatchTime = Date.now();
  if (epoch === epochs - 1) {
    trainingComplete = true;
  }
}

async function handleDownloadModelButtonClick() {
  if (aslModel) {
    await exportModel(aslModel);
    actionButton.innerText = 'Downloaded!';
  } else {
    console.log('no model to export');
  }
}

async function start() {
  try {
    await handleLoadDataClick();
    validateBackend();
    handleTrainingDataSplit();
    handleCreateModel();
    handleConfigureModel();
    handleTrainModel();
  } catch (err) {
    console.log(err);
  }
}

// start()

loadActionButton.onclick = handleLoadDataClick;
