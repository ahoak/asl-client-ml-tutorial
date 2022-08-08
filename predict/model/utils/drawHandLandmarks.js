import { drawConnectors, drawLandmarks, HAND_CONNECTIONS } from "@mediapipe/drawing_utils";

/**
 * Draws the given hand landmarks to the 2d context
 */
export function drawHandLandmarks(drawHandLandmarks, context) {
    if (context) {
      context.clearRect(
        0,
        0,
        context.canvas.width,
        context.canvas.height
      );

      drawConnectors(context, drawHandLandmarks, HAND_CONNECTIONS, {
        color: "#FFF",
        lineWidth: 3,
      });
      drawLandmarks(context, drawHandLandmarks, {
        color: "#7f5a83",
        lineWidth: 2,
      });
    }
}
