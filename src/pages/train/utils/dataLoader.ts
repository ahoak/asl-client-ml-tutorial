import { getOrCreateElement } from '../../../utils/utils';
const loadingstring = '.loading-element';
const solutionFeedbackstring = '.solution-feedback';
const actionButtonQuery = '.train-button';
const loadActionButtonQuery = '.load-data-button';
const outputContainerQuery = '.output-container';

export function handleBeforeDataLoadingStyles() {
  const outputContainer = getOrCreateElement(outputContainerQuery) as HTMLElement;
  outputContainer.style.visibility = 'visible';
  const solutionFeedbackElement = getOrCreateElement(solutionFeedbackstring) as HTMLElement;
  solutionFeedbackElement.innerHTML = `Loading data...`;
  const loadingElement = getOrCreateElement(loadingstring) as HTMLElement;
  loadingElement.style.visibility = 'visible';
}

export function handleAfterDataLoadingStyles() {
  const solutionFeedback = getOrCreateElement(solutionFeedbackstring) as HTMLElement;
  solutionFeedback.innerHTML = `Data loaded 😀`;
  const loadingElement = getOrCreateElement(loadingstring) as HTMLElement;
  loadingElement.style.visibility = 'hidden';
  const actionButton = getOrCreateElement(actionButtonQuery) as HTMLButtonElement;
  const loadActionButton = getOrCreateElement(loadActionButtonQuery) as HTMLButtonElement;
  actionButton.style.visibility = 'visible';
  loadActionButton.disabled = true;
  actionButton.disabled = false;
}
