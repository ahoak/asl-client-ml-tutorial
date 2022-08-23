import { sequential, tensor1d } from '@tensorflow/tfjs';

import type { ValidationResult } from '../../../../types';
import { classes } from '../../../../utils/constants';
import {
  createIncompleteImplValidationError,
  createUnknownValidationError,
} from '../../../../utils/utils';
import type { ClassifyStepState } from './types';

const correctTensorLength = 63;
const fakeNormalizedTensor = tensor1d(
  Array.from({ length: correctTensorLength }).map((n) => Math.random() * 2 - 1),
).expandDims(0) as Tensor1D;
type classifyFn = (
  model: LayersModel,
  classes: string[],
  tensor: Tensor1D,
) => {
  classification: string;
  confidence: number;
};

const answerClassifiation = 'C';
const createCSignTensor = () => tensor1d(classes.map((n) => (n === answerClassifiation ? 1 : 0)));
export async function validate(state: ClassifyStepState): Promise<ValidationResult> {
  try {
    const impl = state.instance as classifyFn;

    const answer = createCSignTensor() as unknown as Tensor;
    const fakeModel = sequential({}) as unknown as LayersModel;
    fakeModel.predict = (_tensor: Tensor) => {
      return answer;
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const prediction = await impl(fakeModel, classes, fakeNormalizedTensor);
    if (!prediction || !prediction.classification) {
      return createIncompleteImplValidationError(
        `
classify() didn't return anything OR the correct format.<br>
It should return an object of the form: <br>
<pre>
return {
  classification: "&lt;Some sign&gt;",
  confidence: &lt;some number from 0 - 1&gt;
}
</pre>
`,
      );
    } else if (prediction.classification !== answerClassifiation) {
      return createIncompleteImplValidationError(
        `classify() returned <b>"${prediction.classification}"</b>, but it should've returned <b>"${answerClassifiation}"</b>`,
      );
    }
  } catch (e) {
    const error = `${e}`;
    if (error.indexOf('Implement') >= 0) {
      return createIncompleteImplValidationError(`Your implementation is incomplete`);
    } else {
      return createUnknownValidationError(error);
    }
  }

  return {
    valid: true,
    errors: [],
  };
}

export const createIncorrectReturnTypeError = () =>
  createIncompleteImplValidationError(
    `
It should return an object of the form: <br />
<pre>
return {
        // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
        jointPositionsFlat,

        // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
        jointPositions,
}
</pre>
`,
  );

export const createIncorrectReturnShapeError = (numReturned: number | null = null) =>
  createIncompleteImplValidationError(
    `
Your jointPositionsFlat value is not the correct length.<br />
It should have a length of ${correctTensorLength}, but 
${numReturned != null ? `${numReturned} was returned` : 'the incorrect length was returned.'}.<br />
Remember the format for the <b>jointPositionsFlat</b> property
should be:<br />
<pre>[x1, y1, z1, x2, y2, z2...., xN, yN, zN]</pre>
`,
  );
