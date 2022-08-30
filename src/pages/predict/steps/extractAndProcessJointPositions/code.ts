export const defaultCode = `
/**
 * Returns the hand joint locations in 3d space within the given _imageSource_
 * ** Note ** Only returns the first hand in the image
 * @param {CanvasImageSource} imageSource The image to detect hand joints within
 * @param {boolean} loadMirrored If the image should be mirrored before extracting joint positions
 * @returns The joint positions
 */
async function extractAndProcessJointPositions(
  imageSource: CanvasImageSource,
  loadMirrored: boolean
): Promise<{
  jointPositionsFlat: Tensor1D;
  jointPositions: Point3D[];
} | null> {
  // Extracts a set of joint positions for every hand in the image
  const allJointPositions = await extractAllJointPositions(imageSource, loadMirrored);
  
  // Is there at least one hand in the image?
  if (allJointPositions !== null && allJointPositions.length > 0) {
    // Get the first hand's joint positions
    const firstHand = allJointPositions[0];

    // Flatten the joint positions, so they look like the format
    // [joint1_x, joint1_y, joint1_z, ...jointN_x, jointN_y, jointN_z]
    const flattenedJoints = firstHand.reduce((result, joint) => {
      result.push(joint.x, joint.y, joint.z);
      return result;
    }, []);

    // Create a tensorflow tensor for the flattened joints
    const flattenedTensor = tf.tensor1d(flattenedJoints);

    // Normalize the flattened tensor values to [-1, 1]
    const dataMax = flattenedTensor.abs().max();
    const dataMin = flattenedTensor.abs().min();
    const normalizedTensor = flattenedTensor.sub(dataMin).div(dataMax.sub(dataMin));
    return {
      jointPositionsFlat: normalizedTensor.expandDims(0),
      jointPositions: firstHand
    };
  }

  // We didn't find anything, so return null
  return null;
}
`;

export const solutionCode = `
/**
 * Returns the hand joint locations in 3d space within the given _imageSource_
 * ** Note ** Only returns the first hand in the image
 * @param {CanvasImageSource} imageSource The image to detect hand joints within
 * @param {boolean} loadMirrored If the image should be mirrored before extracting joint positions
 * @returns The joint positions
 */
async function extractAndProcessJointPositions(
  imageSource: CanvasImageSource,
  loadMirrored: boolean
): Promise<{
  jointPositionsFlat: Tensor1D;
  jointPositions: Point3D[];
} | null> {
  // Extracts a set of joint positions for every hand in the image
  const allJointPositions = await extractAllJointPositions(imageSource, loadMirrored);
  
  // Is there at least one hand in the image?
  if (allJointPositions !== null && allJointPositions.length > 0) {
    // Get the first hand's joint positions
    const firstHand = allJointPositions[0];

    // Flatten the joint positions, so they look like the format
    // [joint1_x, joint1_y, joint1_z, ...jointN_x, jointN_y, jointN_z]
    const flattenedJoints = firstHand.reduce((result, joint) => {
      result.push(joint.x, joint.y, joint.z);
      return result;
    }, []);

    // Create a tensorflow tensor for the flattened joints
    const flattenedTensor = tf.tensor1d(flattenedJoints);

    // Normalize the flattened tensor values to [-1, 1]
    const dataMax = flattenedTensor.abs().max();
    const dataMin = flattenedTensor.abs().min();
    const normalizedTensor = flattenedTensor.sub(dataMin).div(dataMax.sub(dataMin));
    return {
      jointPositionsFlat: normalizedTensor,
      jointPositions: firstHand
    };
  }

  // We didn't find anything, so return null
  return null;
}
`;
