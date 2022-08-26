import '../../utils/fluentBootstrap';
import './components';

import { styleNavOnChange } from '../../utils/utils';
import * as stepDefs from './steps';
import { warmup } from './steps/helpers/extractAllJointPositions';
import type {
  PredictPipelineState,
  PredictStepName,
  StepDisplayElement,
  StepState,
} from './steps/types';

styleNavOnChange('predict');
const predictionContents = document.querySelector('.predict-contents');
const stepController = document.querySelector('step-controller');
const nextButton = predictionContents!.querySelector('.next-button') as HTMLElement;
const resetButton = predictionContents!.querySelector('.reset-button') as HTMLElement;
const breadcrumbContainer = predictionContents!.querySelector('.predict-container .breadcrumbs');
const steps: StepDisplayElement[] = readStepElements();
const defaultPipelineState: PredictPipelineState = createDefaultPipelineState();

/**
 * Initializes the predition page
 */
async function init() {
  predictionContents?.classList.add('initializing');

  // Warmup the hand model
  await warmup();

  // eslint-disable-next-line @essex/adjacent-await
  const pipelineState: PredictPipelineState = await restorePipelineState();

  let currentStep = Object.freeze({
    stepNum: 1 as number,
    name: steps[0].getAttribute('name')! as string,
  });
  stepController?.setAttribute('step', `${currentStep}`);
  nextButton?.addEventListener('click', () => {
    if (currentStep.stepNum < steps.length && steps[currentStep.stepNum - 1].stepState.valid) {
      setStep(currentStep.stepNum + 1);
    }
  });

  resetButton?.addEventListener('click', () => {
    const stepDef = steps[currentStep.stepNum - 1];
    const stepName = stepDef.getAttribute('name')! as PredictStepName;
    stepDef.stepState = defaultPipelineState.steps[stepName];
  });

  /**
   * Updates the state for the given step
   * @param stepName The name of the step to update the state for
   * @param state The new state of the step
   */
  async function updateStepState(stepName: PredictStepName, state: StepState) {
    pipelineState.steps[stepName] = {
      ...state,
    };

    await persistPipelineState(pipelineState);

    // Is the step we're updating the current step
    if (currentStep.name === stepName) {
      nextButton?.toggleAttribute('disabled', !pipelineState.steps[stepName].valid);
    }

    for (const step of steps) {
      step.pipelineState = pipelineState;
    }

    updateBreadcrumbs(steps, pipelineState);
  }

  /**
   * Sets the current step of the page
   * @param stepNum The step to set to
   */
  function setStep(stepNum: number) {
    const nextStepNum = Math.min(stepNum, steps.length);
    currentStep = Object.freeze({
      stepNum: nextStepNum,
      name: steps[nextStepNum - 1].getAttribute('name')!,
    });

    window.location.hash = `#step${currentStep.stepNum}`;
    stepController?.setAttribute('step', `${currentStep.stepNum}`);

    const stepName = steps[currentStep.stepNum - 1].getAttribute('name')! as PredictStepName;

    steps[currentStep.stepNum - 1].stepState = pipelineState.steps[stepName];

    if (nextButton) {
      nextButton.toggleAttribute('disabled', !pipelineState.steps[stepName].valid);

      // hide it if it is the last step
      nextButton.style.display = stepNum === steps.length ? 'none' : '';
    }

    if (resetButton) {
      const userMutable = stepDefs[currentStep.name as PredictStepName].userMutable;
      resetButton.style.display = userMutable ? '' : 'none';
    }

    updateBreadcrumbs(steps, pipelineState);
  }

  // Loads the inital step
  setStep(loadStepFromHash() || 1);

  // load & bind events to all the steps on the page
  steps.forEach((step) => {
    // Loads the pipeline state into the step
    step.pipelineState = pipelineState;

    const name = step.getAttribute('name') as PredictStepName;
    if (name) {
      step.addEventListener('stateChanged', () => void updateStepState(name, step.stepState));
    }
  });

  // Listen to the hash change, and update the current step
  addEventListener('hashchange', () => setStep(loadStepFromHash()));

  // We're done loading, so remove the loading flags on the page
  predictionContents?.classList.add('ready');
  predictionContents?.classList.remove('initializing');
}

/**
 * Loads the step number from the url hash
 * @returns The step number
 */
function loadStepFromHash(): number {
  const hash = window.location.hash ?? null;
  return +(hash.replace('#step', '') || '1');
}

/**
 * Creates a default pipeline state
 * @returns A default pipeline state
 */
function createDefaultPipelineState(): PredictPipelineState {
  return {
    steps: {
      importModel: {
        ...stepDefs.importModel.defaultState,
      },
      extractAndProcessJointPositions: {
        ...stepDefs.extractAndProcessJointPositions.defaultState,
      },
      classify: {
        ...stepDefs.classify.defaultState,
      },
      run: {
        ...stepDefs.run.defaultState,
      },
    },
  };
}

/**
 * Updates the breadcrumbs to the current pipeline state
 * @param steps The step display elements
 * @param pipelineState The current pipeline state
 */
function updateBreadcrumbs(steps: StepDisplayElement[], pipelineState: PredictPipelineState) {
  for (let i = 0; i < steps.length; i++) {
    const ele = breadcrumbContainer?.querySelector(`[step="${i + 1}"]`) as HTMLElement;
    if (ele) {
      const breadcrumbStepName = steps[i].getAttribute('name');
      const isValid = pipelineState.steps[breadcrumbStepName as PredictStepName]?.valid ?? false;
      ele.classList.toggle('valid', isValid);
      ele.classList.toggle('invalid', !isValid);
    }
  }
}

/**
 * Reads the step display elements on the page
 * @returns The step display elements
 */
function readStepElements(): StepDisplayElement[] {
  return [
    predictionContents!.querySelector(
      `[name="${stepDefs.importModel.name}"]`,
    ) as StepDisplayElement,
    predictionContents!.querySelector(
      `[name="${stepDefs.extractAndProcessJointPositions.name}"]`,
    ) as StepDisplayElement,
    predictionContents!.querySelector(`[name="${stepDefs.classify.name}"]`) as StepDisplayElement,
    predictionContents!.querySelector(`[name="${stepDefs.run.name}"]`) as StepDisplayElement,
  ];
}

/**
 * Persists the given state to storage
 * @param state The state to persist
 */
function persistPipelineState(state: PredictPipelineState): void | Promise<void> {
  (Object.keys(state.steps) as PredictStepName[]).forEach((n) => {
    if (n in stepDefs && n in state.steps) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const data = (stepDefs as any)[n].serialize(state.steps[n]) as string | null;
      localStorage.setItem(`predict:${n}`, data ?? '');
    }
  });
}

/**
 * Restores the pipeline state from storage
 * @returns The pipeline state
 */
function restorePipelineState(): PredictPipelineState | Promise<PredictPipelineState> {
  const state = createDefaultPipelineState();
  (Object.keys(state.steps) as PredictStepName[]).forEach((n) => {
    if (n in stepDefs && n in state.steps) {
      const serializedData = localStorage.getItem(`predict:${n}`);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      state.steps[n] = (stepDefs as any)[n].deserialize(serializedData);
    }
  });
  return state;
}

// Init the predict page
void init();
