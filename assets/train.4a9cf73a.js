import{J as x,A as S,k as g,a as f,m as C,n as s,o as H,t as u,e as p,V as w,p as E,q as B,r as T,s as j}from"./utils.42908397.js";import"./WebcamSelector.e687d297.js";const P="ASL Fingerspelling Model Tutorial",q="Train ASL Fingerspelling ML Model using Tensorflowjs",U="ASL Fingerspelling Tutorial \u{1F44B}",J="",W="images/ghc_logo_v4.svg",Y="Grace Hopper Celebration",Z={github:"https://github.com/ahoak/asl-client-ml-tutorial",twitter:"https://twitter.com/amber_hoak"},X=!1,Q=[{step:1,description:"Load Data",helperText:"Load preprocessed data by pressing the button",name:"loadData",readOnly:"true",imageLink:"instructions/loadData.png"},{step:2,description:"Create and Configure Model",helperText:"creating a feed-forward model. We will use 5 layers with relu activation function. Function must return the model.",name:"createModel",readOnly:"false",imageLink:"instructions/createModel.png"},{step:3,description:"Train Model",helperText:"edit function trainModel() by using the Tf.fit API. Set the following parameters: epochs, batchSize,validationData, callbacks. Hint, you may need to transform your data into tensors ",name:"trainModel",readOnly:"false",imageLink:"instructions/trainModel.png"},{step:4,description:"Download Model Files",helperText:"Click the button to download your shiney new model. We will use this in our webapp.",name:"exportModel",readOnly:"true",imageLink:"instructions/exportModel.png"}],G=[{step:1,description:"Import Model",helperText:"Import a pre-trained model to perform inference with."},{step:2,description:"Extract and Process Joint Positions",helperText:"Extract the hand joint positions from within an image."},{step:3,description:"Classify",helperText:"Run inference with the normalized joint positions to get a classification (ASL sign)."},{step:4,description:"Run",helperText:"Run prediction on the model"}],K={metaTitle:P,metaDescription:q,name:U,theme:J,avatarImage:W,avatarImageAlt:Y,social:Z,showDataVideo:X,trainTutorialSteps:Q,predictSteps:G};function z(o){const t=[],e=[],n=f.reduce((i,r,a)=>(i[r]=Array.from({length:f.length}).fill(0),i[r][a]=1,i),{});return Object.keys(o).forEach(i=>{const r=o[i],a=n[i];r.forEach(d=>{t.push(d),e.push(a)})}),{inputs:t,outputs:e}}function L(o,t){const[e,,n]=C(o,t,{testSize:.1,randomState:42}),[i,r,a,d]=C(e,n,{testSize:.1,randomState:42});return[i,r,a,d]}function A(o,t){const e=document.createElement("a");e.setAttribute("href","data:application/zip;base64,"+t),e.setAttribute("download",o),e.style.display="none",document.body.appendChild(e),e.click(),document.body.removeChild(e)}async function tt(o){await o.save("localstorage://model"),console.log("model saved to localstorage!");const t=new x,n=await o.save(new S);Object.keys(n.data).forEach((i,r)=>{r===0?t.file(i,JSON.stringify(n.data[i])):t.file(i,n.data[i])}),await t.generateAsync({type:"base64"}).then(function(i){A("model.zip",i)},function(i){console.warn(i)})}async function et(o,t,e,n,i=5,r=128){if(!o||!t||!e)return new Error("missing parameter for trainModel");const a=g(t.inputs),d=g(t.outputs),c=g(e.inputs),l=g(e.outputs),h=await o.fit(a,d,{epochs:i,batchSize:r,verbose:1,validationData:[c,l],callbacks:n});return a.dispose(),d.dispose(),c.dispose(),l.dispose(),h}const nt=".loading-element",V=".train-button",_="#validation-status";function m(o,t,e){const n=s(_);n.innerHTML=e;const i=s(nt);if(i.style.visibility="hidden",k(o,t),t){const r=s(V);r.disabled=!1}}function it(o){k(o,null),R()}function R(){const o=s(_);o.innerHTML="";const t=s(V);t.disabled=!0}const ot=new Map([["loadData","\u2714\uFE0F Data loaded \u{1F4BE}"],["createModel","\u2714\uFE0F Yay! Model created! \u{1F389}"],["trainModel","\u2714\uFE0F Training complete!\u{1F45F}"],["exportModel",'\u2714\uFE0F Downloaded! Time to make some <a href="/predict#step1">predictions</a> \u{1F57A}']]);function y(o){return ot.get(o)??""}function k(o,t){const e=s(`#tutorial-step${o}`);e?.classList.toggle("valid",t!=null&&t),e?.classList.toggle("invalid",t!=null&&!t)}const D=5;class st{#n=D;#o=128;#i=1;#t=0;#s;#d=!0;#r=s(".training-feedback-container");#u=s(".training-progress-bar");#a=s(".training-start-button");#e=s(".training-stop-button");#l={};#c;#p;constructor(t){this.#n=t?.epochs??D}set aslModel(t){this.#p=t}get aslModel(){return this.#p}set currentStep(t){this.#s=t}get currentStep(){return this.#s}get step(){return this.#s?.step}get stepName(){return this.#s?.name}get epochs(){return this.#n}completedValidation(t,e){this.#l[t]=e}getCompletedState(t){return this.#l[t]??!1}handleReset(t){t==="createModel"&&(this.#p=void 0),this.completedValidation(t,!1)}getTrainingData(){if(this.#c){const[t,,e]=this.#c;return{inputs:t,outputs:e}}}getValidationData(){if(this.#c){const[,t,,e]=this.#c;return{inputs:t,outputs:e}}}handleModelResults=t=>{t.valid&&t.data&&t.data.length>0&&(this.#p=t.data[0])};handleModelCreation=t=>{t.valid&&t.data&&t.data.length>0?this.#p=t.data[0]:console.log("no data provided to ModelBuilder, please retry load data function")};handleDataSplitValidation=t=>{t.valid&&t.data&&t.data.length>0?this.#c=t.data[0]:console.log("no data provided to ModelBuilder, please retry load data function")};handleTrainValidation=t=>{if(t.valid&&t.data&&t.data.length>0){const[e,n]=t.data;this.#o=e,this.#n=n}else console.log("no data provided to ModelBuilder, please retry load data function")};onBatchEnd=(t,e)=>{this.#r.style.display="inline-block",!this.#d&&this.#p&&(this.#p.stopTraining=!0),this.#r.innerHTML=`
      Epoch: ${this.#i} Batch: ${t}
      <br>
      Loss: ${e?.loss.toFixed(3)??""}
      <br>
      Accuracy: ${e?.acc.toFixed(3)??""}
      <br>
      `};async onDownload(){const t=this.#p;t?(await tt(t),m(this.step??1,!0,y("exportModel"))):m(this.step??1,!1,"no model loaded")}onEpochEnd=t=>{const e=Date.now()-this.#t;this.#i=t+2;const n=this.#n-t,i=e*n,[r,a]=H(i);this.#u.innerHTML=`${r} ${a?"minutes":"seconds"} remaining`,this.#t=Date.now(),t===this.#n-1&&m(this.step??1,!0,y("trainModel"))};getCallbacks(){return{onBatchEnd:this.onBatchEnd,onEpochEnd:this.onEpochEnd}}handleValidationComplete=(t,e,n)=>{if(this.#s?.step===e){const i=n?y(t):"validation failed";n&&t==="trainModel"?this.enableTrainingButtons():this.disableTrainingButtons(),t==="trainModel"?k(e,n):t!=="exportModel"&&m(e,n,i)}};disableTrainingButtons(){this.#a.disabled=!0,this.#e.disabled=!0}enableTrainingButtons(){this.#a.disabled=!1,this.#e.disabled=!1}handleTrainingStopped(){this.#d=!1,this.#a.disabled=!1,m(this.step??1,!0,y("trainModel"))}getTrainingInputs(){return[this.#p,this.getTrainingData(),this.getValidationData(),this.getCallbacks(),this.#n]}async onTrainingClick(){const[t,e,n,i,r]=this.getTrainingInputs();t&&(t.stopTraining=!1,this.#d=!0,this.#i=1,this.#a.disabled=!0,await et(t,e,n,i,r,this.#o))}set trainingEnabled(t){this.#d=t}}const at=`
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
`,rt=`
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
}`,lt=`
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
}`;function dt(o){return new Function("classes","tf","tfjs",`return (${o.replace(/export/g,"")})`)(f,u,u)}async function ut(o){let t;try{if(t=await o(f),!t)return p(`"We couldn't find your model. Did you implement createModel function? If so, check that you return your model`)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:w.Unknown,detail:n}]}}return{valid:!0,errors:[],data:[t]}}const ct=Object.freeze(Object.defineProperty({__proto__:null,template:at,solution:rt,solve:lt,implementation:dt,validate:ut},Symbol.toStringTag,{value:"Module"})),pt=`
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
`,ht=`
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
`;function mt(o,t,e,n){return new Function("model","ArrayBufferModelSaver","download","tf","tfjs","JSZip",`return (${o.replace(/export/g,"")})`)(t,e,n,u,u,x,S)}async function ft(o,t){try{await o(t,new S,A)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:w.Unknown,detail:n}]}}return{valid:!0,errors:[]}}const gt=Object.freeze(Object.defineProperty({__proto__:null,template:pt,solution:ht,implementation:mt,validate:ft},Symbol.toStringTag,{value:"Module"})),yt=`
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
`,bt=`
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
`;function wt(o){return new Function("loadAsync","jszip","jsZipInstance","tf","tfjs","assetURL","applyOneHotEncoding","splitTrainingData",`return (${o.replace(/export/g,"")})`)(E,B,B,u,u,T,z,L)}async function vt(o){let t;try{if(t=await o(E,T,z,L),!t||t.length<4)return p(`
          data did not load
      `)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:w.Unknown,detail:n}]}}return{valid:!0,errors:[],data:[t]}}const St=Object.freeze(Object.defineProperty({__proto__:null,template:yt,solution:bt,implementation:wt,validate:vt},Symbol.toStringTag,{value:"Module"})),Et=`

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

