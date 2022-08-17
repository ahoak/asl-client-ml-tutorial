import '../../../../components/CodeEditor/utils/codeEditorTypes/main.d';

import type { ValidationResult } from '../../../../types';
import {
  createIncompleteImplValidationError,
  createUnknownValidationError,
} from '../../../../utils/utils';
import type { ExtractAndProcessJointPositionsStepState } from './types';

const testImageSource = document.createElement('img');
testImageSource.setAttribute('crossorigin', 'anonymous');

const correctTensorLength = 63;

export async function validate(
  state: ExtractAndProcessJointPositionsStepState,
): Promise<ValidationResult> {
  if (state.instance) {
    // Wait for the image to load
    const ready = new Promise((resolve, reject) => {
      testImageSource.onload = resolve;
      testImageSource.onerror = reject;
    });

    testImageSource.src = 'data/testImage.jpg';

    await ready;
    let data: any[] | null = null;

    try {
      const positions = await (state.instance as typeof extractAndProcessJointPositions)(
        testImageSource,
        false,
      );
      if (
        positions?.jointPositionsFlat &&
        positions.jointPositionsFlat.size !== correctTensorLength
      ) {
        return createIncorrectReturnShapeError(positions.jointPositionsFlat.size ?? null);
      } else if (!positions || !positions.jointPositionsFlat) {
        return createIncorrectReturnTypeError();
      }
      data = [positions];
    } catch (e) {
      return createUnknownValidationError(`${e}`);
    }

    return {
      valid: true,
      errors: [],
      data,
    };
  } else {
    return {
      valid: false,
      errors: createIncompleteImplValidationError(`No implementation found!`).errors,
    };
  }
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
