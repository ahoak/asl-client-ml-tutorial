### Predict the classification using model.predict() method.

```javascript
const predictionTensor = model.predict(/*✨INSERT_HERE✨*/).squeeze();
```

**✨Prediction Data**: Add input image data from previous step (tensor) as parameter to [model.predict()](https://js.tensorflow.org/api/latest/#tf.LayersModel.predict).
This will return a tensor that contains the confidence score (0-1) for all output values. We want the highest confidence prediction which we use ``predictionTensor.argMax()`` to get the index of the highest confidence sign.

**✨Classification and Confidence Score**: Using the index of the highest confidence sign (``predictedClassIndex``), get the sign and confidence score.

```javascript
{
    classification: classes[/*✨INSERT_HERE✨*/], 
    confidence: prediction[/*✨INSERT_HERE✨*/],
}
```

    
    