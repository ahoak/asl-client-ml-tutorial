import '../../components';

import { styleNavOnChange } from '../../utils/utils';
// import { testFullPipeline } from './train';
import { ModelBuilder } from './ModelBuilder.js';

styleNavOnChange('build');

const ModelBuilderInstance = new ModelBuilder();
void ModelBuilderInstance.init();

// void ModelBuilderInstance.setCurrentStep(1);

// Test full pipeline without code-blocks
// void testFullPipeline();

/**
 * Loads the step number from the url hash
 * @returns The step number
 */
function loadStepFromHash(): number {
  const hash = window.location.hash ?? null;
  return +(hash.replace('#step', '') || '1');
}
// Listen to the hash change, and update the current step
window.addEventListener('hashchange', () => ModelBuilderInstance.onStepChange(loadStepFromHash()));

void ModelBuilderInstance.onStepChange(loadStepFromHash());
