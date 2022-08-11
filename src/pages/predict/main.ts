import '../../utils/fluentBootstrap';
import './components';

import * as tf from '@tensorflow/tfjs';

import { classes } from '../../utils/constants';
import { codeSteps } from './codeSteps';
import { extractAllJointPositions } from './codeSteps/helpers/extractAllJointPositions';
import { argMax, normalize } from './codeSteps/helpers/misc';
import type { CodeStepChangeEvent } from './components';

const predictionContainer = document.querySelector('.predict-container');
const stepController = document.querySelector('step-controller');
const codeStepEles = document.querySelectorAll('code-step');
const stepImpls = Object.keys(codeSteps).reduce(
  (acc, item) => {
    acc[item] = {
      valid: false,
    };
    return acc;
  },
  {} as Record<
    keyof typeof codeSteps,
    {
      impl?: (...args: any[]) => any;
      valid: boolean;
    }
  >,
);

function init() {
  predictionContainer?.classList.add('ready');
  codeStepEles.forEach((codeStep) => {
    const name = codeStep.getAttribute('name') ?? '';
    const stepDef = codeSteps[name];
    if (name && stepDef) {
      const defaultCode = localStorage.getItem(`predict:${name}`) ?? stepDef.template;
      codeStep.setAttribute('code', defaultCode);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      codeStep.addEventListener('change', async (event: Event) => {
        const ce = event as CodeStepChangeEvent;
        localStorage.setItem(`predict:${name}`, ce.detail.code);
        const stepImpl = stepImpls[name];
        stepImpl.valid = !ce.detail.hasSyntaxErrors;
        if (!ce.detail.hasSyntaxErrors) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          stepImpl.impl = createImplForCode(ce.detail.transpiledCode);
          if (stepDef.validate) {
            const results = await stepDef.validate(stepImpl.impl!);
            codeStep.setAttribute(
              'validation-issues',
              JSON.stringify(results.valid ? [] : results.errors),
            );
            stepImpl.valid = results.valid;
          }
        }
      });
    } else {
      console.error('Expected code-step to have a step attribute!');
    }
  });

  loadStepFromHash();
}

// eslint-disable-next-line @typescript-eslint/ban-types
function createImplForCode<T = (...args: any[]) => any>(code: string): T {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'extractAllJointPositions',
    'tf',
    'tfjs',
    'defaultModelClasses',
    'argMax',
    'normalize',
    `return (${code.replace(/export/g, '')})`,
  );
  return wrapper(extractAllJointPositions, tf, tf, classes, argMax, normalize) as T;
}

function loadStepFromHash() {
  const hash = window.location.hash ?? null;
  const step = hash.replace('#step', '');
  stepController?.setAttribute('step', step ? step : '1');
}

addEventListener('hashchange', loadStepFromHash);

init();
