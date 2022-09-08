import '../../utils/fluentBootstrap';

import * as tf from '@tensorflow/tfjs';

import Settings from '../../../settings.json';
import type { CodeStepComponent } from '../../components';
import type { ProjectSettings } from '../../types';
import { assetURL, classes } from '../../utils/constants';
import { getOrCreateElement, loadTensors } from '../../utils/utils';
import { BuildState } from './BuildState';
import type { CodeStepRecord } from './codeSteps';
import { codeSteps } from './codeSteps';
import { ElementViewer, highlightNavStep, unhighlightNavStep } from './ElementViewer';
import { StepViewer, Validated } from './StepViewer';
import { clearValidationFeedback, handleNavReset } from './utils/dataLoader';

const ProjectSettingsConfig = Settings as unknown as ProjectSettings;

export interface StepImplementationRecord extends CodeStepRecord {
  valid?: boolean;
  impl?: <T = (...args: any[]) => any>(code: string, ...args: any) => T;
}
type StepImplementation = Record<keyof typeof codeSteps, StepImplementationRecord>;

export class ModelBuilder {
  #isSolutionVisble = false;

  #mainEle = getOrCreateElement('#output-element') as HTMLElement;
  #codeStepEles = document.querySelectorAll('code-step') as NodeListOf<CodeStepComponent>;

  #actionButton = getOrCreateElement('.train-button') as HTMLButtonElement;
  #resetButton = getOrCreateElement('.reset-button') as HTMLButtonElement;
  #stopTrainingButton = getOrCreateElement('.training-stop-button') as HTMLButtonElement;
  #startTrainingButton = getOrCreateElement('.training-start-button') as HTMLButtonElement;
  #downloadButton = getOrCreateElement('.download-button') as HTMLButtonElement;
  #solveButton = getOrCreateElement('.solve-button') as HTMLButtonElement;

  #BuidStateInstance = new BuildState();
  #ElementViewerInstance = new ElementViewer();

  #stepMap: Record<string, StepViewer> = {};

  init() {
    this.#actionButton.disabled = true;
    this.#actionButton.onclick = this.handleNextButtonClick;
    this.#resetButton.onclick = this.handleResetButtonClick;
    this.#stopTrainingButton.onclick = this.handleStopTrainingClick;
    this.#startTrainingButton.onclick = this.handlestartTrainingClick;
    this.#downloadButton.onclick = this.handleDownloadClick;
    this.#solveButton.onclick = this.handleSolveClick;
    this.mapCodeSteps();
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
        switch (name) {
          case 'loadData':
            StepViewerInstance.funcInput = [loadTensors, assetURL];
            StepViewerInstance.on(Validated, this.#BuidStateInstance.handleDataSplitValidation);
            break;
          case 'createModel':
            StepViewerInstance.funcInput = [tf, classes];
            StepViewerInstance.on(Validated, this.#BuidStateInstance.handleModelCreation);
            break;

          case 'trainModel':
            StepViewerInstance.on(Validated, this.#BuidStateInstance.handleTrainValidation);
            break;
          default:
            break;
        }
        StepViewerInstance.setCodeFromCacheOrDefault();
        // await StepViewerInstance.runCachedCode();

        StepViewerInstance.on(
          'validationComplete',
          this.#BuidStateInstance.handleValidationComplete,
        );
      } else {
        // console.error('Expected code-step to have a step attribute!');
      }
    });
  }

  handleResetButtonClick = () => {
    const name = this.#BuidStateInstance.currentStep?.name ?? '';
    const currentInstance = this.#stepMap[name];
    currentInstance.resetCodeToDefault();
    this.#ElementViewerInstance.hideTrainingOutput();
    this.#actionButton.disabled = true;
    handleNavReset(currentInstance.stepCount);
  };

  handleSolveClick = () => {
    const name = this.#BuidStateInstance.currentStep?.name ?? '';
    const currentInstance = this.#stepMap[name];
    if (currentInstance) {
      currentInstance.solve();
    }
  };

  handleStopTrainingClick = () => {
    this.#BuidStateInstance.handleTrainingStopped();
    this.#actionButton.disabled = false;
  };

  handleNextButtonClick = async () => {
    const current = this.#BuidStateInstance.step ?? 1;
    const next = current + 1;
    window.location.hash = `#step${next}`;
    await this.onStepChange(next);
  };

  async onStepChange(nextStep: number) {
    const name = this.#BuidStateInstance.stepName;
    if (name) {
      if (this.#isSolutionVisble) {
        this.toggleSolution(false, name);
      }
      this.#ElementViewerInstance.hideInstructions(name);
      const currentInstance = this.#stepMap[name];
      unhighlightNavStep(currentInstance.stepCount);
      currentInstance.show = false;
    }
    clearValidationFeedback();
    await this.setCurrentStep(nextStep);
  }

  handleSolutionButtonClick = () => {
    const state = !this.#isSolutionVisble;
    const name = this.#BuidStateInstance.stepName ?? '';
    this.toggleSolution(state, name);
  };

  toggleSolution(isVisible: boolean, name: string) {
    this.#isSolutionVisble = isVisible;
    const currentInstance = this.#stepMap[name];
    currentInstance.showSolution(isVisible);
  }

  handlestartTrainingClick = async () => {
    this.#actionButton.disabled = true;
    await this.#BuidStateInstance.onTrainingClick();
  };

  handleDownloadClick = async () => {
    await this.#BuidStateInstance.onDownload();
  };

  async handleStepChange(name: string, readOnly = 'false') {
    const instance = this.#stepMap[name];
    if (instance) {
      this.#ElementViewerInstance.showInstructions(name);
      if (readOnly) {
        instance.readonly = readOnly === 'true';
      }

      if (name === 'trainModel') {
        instance.funcInput = this.#BuidStateInstance.getTrainingInputs();
        this.#ElementViewerInstance.showTrainingButtons();
        this.#BuidStateInstance.disableTrainingButtons();
      } else {
        this.#ElementViewerInstance.hideTrainingButtons();
      }

      if (readOnly === 'true') {
        this.#ElementViewerInstance.hideCodeButtons();
      } else {
        this.#ElementViewerInstance.showCodeButtons();
      }

      if (name === 'exportModel') {
        instance.funcInput = [this.#BuidStateInstance.aslModel, tf];
        this.#ElementViewerInstance.showDownload();
        this.#ElementViewerInstance.hideNextButton();
        instance.overrideEventListener = true;
      } else {
        this.#ElementViewerInstance.hideDownload();
        this.#ElementViewerInstance.showNextButton();
        await instance.runCachedCode();
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
      this.#BuidStateInstance.currentStep = step;
      const stepCount = step.step;
      highlightNavStep(stepCount);
      this.#mainEle.innerHTML = `${stepCount}. ${step.description} `;
      await this.handleStepChange(step.name, step.readOnly);
    }
  }
}
