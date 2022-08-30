import '../../../../components/IssueDisplay';

import BaseComponent from '../../../../components/BaseComponent';
import template from './template.html?raw';

const attributes = ['style', 'sign'] as const;
type AttributeName = typeof attributes[number];
export class SignDisplayComponent extends BaseComponent<AttributeName> {
  /**
   * The list of observed attributes
   */
  static get observedAttributes(): AttributeName[] {
    return ['style', 'sign'];
  }

  constructor() {
    super(template);
  }

  #imageEle: HTMLImageElement | null = null;
  #nameEle: HTMLElement | null = null;
  #firstRender = true;

  /**
   * The root of the app component
   */
  #__root: HTMLElement | null = null;
  get #root(): HTMLElement {
    if (!this.#__root) {
      this.#__root = this.templateRoot.querySelector('.root');
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.#__root!;
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name: AttributeName, _oldValue: string | null, newValue: string | null) {
    this.#render(name, newValue ?? '');
  }

  /**
   * Listener for when the element is initialized
   */
  connectedCallback() {
    this.#nameEle = this.#root.querySelector('.sign-name');
    this.#imageEle = this.#root.querySelector('.sign-image');
    this.#render();
    this.#firstRender = false;
  }

  /**
   * Renders this component
   */
  #render(attribute: AttributeName | null = null, attribValue?: string) {
    if (this.#hasAttributeChanged(attribute, 'sign')) {
      const sign = attribValue ?? this.getAttribute('sign') ?? '?';
      if (this.#nameEle) {
        this.#nameEle.innerHTML = sign;
      }
      if (this.#imageEle) {
        this.#imageEle.src = `${import.meta.env.BASE_URL}data/signs/${sign.toLowerCase()}.jpg`;
      }
    }
  }

  #hasAttributeChanged(
    attributeName: AttributeName | null,
    attribute: AttributeName | null,
  ): boolean {
    return this.#firstRender || !attribute || attribute === attributeName;
  }
}

customElements.define('sign-display', SignDisplayComponent);
