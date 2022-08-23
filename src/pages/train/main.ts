import '../../components';

// import { testFullPipeline } from './train';
import { ModelBuilder } from './ModelBuilder.js';

const ModelBuilderInstance = new ModelBuilder();
void ModelBuilderInstance.init();

void ModelBuilderInstance.setCurrentStep(1);

// Test full pipeline without code-blocks
// void testFullPipeline();
