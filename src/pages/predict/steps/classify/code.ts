import type { CodeHints } from '../../components';

const generateCodeBody = (input1: string, input2: string, input3: string, comments = false) =>
  `${
    comments
      ? '\n  // This will return an Tensor containing a match confidence (0 - 1) for each sign'
      : ''
  }
  const predictionTensor = model.predict(${input1}).squeeze();${
    comments ? '\n\n  // Copy the prediction tensor into to a javascript array' : ''
  }
  const prediction = predictionTensor.dataSync();${
    comments ? '\n\n  // This will contain the index of the sign with the highest confidence' : ''
  }
  const predictedClassIndex = ${
    comments
      ? '\n\n    /* Go through all the confidences, and find the one that is the highest */'
      : ''
  }
    predictionTensor
      .argMax()${
        comments
          ? '\n\n      /* Copy the data off of the gpu into a regular array, and get the first element */'
          : ''
      }
      .dataSync()[0];
  return {${comments ? '\n\n    // Map the predicted index to the actual sign' : ''}
    classification: classes[${input2}], ${comments ? '\n\n    // Get the original confidence' : ''}
    confidence: prediction[${input3}],
  }`;

const generateCodeFunction = (
  input1: string,
  input2: string,
  input3: string,
  name = 'classify',
  comments = false,
) =>
  `${
    comments
      ? `
/**
 * Predicts the classification (ASL sign) of the given joint position tensor
 * @param {tf.LayersModel} model The model to run the prediction with
 * @param {string[]} classes The list of classes (ASL sign) the model supports
 * @param {tf.tensor1d} tensor The joint position tensor
 * @returns {{
 *   // The classification (ASL sign)
 *   classification: string,
 *   // The confidence 0 - 1
 *   confidence: number
 *}}
 */`
      : ''
  }
function ${name}(model: LayersModel, classes: string[], tensor: Tensor1D): {
  classification: string,
  confidence: number,
} | null {
${generateCodeBody(input1, input2, input3, comments)}
}
`;

const answer1 = `tensor`;
const answer2 = `predictedClassIndex`;
const answer3 = `predictedClassIndex`;
const userInputIndicator = `/*✨INSERT_HERE✨*/`;
export const defaultCode = generateCodeFunction(
  userInputIndicator,
  userInputIndicator,
  userInputIndicator,
);
export const solutionCode = generateCodeFunction(
  answer1,
  answer2,
  answer3,
  'classifySolution',
  true,
);
export const hints = {
  answer1: {
    code: answer1,
  },
  answer2: {
    code: answer2,
  },
  answer3: {
    code: answer3,
  },
  solution: {
    code: generateCodeBody(answer1, answer2, answer3),
  },
} as CodeHints;
