/**
 * Scales the values within the given array so that they range from -1 to 1
 * @param {number[]} arr The array to normalize
 */
export function normalize(arr: number[]): number[] {
  const max = arr.reduce((maxSoFar, item) => Math.max(Math.abs(maxSoFar), Math.abs(item)), arr[0]);
  return arr.map((n) => n / max);
}

/**
 * Returns the index of the item with highest value
 * @param {Array[]} The array to find the index for
 */
export function argMax(arr: number[]): number | undefined {
  return arr.reduce((maxIdx, item, i) => {
    if (maxIdx === undefined) {
      return i;
    }
    return item > arr[maxIdx] ? i : maxIdx;
  }, undefined as number | undefined);
}

/**
 * Draws the source image onto the target context
 * @param {CanvasImageSource} source The source image
 * @param {CanvasRenderingContext2D} targetCtx The target context
 * @param {bool} mirrored Should the source image be mirrored onto the target
 */
export function drawImage(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  targetCtx: CanvasRenderingContext2D,
  mirrored: boolean,
) {
  const width = 'videoWidth' in source ? source.videoWidth : source.width;
  const height = 'videoHeight' in source ? source.videoHeight : source.height;
  const sourceImage = source;

  const targetCanvas = targetCtx.canvas ?? targetCtx;
  targetCanvas.width = width;
  targetCanvas.height = height;
  if (mirrored) {
    // move to x + img's width
    targetCtx.translate(width, 0);

    // scaleX by -1; this "trick" flips horizontally
    targetCtx.scale(-1, 1);

    // draw the img
    // no need for x,y since we've already translated
    targetCtx.drawImage(sourceImage, 0, 0);

    // always clean up -- reset transformations to default
    targetCtx.setTransform(1, 0, 0, 1, 0, 0);
  } else {
    targetCtx.drawImage(sourceImage, 0, 0);
  }
}
