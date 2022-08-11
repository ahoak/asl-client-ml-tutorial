import type { ValidationResult } from '../../../types';
import { ValidationErrorType } from '../../../types';
import { createIncompleteImplValidationError } from '../../../utils/utils';

export const template = `
/**
 * Returns the hand joint locations in 3d space within the given _imageSource_
 * ** Note ** Only returns the first hand in the image
 * @param {CanvasImageSource} imageSource The image to detect hand joints within
 * @param {boolean} loadMirrored If the image should be mirrored before extracting joint positions
 * @returns The joint positions
 */
async function getFlattenedJointPositions(
  imageSource: CanvasImageSource,
  loadMirrored: boolean
): Promise<{
  jointPositionsFlat: number[] | null;
  jointPositions: Point3D[] | null;
}> {
  // Uncomment the line below to extract joint positions for each hand in the imageSource
  // const allJointPositions = await extractAllJointPositions(imageSource, loadMirrored);
  // but we only need to process the first one

  return {
    // This should look like [x1, y1, z1, x2, y2, z2....xN, yN, zN]
    jointPositionsFlat: null,

    // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
    jointPositions: null,
  };
}
`;

export const solution = `
/**
 * Returns the hand joint locations in 3d space within the given _imageSource_
 * ** Note ** Only returns the first hand in the image
 * @param {CanvasImageSource} imageSource The image to detect hand joints within
 * @param {boolean} loadMirrored If the image should be mirrored before extracting joint positions
 * @returns The joint positions
 */
async function getFlattenedJointPositions(
  imageSource: CanvasImageSource,
  loadMirrored: boolean,
): Promise<{
  jointPositionsFlat: number[] | null;
  jointPositions: Point3D[] | null;
}> {
  const allJointPositions = await extractAllJointPositions(imageSource, loadMirrored);

  // but we only need to process the first one
  if (allJointPositions.length > 0) {
    const jointPositions = allJointPositions[0];
    const jointPositionsFlat = jointPositions.reduce((acc, pos) => {
      acc.push(pos.x, pos.y, pos.z);
      return acc;
    }, [] as number[]);
    return {
      // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
      jointPositionsFlat,

      // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
      jointPositions,
    };
  }

  return {
    // This should look like [x1, y1, z1, x2, y2, z2....xN, yN, zN]
    jointPositionsFlat: null,

    // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
    jointPositions: null,
  };
}
`;

const testImageSource = document.createElement('img');
testImageSource.setAttribute('crossorigin', 'anonymous');

const correctTensorLength = 63;

type getFlattenedJointPositionsImpl = (
  imageSource: CanvasImageSource,
  loadMirrored: boolean,
) => Promise<{
  jointPositionsFlat: number[] | null;
  jointPositions: Point3D[] | null;
}>;

export async function validate(impl: getFlattenedJointPositionsImpl): Promise<ValidationResult> {
  // Wait for the image to load
  const ready = new Promise((resolve, reject) => {
    testImageSource.onload = resolve;
    testImageSource.onerror = reject;
  });

  testImageSource.src = 'data/testImage.jpg';

  await ready;

  try {
    const positions = await impl(testImageSource, false);
    if (
      positions?.jointPositionsFlat &&
      positions.jointPositionsFlat.length !== correctTensorLength
    ) {
      return createIncompleteImplValidationError(`
        Your jointPositionsFlat value is not the correct length.<br />
        It should have a length of ${correctTensorLength}, but
        ${positions.jointPositionsFlat.length} was returned.<br />
        Remember the format for the <b>jointPositionsFlat</b> property
        should be:<br />
        <pre>[x1, y1, z1, x2, y2, z2...., xN, yN, zN]</pre>
      `);
    } else if (!positions || !positions.jointPositionsFlat) {
      return createIncompleteImplValidationError(`
It should return an object of the form: <br />
<pre>
return {
        // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
        jointPositionsFlat,

        // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
        jointPositions,
}
</pre>
`);
    }
  } catch (e) {
    const error = `${e}`;
    return {
      valid: false,
      errors: [
        {
          type: ValidationErrorType.Unknown,
          detail: error,
        },
      ],
    };
  }

  return {
    valid: true,
    errors: [],
  };
}
