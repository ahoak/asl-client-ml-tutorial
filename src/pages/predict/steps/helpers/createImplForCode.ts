import * as tf from '@tensorflow/tfjs';

import { classes } from '../../../../utils/constants';
import { extractAllJointPositions } from '../helpers/extractAllJointPositions';
import { argMax, normalize } from '../helpers/misc';
import type { PredictPipelineState } from '../types';

export function createImplForStepCode<T = (...args: any[]) => any>(
  code: string,
  pipelineState?: PredictPipelineState | null,
): T {
  const pipelineImplNames = Object.keys(pipelineState?.steps || {}) || [];
  const pipelineImpls =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    (pipelineImplNames.map((n) => (pipelineState?.steps as unknown as any)[n].instance) ||
      []) as (() => void)[];
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  const wrapper = new Function(
    'extractAllJointPositions',
    'tf',
    'tfjs',
    'defaultModelClasses',
    'argMax',
    'normalize',
    ...pipelineImplNames,
    `return (${code.replace(/export/g, '')})`,
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return wrapper(
    extractAllJointPositions,
    tf,
    tf,
    classes,
    argMax,
    normalize,
    ...pipelineImpls,
  ) as T;
}
