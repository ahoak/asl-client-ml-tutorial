import '../../utils/fluentBootstrap';
import './components';

import { warmup } from './codeSteps/helpers/extractAllJointPositions';
import * as stepDefs from './steps';
import type { PredictPipelineState, PredictStepName, StepState } from './steps/types';

const predictionContents = document.querySelector('.predict-contents');
const stepController = document.querySelector('step-controller');

async function init() {
  predictionContents?.classList.add('initializing');

  await warmup();

  const breadcrumbContainer = predictionContents!.querySelector('.predict-container .breadcrumbs');
  const steps: (HTMLElement & {
    stepState: StepState<unknown>;
    pipelineState?: PredictPipelineState | null;
  })[] = [
    predictionContents!.querySelector(
      `[name="${stepDefs.importModel.name}"]`,
    )! as stepDefs.importModel.Renderer,
    predictionContents!.querySelector(
      `[name="${stepDefs.extractAndProcessJointPositions.name}"]`,
    )! as stepDefs.extractAndProcessJointPositions.Renderer,
    predictionContents!.querySelector(
      `[name="${stepDefs.classify.name}"]`,
    )! as stepDefs.classify.Renderer,
    predictionContents!.querySelector(
      `[name="${stepDefs.cleanup.name}"]`,
    )! as stepDefs.cleanup.Renderer,
    predictionContents!.querySelector(`[name="${stepDefs.run.name}"]`)! as stepDefs.run.Renderer,
  ];

  const defaultPipelineState: PredictPipelineState = createDefaultPipelineState();
  const pipelineState: PredictPipelineState = await restorePipelineState();

  let currentStep = 1;
  stepController?.setAttribute('step', `${currentStep}`);

  const nextButton = predictionContents!.querySelector('.next-button');
  nextButton?.addEventListener('click', () => {
    if (currentStep < steps.length && steps[currentStep - 1].stepState.valid) {
      setStep(currentStep + 1);
    }
  });

  const resetButton = predictionContents!.querySelector('.reset-button');
  resetButton?.addEventListener('click', () => {
    const stepName = steps[currentStep - 1].getAttribute('name')! as PredictStepName;
    steps[currentStep - 1].stepState = defaultPipelineState.steps[stepName];
  });

  async function updateStepState(stepName: PredictStepName, state: StepState, stepNum: number) {
    pipelineState.steps[stepName] = {
      ...state,
    };

    await persistPipelineState(pipelineState);

    if (stepNum === currentStep) {
      nextButton?.toggleAttribute('disabled', !pipelineState.steps[stepName].valid);
    }

    for (const step of steps) {
      step.pipelineState = pipelineState;
    }

    updateBreadcrumbs();
  }

  function updateBreadcrumbs() {
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

  function setStep(stepNum: number) {
    currentStep = Math.min(stepNum, steps.length);
    window.location.hash = `#step${currentStep}`;
    stepController?.setAttribute('step', `${currentStep}`);

    const stepName = steps[currentStep - 1].getAttribute('name')! as PredictStepName;

    steps[stepNum - 1].stepState = pipelineState.steps[stepName];

    nextButton?.toggleAttribute('disabled', !pipelineState.steps[stepName].valid);
    updateBreadcrumbs();
  }

  for (const step of steps) {
    step.pipelineState = pipelineState;
  }

  setStep(loadStepFromHash() || 1);

  steps.forEach((step, i) => {
    const name = step.getAttribute('name') as PredictStepName;
    if (name) {
      step.addEventListener(
        'stateChanged',
        () => void updateStepState(name, step.stepState, i + 1),
      );
    }
  });

  addEventListener('hashchange', () => {
    setStep(loadStepFromHash());
  });

  predictionContents?.classList.add('ready');
  predictionContents?.classList.remove('initializing');
}

function loadStepFromHash(): number {
  const hash = window.location.hash ?? null;
  return +(hash.replace('#step', '') || '1');
}

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
      cleanup: {
        ...stepDefs.cleanup.defaultState,
      },
      run: {
        ...stepDefs.run.defaultState,
      },
    },
  };
}

void init();

// eslint-disable-next-line @typescript-eslint/require-await
async function persistPipelineState(state: PredictPipelineState): Promise<void> {
  (Object.keys(state.steps) as PredictStepName[]).forEach((n) => {
    if (n in stepDefs && n in state.steps) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const data = (stepDefs as any)[n].serialize(state.steps[n]) as string | null;
      localStorage.setItem(`predict:${n}`, data ?? '');
    }
  });
}

// eslint-disable-next-line @typescript-eslint/require-await
async function restorePipelineState(): Promise<PredictPipelineState> {
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
