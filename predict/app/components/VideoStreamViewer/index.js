import template from "./videostreamviewer.html";
import BaseComponent from "../BaseComponent";

export class VideoStreamViewerComponent extends BaseComponent {
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
  
  /**
   * The video stream to be loaded
   */
  #stream = null;
  

  /**
   * The root element of the template
   */
  constructor() {
    super(template);
  }
  
  /**
   * Gets the video stream of this viewer 
   */
  get stream() {
    return this.#stream;
  }
  
  /**
   * Gets the image source of this viewer 
   */
  get imageSource() {
    return this.#getRoot();
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
        root.srcObject = stream
        root
          .play()
          .catch(error => console.error('videoElem.play() failed:%o', error))
      } else {
        root.srcObject = null
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
  #getRoot() {
    if (!this.#root) {
      this.#root = this.templateRoot.querySelector(".root");
    }
    return this.#root;
  }
}

customElements.define("video-stream-viewer", VideoStreamViewerComponent);
