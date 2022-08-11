import '../../utils/fluentBootstrap';
import './components';

import { codeSteps } from './codeSteps';

const predictionContainer = document.querySelector('.predict-container');
const stepController = document.querySelector('step-controller');
const codeStepEles = document.querySelectorAll('code-step');

function init() {
  predictionContainer?.classList.add('ready');
  codeStepEles.forEach((codeStep) => {
    const name = codeStep.getAttribute('name') ?? '';
    const stepDef = codeSteps[name];
    if (name && stepDef) {
      codeStep.setAttribute('code', stepDef.template);
    } else {
      console.error('Expected code-step to have a step attribute!');
    }
  });

  loadStepFromHash();
}

function loadStepFromHash() {
  const hash = window.location.hash ?? '';
  const step = hash.replace('#step', '');
  stepController?.setAttribute('step', step ?? '1');
}

addEventListener('hashchange', loadStepFromHash);

init();
