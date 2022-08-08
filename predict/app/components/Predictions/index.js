import template from "./predictions.html";
import BaseComponent from "../BaseComponent";
import "../VideoStreamViewer";
import { predict } from "../../../model/predict";

export class PredictionsComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ["style", "class"];
  }

  /**
   * The root of the component
   */
  #root = null;
  #videoStreamViewer = null;
  #startButton = null;
  #predictionOutput = null;
  #stream = null;
  #source = "webcam";
  #model = null;

  #started = false;
  #stopPredictionLoop = null;

  /**
   * The root element of the template
   */
  constructor() {
    super(template);
  }
  
  /**
   * Gets the model used for prediction
   */
  get model() {
    return this.#model;
  }
  
  /**
   * Sets the model to use when predicting
   */
  set model(value) {
    this.#model = value;
  }

  /**
   * Runs prediction on the current source & streams
   */
  async predict() {
    if (this.#model && this.#stream) {
      const imageSource = this.#videoStreamViewer.imageSource;
      const isVideo = imageSource instanceof HTMLVideoElement;
      if (!isVideo || imageSource.readyState >= 2) {
        // TODO: Assume a "video" imageSource needs to be mirrored
        const result = await predict(this.#model, imageSource, isVideo);
        const resultStr = result
          ? `${result.classification} (${(result.confidence * 100).toFixed(2)}%)`
          : "No Prediction";
        this.#updateOutput(resultStr);
      }
    }
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Make our "style", match the host value
    if (name == "style") {
      this.#getRoot().style.cssText = newValue;
    } else if (name === "class") {
      this.#getRoot().className = `root ${newValue ?? ""}`;
    }
  }

  /**
   * Callback for when the element is attached to a document somewhere
   */
  connectedCallback() {
    const root = this.#getRoot();
    this.#videoStreamViewer = root.querySelector(".video-stream-viewer");
    this.#startButton = root.querySelector(".start-button");
    this.#startButton.onclick = this.#handleStartButtonClick;
    this.#predictionOutput = root.querySelector(".predictions-output");
  }

  /**
   * Handler for when the start button is clicked on
   */
  #handleStartButtonClick = () => {
    this.#toggle();
  };

  /**
   * Toggles the prediction loop
   */
  async #toggle() {
    if (!this.#started) {
      await this.#start();
    } else {
      await this.#stop();
    }
  }

  /**
   * Starts the prediction loop
   */
  async #start() {
    // Stop it if it is already running
    await this.#stop();

    this.#started = true;
    this.#startButton.innerText = "Stop";

    await this.#startVideo();

    this.#stopPredictionLoop = (() => {
      let done = false;
      const loop = async () => {
        if (!done) {
          await this.predict();
          setTimeout(loop, 0);
        }
      };
      setTimeout(loop, 0);

      return () => (done = true);
    })();
  }

  /**
   * Stops the prediction loop
   */
  async #stop() {
    this.#started = false;
    this.#startButton.innerText = "Start";
    await this.#stopVideo();

    if (this.#stopPredictionLoop) {
      this.#stopPredictionLoop();
      this.#stopPredictionLoop = null;
    }
  }

  /**
   * Starts the video stream
   */
  async #startVideo() {
    this.#stopVideo();
    if (this.#source === "webcam") {
      const constraints = {
        video: true,
        width: 200,
        height: 200,
      };
      this.#stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.#videoStreamViewer.stream = this.#stream;
    }
  }

  /**
   * Stops the video stream
   */
  async #stopVideo() {
    if (this.#stream) {
      this.#stream.getTracks().forEach((t) => t.stop());
      this.#videoStreamViewer.stream = null;
      this.#stream = null;
    }
  }

  /**
   * Updates the output
   */
  #updateOutput(text) {
    this.#predictionOutput.innerText = text ?? "";
  }

  /**
   * Gets the root element for the component
   */
  #getRoot() {
    if (!this.#root) {
      this.#root = this.templateRoot.querySelector(".root");
    }
    return this.#root;
  }
}

customElements.define("predictions-component", PredictionsComponent);
