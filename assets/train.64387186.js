import{J as x,A as S,k as g,a as f,m as C,n as a,o as H,t as c,e as p,V as w,p as E,q as B,r as T,s as j}from"./utils.fd1d5341.js";import"./VideoStreamViewer.3feff95f.js";const P="ASL Fingerspelling Model Tutorial",q="Train ASL Fingerspelling ML Model using Tensorflowjs",U="ASL Fingerspelling Tutorial \u{1F44B}",J="",W="images/ghc_logo_v4.svg",Y={github:"https://github.com/ahoak/asl-client-ml-tutorial",twitter:"https://twitter.com/amber_hoak"},Z=!1,X=[{step:1,description:"Load Data",helperText:"Load preprocessed data by pressing the button",name:"loadData",readOnly:"true",imageLink:"instructions/loadData.png"},{step:2,description:"Create and Configure Model",helperText:"creating a feed-forward model. We will use 5 layers with relu activation function. Function must return the model.",name:"createModel",readOnly:"false",imageLink:"instructions/createModel.png"},{step:3,description:"Train Model",helperText:"edit function trainModel() by using the Tf.fit API. Set the following parameters: epochs, batchSize,validationData, callbacks. Hint, you may need to transform your data into tensors ",name:"trainModel",readOnly:"false",imageLink:"instructions/trainModel.png"},{step:4,description:"Download Model Files",helperText:"Click the button to download your shiney new model. We will use this in our webapp.",name:"exportModel",readOnly:"true",imageLink:"instructions/exportModel.png"}],Q=[{step:1,description:"Import Model",helperText:"Import a pre-trained model to perform inference with."},{step:2,description:"Extract and Process Joint Positions",helperText:"Extract the hand joint positions from within an image."},{step:3,description:"Classify",helperText:"Run inference with the normalized joint positions to get a classification (ASL sign)."},{step:4,description:"Run",helperText:"Run prediction on the model"}],M={metaTitle:P,metaDescription:q,name:U,theme:J,avatarImage:W,social:Y,showDataVideo:Z,trainTutorialSteps:X,predictSteps:Q};function z(i){const t=[],e=[],n=f.reduce((o,r,s)=>(o[r]=Array.from({length:f.length}).fill(0),o[r][s]=1,o),{});return Object.keys(i).forEach(o=>{const r=i[o],s=n[o];r.forEach(d=>{t.push(d),e.push(s)})}),{inputs:t,outputs:e}}function L(i,t){const[e,,n]=C(i,t,{testSize:.1,randomState:42}),[o,r,s,d]=C(e,n,{testSize:.1,randomState:42});return[o,r,s,d]}function A(i,t){const e=document.createElement("a");e.setAttribute("href","data:application/zip;base64,"+t),e.setAttribute("download",i),e.style.display="none",document.body.appendChild(e),e.click(),document.body.removeChild(e)}async function G(i){await i.save("localstorage://model"),console.log("model saved to localstorage!");const t=new x,n=await i.save(new S);Object.keys(n.data).forEach((o,r)=>{r===0?t.file(o,JSON.stringify(n.data[o])):t.file(o,n.data[o])}),await t.generateAsync({type:"base64"}).then(function(o){A("model.zip",o)},function(o){console.warn(o)})}async function K(i,t,e,n,o=5,r=128){if(!i||!t||!e)return new Error("missing parameter for trainModel");const s=g(t.inputs),d=g(t.outputs),u=g(e.inputs),l=g(e.outputs),h=await i.fit(s,d,{epochs:o,batchSize:r,verbose:1,validationData:[u,l],callbacks:n});return s.dispose(),d.dispose(),u.dispose(),l.dispose(),h}const tt=".loading-element",$=".train-button",V="#validation-status";function m(i,t,e){const n=a(V);n.innerHTML=e;const o=a(tt);if(o.style.visibility="hidden",t){const r=a(`#tutorial-step${i}`),s=M.trainTutorialSteps.find(u=>u.step===i);s&&r&&(r.innerHTML=`<a href="#step${i}">\u2705${s.description}</a>`);const d=a($);d.disabled=!1}}function et(i){const t=a(`#tutorial-step${i}`),e=M.trainTutorialSteps.find(n=>n.step===i);e&&t&&(t.innerHTML=`<a href="#step${i}">${e.description}</a>`),_()}function _(){const i=a(V);i.innerHTML="";const t=a($);t.disabled=!0}const nt=new Map([["loadData","\u2714\uFE0F Data loaded \u{1F4BE}"],["createModel","\u2714\uFE0F Yay! Model created! \u{1F389}"],["trainModel","\u2714\uFE0F Training complete!\u{1F45F}"],["exportModel",'\u2714\uFE0F Downloaded! Time to make some <a href="/predict#step1">predictions</a> \u{1F57A}']]);function y(i){return nt.get(i)??""}const D=5;class it{#n=D;#o=128;#i=1;#t=0;#s;#l=!0;#a=a(".training-feedback-container");#d=a(".training-progress-bar");#u=a(".training-start-button");#e=a(".training-stop-button");#r={};#c;#p;constructor(t){this.#n=t?.epochs??D}set aslModel(t){this.#p=t}get aslModel(){return this.#p}set currentStep(t){this.#s=t}get currentStep(){return this.#s}get step(){return this.#s?.step}get stepName(){return this.#s?.name}get epochs(){return this.#n}completedValidation(t,e){this.#r[t]=e}getCompletedState(t){return this.#r[t]??!1}handleReset(t){t==="createModel"&&(this.#p=void 0),this.completedValidation(t,!1)}getTrainingData(){if(this.#c){const[t,,e]=this.#c;return{inputs:t,outputs:e}}}getValidationData(){if(this.#c){const[,t,,e]=this.#c;return{inputs:t,outputs:e}}}handleModelResults=t=>{t.valid&&t.data&&t.data.length>0&&(this.#p=t.data[0])};handleModelCreation=t=>{t.valid&&t.data&&t.data.length>0?this.#p=t.data[0]:console.log("no data provided to ModelBuilder, please retry load data function")};handleDataSplitValidation=t=>{t.valid&&t.data&&t.data.length>0?this.#c=t.data[0]:console.log("no data provided to ModelBuilder, please retry load data function")};handleTrainValidation=t=>{if(t.valid&&t.data&&t.data.length>0){const[e,n]=t.data;this.#o=e,this.#n=n}else console.log("no data provided to ModelBuilder, please retry load data function")};onBatchEnd=(t,e)=>{this.#a.style.display="inline-block",!this.#l&&this.#p&&(this.#p.stopTraining=!0),this.#a.innerHTML=`
      Epoch: ${this.#i} Batch: ${t}
      <br>
      Loss: ${e?.loss.toFixed(3)??""}
      <br>
      Accuracy: ${e?.acc.toFixed(3)??""}
      <br>
      `};async onDownload(){const t=this.#p;t?(await G(t),m(this.step??1,!0,y("exportModel"))):m(this.step??1,!1,"no model loaded")}onEpochEnd=t=>{const e=Date.now()-this.#t;this.#i=t+2;const n=this.#n-t,o=e*n,[r,s]=H(o);this.#d.innerHTML=`${r} ${s?"minutes":"seconds"} remaining`,this.#t=Date.now(),t===this.#n-1&&m(this.step??1,!0,y("trainModel"))};getCallbacks(){return{onBatchEnd:this.onBatchEnd,onEpochEnd:this.onEpochEnd}}handleValidationComplete=(t,e,n)=>{if(this.#s?.step===e){const o=n?y(t):"validation failed";n&&t==="trainModel"?this.enableTrainingButtons():this.disableTrainingButtons(),t!=="exportModel"&&t!=="trainModel"&&m(e,n,o)}};disableTrainingButtons(){this.#u.disabled=!0,this.#e.disabled=!0}enableTrainingButtons(){this.#u.disabled=!1,this.#e.disabled=!1}handleTrainingStopped(){this.#l=!1,this.#u.disabled=!1,m(this.step??1,!0,y("trainModel"))}getTrainingInputs(){return[this.#p,this.getTrainingData(),this.getValidationData(),this.getCallbacks(),this.#n]}async onTrainingClick(){const[t,e,n,o,r]=this.getTrainingInputs();t&&(t.stopTraining=!1,this.#l=!0,this.#i=1,this.#u.disabled=!0,await K(t,e,n,o,r,this.#o))}set trainingEnabled(t){this.#l=t}}const ot=`
function createModel(classes: string[]):LayersModel {
 
  const model = tf.sequential({
    layers: [
 
      tf.layers.dense({ inputShape: [/*\u2728INSERT_HERE\u2728*/], units: /*\u2728INSERT_HERE\u2728*/, activation: 'relu' }),

      tf.layers.dense({ units: /*\u2728INSERT_HERE\u2728*/, activation: 'relu' }),

      tf.layers.dense({ units: /*\u2728INSERT_HERE\u2728*/, activation: 'softmax' }),
    ],
  });

  model.compile({

    optimizer:  /*\u2728INSERT_HERE\u2728*/, // optimizer options: 'sgd', 'adam', 'adamax', 'momentum'

    loss:  /*\u2728INSERT_HERE\u2728*/, // loss options: 'categoricalCrossentropy' , 'binaryCrossentropy'

    metrics: ['accuracy'],
  });

  return model;
}
`,st=`
function createModelSolution(classes: string[]):LayersModel {
  // Create a feed-forward model using the tf.sequential (https://js.tensorflow.org/api/latest/#sequential)
  const model = tf.sequential({
    layers: [
      // Fill in the inputShape and units (hint this is equal to mediapipe hands output per image = 63)
      // Want to play with other activation functions, go for it!
      tf.layers.dense({ inputShape: [63], units: 63, activation: 'relu' }),
      // Fill in units (neurons) in range 100-300
      tf.layers.dense({ units: 256, activation: 'relu' }),
      // Add a final dense layer wtih number of neurons equal to classes (i.e classes.length )
      tf.layers.dense({ units: classes.length, activation: 'softmax' }),
    ],
  });

  model.compile({
    // Adam changes the learning rate over time which is useful.
    // https://js.tensorflow.org/api/latest/#Training-Optimizers
    optimizer: 'adam', //optimizer options: 'sgd', 'momentum', 'adagrad', 'ada', 'adam', 'adamax', 'rmsprop'

    // Use the correct loss function. https://js.tensorflow.org/api/latest/#Training-Losses
    // If 2 classes of data, use 'binaryCrossentropy' else use 'categoricalCrossentropy' if more than 2 classes and output of our model is a probability distribution.
    loss: 'categoricalCrossentropy',
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: ['accuracy'],
  });

  /* Uncomment below statement to check the output. */
  // console.log(model.summary())

  return model;
}`,at=`
function createModel(classes: string[]):LayersModel {

  const model = tf.sequential({

    layers: [

      tf.layers.dense({ inputShape: [63], units: 63, activation: 'relu' }),

      tf.layers.dense({ units: 256, activation: 'relu' }),

      tf.layers.dense({ units: classes.length, activation: 'softmax' }),
    ],
  });

  model.compile({
  
    optimizer: 'adam',  // optimizer options: 'sgd', 'adam', 'adamax', 'momentum'

    loss: 'categoricalCrossentropy', // loss options: 'categoricalCrossentropy' , 'binaryCrossentropy'
    
    metrics: ['accuracy'],
  });

  return model;
}`;function rt(i){return new Function("classes","tf","tfjs",`return (${i.replace(/export/g,"")})`)(f,c,c)}async function lt(i){let t;try{if(t=await i(f),!t)return p(`"We couldn't find your model. Did you implement createModel function? If so, check that you return your model`)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:w.Unknown,detail:n}]}}return{valid:!0,errors:[],data:[t]}}const dt=Object.freeze(Object.defineProperty({__proto__:null,template:ot,solution:st,solve:at,implementation:rt,validate:lt},Symbol.toStringTag,{value:"Module"})),ut=`
// READ-ONLY
async function exportModel(model: LayersModel, ArrayBufferModelSaverInstance,  download: (filename: string, data: string)=> void): Promise<void> {
    // checkout https://www.tensorflow.org/js/guide/save_load for info on the async method 'save'
    // We can save the topology and weights of a model
    // Topology: This is a file describing the architecture of a model (i.e. what operations it uses). It contains references to the models's weights which are stored externally.
    // Weights: These are binary files that store the weights of a given model in an efficient format. They are generally stored in the same folder as the topology.


    // save to localstorage or downloads
    await model.save('localstorage://model');

    // custom Logic to save as zip folder

    const zip = new JSZip();
    const files = await model.save(ArrayBufferModelSaverInstance);
    const f = files as unknown as { data: { [key: string]: ArrayBuffer } };
  
    Object.keys(f.data).forEach((fileName, index) => {
      if (index === 0) {
        zip.file(fileName, JSON.stringify(f.data[fileName]));
      } else {
        zip.file(fileName, f.data[fileName]);
      }
    });

    // download to zip file for upload in part 2 of the tutorial

    await zip.generateAsync({ type: 'base64' }).then(
      function (base64) {
        download('model.zip', base64);
      },
      function (error) {
        console.warn(error);
      },
    );
    
}
`,ct=`
// READ-ONLY
async function exportModel(model: LayersModel, ArrayBufferModelSaverInstance,  download: (filename: string, data: string)=> void): Promise<void> {
    // checkout https://www.tensorflow.org/js/guide/save_load for info on the async method 'save'
    // We can save the topology and weights of a model
    // Topology: This is a file describing the architecture of a model (i.e. what operations it uses). It contains references to the models's weights which are stored externally.
    // Weights: These are binary files that store the weights of a given model in an efficient format. They are generally stored in the same folder as the topology.


    // save to localstorage or downloads
    await model.save('localstorage://model');

    // custom Logic to save as zip folder

    const zip = new JSZip();
    const files = await model.save(ArrayBufferModelSaverInstance);
    const f = files as unknown as { data: { [key: string]: ArrayBuffer } };
  
    Object.keys(f.data).forEach((fileName, index) => {
      if (index === 0) {
        zip.file(fileName, JSON.stringify(f.data[fileName]));
      } else {
        zip.file(fileName, f.data[fileName]);
      }
    });

    // download to zip file for upload in part 2 of the tutorial

    await zip.generateAsync({ type: 'base64' }).then(
      function (base64) {
        download('model.zip', base64);
      },
      function (error) {
        console.warn(error);
      },
    );
    
}
`;function pt(i,t,e,n){return new Function("model","ArrayBufferModelSaver","download","tf","tfjs","JSZip",`return (${i.replace(/export/g,"")})`)(t,e,n,c,c,x,S)}async function ht(i,t){try{await i(t,new S,A)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:w.Unknown,detail:n}]}}return{valid:!0,errors:[]}}const mt=Object.freeze(Object.defineProperty({__proto__:null,template:ut,solution:ct,implementation:pt,validate:ht},Symbol.toStringTag,{value:"Module"})),ft=`
// READ-ONLY
async function loadTensorData(
  loadTensors: (folder: jsZipInstance) => Promise<{ [key: string]: number[][] }>,
  assetURL: string,
  applyOneHotEncoding: (data: {  [key: string]: number[][]}) => { inputs: number[][]; outputs: number[][] },
  splitTrainingData: (
    X: number[][],
    Y: number[][],
  ) => [number[][], number[][], number[][], number[][]],

): Promise<[number[][], number[][], number[][], number[][]]> {
  
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  const zipFolder = await jszip.loadAsync(zippedModelBuffer);

  const data = await loadTensors(zipFolder);

  // Check inspector to view data
  console.log("data", data)

  const { inputs, outputs } = applyOneHotEncoding(data);
  return splitTrainingData(inputs, outputs);
}
`,gt=`
// READ-ONLY
// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets. Encodes Y-values (letter names) using one-hot encoding
// shuffles and splits data into training, validation, test sets
async function loadTensorData(
  loadTensors: (folder: jsZipInstance) => Promise<{ [key: string]: number[][] }>,
  assetURL: string,
  applyOneHotEncoding: (data: {  [key: string]: number[][]}) => { inputs: number[][]; outputs: number[][] },
  splitTrainingData: (
    X: number[][],
    Y: number[][],
  ) => [number[][], number[][], number[][], number[][]],

): Promise<[number[][], number[][], number[][], number[][]]> {
  // Fetch pre-processed data, data is extracted using mediapipe hands model
  // https://google.github.io/mediapipe/solutions/hands.html from this dataset: 
  // https://www.kaggle.com/datasets/grassknoted/asl-alphabet
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer();
  const zipFolder = await jszip.loadAsync(zippedModelBuffer);
  const data = await loadTensors(zipFolder);
  // Check inspector to view data
  console.log("data", data)

  // apply one-hot encoding function below
  const { inputs, outputs } = applyOneHotEncoding(data);
  // take the results from one-hot encoding and split data
  return splitTrainingData(inputs, outputs);
}
`;function yt(i){return new Function("loadAsync","jszip","jsZipInstance","tf","tfjs","assetURL","applyOneHotEncoding","splitTrainingData",`return (${i.replace(/export/g,"")})`)(E,B,B,c,c,T,z,L)}async function bt(i){let t;try{if(t=await i(E,T,z,L),!t||t.length<4)return p(`
          data did not load
      `)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:w.Unknown,detail:n}]}}return{valid:!0,errors:[],data:[t]}}const wt=Object.freeze(Object.defineProperty({__proto__:null,template:ft,solution:gt,implementation:yt,validate:bt},Symbol.toStringTag,{value:"Module"})),vt=`

async function trainModel(
  model: LayersModel, 
  trainingData: { inputs: number[][]; outputs: number[][] },
  validationData: { inputs: number[][]; outputs: number[][] },
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 5
): Promise<History> {

  const inputs = tf.tensor(trainingData.inputs);
  const outputs = tf.tensor(trainingData.outputs);
  const inputValidation = tf.tensor(validationData.inputs);
  const outputValidation = tf.tensor(validationData.outputs);

  const modelHistory = await model.fit( /*\u2728INSERT_HERE\u2728*/, /*\u2728INSERT_HERE\u2728*/, {
    epochs: numEpochs, // default = 5 
    batchSize: 128, 
    verbose: 1,
    validationData: [/*\u2728INSERT_HERE\u2728*/, /*\u2728INSERT_HERE\u2728*/],
    callbacks: callbacks
   });

  inputs.dispose()
  outputs.dispose()
  inputValidation.dispose()
  outputValidation.dispose() 

  return modelHistory
}

`,St=`
 async function trainModelSolution(
  model: LayersModel,
  trainingData: { inputs: number[][]; outputs: number[][] },
  validationData: { inputs: number[][]; outputs: number[][] },
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 3,
): Promise<History> {

  const inputs = tf.tensor(trainingData.inputs);
  const outputs = tf.tensor(trainingData.outputs);
  const inputValidation = tf.tensor(validationData.inputs);
  const outputValidation = tf.tensor(validationData.outputs);

  // Since our data fits in memory, we can use the model.fit() api. 
  // https://js.tensorflow.org/api/latest/#tf.LayersModel.fit
  const modelHistory = await model.fit(inputs, outputs, {
    epochs: numEpochs, 
    batchSize: 128,
    verbose: 1,
    validationData: [inputValidation, outputValidation],
    callbacks: callbacks
  });
  
  // Free up memory resources by cleaning up intermediate tensors (i.e the tensors above)
  inputs.dispose()
  outputs.dispose()
  inputValidation.dispose()
  outputValidation.dispose() 
  
  return modelHistory
}

/* 
Under the hood, model.fit() can do a lot for us:

 Splits the data into a train and validation set, and uses the validation set to measure progress during training.
 Shuffles the data but only after the split. To be safe, you should pre-shuffle the data before passing it to fit().
 Splits the large data tensor into smaller tensors of size batchSize.
 Calls optimizer.minimize() while computing the loss of the model with respect to the batch of data.
 It can notify you on the start and end of each epoch or batch. In our case, we are notified at the end of every batch using the callbacks.onBatchEndoption. Other options include: onTrainBegin, onTrainEnd, onEpochBegin, onEpochEnd and onBatchBegin.
 It yields to the main thread to ensure that tasks queued in the JS event loop can be handled in a timely manner.
 Read more: https://www.tensorflow.org/js/guide/train_models
*/


`,Et=`

async function trainModel(
  model: LayersModel,
  trainingData: { inputs: number[][]; outputs: number[][] },
  validationData: { inputs: number[][]; outputs: number[][] },
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 5
): Promise<History> {

  const inputs = tf.tensor(trainingData.inputs);
  const outputs = tf.tensor(trainingData.outputs);
  const inputValidation = tf.tensor(validationData.inputs);
  const outputValidation = tf.tensor(validationData.outputs);

  const modelHistory = await model.fit(inputs, outputs, {
    epochs: numEpochs, 
    batchSize: 128,
    verbose: 1,
    validationData: [inputValidation, outputValidation],
    callbacks: callbacks
  });

  inputs.dispose()
  outputs.dispose()
  inputValidation.dispose()
  outputValidation.dispose() 

  return modelHistory
}

`;function Tt(i,t,e,n,o,r){return new Function("model","trainingData","validationData","callbacks","numEpochs","tf","tfjs",`return (${i.replace(/export/g,"")})`)(t,e,n,o,r,c,c)}async function Mt(i,t,e,n,o,r){let s;try{if(!t)return p(`
      Missing model. Please make sure model was created in previous step. 
      `);if(!e||!n)return p(`
      Missing data. Please make sure data is loaded in step 1.'
      `);const l={};if(l.fit=(h,N,O)=>new Promise(F=>F({epoch:[0],history:{},params:O,validationData:null,input:h,output:N})),s=await i(l,e,n,o,r),s)if(s.params){if(!s.input||!s.output)return p(`
      Model.fit() requires input and output to defined parameters.'
      `)}else return p(`
      Looks like you didn't put any parameters in your fit function'
      `);else return p(`
      Looks like you didn't return anything. Please return value from model.fit()'
      `)}catch(l){const h=`${JSON.stringify(l)}`;return{valid:!1,errors:[{type:w.Unknown,detail:h}]}}const d=s?s.params?.batchSize:128,u=s?s.params?.epochs:5;return{valid:!0,errors:[],data:[d,u]}}const kt=Object.freeze(Object.defineProperty({__proto__:null,template:vt,solution:St,solve:Et,implementation:Tt,validate:Mt},Symbol.toStringTag,{value:"Module"})),v={createModel:dt,exportModel:mt,trainModel:kt,loadData:wt};class Ct{#n=a(".training-feedback-container");#o=a("#solution-tab");#i=a(".train-button");#t=a(".reset-button");#s=a(".training-stop-button");#l=a(".training-start-button");#a=a(".download-button");#d=a(".solve-button");showTrainingButtons(){this.#l.style.display="inline-flex",this.#s.style.display="inline-flex"}hideTrainingButtons(){this.#s.style.display="none",this.#l.style.display="none",this.#n.style.display="none"}showTrainingOutput(){this.#n.style.display="inline-block"}hideTrainingOutput(){this.#n.style.display="none"}showDownload(){this.#a.style.display="inline-flex"}hideDownload(){this.#a.style.display="none"}hideCodeButtons(){this.#t.style.display="none",this.#d.style.display="none",this.#o.style.display="none"}showCodeButtons(){this.#t.style.display="inline-flex",this.#d.style.display="inline-flex",this.#o.style.display="inline-flex"}hideNextButton(){this.#i.style.display="none"}showNextButton(){this.#i.style.display="inline-flex"}showInstructions(t){const e=a(`#${t}-image`);e.style.display="flex"}hideInstructions(t){const e=a(`#${t}-image`);e.style.display="none"}}function Bt(i){const t=document.querySelector(`#tutorial-step${i}`);t&&(t.style.fontWeight="bold")}function Dt(i){const t=document.querySelector(`#tutorial-step${i}`);t&&(t.style.fontWeight="revert")}let It=()=>({events:{},emit(i,...t){let e=this.events[i]||[];for(let n=0,o=e.length;n<o;n++)e[n](...t)},on(i,t){return this.events[i]?.push(t)||(this.events[i]=[t]),()=>{this.events[i]=this.events[i]?.filter(e=>t!==e)}}});const b="validated",xt="validationInProgress",I="validationComplete";class zt{#n=0;#o;#i;#t;#s=!1;#l=[];#a;#d;#u;#e;constructor(t){this.#n=t.stepCount??0,this.#o=t.stepRecord,this.#i=t.element,this.#t=t.name,this.#d=localStorage.getItem(`build-ts:${this.#t}`),this.#u=t.solutionElement,this.#a=It(),this.setEventListener()}set show(t){t?(this.#i.setAttribute("style","display: flex;width: 100%;height:calc(100vw / 2)"),this.showSolution(!0)):(this.#i.setAttribute("style","display:none;"),this.showSolution(!1))}showSolution(t){this.#u&&(t?this.#u.setAttribute("style","display: flex;width: 100%;height:calc(100vw / 2)"):this.#u.setAttribute("style","display:none;"))}set code(t){this.#i.setAttribute("code",t)}set allowBackgroundExecution(t){this.#i.toggleAttribute("allow-background-execution",t)}set readonly(t){this.#i.toggleAttribute("readonly",t)}get solutionElement(){return this.#u}get stepCount(){return this.#n}resetCodeToDefault(){this.code=this.#o.template,localStorage.removeItem(`build:${this.#t}`),localStorage.removeItem(`build-ts:${this.#t}`),this.#d=null,this.#s=!1}solve(){this.code=this.#o.solve??this.#o.solution}on(t,e){return this.#a.on(t,e)}set overrideEventListener(t){this.#e=t}setEventListener(){this.#i.addEventListener("change",async t=>{const e=t,n=!e.detail.hasSyntaxErrors,o=e.detail.transpiledCode;n?(localStorage.setItem(`build-ts:${this.#t}`,e.detail.transpiledCode),localStorage.setItem(`build:${this.#t}`,e.detail.code),this.#d=e.detail.transpiledCode,this.#e||await this.handleEvalInput(o)):this.#a.emit(I,this.#t,this.#n,!1)})}set funcInput(t){this.#l=t}setCodeFromCacheOrDefault(){const t=localStorage.getItem(`build:${this.#t}`),e=t&&t.length>0?t:this.#o.template;this.code=e}async runCachedCode(){try{this.#d&&await this.handleEvalInput(this.#d)}catch(t){console.warn(t)}}async handleEvalInput(t){this.#a.emit(xt,this.#t,this.#n);const e=t??this.#i.getAttribute("code")??"",n=this.#o.implementation(e,...this.#l);if(this.#o.validate)try{const o=await this.#o.validate(n,...this.#l);this.#i.setAttribute("validation-issues",JSON.stringify(o.valid?[]:o.errors)),this.#s=o.valid,this.#s&&this.#a.emit(b,o)}catch(o){console.log(o)}this.#a.emit(I,this.#t,this.#n,this.#s)}get isValid(){return this.#s}}const Lt=M;class At{#n=!1;#o=a("#output-element");#i=document.querySelectorAll("code-step");#t=a(".train-button");#s=a(".reset-button");#l=a(".training-stop-button");#a=a(".training-start-button");#d=a(".download-button");#u=a(".solve-button");#e=new it;#r=new Ct;#c={};init(){this.#t.disabled=!0,this.#t.onclick=this.handleNextButtonClick,this.#s.onclick=this.handleResetButtonClick,this.#l.onclick=this.handleStopTrainingClick,this.#a.onclick=this.handlestartTrainingClick,this.#d.onclick=this.handleDownloadClick,this.#u.onclick=this.handleSolveClick,this.mapCodeSteps()}mapCodeSteps(){const t=Object.keys(v).reduce((e,n)=>(e[n]={valid:!1,...v[n]},e),{});this.initCodeSteps(t)}initCodeSteps(t){const e={};this.#i.forEach(n=>{const o=n.getAttribute("name")??"";if(/-solution/.test(o)){const s=o.replace("-solution","");e[s]=n}}),this.#i.forEach(n=>{const o=n.getAttribute("name")??"",r=n.getAttribute("step")??"",s=v[o];if(o&&s){const d=t[o];let u;e[o]&&(u=e[o],u.setAttribute("code",d.solution),u.toggleAttribute("readonly",!0));const l=new zt({stepRecord:d,element:n,name:o,stepCount:+r,solutionElement:u});switch(this.#c[o]=l,o){case"loadData":l.funcInput=[E,T],l.on(b,this.#e.handleDataSplitValidation);break;case"createModel":l.funcInput=[c,f],l.on(b,this.#e.handleModelCreation);break;case"trainModel":l.on(b,this.#e.handleTrainValidation);break}l.setCodeFromCacheOrDefault(),l.on("validationComplete",this.#e.handleValidationComplete)}})}handleResetButtonClick=()=>{const t=this.#e.currentStep?.name??"",e=this.#c[t];e.resetCodeToDefault(),this.#r.hideTrainingOutput(),this.#t.disabled=!0,et(e.stepCount)};handleSolveClick=()=>{const t=this.#e.currentStep?.name??"",e=this.#c[t];e&&e.solve()};handleStopTrainingClick=()=>{this.#e.handleTrainingStopped(),this.#t.disabled=!1};handleNextButtonClick=async()=>{const e=(this.#e.step??1)+1;window.location.hash=`#step${e}`,await this.onStepChange(e)};async onStepChange(t){const e=this.#e.stepName;if(e){this.#n&&this.toggleSolution(!1,e),this.#r.hideInstructions(e);const n=this.#c[e];Dt(n.stepCount),n.show=!1}_(),await this.setCurrentStep(t)}handleSolutionButtonClick=()=>{const t=!this.#n,e=this.#e.stepName??"";this.toggleSolution(t,e)};toggleSolution(t,e){this.#n=t,this.#c[e].showSolution(t)}handlestartTrainingClick=async()=>{this.#t.disabled=!0,await this.#e.onTrainingClick()};handleDownloadClick=async()=>{await this.#e.onDownload()};async handleStepChange(t,e="false"){const n=this.#c[t];n?(this.#r.showInstructions(t),e&&(n.readonly=e==="true"),t==="trainModel"?(n.funcInput=this.#e.getTrainingInputs(),this.#r.showTrainingButtons(),this.#e.disableTrainingButtons()):this.#r.hideTrainingButtons(),e==="true"?this.#r.hideCodeButtons():this.#r.showCodeButtons(),t==="exportModel"?(n.funcInput=[this.#e.aslModel,c],this.#r.showDownload(),this.#r.hideNextButton(),n.overrideEventListener=!0):(this.#r.hideDownload(),this.#r.showNextButton(),await n.runCachedCode()),n.show=!0):console.error(`Instance of StepViewer for ${t} is not found`)}async setCurrentStep(t){const e=Lt.trainTutorialSteps.find(n=>n.step===t);if(e!=null){this.#e.currentStep=e;const n=e.step;Bt(n),this.#o.innerHTML=`${n}. ${e.description} `,await this.handleStepChange(e.name,e.readOnly)}}}j("build");const k=new At;k.init();function R(){return+((window.location.hash??null).replace("#step","")||"1")}window.addEventListener("hashchange",()=>k.onStepChange(R()));k.onStepChange(R());
