import type { Tab } from '@fluentui/web-components';

import { getOrCreateElement } from '../../utils/utils';

export class ElementViewer {
  #trainingStatusElement = getOrCreateElement('.training-feedback-container') as HTMLElement;
  #solutionTabPanel = getOrCreateElement('#solution-tab') as Tab;

  #actionButton = getOrCreateElement('.train-button') as HTMLButtonElement;
  #resetButton = getOrCreateElement('.reset-button') as HTMLButtonElement;
  #stopTrainingButton = getOrCreateElement('.training-stop-button') as HTMLButtonElement;
  #startTrainingButton = getOrCreateElement('.training-start-button') as HTMLButtonElement;
  #downloadButton = getOrCreateElement('.download-button') as HTMLButtonElement;
  #solveButton = getOrCreateElement('.solve-button') as HTMLButtonElement;

  showTrainingButtons() {
    this.#startTrainingButton.style.display = 'inline-flex';
    this.#stopTrainingButton.style.display = 'inline-flex';
  }

  hideTrainingButtons() {
    this.#stopTrainingButton.style.display = 'none';
    this.#startTrainingButton.style.display = 'none';
    this.#trainingStatusElement.style.display = 'none';
  }

  showTrainingOutput() {
    this.#trainingStatusElement.style.display = 'inline-block';
  }

  hideTrainingOutput() {
    this.#trainingStatusElement.style.display = 'none';
  }

  showDownload() {
    this.#downloadButton.style.display = 'inline-flex';
  }
  hideDownload() {
    this.#downloadButton.style.display = 'none';
  }

  hideCodeButtons() {
    this.#resetButton.style.display = 'none';
    this.#solveButton.style.display = 'none';
    this.#setTabVisibility(this.#solutionTabPanel, false);
  }

  showCodeButtons() {
    this.#resetButton.style.display = 'inline-flex';
    this.#solveButton.style.display = 'inline-flex';
    this.#setTabVisibility(this.#solutionTabPanel, true);
  }
  hideNextButton() {
    this.#actionButton.style.display = 'none';
  }

  showNextButton() {
    this.#actionButton.style.display = 'inline-flex';
  }

  showInstructions(name: string) {
    const instructionsContainer = getOrCreateElement(`#${name}-image`) as HTMLElement;
    instructionsContainer.style.display = 'block';
  }

  hideInstructions(name: string) {
    const instructionsContainer = getOrCreateElement(`#${name}-image`) as HTMLElement;
    instructionsContainer.style.display = 'none';
  }

  #setTabVisibility(tab: Tab, visible: boolean) {
    tab.style.display = visible ? 'inline-flex' : 'none';
    tab.toggleAttribute('disabled', !visible);
  }
}

// Utils

export function highlightNavStep(step: number): void {
  const step1Element: HTMLElement | null = document.querySelector(`#tutorial-step${step}`);
  if (step1Element) {
    step1Element.style.fontWeight = 'bold';
  }
}

export function unhighlightNavStep(step: number): void {
  const step1Element: HTMLElement | null = document.querySelector(`#tutorial-step${step}`);
  if (step1Element) {
    step1Element.style.fontWeight = 'revert';
  }
}
