import * as tf from "@tensorflow/tfjs";
import * as predict from "./predict";
import { loadZippedModelFromGlitch } from "./load";
import { names as assetNames, getAssetUrl } from "../assets";

const numJoints = 21;
const correctTensorLength = 3 * numJoints;

const testImageSource = document.createElement("img");
const rawHandTensor = Array.from({ length: correctTensorLength }).map(
  (n) => Math.random() * 10
);
const normalizedHandTensor = Array.from({ length: correctTensorLength }).map(
  (n) => Math.random() * 10
);

export const ProjectValidationError = {
  MISSING_MODEL: 1,
  INCOMPLETE_IMPLEMENTATION: 2,
  UNKNOWN_ERROR: 3,
};

export const steps = [
  {
    name: "getFlattenedJointPositions",
    template: predict.getFlattenedJointPositions,
    async validate(impl) {
      const functionName = "getFlattenedJointPositions"
      let foundComplete = false;
      const testImages = assetNames.filter((n) => n.indexOf("testImage") >= 0);
      for (const testImage of testImages) {
        const sign = testImage.match(/testImage([^0-9]+)/)[1];
        const url = await getAssetUrl(testImage);

        try {
          // Wait for the image to load
          const ready = new Promise((resolve, reject) => {
            testImageSource.onload = resolve;
            testImageSource.onerror = reject;
          });

          testImageSource.src = url;
          await ready;
        } catch (e) {
          console.log(e);
          continue;
        }

        try {
          const positions = await impl(
            testImageSource
          );
          if (positions) {
            if (
              positions.jointPositionsFlat &&
              positions.jointPositionsFlat.length !== correctTensorLength
            ) {
              return {
                errors: [
                  {
                    type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                    function: functionName,
                    path: "model/predict.js",
                    detail: `
                      Your jointPositionsFlat value is not the correct length.<br>
                      It should have a length of ${correctTensorLength}, but ${positions.jointPositionsFlat.length} was returned.<br>
                      Remember the format for the <b>jointPositionsFlat</b> property should be:<br>
                      <pre>[x1, y1, z1, x2, y2, z2...., xN, yN, zN]</pre>
                    `.trim(),
                  },
                ],
              };
            }
          }
          return {
            errors: [
              {
                type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                function: functionName,
                path: "model/predict.js",
                detail: `
                  It should return an object of the form: <br>
<pre>
return {
  // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
  jointPositionsFlat,

  // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
  jointPositions,
}
</pre>
                `.trim(),
              },
            ],
          };
        } catch (e) {
          const error = `${e}`;
          if (error.indexOf("Implement") >= 0) {
            const fileLocation = fileLocationFromStackTrace(e);
            const path = fileLocation.replace(window.location.href, "");
            console.log("path", path);
            return {
              errors: [
                {
                  type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                  function: functionName,
                  path,
                  error,
                },
              ],
            };
          } else if (error.indexOf("Unknown asset") >= 0) {
            return {
              errors: [
                {
                  type: ProjectValidationError.MISSING_MODEL,
                  error: "Missing Model",
                },
              ],
            };
          } else {
            return {
              errors: [
                {
                  type: ProjectValidationError.UNKNOWN_ERROR,
                  error,
                },
              ],
            };
          }
        }
      }

      return {
        errors: [],
      };
    },
  },
  {
    name: "normalizeTensor",
    template: predict.normalizeTensor,
    async validate(impl) {
      const functionName = "normalizeTensor";
      try {
        const normalized = await impl(
          rawHandTensor.slice(0)
        );
        if (!normalized || normalized.length != correctTensorLength) {
          return {
            errors: [
              {
                type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                function: functionName,
                path: "model/predict.js",
                detail: `
                  Your normalizeTensor didn't return anything, or the wrong size array.<br>
                  It should normalize the values within the tensor parameter from -1 to 1.
                `.trim(),
              },
            ],
          };
        } else if (normalized.some((n) => Math.abs(n) > 1)) {
          return {
            errors: [
              {
                type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                function: functionName,
                path: "model/predict.js",
                detail: `
                  The return from normalizeTensor is not normalized correctly, the values should range from -1 to 1.
                `.trim(),
              },
            ],
          };
        }
      } catch (e) {
        const error = `${e}`;
        if (error.indexOf("Implement") >= 0) {
          const fileLocation = fileLocationFromStackTrace(e);
          const path = fileLocation.replace(window.location.href, "");
          console.log("path", path);
          return {
            errors: [
              {
                type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                function: functionName,
                path,
              },
            ],
          };
        } else {
          return {
            errors: [
              {
                type: ProjectValidationError.UNKNOWN_ERROR,
                error,
              },
            ],
          };
        }
      }

      return {
        errors: [],
      };
    },
  },
  {
    name: "predictClassification",
    template: predict.predictClassification,
    async validate(impl) {
      const functionName = "predictClassification"
      try {
        const prediction = await impl(
          normalizedHandTensor
        );
        if (!prediction || !prediction.classification) {
          return {
            errors: [
              {
                type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                function: functionName,
                path: "model/predict.js",
                detail: `
                  Your predictClassification didn't return anything.<br>
                  It should return an object of the form: <br>
<pre>
return {
  classification: "&lt;Some sign&gt;",
  confidence: &lt;some number from 0 - 1&gt;
}
</pre>
                `.trim(),
              },
            ],
          };
        }
      } catch (e) {
        const error = `${e}`;
        if (error.indexOf("Implement") >= 0) {
          const fileLocation = fileLocationFromStackTrace(e);
          const path = fileLocation.replace(window.location.href, "");
          console.log("path", path);
          return {
            errors: [
              {
                type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                function: functionName,
                path,
              },
            ],
          };
        } else {
          return {
            errors: [
              {
                type: ProjectValidationError.UNKNOWN_ERROR,
                error,
              },
            ],
          };
        }
      }

      return {
        errors: [],
      };
    },
  },
  {
    name: "cleanup",
    template: predict.cleanup,
    async validate(impl) {
      const functionName = "cleanup"
      try {
        const fakeTensor = tf.tensor1d([1, 2, 3]);
        let disposed = false
        fakeTensor.dispose = () => disposed = true
        await impl(fakeTensor);
        if (!disposed) {
          return {
            errors: [
              {
                type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                function: functionName,
                detail: `Your function did not clean up the tensor that was passed in.`
              },
            ],
          };
        }
      } catch (e) {
        const error = `${e}`;
        if (error.indexOf("Implement") >= 0) {
          const fileLocation = fileLocationFromStackTrace(e);
          const path = fileLocation.replace(window.location.href, "");
          console.log("path", path);
          return {
            errors: [
              {
                type: ProjectValidationError.INCOMPLETE_IMPLEMENTATION,
                function: functionName,
                path,
              },
            ],
          };
        } else {
          return {
            errors: [
              {
                type: ProjectValidationError.UNKNOWN_ERROR,
                error,
              },
            ],
          };
        }
      }

      return {
        errors: [],
      };
    },
  },
];

