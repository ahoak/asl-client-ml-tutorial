import {
  // train,
  exportModel,
  setTensorFlowBackend,
  encodeAndSplitData,
  createModel,
  configureModel,
  trainModel,
} from "./train.js";
import * as tf from "@tensorflow/tfjs";
import { millisToMinutesAndSeconds, loadTensorData } from "../utils/utils";
import { fillColor } from "@fluentui/web-components";
import Settings from "../settings.json";
import "../utils/fluentBootstrap";

const tutorialSteps = Settings.tutorialSteps;

let epochs = 5;
let isTrainingStarted = false;
const batchSize = 405 * 2;
let timeRemainingEstimate = 0;
let startBatchTime = 0;

const totalIncrements = epochs * batchSize;
let initTime = false;
let trainingComplete = false;
let currentStep;

const mainEle = document.getElementById("output-element");

const step1Element = document.getElementById("tutorial-step1");

const helperTextElement = document.querySelector(".helper-text");
const solutionFeedbackElement = document.querySelector(".solution-feedback");
const trainingStatusElement = document.querySelector(".training-feedback");
const trainingContainerElement = document.querySelector(
  ".training-feedback-container"
);
const actionButton = document.querySelector(".train-button");
actionButton.disabled = true;
const loadActionButton = document.querySelector(".load-data-button");
let [X_train, X_val, y_train, y_val] = [];

fillColor.setValueFor(actionButton, "#ff7698");
fillColor.setValueFor(loadActionButton, "#ff7698");

function highlightNavStep(step) {
  const step1Element = document.getElementById(`tutorial-step${step}`);
  step1Element ? (step1Element.style["font-weight"] = "bold") : undefined;
}

function unhighlightNavStep(step) {
  const step1Element = document.getElementById(`tutorial-step${step}`);
  step1Element ? (step1Element.style["font-weight"] = "revert") : undefined;
}

function setCurrentStep(stepcount) {
  const step = tutorialSteps.find(
    (tutorialStep) => tutorialStep.step === stepcount
  );
  if (step != null) {
    currentStep = step;
    highlightNavStep(currentStep.step);
    unhighlightNavStep(currentStep.step - 1);
    helperTextElement.innerHTML = currentStep.helperText;
    mainEle.innerHTML = `${currentStep.step}. ${currentStep.description} `;
  }
}
// init highlighting of first step
setCurrentStep(1);

const progressBarElement = document.querySelector(".training-progress-bar");
const timeElement = document.querySelector(".time-remaining");
const outputContainer = document.querySelector(".output-container");
let aslModel;
let inputData;

// Step 1: Load preprocessed data (we have done the image processing for you)
async function handleLoadDataClick() {
  try {
    handleBeforeDataLoadingStyles();
    // This loads tensor data
    inputData = await loadTensorData();
    console.log("inputData", inputData);
    handleAfterDataLoadingStyles();
  } catch (err) {
    throw err;
  }
}

async function handleTrainModel() {
  trainingContainerElement.style.visibility = "visible";
  startBatchTime = Date.now();
  try {
      if(aslModel) {
     await trainModel(aslModel, X_train, X_val, y_train, y_val, epochs, {
      onBatchEnd,
      onEpochEnd,
    });
        console.log("currentStep.step", currentStep.step)
        console.log("trainingComplete", trainingComplete)
    if (currentStep.step === 7 && trainingComplete) {
      actionButton.style.visibility = "visible";
      actionButton.innerText = "Download model";
      actionButton.onclick = handleDownloadModelButtonClick;
    } else {
       // throw new Error("Training did not complete.")
    }
  }
  } catch (err) {
    throw err
  }
}

function handleConfigureModel() {
  try {
    configureModel(aslModel);
    const output = aslModel.evaluate(
      tf.truncatedNormal([1, 63]),
      tf.truncatedNormal([1, 26])
    );
    solutionFeedbackElement.innerHTML = "Look at you go! Great work.";
    setCurrentStep(currentStep.step + 1);
    actionButton.onclick = handleTrainModel;
  } catch (err) {
    solutionFeedbackElement.innerHTML =
      "The model needs to be compiled before being used. Check configureModel() method";
    throw new Error("The model needs to be compiled before being used. Check configureModel() method")
  }
}