`,Tt=`
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


`,kt=`

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

`;function Mt(o,t,e,n,i,r){return new Function("model","trainingData","validationData","callbacks","numEpochs","tf","tfjs",`return (${o.replace(/export/g,"")})`)(t,e,n,i,r,u,u)}async function Ct(o,t,e,n,i,r){let a;try{if(!t)return p(`
      Missing model. Please make sure model was created in previous step. 
      `);if(!e||!n)return p(`
      Missing data. Please make sure data is loaded in step 1.'
      `);const l={};if(l.fit=(h,N,O)=>new Promise(F=>F({epoch:[0],history:{},params:O,validationData:null,input:h,output:N})),a=await o(l,e,n,i,r),a)if(a.params){if(!a.input||!a.output)return p(`
      Model.fit() requires input and output to defined parameters.'
      `)}else return p(`
      Looks like you didn't put any parameters in your fit function'
      `);else return p(`
      Looks like you didn't return anything. Please return value from model.fit()'
      `)}catch(l){const h=`${JSON.stringify(l)}`;return{valid:!1,errors:[{type:w.Unknown,detail:h}]}}const d=a?a.params?.batchSize:128,c=a?a.params?.epochs:5;return{valid:!0,errors:[],data:[d,c]}}const Bt=Object.freeze(Object.defineProperty({__proto__:null,template:Et,solution:Tt,solve:kt,implementation:Mt,validate:Ct},Symbol.toStringTag,{value:"Module"})),v={createModel:ct,exportModel:gt,trainModel:Bt,loadData:St};class Dt{#n=s(".training-feedback-container");#o=s("#solution-tab");#i=s(".train-button");#t=s(".reset-button");#s=s(".training-stop-button");#d=s(".training-start-button");#r=s(".download-button");#u=s(".solve-button");showTrainingButtons(){this.#d.style.display="inline-flex",this.#s.style.display="inline-flex"}hideTrainingButtons(){this.#s.style.display="none",this.#d.style.display="none",this.#n.style.display="none"}showTrainingOutput(){this.#n.style.display="inline-block"}hideTrainingOutput(){this.#n.style.display="none"}showDownload(){this.#r.style.display="inline-flex"}hideDownload(){this.#r.style.display="none"}hideCodeButtons(){this.#t.style.display="none",this.#u.style.display="none",this.#a(this.#o,!1)}showCodeButtons(){this.#t.style.display="inline-flex",this.#u.style.display="inline-flex",this.#a(this.#o,!0)}hideNextButton(){this.#i.style.display="none"}showNextButton(){this.#i.style.display="inline-flex"}showInstructions(t){const e=s(`#${t}-image`);e.style.display="block"}hideInstructions(t){const e=s(`#${t}-image`);e.style.display="none"}#a(t,e){t.style.display=e?"inline-flex":"none",t.toggleAttribute("disabled",!e)}}function It(o){const t=document.querySelector(`#tutorial-step${o}`);t&&(t.style.fontWeight="bold")}function xt(o){const t=document.querySelector(`#tutorial-step${o}`);t&&(t.style.fontWeight="revert")}let zt=()=>({events:{},emit(o,...t){let e=this.events[o]||[];for(let n=0,i=e.length;n<i;n++)e[n](...t)},on(o,t){return this.events[o]?.push(t)||(this.events[o]=[t]),()=>{this.events[o]=this.events[o]?.filter(e=>t!==e)}}});const b="validated",Lt="validationInProgress",I="validationComplete";class At{#n=0;#o;#i;#t;#s=!1;#d=[];#r;#u;#a;#e;constructor(t){this.#n=t.stepCount??0,this.#o=t.stepRecord,this.#i=t.element,this.#t=t.name,this.#u=localStorage.getItem(`build-ts:${this.#t}`),this.#a=t.solutionElement,this.#r=zt(),this.setEventListener()}set show(t){t?(this.#i.setAttribute("style","display: flex;width: 100%;height:calc(100vw / 2)"),this.showSolution(!0)):(this.#i.setAttribute("style","display:none;"),this.showSolution(!1))}showSolution(t){this.#a&&(t?this.#a.setAttribute("style","display: flex;width: 100%;height:calc(100vw / 2)"):this.#a.setAttribute("style","display:none;"))}set code(t){this.#i.setAttribute("code",t)}set allowBackgroundExecution(t){this.#i.toggleAttribute("allow-background-execution",t)}set readonly(t){this.#i.toggleAttribute("readonly",t)}get solutionElement(){return this.#a}get stepCount(){return this.#n}resetCodeToDefault(){this.code=this.#o.template,localStorage.removeItem(`build:${this.#t}`),localStorage.removeItem(`build-ts:${this.#t}`),this.#u=null,this.#s=!1}solve(){this.code=this.#o.solve??this.#o.solution}on(t,e){return this.#r.on(t,e)}set overrideEventListener(t){this.#e=t}setEventListener(){this.#i.addEventListener("change",async t=>{const e=t,n=!e.detail.hasSyntaxErrors,i=e.detail.transpiledCode;n?(localStorage.setItem(`build-ts:${this.#t}`,e.detail.transpiledCode),localStorage.setItem(`build:${this.#t}`,e.detail.code),this.#u=e.detail.transpiledCode,this.#e||await this.handleEvalInput(i)):this.#r.emit(I,this.#t,this.#n,!1)})}set funcInput(t){this.#d=t}setCodeFromCacheOrDefault(){const t=localStorage.getItem(`build:${this.#t}`),e=t&&t.length>0?t:this.#o.template;this.code=e}async runCachedCode(){try{this.#u&&await this.handleEvalInput(this.#u)}catch(t){console.warn(t)}}async handleEvalInput(t){this.#r.emit(Lt,this.#t,this.#n);const e=t??this.#i.getAttribute("code")??"",n=this.#o.implementation(e,...this.#d);if(this.#o.validate)try{const i=await this.#o.validate(n,...this.#d);this.#i.setAttribute("validation-issues",JSON.stringify(i.valid?[]:i.errors)),this.#s=i.valid,this.#s&&this.#r.emit(b,i)}catch(i){console.log(i)}this.#r.emit(I,this.#t,this.#n,this.#s)}get isValid(){return this.#s}}const Vt=K;class _t{#n=!1;#o=s("#output-element");#i=document.querySelectorAll("code-step");#t=s(".train-button");#s=s(".reset-button");#d=s(".training-stop-button");#r=s(".training-start-button");#u=s(".download-button");#a=s(".solve-button");#e=new st;#l=new Dt;#c={};init(){this.#t.disabled=!0,this.#t.onclick=this.handleNextButtonClick,this.#s.onclick=this.handleResetButtonClick,this.#d.onclick=this.handleStopTrainingClick,this.#r.onclick=this.handlestartTrainingClick,this.#u.onclick=this.handleDownloadClick,this.#a.onclick=this.handleSolveClick,this.mapCodeSteps()}mapCodeSteps(){const t=Object.keys(v).reduce((e,n)=>(e[n]={valid:!1,...v[n]},e),{});this.initCodeSteps(t)}initCodeSteps(t){const e={};this.#i.forEach(n=>{const i=n.getAttribute("name")??"";if(/-solution/.test(i)){const a=i.replace("-solution","");e[a]=n}}),this.#i.forEach(n=>{const i=n.getAttribute("name")??"",r=n.getAttribute("step")??"",a=v[i];if(i&&a){const d=t[i];let c;e[i]&&(c=e[i],c.setAttribute("code",d.solution),c.toggleAttribute("readonly",!0));const l=new At({stepRecord:d,element:n,name:i,stepCount:+r,solutionElement:c});switch(this.#c[i]=l,i){case"loadData":l.funcInput=[E,T],l.on(b,this.#e.handleDataSplitValidation);break;case"createModel":l.funcInput=[u,f],l.on(b,this.#e.handleModelCreation);break;case"trainModel":l.on(b,this.#e.handleTrainValidation);break}l.setCodeFromCacheOrDefault(),l.on("validationComplete",this.#e.handleValidationComplete)}})}handleResetButtonClick=()=>{const t=this.#e.currentStep?.name??"",e=this.#c[t];e.resetCodeToDefault(),this.#l.hideTrainingOutput(),this.#t.disabled=!0,it(e.stepCount)};handleSolveClick=()=>{const t=this.#e.currentStep?.name??"",e=this.#c[t];e&&e.solve()};handleStopTrainingClick=()=>{this.#e.handleTrainingStopped(),this.#t.disabled=!1};handleNextButtonClick=async()=>{const e=(this.#e.step??1)+1;window.location.hash=`#step${e}`,await this.onStepChange(e)};async onStepChange(t){const e=this.#e.stepName;if(e){this.#n&&this.toggleSolution(!1,e),this.#l.hideInstructions(e);const n=this.#c[e];xt(n.stepCount),n.show=!1}R(),await this.setCurrentStep(t)}handleSolutionButtonClick=()=>{const t=!this.#n,e=this.#e.stepName??"";this.toggleSolution(t,e)};toggleSolution(t,e){this.#n=t,this.#c[e].showSolution(t)}handlestartTrainingClick=async()=>{this.#t.disabled=!0,await this.#e.onTrainingClick()};handleDownloadClick=async()=>{await this.#e.onDownload()};async handleStepChange(t,e="false"){const n=this.#c[t];n?(this.#l.showInstructions(t),e&&(n.readonly=e==="true"),t==="trainModel"?(n.funcInput=this.#e.getTrainingInputs(),this.#l.showTrainingButtons(),this.#e.disableTrainingButtons()):this.#l.hideTrainingButtons(),e==="true"?this.#l.hideCodeButtons():this.#l.showCodeButtons(),t==="exportModel"?(n.funcInput=[this.#e.aslModel,u],this.#l.showDownload(),this.#l.hideNextButton(),n.overrideEventListener=!0):(this.#l.hideDownload(),this.#l.showNextButton(),await n.runCachedCode()),n.show=!0):console.error(`Instance of StepViewer for ${t} is not found`)}async setCurrentStep(t){const e=Vt.trainTutorialSteps.find(n=>n.step===t);if(e!=null){this.#e.currentStep=e;const n=e.step;It(n),this.#o.innerHTML=`${n}. ${e.description} `,await this.handleStepChange(e.name,e.readOnly)}}}j("build");const M=new _t;M.init();function $(){return+((window.location.hash??null).replace("#step","")||"1")}window.addEventListener("hashchange",()=>M.onStepChange($()));M.onStepChange($());