export async function validate() {
  let errors = [];
  let model = null;
  try {
    const { errors: modelImportErrors } = await validateModelImport();
    if (modelImportErrors.length > 0) {
      errors = errors.concat(modelImportErrors);
    }

    for (const toImplement of steps) {
      const result = await toImplement.validate();
      if (result && result.errors && result.errors.length > 0) {
        errors = errors.concat(result.errors);
      }
    }
  } catch (e) {
    const error = `${e}`;
    errors.push({
      type: ProjectValidationError.UNKNOWN_ERROR,
      error,
    });
  } finally {
  }

  return {
    errors,
    valid: errors.length === 0,
  };
}

async function validateModelImport() {
  const errors = [];
  let model = null;
  try {
    model = await loadZippedModelFromGlitch("model.zip");
  } catch (e) {
    const error = `${e}`;
    if (error.indexOf("Unknown asset") >= 0) {
      errors.push({
        type: ProjectValidationError.MISSING_MODEL,
        error: "You must upload your model to the Assets folder in this Glitch",
      });
    }
  }
  return { errors, model };
}

function fileLocationFromStackTrace(e) {
  // const fileLocationRegex = /at\s*([^\s]+)\s*\(([^\)]+)\)/;
  const fileLocationRegex = /\s+at\s*[^\(]+\((([\w\/]+\.js)(\?t=\d+)?([^\)]+))/;
  const errStr = `${e.stack ?? e.message}`.replaceAll(window.location.href, "");
  const matches = errStr.match(fileLocationRegex);
  if (matches && matches.length > 0) {
    const [, , filePath, time, fileLoc] = matches;
    return `${filePath}${fileLoc ?? ""}`;
  } else {
    return null;
  }
}
