import BaseComponent from '../../../../components/BaseComponent';
import template from './template.html?raw';

export class ImportModelStep extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style'];
  }

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #connected = false;

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
   * Listener for when the element is initialized
   */
  connectedCallback() {
    this.#connected = true;
  }

  /**
   * Listener for when the element is removed from the dom
   */
  disconnectedCallback() {
    this.#connected = false;
  }
}

customElements.define('import-model-step', ImportModelStep);
