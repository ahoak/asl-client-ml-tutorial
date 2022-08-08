import { extractAllJointPositions } from "../utils/extractAllJointPositions";

export async function getFlattenedJointPositions(imageSource, loadMirrored) {
  const allJointPositions = await extractAllJointPositions(imageSource, loadMirrored);
  if (allJointPositions.length > 0) {
    const jointPositions = allJointPositions[0];
    const jointPositionsFlat = jointPositions.reduce((acc, pos) => {
      acc.push(pos.x, pos.y, pos.z);
      return acc;
    }, []);
    return {
      // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
      jointPositionsFlat,
      
    // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
      jointPositions,
    }
  }
  return null
}