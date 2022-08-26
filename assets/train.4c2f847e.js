import{a as h,t as u,e as f,V as m,i as v,J as B,A as C,k as y,m as T,n as b,o as s,p as L,s as A}from"./utils.83332e14.js";import"./VideoStreamViewer.750a7efa.js";const V="ASL Fingerspelling Model Tutorial",_="Train ASL Fingerspelling ML Model using Tensorflowjs",R="ASL Fingerspelling Tutorial \u{1F44B}",F="",$="",j={github:"https://github.com/ahoak/asl-client-ml-tutorial",twitter:"https://twitter.com/amber_hoak"},O=!1,N=[{step:1,description:"Load Data",helperText:"Load preprocessed data by pressing the button",name:"loadData",readOnly:"true"},{step:2,description:"Create and Configure Model",helperText:"creating a feed-forward model. We will use 5 layers with relu activation function. Function must return the model.",name:"createModel",readOnly:"false"},{step:3,description:"Train Model",helperText:"edit function trainModel() by using the Tf.fit API. Set the following parameters: epochs, batchSize,validationData, callbacks. Hint, you may need to transform your data into tensors ",name:"trainModel",readOnly:"false"},{step:4,description:"Download Model Files",helperText:"Click the button to download your shiney new model. We will use this in our webapp.",name:"exportModel",readOnly:"true"}],H=[{step:1,description:"Import Model",helperText:"Import a pre-trained model to perform inference with."},{step:2,description:"Extract and Process Joint Positions",helperText:"Extract the hand joint positions from within an image."},{step:3,description:"Classify",helperText:"Run inference with the normalized joint positions to get a classification (ASL sign)."},{step:4,description:"Run",helperText:"Run prediction on the model"}],k={metaTitle:V,metaDescription:_,name:R,theme:F,avatarImage:$,social:j,showDataVideo:O,trainTutorialSteps:N,predictSteps:H},P=`
// Create a feed-forward model using the tf.sequential (https://js.tensorflow.org/api/latest/#sequential)
function createModel(classes: string[]):LayersModel {
 
  // Step 1: Create Model
  const model = tf.sequential({
    layers: [
      // Fill in the inputShape and units (hint this is equal to mediapipe hands output per image = 63)
      // Want to play with other activation functions, go for it! 
      tf.layers.dense({ inputShape: [/*\u2728INSERT_HERE\u2728*/], units: /*\u2728INSERT_HERE\u2728*/, activation: 'relu' }),

      // Fill in units (nuerons) in range 100-300
      tf.layers.dense({ units: /*\u2728INSERT_HERE\u2728*/, activation: 'relu' }),

      // Add a final dense layer wtih number of nuerons equal to classes (i.e classes.length )
      tf.layers.dense({ units: /*\u2728INSERT_HERE\u2728*/, activation: 'softmax' }),
    ],
  });

  // Step 2: Configure Model
  model.compile({
    // Adam changes the learning rate over time which is useful.
    // https://js.tensorflow.org/api/latest/#Training-Optimizers
    optimizer:  /*\u2728INSERT_HERE\u2728*/, //optimizer options: 'sgd', 'momentum', 'adagrad', 'ada', 'adam', 'adamax', 'rmsprop'

    // Use the correct loss function. https://js.tensorflow.org/api/latest/#Training-Losses
    // If 2 classes of data, use 'binaryCrossentropy' else use 'categoricalCrossentropy' if more than 2 classes and output of our model is a probability distribution.
    loss:  /*\u2728INSERT_HERE\u2728*/,
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: ['accuracy'],
  });


  /* Uncomment below statement to check the output. */
  // console.log(model.summary())

  return model;
}
`,Y=`
function createModelSolution(classes: string[]):LayersModel {
  // Create a feed-forward model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [63], units: 63, activation: 'relu' }),
      tf.layers.dense({ units: 256, activation: 'relu' }),
      tf.layers.dense({ units: classes.length, activation: 'softmax' }),
    ],
  });

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}`;function U(i){return new Function("classes","tf","tfjs",`return (${i.replace(/export/g,"")})`)(h,u,u)}async function X(i){let t;try{if(t=await i(h),!t)return f(`"We couldn't find your model. Did you implement createModel function? If so, check that you return your model`)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:m.Unknown,detail:n}]}}return{valid:!0,errors:[],data:[t]}}const q=Object.freeze(Object.defineProperty({__proto__:null,template:P,solution:Y,implementation:U,validate:X},Symbol.toStringTag,{value:"Module"}));function M(i){const t=[],e=[],n=h.reduce((a,o,r)=>(a[o]=Array.from({length:h.length}).fill(0),a[o][r]=1,a),{});return Object.keys(i).forEach(a=>{const o=i[a],r=n[a];o.forEach(l=>{t.push(l),e.push(r)})}),{X:t,Y:e}}function x(i,t){const[e,,n]=v(i,t,{testSize:.1,randomState:42}),[a,o,r,l]=v(e,n,{testSize:.1,randomState:42});return[a,o,r,l]}function J(i,t){const e=document.createElement("a");e.setAttribute("href","data:application/zip;base64,"+t),e.setAttribute("download",i),e.style.display="none",document.body.appendChild(e),e.click(),document.body.removeChild(e)}const W=`
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
`,Z=`
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
`;function Q(i,t,e,n){return new Function("model","ArrayBufferModelSaver","download","tf","tfjs","JSZip",`return (${i.replace(/export/g,"")})`)(t,e,n,u,u,B,C)}async function G(i,t){try{await i(t,new C,J)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:m.Unknown,detail:n}]}}return{valid:!0,errors:[]}}const K=Object.freeze(Object.defineProperty({__proto__:null,template:W,solution:Z,implementation:Q,validate:G},Symbol.toStringTag,{value:"Module"})),tt=`
// READ-ONLY
// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets. Encodes Y-values (letter names) using one-hot encoding
// shuffles and splits data into training, validation, test sets
async function loadTensorData(
  loadTensors: (folder: jsZipInstance) => Promise<{ [key: string]: number[][] }>,
  assetURL: string,
  applyOneHotEncoding: (data: {  [key: string]: number[][]}) => { X: number[][]; Y: number[][] },
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
  const { X, Y } = applyOneHotEncoding(data);
  // take the results from one-hot encoding and split data
  return splitTrainingData(X, Y);
}
`,et=`
// READ-ONLY
// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets. Encodes Y-values (letter names) using one-hot encoding
// shuffles and splits data into training, validation, test sets
async function loadTensorData(
  loadTensors: (folder: jsZipInstance) => Promise<{ [key: string]: number[][] }>,
  assetURL: string,
  applyOneHotEncoding: (data: {  [key: string]: number[][]}) => { X: number[][]; Y: number[][] },
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
  const { X, Y } = applyOneHotEncoding(data);
  // take the results from one-hot encoding and split data
  return splitTrainingData(X, Y);
}
`;function nt(i){return new Function("loadAsync","jszip","jsZipInstance","tf","tfjs","assetURL","applyOneHotEncoding","splitTrainingData",`return (${i.replace(/export/g,"")})`)(y,T,T,u,u,b,M,x)}async function at(i){let t;try{if(t=await i(y,b,M,x),!t||t.length<4)return f(`
          data did not load
      `)}catch(e){const n=`${e}`;return{valid:!1,errors:[{type:m.Unknown,detail:n}]}}return{valid:!0,errors:[],data:[t]}}const it=Object.freeze(Object.defineProperty({__proto__:null,template:tt,solution:et,implementation:nt,validate:at},Symbol.toStringTag,{value:"Module"})),ot=`

async function trainModel(
  model: LayersModel,
  xTrainData: number[][], 
  yTrainData: number[][], 
  xValidationData: number[][], 
  yValidationData: number[][], 
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 3
): Promise<History> {

  const xTrainTensor = tf.tensor(xTrainData);
  const yTrainTensor = tf.tensor(yTrainData);
  const xValidationTensor = tf.tensor(xValidationData);
  const yValidationTensor = tf.tensor(yValidationData);


  // Since our data fits in memory, we can use the model.fit() api. 
  // https://js.tensorflow.org/api/latest/#tf.LayersModel.fit

  const modelHistory = await model.fit( /*\u2728INSERT_HERE\u2728*/, /*\u2728INSERT_HERE\u2728*/, {
    epochs: numEpochs, // default = 3 
    batchSize: 128, 
    verbose: 1,
    validationData: [/*\u2728INSERT_HERE\u2728*/, /*\u2728INSERT_HERE\u2728*/],
    callbacks: callbacks
   });

   // Free up memory resources by cleaning up intermediate tensors (i.e the tensors above)
  xTrainTensor.dispose()
  yTrainTensor.dispose()
  xValidationTensor.dispose()
  yValidationTensor.dispose() 

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
`,st=`
 async function trainModelSolution(
  model: LayersModel,
  xTrainData: number[][], 
  yTrainData: number[][], 
  xValidationData: number[][], 
  yValidationData: number[][], 
  callbacks: {
    onBatchEnd: (batch: number, logs?: Logs) => void;
    onEpochEnd: (epoch: number) => void;
  },
  numEpochs = 3,
): Promise<History> {

  const xTrainTensor = tf.tensor(xTrainData);
  const yTrainTensor = tf.tensor(yTrainData);
  const xValidationTensor = tf.tensor(xValidationData);
  const yValidationTensor = tf.tensor(yValidationData);

  const modelHistory = await model.fit(xTrainTensor, yTrainTensor, {
    epochs: numEpochs, 
    batchSize: 128,
    verbose: 1,
    validationData: [xValidationTensor, yValidationTensor],
    callbacks: callbacks
  });

  xTrainTensor.dispose()
  yTrainTensor.dispose()
  xValidationTensor.dispose()
  yValidationTensor.dispose() 
  
  return modelHistory
}`;function rt(i,t,e,n,a,o,r,l){return new Function("model","xTrainData","yTrainData","xValidationData","yValidationData","callbacks","numEpochs","tf","tfjs",`return (${i.replace(/export/g,"")})`)(t,e,n,a,o,r,l,u,u)}async function lt(i,t,e,n,a,o,r,l){try{const d=await i(t,e,n,a,o,r,l);if(d){if(!d.params)return f(`
      Looks like you didn't put any parameters in your fit function'
      `)}else return f(`
      Looks like you didn't return anything. Please return value from model.fit()'
      `)}catch(d){const c=`${d}`;return{valid:!1,errors:[{type:m.Unknown,detail:c}]}}return{valid:!0,errors:[],data:[]}}const dt=Object.freeze(Object.defineProperty({__proto__:null,template:ot,solution:st,implementation:rt,validate:lt},Symbol.toStringTag,{value:"Module"})),g={createModel:q,exportModel:K,trainModel:dt,loadData:it};let ct=()=>({events:{},emit(i,...t){let e=this.events[i]||[];for(let n=0,a=e.length;n<a;n++)e[n](...t)},on(i,t){return this.events[i]?.push(t)||(this.events[i]=[t]),()=>{this.events[i]=this.events[i]?.filter(e=>t!==e)}}});const p="validated",ut="validationInProgress",ht="validationComplete";class pt{#o=0;#n;#a;#e;#l=!1;#t=[];#s;#c;#r;#p;constructor(t){this.#o=t.stepCount??0,this.#n=t.stepRecord,this.#a=t.element,this.#e=t.name,this.#c=localStorage.getItem(`build-ts:${this.#e}`),this.#r=t.solutionElement,this.#s=ct(),this.setEventListener()}set show(t){t?this.#a.setAttribute("style","display: flex;width: 100%;height:calc(100vw / 2)"):this.#a.setAttribute("style","display:none;")}showSolution(t){this.#r&&(t?this.#r.setAttribute("style","display: flex;width: 100%;height:calc(100vw / 2)"):this.#r.setAttribute("style","display:none;"))}set code(t){this.#a.setAttribute("code",t)}set readonly(t){this.#a.toggleAttribute("readonly",t)}get solutionElement(){return this.#r}resetCodeToDefault(){this.code=this.#n.template,localStorage.removeItem(`build:${this.#e}`),localStorage.removeItem(`build-ts:${this.#e}`),this.#c=null,this.#l=!1}on(t,e){return this.#s.on(t,e)}set overrideEventListener(t){this.#p=t}setEventListener(){this.#a.addEventListener("change",async t=>{const e=t,n=!e.detail.hasSyntaxErrors,a=e.detail.transpiledCode;n&&(localStorage.setItem(`build-ts:${this.#e}`,e.detail.transpiledCode),localStorage.setItem(`build:${this.#e}`,e.detail.code),this.#c=e.detail.transpiledCode,this.#p||await this.handleEvalInput(a))})}set funcInput(t){this.#t=t}setCodeFromCacheOrDefault(){this.code=localStorage.getItem(`build:${this.#e}`)??this.#n.template}async runCachedCode(){try{this.#c&&await this.handleEvalInput(this.#c)}catch(t){console.warn(t)}}async handleEvalInput(t){this.#s.emit(ut,this.#e,this.#o);const e=t??this.#a.getAttribute("code")??"",n=this.#n.implementation(e,...this.#t);if(this.#n.validate)try{const a=await this.#n.validate(n,...this.#t);this.#a.setAttribute("validation-issues",JSON.stringify(a.valid?[]:a.errors)),this.#l=a.valid,this.#l&&this.#s.emit(p,a)}catch(a){console.log(a)}this.#s.emit(ht,this.#e,this.#o,this.#l)}get isValid(){return this.#l}}const D=".loading-element",I=".train-button",ft=".output-container",w="#validation-status";function mt(){const i=s(ft);i.style.visibility="visible";const t=s(w);t.innerHTML="Validating solution...";const e=s(D);e.style.visibility="visible"}function E(i,t,e){const n=s(w);n.innerHTML=e;const a=s(D);if(a.style.visibility="hidden",t){const o=s(`#tutorial-step${i}`),r=k.trainTutorialSteps.find(d=>d.step===i);r&&o&&(o.innerHTML=`\u2705${r.description}`);const l=s(I);l.disabled=!1}}function gt(){const i=s(w);i.innerHTML="";const t=s(I);t.disabled=!0}const yt=new Map([["loadData","\u2714\uFE0F Data loaded \u{1F4BE}"],["createModel","\u2714\uFE0F Yay! Model created! \u{1F389}"],["trainModel","\u2714\uFE0F Training complete!\u{1F45F}"],["exportModel",'\u2714\uFE0F Downloaded! Time to make some <a href="/predict#step1">predictions</a> \u{1F57A}']]);function bt(i){return yt.get(i)??""}const wt=k,S=3;class vt{#o=S;#n=1;#a=405*2;#e=0;#l=!1;#t;#s=!1;#c=s("#output-element");#r=s(".training-feedback-container");#p=s(".training-progress-bar");#E=document.querySelectorAll("code-step");#k=s(".training-progress-bar");#S=s(".load-data-description");#f=s(".train-button");#g=s(".view-solution-button");#y=s(".reset-button");#m=s(".training-stop-button");#h=s(".training-start-button");#C=s(".download-button");#b=s(".toggle-code-button");#w=!0;#v=!1;#T;#i;#d={};#M={};#u=!1;constructor(t){this.#o=t?.epochs??S}init(){this.#f.disabled=!0,this.#f.onclick=this.handleNextButtonClick,this.#g.onclick=this.handleSolutionButtonClick,this.#y.onclick=this.handleResetButtonClick,this.#m.onclick=this.handleStopTrainingClick,this.#h.onclick=this.handlestartTrainingClick,this.#C.onclick=this.handleDownloadClick,this.#b.onclick=this.handleCodeToggleClick,this.mapCodeSteps()}mapCodeSteps(){const t=Object.keys(g).reduce((e,n)=>(e[n]={valid:!1,...g[n]},e),{});this.initCodeSteps(t)}initCodeSteps(t){const e={};this.#E.forEach(n=>{const a=n.getAttribute("name")??"";if(/-solution/.test(a)){const r=a.replace("-solution","");e[r]=n}}),this.#E.forEach(n=>{const a=n.getAttribute("name")??"",o=n.getAttribute("step")??"",r=g[a];if(a&&r){const l=t[a];let d;e[a]&&(d=e[a],d.setAttribute("code",l.solution),d.toggleAttribute("readonly",!0));const c=new pt({stepRecord:l,element:n,name:a,stepCount:+o,solutionElement:d});switch(this.#d[a]=c,this.#M[o]=a,a){case"loadData":c.funcInput=[y,b],c.on(p,this.handleDataSplitValidation);break;case"createModel":c.funcInput=[u,h],c.on(p,this.handleModelCreation);break;case"configureModel":c.on(p,this.handleConfigureModel);break}c.on("validationInProgress",this.handleValidationStarted),c.on("validationComplete",this.handleValidationComplete)}else console.error("Expected code-step to have a step attribute!")})}handleValidationStarted=(t,e)=>{this.#t?.step===e&&(mt(),t==="trainModel"&&(this.#m.style.display="inline-flex"))};handleValidationComplete=(t,e,n)=>{if(this.#t?.step===e){let a="validation failed";n&&(a=bt(t)),t==="trainModel"&&this.#v,E(e,n,a)}};handleResetButtonClick=()=>{const t=this.#t?.name??"";this.#d[t].resetCodeToDefault()};handleStopTrainingClick=()=>{this.#w=!1,this.#h.disabled=!1};onBatchEnd=(t,e)=>{this.#l||(this.#l=!0,this.#r.style.display="inline-block"),!this.#w&&this.#i&&(this.#i.stopTraining=!0);const n=this.#n*this.#a+(t+1),a=this.#o*this.#a,o=n/a*100;this.#k.value=o,this.#r.innerHTML=`
      Epoch: ${this.#n} Batch: ${t}
      <br>
      Loss: ${e?.loss.toFixed(3)??""}
      <br>
      Accuracy: ${e?.acc.toFixed(3)??""}
      <br>
      `};onEpochEnd=t=>{const e=Date.now()-this.#e;this.#n=t+1;const n=this.#o-t,a=e*n,[o,r]=L(a);this.#p.innerHTML=`${o} ${r?"minutes":"seconds"} remaining`,this.#e=Date.now(),t===this.#o-1&&(this.#v=!0)};handleConfigureModel=t=>{t.valid&&t.data&&t.data.length>0&&(this.#i=t.data[0])};handleModelCreation=t=>{t.valid&&t.data&&t.data.length>0?this.#i=t.data[0]:console.log("no data provided to ModelBuilder, please retry load data function")};handleDataSplitValidation=t=>{t.valid&&t.data&&t.data.length>0?this.#T=t.data[0]:console.log("no data provided to ModelBuilder, please retry load data function")};handleNextButtonClick=async()=>{const t=this.#t?.step??1;await this.onStepChange(t+1)};async onStepChange(t){if(this.#t){const e=this.#t.name;this.#s&&this.toggleSolution(!1,e);const n=this.#d[e];n.show=!1}gt(),t!==void 0&&await this.setCurrentStep(t)}handleSolutionButtonClick=()=>{const t=!this.#s,e=this.#t?.name??"";this.toggleSolution(t,e)};toggleSolution(t,e){this.#s=t,this.#d[e].showSolution(t)}handlestartTrainingClick=async()=>{const t=this.#d.trainModel;this.#i&&t&&(this.#i.stopTraining=!1,this.#w=!0,this.#n=0,this.#h.disabled=!0,this.#v=!1,this.#f.disabled=!0,await t.runCachedCode())};handleDownloadClick=async()=>{const t=this.#d.exportModel;this.#i&&t&&await t.runCachedCode()};handleCodeToggleClick=()=>{if(this.#t?.name){const t=this.#d[this.#t?.name];this.#u?t.show=!1:t.show=!0,this.#u=!this.#u}};async handleStepChange(t,e="false"){const n=this.#d[t];if(n){if(n.setCodeFromCacheOrDefault(),e&&(n.readonly=e==="true"),t==="loadData"?(this.#S.style.display="block",await n.runCachedCode()):this.#S.style.display="none",t==="exportModel"&&this.#i&&(n.funcInput=[this.#i,u]),t==="trainModel"&&this.#i&&this.#T){const[a,o,r,l]=this.#T;n.funcInput=[this.#i,a,r,o,l,{onBatchEnd:this.onBatchEnd,onEpochEnd:this.onEpochEnd},this.#o],n.overrideEventListener=!0,this.#h.style.display="inline-flex",this.#m.style.display="inline-flex"}else this.#m.style.display="none",this.#h.style.display="none",this.#r.style.display="none";t==="exportModel"&&(n.overrideEventListener=!0,this.#C.style.display="inline-flex",this.#f.style.display="none"),e==="true"?(this.#g.style.display="none",this.#y.style.display="none",this.#u=!1,this.#b.style.display="inline-flex"):(this.#g.style.display="inline-flex",this.#y.style.display="inline-flex",this.#u=!0,this.#b.style.display="none"),n.show=this.#u}else console.error(`Instance of StepViewer for ${t} is not found`)}async setCurrentStep(t){const e=wt.trainTutorialSteps.find(n=>n.step===t);e!=null&&(this.#t=e,Tt(this.#t.step),Et(this.#t.step-1),this.#c.innerHTML=`${this.#t.step}. ${this.#t.description} `,await this.handleStepChange(this.#t.name,this.#t.readOnly))}}function Tt(i){const t=document.querySelector(`#tutorial-step${i}`);t&&(t.style.fontWeight="bold")}function Et(i){const t=document.querySelector(`#tutorial-step${i}`);t&&(t.style.fontWeight="revert")}A("build");const z=new vt;z.init();z.setCurrentStep(1);
