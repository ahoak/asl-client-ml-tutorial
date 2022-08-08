import { Hands } from '@mediapipe/hands'
import * as tf from '@tensorflow/tfjs'
import { drawImage, normalize, argMax } from './misc'

const predictionCanvas = document.createElement('canvas')
const predictionCanvasCtx = predictionCanvas.getContext('2d')

class HandPoseExtractor {
  #hands = null;

  /**
   * @type {Function<string | null>}
   */
  #extractionCallback = null;
  
  constructor() {
    this.#init()
  }

  async #init(empty = false) {
    if (!this.#hands) {
      console.log("loading hand model...");

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

  async extract(imageSource, mirrored) {
    return new Promise(async (resolve) => {
      this.#extractionCallback = resolve;
      await drawImage(imageSource, predictionCanvasCtx, mirrored)
      this.#hands.send({ image: predictionCanvas });
    });
  }

  // callback for after hands model gets landmarks
  #onResults = async (results) => {
    this.#extractionCallback(
      (results.multiHandLandmarks ?? []).reduce((acc, mhl) => {
        if (mhl.length > 0) { 
          acc.push(mhl)
        }
        return acc
      }, [])
    )
  }
}

const extractor = new HandPoseExtractor()

/**
 * Extracts hand poses from the given image source
 * @param {CanvasImageSource} imageSource The image to extract hand poses for
 * @param {bool} mirrored If the image should be mirrored before extracting
 * @returns Point3D[][] joint locations for each hand within the image
 */
export async function extractAllJointPositions(imageSource, mirrored) {
  return extractor.extract(imageSource, mirrored)
}