import '../../components';

// import { testFullPipeline } from './train';
import { ModelBuilder } from './ModelBuilder.js';

const ModelBuilderInstance = new ModelBuilder();
void ModelBuilderInstance.init();

void ModelBuilderInstance.setCurrentStep(1);

// void testFullPipeline();

//TODO: Figure out best approach to implement
// function loadStepFromHash() {
//   const hash = window.location.hash ?? null;
//   const step = hash.replace('#step', '');
//   ModelBuilderInstance.onStepChange(+step);
// }

// addEventListener('hashchange', loadStepFromHash);
