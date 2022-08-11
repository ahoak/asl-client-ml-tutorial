import type { Results } from '@mediapipe/hands';
import { Hands } from '@mediapipe/hands';

import { drawImage } from './misc';

const predictionCanvas = document.createElement('canvas');
const predictionCanvasCtx = predictionCanvas.getContext('2d');

class HandPoseExtractor {
  #hands: Hands | null = null;
  #extractionCallback: ((extracted: Point3D[][]) => void) | null = null;

  constructor() {
    this.#init();
  }

  #init(empty = false) {
    if (!this.#hands) {
      console.log('loading hand model...');

      this.#hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
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

  async extract(
    imageSource: HTMLVideoElement | HTMLImageElement,
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