function handleCreateModel() {
  const model = createModel();
  if (model) {
    aslModel = model;
    solutionFeedbackElement.innerHTML = "Yay! Model created! 🎉";
    setCurrentStep(currentStep.step + 1);
    actionButton.onclick = handleConfigureModel;
  } else {
    solutionFeedbackElement.innerHTML =
      "Whoops we couldn't find your model. Did you implement createModel function? If so, check that you return your model";
    throw new Error("No model detected. Did you implement createModel function? If so, check that you return your model")
  }
}

function handleTrainingDataSplit() {
  const result = encodeAndSplitData(inputData);
  if (result && result.length > 0) {
    [X_train, X_val, y_train, y_val] = result;
    solutionFeedbackElement.innerHTML = "Great job! Training data is ready";
    setCurrentStep(currentStep.step + 1);
    actionButton.onclick = handleCreateModel;
  } else {
    solutionFeedbackElement.innerHTML =
      "It appears encodeAndSplitData() function may not be implemented ";
    throw new Error(
      "It appears encodeAndSplitData() function may not be implemented"
    );
  }
}

function validateBackend() {
  setTensorFlowBackend();
  const backendInUse = tf.getBackend();
  let proceed = backendInUse != undefined;
  if (backendInUse) {
    solutionFeedbackElement.innerHTML = `Nice work! You are using ${backendInUse}.`;
  } else {
    solutionFeedbackElement.innerHTML =
      "Hmm no backend detected. Please check solution.";
    throw new Error("no backend detected. Please check solution.");
  }
  if (proceed) {
    setCurrentStep(currentStep.step + 1);
    actionButton.onclick = handleTrainingDataSplit;
  }
}
function handleBeforeDataLoadingStyles() {
  outputContainer.style.visibility = "visible";
  solutionFeedbackElement.innerHTML = `Loading data...`;
  const loadingElement = document.querySelector(".loading-element");
  loadingElement.style.visibility = "visible";
}

function handleAfterDataLoadingStyles() {
  solutionFeedbackElement.innerHTML = `Data loaded 😀`;
  const loadingElement = document.querySelector(".loading-element");
  loadingElement.style.visibility = "hidden";
  actionButton.style.visibility = "visible";
  loadActionButton.disabled = true;
  actionButton.disabled = false;
  actionButton.onclick = validateBackend;
  setCurrentStep(currentStep.step + 1);
}

function onBatchEnd(epoch, batch, logs) {
  if (!initTime) {
    initTime = true;
    setCurrentStep(currentStep + 1);
    trainingStatusElement.style.visibility = "visible";
  }
  const batchDuration = Date.now() - startBatchTime;

  const currentIncrement = epoch * batchSize + (batch + 1);

  const progressValue = (currentIncrement / totalIncrements) * 100;
  progressBarElement.value = progressValue;

  trainingStatusElement.innerHTML = `
    Epoch: ${epoch} Batch: ${batch}
    <br>
    Loss: ${logs.loss.toFixed(3)}
    <br>
    Accuracy: ${logs.acc.toFixed(3)}
    <br>
    `;
}

function onEpochEnd(epoch) {
  const batchDuration = Date.now() - startBatchTime;
  const remainingIncrements = epochs - epoch;
  const msRemaining = batchDuration * remainingIncrements;
  const [time, hasMinutes] = millisToMinutesAndSeconds(msRemaining);
  timeElement.innerHTML = `${time} ${
    hasMinutes ? "minutes" : "seconds"
  } remaining`;
  startBatchTime = Date.now();
  if (epoch === epochs - 1) {
    trainingComplete = true;
  }
}

async function handleTrainingStartButtonClick() {
  start();
}

async function handleDownloadModelButtonClick() {
  if (aslModel) {
    await exportModel(aslModel);
    actionButton.innerText = "Downloaded!";
  } else {
    console.log("no model to export");
  }
}

async function start() {
  try {
    await handleLoadDataClick();
    validateBackend();
    handleTrainingDataSplit();
    handleCreateModel()
    handleConfigureModel()
    handleTrainModel()
  } catch (err) {
    console.log(err)
  }
}

// start()

loadActionButton.onclick = handleLoadDataClick;
