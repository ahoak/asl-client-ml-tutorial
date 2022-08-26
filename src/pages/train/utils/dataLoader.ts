import type { BreadcrumbItem } from '@fluentui/web-components';

import Settings from '../../../../settings.json';
import { getOrCreateElement } from '../../../utils/utils';

const loadingstring = '.loading-element';
const actionButtonQuery = '.train-button';
const outputContainerQuery = '.output-container';
const validationStatusQuery = '#validation-status';

export function handleValidatingStep() {
  const outputContainer = getOrCreateElement(outputContainerQuery) as HTMLElement;
  outputContainer.style.visibility = 'visible';
  const validationFeedback = getOrCreateElement(validationStatusQuery) as HTMLElement;
  validationFeedback.innerHTML = `Validating solution...`;
  const loadingElement = getOrCreateElement(loadingstring) as HTMLElement;
  loadingElement.style.visibility = 'visible';
}

export function handleValidationgComplete(
  step: number,
  passedValidation: boolean,
  successStatement: string,
) {
  const validationFeedback = getOrCreateElement(validationStatusQuery) as HTMLElement;
  validationFeedback.innerHTML = successStatement;
  const loadingElement = getOrCreateElement(loadingstring) as HTMLElement;
  loadingElement.style.visibility = 'hidden';
  if (passedValidation) {
    const breadcrumbItem = getOrCreateElement(`#tutorial-step${step}`) as BreadcrumbItem;
    const description = Settings.trainTutorialSteps.find((item) => item.step === step);
    if (description && breadcrumbItem) {
      breadcrumbItem.innerHTML = `✅${description.description}`;
    }
    const actionButton = getOrCreateElement(actionButtonQuery) as HTMLButtonElement;
    actionButton.disabled = false;
  }
}

export function clearValidationFeedback() {
  const validationFeedback = getOrCreateElement(validationStatusQuery) as HTMLElement;
  validationFeedback.innerHTML = '';
  const actionButton = getOrCreateElement(actionButtonQuery) as HTMLButtonElement;
  actionButton.disabled = true;
}

const stepSuccessStatements = new Map([
  ['loadData', `✔️ Data loaded 💾`],
  ['createModel', '✔️ Yay! Model created! 🎉'],
  ['trainModel', '✔️ Training complete!👟'],
  ['exportModel', '✔️ Downloaded! Time to make some <a href="/predict#step1">predictions</a> 🕺'],
]) as Map<string, string>;

export function getSuccessStatement(name: string) {
  return stepSuccessStatements.get(name) ?? '';
}
