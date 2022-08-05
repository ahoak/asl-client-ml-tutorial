import { classes, BackendOptions } from "../utils/constants.js";
import { trainTestSplit } from "../utils/utils.js";
import * as tf from "@tensorflow/tfjs";

/*
  Modify below to build model
*/


// Step 2: Set TensorflowBackend
/*
  Sets Tensorflow backend to use either webgl, cpu or wasm
  returns string ('webgl', 'cpu', 'wasm')
*/
export function setTensorFlowBackend() {
  // specify backend (not necessary, should default to webgl if available)
  // const option = BackendOptions.webgl || BackendOptions.cpu || BackendOptions.wasm
  const backend = BackendOptions.webgl;
  tf.setBackend(backend);
}

// Step 3: Use One Hot Encoding to convert letters (i.e "A", "B", "C") to binary vector 
// Split Training data
// use pre-built functions below to complete 
/*
  Encodes data useing one hot encoding and splits data into training and test set
  returns array of values [X_train, X_val, y_train, y_val];
*/
export function encodeAndSplitData(data){
  //apply one-hot encoding function below
  const { X, Y } = applyOneHotEncoding( data)
  // take the results from one-hot encoding and split data
  return splitTrainingData(X, Y)
}



export function applyOneHotEncoding(data) {
  const X = [];
  const Y = [];

  const oneHotClasses = classes.reduce((acc, item, i) => {
    acc[item] = Array.from({ length: classes.length }).fill(0);
    acc[item][i] = 1;
    return acc;
  }, {});
  // One=hot encoding to map classnames to numerical values
  Object.keys(data).forEach((cls) => {
    const clsData = data[cls];
    
    const yVal = oneHotClasses[cls];
    clsData.forEach((item) => {
      X.push(item);
      Y.push(yVal);
    });
  });
  
  // let outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32');
  // let oneHotOutputs = tf.oneHot(outputsAsTensor, classes.length);
  // let inputsAsTensor = tf.stack(trainingDataInputs);
  return { X, Y };
}

export function splitTrainingData(X, Y) {
  //Split data between training and test set
  const [X_train_1, X_test_1, y_train_1, y_test] = trainTestSplit(X, Y, {
    test_size: 0.1,
    random_state: 42,
  });

  const [X_train, X_val, y_train, y_val] = trainTestSplit(
    X_train_1,
    y_train_1,
    { test_size: 0.1, random_state: 42 }
  );
  return [X_train, X_val, y_train, y_val];
}

// Create a feed-forward model using the tf.sequential (https://js.tensorflow.org/api/latest/#sequential)
export function createModel() {
  // Create a feed-forward model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [63], units: 63, activation: "relu" }),
      tf.layers.dense({ units: 512, activation: "relu" }),
      tf.layers.dense({ units: 256, activation: "relu" }),
      tf.layers.dropout({ rate: 0.3 }),
      tf.layers.dense({ units: 128, activation: "relu" }),
      tf.layers.dense({ units: classes.length, activation: "softmax" }),
    ],
  });
  return model;
}

// https://js.tensorflow.org/api/latest/#tf.LayersModel.compile
export function configureModel(model) {
  // Compile the model with the defined optimizer and specify a loss function to use.
  const compiledModel = model.compile({
    // Adam changes the learning rate over time which is useful.
    // optimizer: 'adam',
    optimizer: tf.train.adam(0.001),
    // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
    // Else categoricalCrossentropy is used if more than 2 classes.
    loss: "categoricalCrossentropy",
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: ["accuracy"],
  });
}

export function getCallbacks(epoch, opts) {
  function onBatchEnd(batch, logs) {
    opts.onBatchEnd && opts.onBatchEnd(epoch, batch, logs);
  }

  function onEpochEnd() {
    epoch = epoch + 1;
    opts.onEpochEnd && opts.onEpochEnd(epoch);
  }
  return { onBatchEnd, onEpochEnd };
}


export async function trainModel(model, X_train, X_val, y_train, y_val, numEpochs, cbs) {
  let epoch = 0;
  const callbacks = getCallbacks(epoch, cbs);
  const data = tf.tensor(X_train);
  await model.fit(data, tf.tensor(y_train), {
    epochs: numEpochs,
    batchSize: 128,
    verbose: 1,
    validationData: [tf.tensor(X_val), tf.tensor(y_val)],
    callbacks,
  });
}

export async function exportModel(model) {
  // checkout https://www.tensorflow.org/js/guide/save_load
  const savedModel = await model.save("localstorage://model");
  // model.save(new ArrayBufferModelSaver())
  // console.log('saving to localstorage');
  // const files = ["tensorflowjs_models/model/weight_data", "tensorflowjs_models/model/weight_specs", "tensorflowjs_models/model/model_topology"]


}

//https://js.tensorflow.org/api/latest/#data.webcam