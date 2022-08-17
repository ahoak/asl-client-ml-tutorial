import '../../../../components/IssueDisplay';

import BaseComponent from '../../../../components/BaseComponent';
import type { CodeIssueDisplayComponent } from '../../../../components/IssueDisplay';
import type { CodeIssue } from '..';
import template from './template.html';

const attributes = ['style', 'name', 'step-issues', 'valid', 'validating'] as const;
type AttributeName = typeof attributes[number];
export class StepContainerComponent extends BaseComponent<AttributeName> {
  /**
   * The list of observed attributes
   */
  static get observedAttributes(): AttributeName[] {
    return ['style', 'name', 'step-issues', 'validating', 'valid'];
  }

  constructor() {
    super(template);
  }

  #nameEle: HTMLElement | null = null;
  #successContainer: HTMLElement | null = null;
  #issueContainer: HTMLElement | null = null;
  #validatingContainer: HTMLElement | null = null;
  #validateProgressContainer: HTMLElement | null = null;
  #issueDisplay: CodeIssueDisplayComponent | null = null;
  #connected = false;
  #stepIssues: CodeIssue[] = [];
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
    if (name === 'step-issues') {
      this.#stepIssues = JSON.parse(this.getAttribute('step-issues') || '[]') as CodeIssue[];
    }
    this.#render(name, newValue ?? '');
  }

  /**
   * Listener for when the element is initialized
   */
  connectedCallback() {
    this.#nameEle = this.#root.querySelector('.name');
    this.#successContainer = this.#root.querySelector('.validate-success');
    this.#validatingContainer = this.#root.querySelector('.validate-container');
    this.#validateProgressContainer = this.#root.querySelector('.validate-progress');
    this.#issueContainer = this.#root.querySelector('.issue-container');
    this.#issueDisplay = this.#root.querySelector('.issue-display');

    this.#connected = true;
    this.#render();
    this.#firstRender = false;
  }

  /**
   * Listener for when the element is removed from the dom
   */
  disconnectedCallback() {
    this.#connected = false;
  }

  /**
   * Renders this component
   */
  #render(attribute: AttributeName | null = null, attribValue?: string) {
    if (this.#connected) {
      if (this.#hasAttributeChanged('style', attribute)) {
        this.#root.style.cssText = attribValue ?? this.getAttribute('style') ?? '';
      }
      if (this.#hasAttributeChanged('name', attribute)) {
        this.#nameEle!.innerHTML = attribValue ?? this.getAttribute('name') ?? ''!;
      }
      if (this.#hasAttributeChanged('validating', attribute)) {
        const isValidating = this.hasAttribute('validating');
        this.#validateProgressContainer!.style.display = isValidating ? '' : 'none';
      }
      if (this.#hasAttributeChanged('step-issues', attribute)) {
        this.#issueDisplay!.setAttribute('issues', JSON.stringify(this.#stepIssues));
      }

      const hasIssues = this.#stepIssues.length > 0;
      this.#issueContainer!.style.display = hasIssues ? 'block' : 'none';
      this.#successContainer!.style.display = this.hasAttribute('valid') ? 'block' : 'none';
    }
  }

  #hasAttributeChanged(attributeName: AttributeName, attribute: AttributeName | null): boolean {
    return this.#firstRender || !attribute || attribute === attributeName;
  }
}

customElements.define('step-container', StepContainerComponent);
