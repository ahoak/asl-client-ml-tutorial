import type { Results } from '@mediapipe/hands';
import { Hands } from '@mediapipe/hands';

import { drawImage } from './misc';

const predictionCanvas = document.createElement('canvas');
const predictionCanvasCtx = predictionCanvas.getContext('2d');
const emptyImage = document.createElement('canvas');

class HandPoseExtractor {
  #hands: Hands | null = null;
  #extractionCallback: ((extracted: Point3D[][]) => void) | null = null;

  constructor() {
    this.#init();
  }

  #init() {
    if (!this.#hands) {
      console.log('loading hand model...');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.#hands = new (Hands || (window as any)['Hands'])({
        locateFile: (file) => {
          return import.meta.env.VITE_USE_CDN_RESOURCES !== 'false'
            ? `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            : `${import.meta.env.BASE_URL}node_modules/@mediapipe/hands/${file}`;
        },
      });
      this.#hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      this.#hands.onResults(this.#onResults);
    }
  }

  /**
   * Warms up the hand position model
   * @param imageSource The optional image source to warmup with
   */
  async warmup(imageSource: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement = emptyImage) {
    await this.extract(imageSource, false);
  }

  async extract(
    imageSource: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
    mirrored: boolean,
  ): Promise<Point3D[][]> {
    return new Promise((resolve) => {
      this.#extractionCallback = resolve;
      drawImage(imageSource, predictionCanvasCtx!, mirrored);
      void this.#hands!.send({ image: predictionCanvas });
    });
  }

  // callback for after hands model gets landmarks
  #onResults = (results: Results) => {
    this.#extractionCallback!(
      (results.multiHandLandmarks ?? []).reduce((acc, mhl) => {
        if (mhl.length > 0) {
          acc.push(mhl);
        }
        return acc;
      }, [] as Point3D[][]),
    );
  };
}

const extractor = new HandPoseExtractor();

/**
 * Warms up the hand pose model
 */
export function warmup(
  imageSource?: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
): Promise<void> {
  return extractor.warmup(imageSource);
}

/**
 * Extracts hand poses from the given image source
 * @param {HTMLVideoElement | HTMLImageElement} imageSource The image to extract hand poses for
 * @param {bool} mirrored If the image should be mirrored before extracting
 * @returns Point3D[][] joint locations for each hand within the image
 */
export async function extractAllJointPositions(
  imageSource: HTMLVideoElement | HTMLImageElement,
  mirrored: boolean,
) {
  return extractor.extract(imageSource, mirrored);
}
