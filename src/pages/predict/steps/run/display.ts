import { classes } from '../../../../utils/constants';
import { loadModelFromZip } from '../../../../utils/utils';
import type { CodeEditorComponent, VideoStreamViewerComponent } from '../../components';
import { BaseComponent } from '../../components';
import { createImplForStepCode } from '../helpers/createImplForCode';
import type { PredictPipelineState, StepDisplayElement, StepState } from '../types';
import { code } from './code';
import template from './template.html';

type PredictFn = (
  model: LayersModel,
  imageSource: CanvasImageSource,
  loadMirrored: boolean,
  classes: string[],
) => Promise<{
  classification: string;
  confidence: number;
} | null>;
export class RunStep extends BaseComponent implements StepDisplayElement {
  #videoStreamViewer: VideoStreamViewerComponent | null = null;
  #startButton: HTMLElement | null = null;
  #codeEditor: CodeEditorComponent | null = null;
  #predictionOutput: HTMLElement | null = null;
  #stream: MediaStream | null = null;
  #model: LayersModel | null = null;
  #source = 'webcam';

  #predictImpl: PredictFn | null = null;

  #started = false;
  #stopPredictionLoop: (() => void) | null = null;

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #__root: HTMLElement | null = null;
  get #root(): HTMLElement {
    if (!this.#__root) {
      this.#__root = this.templateRoot.querySelector('.root');
    }
    return this.#__root!;
  }

  /**
   * The internal step state (DONT USE DIRECTLY)
   */
  #__stepState: StepState = {
    valid: false,
  };

  /**
   * Gets the current step state
   */
  get stepState(): StepState {
    return this.#__stepState!;
  }

  /**
   * Sets the step state
   */
  set stepState(state: StepState) {
    if (state !== this.#__stepState) {
      this.#__stepState = state;
    }
  }

  /**
   * Gets the pipeline state
   */
  #__pipelineState: PredictPipelineState | null = null;
  get pipelineState() {
    return this.#__pipelineState;
  }

  /**
   * Sets the pipeline state
   */
  set pipelineState(value: PredictPipelineState | null) {
    this.#__pipelineState = value;

    this.#model = null;
    const modelData = value?.steps.importModel?.data;
    if (modelData) {
      void loadModelFromZip(modelData as ArrayBuffer).then((model) => {
        this.#model = model;
      });
    }

    this.#loadPredictionImpl();
  }

  /**
   * Runs prediction on the current source & streams
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async predict() {
    if (this.#stream && this.#predictImpl && this.#__pipelineState && this.#model) {
      const imageSource = this.#videoStreamViewer!.imageSource;
      const isVideo = imageSource instanceof HTMLVideoElement;
      if (!isVideo || imageSource.readyState >= 2) {
        // TODO: Assume a "video" imageSource needs to be mirrored
        const result = await this.#predictImpl(this.#model, imageSource, isVideo, classes);
        const resultStr = result
          ? `${result.classification} (${(result.confidence * 100).toFixed(2)}%)`
          : 'No Prediction';
        this.#updateOutput(resultStr);
      }
    }
  }

  connectedCallback() {
    this.#videoStreamViewer = this.#root.querySelector('.video-stream-viewer');
    this.#startButton = this.#root.querySelector('.start-button');
    this.#startButton!.onclick = () => this.#handleStartButtonClick();
    this.#predictionOutput = this.#root.querySelector('.predictions-output');
    this.#codeEditor = this.#root.querySelector('.code-editor');

    const toggleCodeButton = this.#root.querySelector('.toggle-code-button');
    if (this.#codeEditor) {
      this.#codeEditor.addEventListener('change', () => this.#loadPredictionImpl());
      this.#codeEditor.setAttribute('code', code);

      let visible = false;
      toggleCodeButton?.addEventListener('click', () => {
        visible = !visible;
        this.#codeEditor!.style.display = visible ? '' : 'none';
      });
    }
    super.connectedCallback();
  }

  /**
   * Handler for when the start button is clicked on
   */
  #handleStartButtonClick() {
    void this.#toggle();
  }

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
    this.#startButton!.innerText = 'Stop';

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
    this.#startButton!.innerText = 'Start';
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
    await this.#stopVideo();
    if (this.#source === 'webcam') {
      const constraints = {
        video: true,
        width: 200,
        height: 200,
      };
      this.#stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.#videoStreamViewer!.stream = this.#stream;
    }
  }

  /**
   * Stops the video stream
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async #stopVideo() {
    if (this.#stream) {
      this.#stream.getTracks().forEach((t) => t.stop());
      this.#videoStreamViewer!.stream = null;
      this.#stream = null;
    }
  }

  /**
   * Updates the output
   */
  #updateOutput(text: string) {
    this.#predictionOutput!.innerText = text ?? '';
  }

  /**
   * Loads the prediction impl
   */
  #loadPredictionImpl() {
    this.#predictImpl = null;
    if (this.#codeEditor) {
      const transpiledCode = this.#codeEditor.getAttribute('transpiled-code');
      if (transpiledCode) {
        this.#predictImpl = createImplForStepCode<PredictFn>(transpiledCode, this.pipelineState);
      }
    }
  }
}

customElements.define('run-step', RunStep);
