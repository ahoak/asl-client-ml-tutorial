import '../IssueDisplay';

import BaseComponent from '../BaseComponent';
import type { CodeEditorChangeEventArgs, CodeEditorComponent, CodeIssue } from '../CodeEditor';
import type { CodeIssueDisplayComponent } from '../IssueDisplay';
import template from './template.html';
import type { RawValidationIssue } from './types';

const attributes = ['name', 'code', 'validation-issues', 'syntax-issues', 'validating'] as const;
export class CodeStepComponent extends BaseComponent<typeof attributes[number]> {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style', 'name', 'code', 'validation-issues', 'syntax-issues', 'validating'];
  }

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #root: HTMLElement | null = null;
  #nameEle: HTMLElement | null = null;
  #successContainer: HTMLElement | null = null;
  #issueContainer: HTMLElement | null = null;
  #issueDisplay: CodeIssueDisplayComponent | null = null;
  #codeEditorEle: CodeEditorComponent | null = null;
  #connected = false;
  #syntaxIssues: CodeIssue[] = [];
  #hasCodeChanged = false;
  #validationIssues: CodeIssue[] = [];
  #firstRender = true;

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'validation-issues') {
      this.#validationIssues = (
        JSON.parse(this.getAttribute('validation-issues') ?? '[]') as RawValidationIssue[]
      ).map((n) => ({
        type: 'validation',
        message: n.detail,
      }));
    } else if (name === 'syntax-issues') {
      this.#syntaxIssues = JSON.parse(this.getAttribute('syntax-issues') ?? '[]') as CodeIssue[];
    }
    this.#render(name, newValue);
  }

  /**
   * Listener for when the element is initialized
   */
  connectedCallback() {
    this.#nameEle = this.#getRoot().querySelector('.name');
    this.#codeEditorEle = this.#getRoot().querySelector('.code-editor');
    this.#successContainer = this.#getRoot().querySelector('.validate-success');
    this.#issueContainer = this.#getRoot().querySelector('.issue-container');
    this.#issueDisplay = this.#getRoot().querySelector('.issue-display');

    this.#codeEditorEle!.addEventListener('change', (rawEvent: Event) => {
      const event = rawEvent as CustomEvent<CodeEditorChangeEventArgs>;
      this.#hasCodeChanged = true;

      const issues = (event.detail.issues ?? []).filter(
        (n) => n.type === 'error' || n.type === 'warning',
      );
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            ...event.detail,
            hasSyntaxErrors: issues.filter((n) => n.type === 'error').length > 0,
          },
        }),
      );

      this.setAttribute('syntax-issues', JSON.stringify(issues ?? []));
      this.#render();
    });

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
  #render(attribute: string | null = null, attribValue: string | null = null) {
    if (this.#connected) {
      if (this.#firstRender || !attribute || attribute === 'style') {
        attribValue = attribute ? attribValue : this.getAttribute('style');
        this.#getRoot().style.cssText = attribValue!;
      }
      if (this.#firstRender || !attribute || attribute === 'name') {
        attribValue = attribute ? attribValue : this.getAttribute('name');
        this.#nameEle!.innerHTML = attribValue!;
      }
      if (
        this.#firstRender ||
        !attribute ||
        attribute === 'validation-issues' ||
        attribute === 'syntax-issues'
      ) {
        this.#issueDisplay!.setAttribute(
          'issues',
          JSON.stringify(
            this.#syntaxIssues.length > 0 ? this.#syntaxIssues : this.#validationIssues,
          ),
        );
      }
      if (this.#firstRender || attribute === 'code') {
        attribValue = (attribute ? attribValue : this.getAttribute('code')) ?? '';
        this.#codeEditorEle!.setAttribute('placeholder', attribValue);
      }

      const hasIssues = this.#syntaxIssues.length > 0 || this.#validationIssues.length > 0;
      this.#issueContainer!.style.display = hasIssues ? 'block' : 'none';
      this.#successContainer!.style.display = this.#hasCodeChanged && !hasIssues ? 'block' : 'none';
    }
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

customElements.define('code-step', CodeStepComponent);
