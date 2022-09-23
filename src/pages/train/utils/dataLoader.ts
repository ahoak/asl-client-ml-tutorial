import type { BreadcrumbItem } from '@fluentui/web-components';

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

export function handleValidatingComplete(
  step: number,
  passedValidation: boolean,
  successStatement: string,
) {
  const validationFeedback = getOrCreateElement(validationStatusQuery) as HTMLElement;
  validationFeedback.innerHTML = successStatement;
  const loadingElement = getOrCreateElement(loadingstring) as HTMLElement;
  loadingElement.style.visibility = 'hidden';
  updateBreadcrumbStatus(step, passedValidation);
  if (passedValidation) {
    const actionButton = getOrCreateElement(actionButtonQuery) as HTMLButtonElement;
    actionButton.disabled = false;
  }
}

export function handleNavReset(step: number) {
  updateBreadcrumbStatus(step, null);
  clearValidationFeedback();
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
  [
    'exportModel',
    `✔️ Downloaded! Time to make some <a href="${
      import.meta.env.BASE_URL
    }predict#step1">predictions</a> 🕺`,
  ],
]) as Map<string, string>;

export function getSuccessStatement(name: string) {
  return stepSuccessStatements.get(name) ?? '';
}

/**
 * Updates the corresponding breadcrumb item's status mark
 * @param step The step to update the status for
 * @param valid If the step is valid
 */
export function updateBreadcrumbStatus(step: number, valid: boolean | undefined | null) {
  const breadcrumbItem = getOrCreateElement(`#tutorial-step${step}`) as BreadcrumbItem;
  breadcrumbItem?.classList.toggle('valid', valid != null && valid);
  breadcrumbItem?.classList.toggle('invalid', valid != null && !valid);
}
