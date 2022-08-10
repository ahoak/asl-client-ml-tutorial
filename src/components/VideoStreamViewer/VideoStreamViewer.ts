import BaseComponent from '../BaseComponent';
import template from './template.html';

export class VideoStreamViewerComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style', 'class'];
  }

  /**
   * The root of the component
   */
  #root: HTMLVideoElement | null = null;

  /**
   * The video stream to be loaded
   */
  #stream: MediaStream | null = null;

  /**
   * The root element of the template
   */
  constructor() {
    super(template);
  }

  /**
   * Gets the image source of this viewer
   */
  get imageSource() {
    return this.#getRoot();
  }

  /**
   * Gets the video stream of this viewer
   */
  get stream() {
    return this.#stream;
  }

  /**
   * Sets the video stream for this viewer
   * @param {MediaStream} stream The stream for this viewer
   */
  set stream(stream) {
    const root = this.#getRoot();
    if (this.#stream !== stream) {
      this.#stream = stream;
      if (stream) {
        root.srcObject = stream;
        root.play().catch((error) => console.error('videoElem.play() failed:%o', error));
      } else {
        root.srcObject = null;
      }
    }
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    // Make our "style", match the host value
    if (name === 'style') {
      this.#getRoot().style.cssText = newValue ?? '';
    } else if (name === 'class') {
      this.#getRoot().className = `root ${newValue ?? ''}`;
    }
  }

  /**
   * Callback for when the element is attached to a document somewhere
   */
  connectedCallback() {
    // const root = this.#getRoot();
    // root.onplay = () => root.paused = false
    // root.onpause = () => root.paused = true
  }

  /**
   * Gets the root element for the component
   */
  #getRoot(): HTMLVideoElement {
    if (!this.#root) {
      this.#root = this.templateRoot.querySelector('.root');
    }
    return this.#root!;
  }
}

customElements.define('video-stream-viewer', VideoStreamViewerComponent);
