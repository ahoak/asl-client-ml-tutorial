import BaseComponent from '../../../../components/BaseComponent';
import template from './template.html';

export class StepControllerComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style', 'class', 'step'];
  }

  /**
   * The root of the component
   */
  #root: HTMLElement | null = null;

  /**
   * The current step
   */
  #step: number | null = null;

  /**
   * The slot where child steps are placed
   */
  #stepSlot: HTMLSlotElement | null = null;

  /**
   * The header container element
   */
  #headerContainer: HTMLSlotElement | null = null;

  /**
   * The slot where header is placed
   */
  #headerSlot: HTMLSlotElement | null = null;

  /**
   * The root element of the template
   */
  constructor() {
    super(template);
  }

  /**
   * Gets the current step
   */
  get step(): number | null {
    return this.#step;
  }

  /**
   * Sets the current step
   */
  set step(value: number | null) {
    this.setAttribute('step', `${value ?? ''}`);
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    // Make our "style", match the host value
    if (name === 'style') {
      this.#getRoot().style.cssText = newValue ?? '';
    } else if (name === 'step') {
      this.#step = newValue ? parseInt(newValue, 10) : null;
      this.#render();
    }
  }

  /**
   * @inheritDoc
   */
  connectedCallback(): void {
    this.#stepSlot = this.#getRoot().querySelector('.contents slot');
    this.#headerContainer = this.#getRoot().querySelector('.header');
    this.#headerSlot = this.#getRoot().querySelector('.header slot');
    this.#stepSlot!.addEventListener('slotchange', () => {
      this.#render();
    });
    this.#headerSlot!.addEventListener('slotchange', () => {
      this.#render();
    });
    this.#render();
  }

  /**
   * Renders this component
   */
  #render() {
    const strStep = `${this.#step ?? 'none'}`;
    if (this.#stepSlot) {
      const stepNodes = this.#getStepNodes(this.#stepSlot.assignedElements());
      for (const node of stepNodes) {
        const isActive = node.getAttribute('step') === strStep;
        node.classList.toggle('active-step', isActive);
      }
    }
    if (this.#headerSlot && this.#headerContainer) {
      const stepNodes = this.#getStepNodes(this.#headerSlot.assignedElements());
      for (const node of stepNodes) {
        const isActive = node.getAttribute('step') === strStep;
        node.classList.toggle('active-step', isActive);
      }
    }
  }

  /**
   *
   * @param parents The parent nodes to get the child step nodes for
   */
  #getStepNodes(parents: Element[]): HTMLElement[] {
    const results: HTMLElement[] = [];
    parents.forEach((child) => {
      if (child instanceof HTMLElement) {
        const childStep = child.getAttribute('step') ?? child.getAttribute('data-step');
        if (childStep) {
          results.push(child);
        }
        child.querySelectorAll('[step]').forEach((desc) => {
          if (desc instanceof HTMLElement) {
            const descStep = desc.getAttribute('step') ?? desc.getAttribute('data-step');
            if (descStep) {
              results.push(desc);
            }
          }
        });
      }
    });
    return results;
  }

  /**
   * Gets the root element for the component
   */
  #getRoot(): HTMLElement {
    if (!this.#root) {
      this.#root = this.templateRoot.querySelector('.root');
    }
    return this.#root!;
  }
}

customElements.define('step-controller', StepControllerComponent);
