import BaseComponent from '../../../../components/BaseComponent';
import template from './template.html?raw';

export class StepControllerComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style', 'class', 'step', 'max-step'];
  }

  /**
   * The root of the component
   */
  #root: HTMLElement | null = null;

  /**
   * The next button of the component
   */
  #nextButton: HTMLElement | null = null;

  /**
   * The current step
   */
  #step: number | null = null;

  /**
   * The max step
   */
  #maxStep: number | null = null;

  /**
   * The slot where child steps are placed
   */
  #stepSlot: HTMLSlotElement | null = null;

  /**
   * The slot where child steps are placed
   */
  #buttonsSlot: HTMLSlotElement | null = null;

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
   * Gets the max step
   */
  get maxStep(): number {
    return this.#maxStep ?? 0;
  }

  /**
   * Sets the max step
   */
  set maxStep(value: number) {
    if (value > 0 && value !== this.maxStep) {
      this.setAttribute('max-step', `${value ?? '0'}`);
    } else {
      throw new Error('max-step must be an integer greater than 0');
    }
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    // Make our "style", match the host value
    if (name === 'style') {
      this.#getRoot().style.cssText = newValue ?? '';
    } else if (name === 'step') {
      this.#step = newValue ? parseInt(newValue, 10) : null;
      this.dispatchEvent(
        new CustomEvent('stepChanged', {
          detail: {
            step: this.#step ?? 0,
          },
        }),
      );
    } else if (name === 'max-step') {
      this.#maxStep = newValue ? +newValue : 0;
    }
    this.#render();
  }

  /**
   * @inheritDoc
   */
  connectedCallback(): void {
    this.#stepSlot = this.#getRoot().querySelector('.contents slot');
    this.#headerSlot = this.#getRoot().querySelector('.header slot');
    this.#buttonsSlot = this.#getRoot().querySelector('.buttons slot');
    this.#nextButton = this.#getRoot().querySelector('.next-button');
    this.#nextButton?.addEventListener('click', () => (this.step = (this.step ?? 0) + 1));
    this.#stepSlot?.addEventListener('slotchange', () => this.#render());
    this.#headerSlot?.addEventListener('slotchange', () => this.#render());
    this.#buttonsSlot?.addEventListener('slotchange', () => this.#render());
    this.#render();
  }

  /**
   * Renders this component
   */
  #render() {
    const strStep = `${this.#step ?? 'none'}`;
    if (this.#stepSlot) {
      this.#updateSlotClasses(this.#stepSlot, strStep);
    }
    if (this.#headerSlot) {
      this.#updateSlotClasses(this.#headerSlot, strStep);
    }
    if (this.#buttonsSlot) {
      this.#updateSlotClasses(this.#buttonsSlot, strStep);
    }

    if (this.#nextButton) {
      const hasNext = (this.step ?? 0) < this.maxStep;
      this.#nextButton.toggleAttribute('disabled', !hasNext);
      this.#nextButton.part.toggle('disabled', !hasNext);
    }
  }

  /**
   * Updates the classes on the slot elements
   * @param slot The slot to update the step classes for
   * @param strStep The string value of the step
   */
  #updateSlotClasses(slot: HTMLSlotElement, strStep: string) {
    const stepNodes = this.#getStepNodes(slot.assignedElements());
    for (const node of stepNodes) {
      const isActive = node.getAttribute('step') === strStep;
      node.classList.toggle('active-step', isActive);
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
