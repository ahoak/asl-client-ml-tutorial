import{a as p,t as d,e as m,V as f,k as w,J as L,A as T,m as y,n as E,o as b,p as s,q as z,s as B}from"./utils.03e8e154.js";import"./VideoStreamViewer.0d21d2b1.js";const A="ASL Fingerspelling Model Tutorial",_="Train ASL Fingerspelling ML Model using Tensorflowjs",$="ASL Fingerspelling Tutorial \u{1F44B}",R="",F="",V={github:"https://github.com/ahoak/asl-client-ml-tutorial",twitter:"https://twitter.com/amber_hoak"},O=!1,j=[{step:1,description:"Load Data",helperText:"Load preprocessed data by pressing the button",name:"loadData",readOnly:"true",imageLink:"instructions/loadData.png"},{step:2,description:"Create and Configure Model",helperText:"creating a feed-forward model. We will use 5 layers with relu activation function. Function must return the model.",name:"createModel",readOnly:"false",imageLink:"instructions/createModel.png"},{step:3,description:"Train Model",helperText:"edit function trainModel() by using the Tf.fit API. Set the following parameters: epochs, batchSize,validationData, callbacks. Hint, you may need to transform your data into tensors ",name:"trainModel",readOnly:"false",imageLink:"instructions/trainModel.png"},{step:4,description:"Download Model Files",helperText:"Click the button to download your shiney new model. We will use this in our webapp.",name:"exportModel",readOnly:"true",imageLink:"instructions/exportModel.png"}],H=[{step:1,description:"Import Model",helperText:"Import a pre-trained model to perform inference with."},{step:2,description:"Extract and Process Joint Positions",helperText:"Extract the hand joint positions from within an image."},{step:3,description:"Classify",helperText:"Run inference with the normalized joint positions to get a classification (ASL sign)."},{step:4,description:"Run",helperText:"Run prediction on the model"}],k={metaTitle:A,metaDescription:_,name:$,theme:R,avatarImage:F,social:V,showDataVideo:O,trainTutorialSteps:j,predictSteps:H},N=`
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
`,P=`
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
}`,U=`
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
}`;function q(o){return new Function("classes","tf","tfjs",`return (${o.replace(/export/g,"")})`)(p,d,d)}async function J(o){let t;try{if(t=await o(p),!t)return m(`"We couldn't find your model. Did you implement createModel function? If so, check that you return your model`)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:f.Unknown,detail:n}]}}return{valid:!0,errors:[],data:[t]}}const W=Object.freeze(Object.defineProperty({__proto__:null,template:N,solution:P,solve:U,implementation:q,validate:J},Symbol.toStringTag,{value:"Module"}));function M(o){const t=[],e=[],n=p.reduce((i,a,r)=>(i[a]=Array.from({length:p.length}).fill(0),i[a][r]=1,i),{});return Object.keys(o).forEach(i=>{const a=o[i],r=n[i];a.forEach(l=>{t.push(l),e.push(r)})}),{inputs:t,outputs:e}}function D(o,t){const[e,,n]=w(o,t,{testSize:.1,randomState:42}),[i,a,r,l]=w(e,n,{testSize:.1,randomState:42});return[i,a,r,l]}function Y(o,t){const e=document.createElement("a");e.setAttribute("href","data:application/zip;base64,"+t),e.setAttribute("download",o),e.style.display="none",document.body.appendChild(e),e.click(),document.body.removeChild(e)}const Z=`
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
`,X=`
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
`;function Q(o,t,e,n){return new Function("model","ArrayBufferModelSaver","download","tf","tfjs","JSZip",`return (${o.replace(/export/g,"")})`)(t,e,n,d,d,L,T)}async function G(o,t){try{await o(t,new T,Y)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:f.Unknown,detail:n}]}}return{valid:!0,errors:[]}}const K=Object.freeze(Object.defineProperty({__proto__:null,template:Z,solution:X,implementation:Q,validate:G},Symbol.toStringTag,{value:"Module"})),tt=`
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
`,et=`
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
`;function nt(o){return new Function("loadAsync","jszip","jsZipInstance","tf","tfjs","assetURL","applyOneHotEncoding","splitTrainingData",`return (${o.replace(/export/g,"")})`)(y,E,E,d,d,b,M,D)}async function it(o){let t;try{if(t=await o(y,b,M,D),!t||t.length<4)return m(`
          data did not load
      `)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:f.Unknown,detail:n}]}}return{valid:!0,errors:[],data:[t]}}const ot=Object.freeze(Object.defineProperty({__proto__:null,template:tt,solution:et,implementation:nt,validate:it},Symbol.toStringTag,{value:"Module"})),at=`

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

`,st=`
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


`,rt=`

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

`;function lt(o,t,e,n,i,a){return new Function("model","trainingData","validationData","callbacks","numEpochs","tf","tfjs",`return (${o.replace(/export/g,"")})`)(t,e,n,i,a,d,d)}async function dt(o,t,e,n,i,a){try{const r=await o(t,e,n,i,a);if(r){if(!r.params)return m(`
      Looks like you didn't put any parameters in your fit function'
      `)}else return m(`
      Looks like you didn't return anything. Please return value from model.fit()'
      `)}catch(r){const l=`${r}`;return{valid:!1,errors:[{type:f.Unknown,detail:l}]}}return{valid:!0,errors:[],data:[]}}const ct=Object.freeze(Object.defineProperty({__proto__:null,template:at,solution:st,solve:rt,implementation:lt,validate:dt},Symbol.toStringTag,{value:"Module"})),g={createModel:W,exportModel:K,trainModel:ct,loadData:ot};let ut=()=>({events:{},emit(o,...t){let e=this.events[o]||[];for(let n=0,i=e.length;n<i;n++)e[n](...t)},on(o,t){return this.events[o]?.push(t)||(this.events[o]=[t]),()=>{this.events[o]=this.events[o]?.filter(e=>t!==e)}}});const h="validated",pt="validationInProgress",ht="validationComplete";class mt{#a=0;#e;#n;#i;#l=!1;#t=[];#s;#c;#r;#p;constructor(t){this.#a=t.stepCount??0,this.#e=t.stepRecord,this.#n=t.element,this.#i=t.name,this.#c=localStorage.getItem(`build-ts:${this.#i}`),this.#r=t.solutionElement,this.#s=ut(),this.setEventListener()}set show(t){t?(this.#n.setAttribute("style","display: flex;width: 100%;height:calc(100vw / 2)"),this.showSolution(!0)):(this.#n.setAttribute("style","display:none;"),this.showSolution(!1))}showSolution(t){this.#r&&(t?this.#r.setAttribute("style","display: flex;width: 100%;height:calc(100vw / 2)"):this.#r.setAttribute("style","display:none;"))}set code(t){this.#n.setAttribute("code",t)}set allowBackgroundExecution(t){this.#n.toggleAttribute("allow-background-execution",t)}set readonly(t){this.#n.toggleAttribute("readonly",t)}get solutionElement(){return this.#r}resetCodeToDefault(){this.code=this.#e.template,localStorage.removeItem(`build:${this.#i}`),localStorage.removeItem(`build-ts:${this.#i}`),this.#c=null,this.#l=!1}solve(){this.code=this.#e.solve??this.#e.solution}on(t,e){return this.#s.on(t,e)}set overrideEventListener(t){this.#p=t}setEventListener(){this.#n.addEventListener("change",async t=>{const e=t,n=!e.detail.hasSyntaxErrors,i=e.detail.transpiledCode;n&&(localStorage.setItem(`build-ts:${this.#i}`,e.detail.transpiledCode),localStorage.setItem(`build:${this.#i}`,e.detail.code),this.#c=e.detail.transpiledCode,this.#p||await this.handleEvalInput(i))})}set funcInput(t){this.#t=t}setCodeFromCacheOrDefault(){const t=localStorage.getItem(`build:${this.#i}`),e=t&&t.length>0?t:this.#e.template;this.code=e}async runCachedCode(){try{this.#c&&await this.handleEvalInput(this.#c)}catch(t){console.warn(t)}}async handleEvalInput(t){this.#s.emit(pt,this.#i,this.#a);const e=t??this.#n.getAttribute("code")??"",n=this.#e.implementation(e,...this.#t);if(this.#e.validate)try{const i=await this.#e.validate(n,...this.#t);this.#n.setAttribute("validation-issues",JSON.stringify(i.valid?[]:i.errors)),this.#l=i.valid,this.#l&&this.#s.emit(h,i)}catch(i){console.log(i)}this.#s.emit(ht,this.#i,this.#a,this.#l)}get isValid(){return this.#l}}const I=".loading-element",x=".train-button",ft=".output-container",v="#validation-status";function gt(){const o=s(ft);o.style.visibility="visible";const t=s(v);t.innerHTML="Validating solution...";const e=s(I);e.style.visibility="visible"}function S(o,t,e){const n=s(v);n.innerHTML=e;const i=s(I);if(i.style.visibility="hidden",t){const a=s(`#tutorial-step${o}`),r=k.trainTutorialSteps.find(c=>c.step===o);r&&a&&(a.innerHTML=`\u2705${r.description}`);const l=s(x);l.disabled=!1}}function yt(){const o=s(v);o.innerHTML="";const t=s(x);t.disabled=!0}const bt=new Map([["loadData","\u2714\uFE0F Data loaded \u{1F4BE}"],["createModel","\u2714\uFE0F Yay! Model created! \u{1F389}"],["trainModel","\u2714\uFE0F Training complete!\u{1F45F}"],["exportModel",'\u2714\uFE0F Downloaded! Time to make some <a href="/predict#step1">predictions</a> \u{1F57A}']]);function vt(o){return bt.get(o)??""}const wt=k,C=5;class Et{#a=C;#e=1;#n=405*2;#i=0;#l=!1;#t;#s=!1;#c=s("#output-element");#r=s(".training-feedback-container");#p=s(".training-progress-bar");#w=document.querySelectorAll("code-step");#T=s(".training-progress-bar");#E=s(".load-data-description");#S=s("#solution-tab");#h=s(".train-button");#f=s(".reset-button");#m=s(".training-stop-button");#u=s(".training-start-button");#C=s(".download-button");#g=s(".solve-button");#y=!0;#b=!1;#v;#o;#d={};#k={};constructor(t){this.#a=t?.epochs??C}async init(){this.#h.disabled=!0,this.#h.onclick=this.handleNextButtonClick,this.#f.onclick=this.handleResetButtonClick,this.#m.onclick=this.handleStopTrainingClick,this.#u.onclick=this.handlestartTrainingClick,this.#C.onclick=this.handleDownloadClick,this.#g.onclick=this.handleSolveClick,this.mapCodeSteps(),await this.setCurrentStep(1)}mapCodeSteps(){const t=Object.keys(g).reduce((e,n)=>(e[n]={valid:!1,...g[n]},e),{});this.initCodeSteps(t)}initCodeSteps(t){const e={};this.#w.forEach(n=>{const i=n.getAttribute("name")??"";if(/-solution/.test(i)){const r=i.replace("-solution","");e[r]=n}}),this.#w.forEach(n=>{const i=n.getAttribute("name")??"",a=n.getAttribute("step")??"",r=g[i];if(i&&r){const l=t[i];let c;e[i]&&(c=e[i],c.setAttribute("code",l.solution),c.toggleAttribute("readonly",!0));const u=new mt({stepRecord:l,element:n,name:i,stepCount:+a,solutionElement:c});switch(this.#d[i]=u,this.#k[a]=i,i){case"loadData":u.funcInput=[y,b],u.on(h,this.handleDataSplitValidation),u.setCodeFromCacheOrDefault();break;case"createModel":u.funcInput=[d,p],u.on(h,this.handleModelCreation);break;case"configureModel":u.on(h,this.handleConfigureModel);break}u.on("validationComplete",this.handleValidationComplete)}})}handleValidationStarted=(t,e)=>{this.#t?.step===e&&(gt(),t==="trainModel"&&(this.#m.style.display="inline-flex"))};handleValidationComplete=(t,e,n)=>{if(this.#t?.step===e){let i="validation failed";n&&(i=vt(t)),t==="trainModel"&&this.#b,S(e,n,i)}};handleResetButtonClick=()=>{const t=this.#t?.name??"";this.#d[t].resetCodeToDefault()};handleSolveClick=()=>{const t=this.#t?.name??"",e=this.#d[t];e&&e.solve()};handleStopTrainingClick=()=>{this.#y=!1,this.#u.disabled=!1};onBatchEnd=(t,e)=>{this.#l||(this.#l=!0,this.#r.style.display="inline-block"),!this.#y&&this.#o&&(this.#o.stopTraining=!0);const n=this.#e*this.#n+(t+1),i=this.#a*this.#n,a=n/i*100;this.#T.value=a,this.#r.innerHTML=`
      Epoch: ${this.#e} Batch: ${t}
      <br>
      Loss: ${e?.loss.toFixed(3)??""}
      <br>
      Accuracy: ${e?.acc.toFixed(3)??""}
      <br>
      `};onEpochEnd=t=>{const e=Date.now()-this.#i;this.#e=t+2;const n=this.#a-t,i=e*n,[a,r]=z(i);this.#p.innerHTML=`${a} ${r?"minutes":"seconds"} remaining`,this.#i=Date.now(),t===this.#a-1&&(this.#b=!0)};handleConfigureModel=t=>{t.valid&&t.data&&t.data.length>0&&(this.#o=t.data[0])};handleModelCreation=t=>{t.valid&&t.data&&t.data.length>0?this.#o=t.data[0]:console.log("no data provided to ModelBuilder, please retry load data function")};handleDataSplitValidation=t=>{t.valid&&t.data&&t.data.length>0?this.#v=t.data[0]:console.log("no data provided to ModelBuilder, please retry load data function")};handleNextButtonClick=async()=>{const t=this.#t?.step??1;await this.onStepChange(t+1)};async onStepChange(t){if(this.#t){const e=this.#t.name;this.#s&&this.toggleSolution(!1,e);const n=s(`#${e}-image`);n.style.display="none";const i=this.#d[e];i.show=!1}yt(),t!==void 0&&await this.setCurrentStep(t)}handleSolutionButtonClick=()=>{const t=!this.#s,e=this.#t?.name??"";this.toggleSolution(t,e)};toggleSolution(t,e){this.#s=t,this.#d[e].showSolution(t)}handlestartTrainingClick=async()=>{const t=this.#d.trainModel;this.#o&&t&&(this.#o.stopTraining=!1,this.#y=!0,this.#e=1,this.#u.disabled=!0,this.#b=!1,this.#h.disabled=!0,await t.runCachedCode())};handleDownloadClick=async()=>{const t=this.#d.exportModel;this.#o&&t&&await t.runCachedCode()};async handleStepChange(t,e="false"){const n=this.#d[t];if(n){const i=s(`#${t}-image`);if(i.style.display="flex",n.setCodeFromCacheOrDefault(),e&&(n.readonly=e==="true"),t==="loadData"?(this.#E.style.display="block",await n.runCachedCode()):this.#E.style.display="none",t==="exportModel"&&this.#o&&(n.funcInput=[this.#o,d]),t==="trainModel"&&this.#o&&this.#v){const[a,r,l,c]=this.#v;n.funcInput=[this.#o,{inputs:a,outputs:l},{inputs:r,outputs:c},{onBatchEnd:this.onBatchEnd,onEpochEnd:this.onEpochEnd},this.#a],n.overrideEventListener=!0,this.#u.style.display="inline-flex",this.#m.style.display="inline-flex"}else this.#m.style.display="none",this.#u.style.display="none",this.#r.style.display="none";t==="exportModel"&&(n.overrideEventListener=!0,this.#C.style.display="inline-flex",this.#h.style.display="none"),e==="true"?(this.#f.style.display="none",this.#g.style.display="none",this.#S.style.display="none"):(this.#f.style.display="inline-flex",this.#g.style.display="inline-flex",this.#S.style.display="inline-flex"),n.show=!0}else console.error(`Instance of StepViewer for ${t} is not found`)}async setCurrentStep(t){const e=wt.trainTutorialSteps.find(n=>n.step===t);e!=null&&(this.#t=e,St(this.#t.step),Ct(this.#t.step-1),this.#c.innerHTML=`${this.#t.step}. ${this.#t.description} `,await this.handleStepChange(this.#t.name,this.#t.readOnly))}}function St(o){const t=document.querySelector(`#tutorial-step${o}`);t&&(t.style.fontWeight="bold")}function Ct(o){const t=document.querySelector(`#tutorial-step${o}`);t&&(t.style.fontWeight="revert")}B("build");const Tt=new Et;Tt.init();
