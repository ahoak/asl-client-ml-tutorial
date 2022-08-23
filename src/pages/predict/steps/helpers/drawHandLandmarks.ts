import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import type { Landmark } from '@mediapipe/hands';
import { HAND_CONNECTIONS } from '@mediapipe/hands';

/**
 * Draws the given hand landmarks to the 2d context
 */
export function drawHandLandmarks(landmarksToDraw: Landmark[], context: CanvasRenderingContext2D) {
  if (context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    drawConnectors(context, landmarksToDraw, HAND_CONNECTIONS, {
      color: '#FFF',
      lineWidth: 3,
    });
    drawLandmarks(context, landmarksToDraw, {
      color: '#7f5a83',
      lineWidth: 2,
    });
  }
}
