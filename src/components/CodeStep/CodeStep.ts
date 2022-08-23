import '../IssueDisplay';

import BaseComponent from '../BaseComponent';
import type { CodeEditorChangeEventArgs, CodeEditorComponent, CodeIssue } from '../CodeEditor';
import type { CodeIssueDisplayComponent } from '../IssueDisplay';
import template from './template.html?raw';
import type { RawValidationIssue } from './types';

export type CodeStepChangeEventArgs = CodeEditorChangeEventArgs & {
  hasSyntaxErrors: boolean;
};
export type CodeStepChangeEvent = CustomEvent<CodeStepChangeEventArgs>;

const attributes = ['name', 'code', 'validation-issues', 'syntax-issues', 'validating'] as const;
export class CodeStepComponent extends BaseComponent<typeof attributes[number]> {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return [
      'style',
      'name',
      'code',
      'validation-issues',
      'syntax-issues',
      'validating',
      'readonly',
    ];
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
  #codeEditorEle: CodeEditorComponent | null = null;
  #connected = false;
  #syntaxIssues: CodeIssue[] = [];
  #validationIssues: CodeIssue[] = [];
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
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === 'validation-issues') {
      this.#validationIssues = (
        JSON.parse(this.getAttribute('validation-issues') ?? '[]') as RawValidationIssue[]
      ).map((n) => ({
        type: 'validation',
        message: n.detail,
      }));
    } else if (name === 'syntax-issues') {
      this.#syntaxIssues = JSON.parse(this.getAttribute('syntax-issues') ?? '[]') as CodeIssue[];
    } else if (name === 'readonly') {
      this.#codeEditorEle?.toggleAttribute('readonly', newValue === null);
    }
    this.#render(name, newValue ?? '');
  }

  /**
   * Listener for when the element is initialized
   */
  connectedCallback() {
    this.#nameEle = this.#root.querySelector('.name');
    this.#codeEditorEle = this.#root.querySelector('.code-editor');
    this.#successContainer = this.#root.querySelector('.validate-success');
    this.#validatingContainer = this.#root.querySelector('.validate-container');
    this.#validateProgressContainer = this.#root.querySelector('.validate-progress');
    this.#issueContainer = this.#root.querySelector('.issue-container');
    this.#issueDisplay = this.#root.querySelector('.issue-display');

    this.#codeEditorEle!.addEventListener('change', (rawEvent: Event) => {
      const event = rawEvent as CustomEvent<CodeEditorChangeEventArgs>;
      const issues = (event.detail.issues ?? []).filter(
        (n) => n.type === 'error' || n.type === 'warning',
      );

      this.setAttribute('code', event.detail.code);
      this.setAttribute('transpiled-code', event.detail.transpiledCode);
      this.setAttribute('syntax-issues', JSON.stringify(issues ?? []));

      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            ...event.detail,
            hasSyntaxErrors: issues.filter((n) => n.type === 'error').length > 0,
          },
        }),
      );

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
  #render(attribute: string | null = null, attribValue?: string) {
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
      if (
        this.#hasAttributeChanged('validation-issues', attribute) ||
        this.#hasAttributeChanged('syntax-issues', attribute)
      ) {
        this.#issueDisplay!.setAttribute(
          'issues',
          JSON.stringify(
            this.#syntaxIssues.length > 0 ? this.#syntaxIssues : this.#validationIssues,
          ),
        );
      }

      if (this.#hasAttributeChanged('code', attribute)) {
        attribValue = attribValue ?? this.getAttribute('code') ?? '';
        if (attribValue !== this.#codeEditorEle!.getAttribute('code')) {
          this.#codeEditorEle!.setAttribute('code', attribValue);
        }
      }

      this.#codeEditorEle?.toggleAttribute('readonly', this.hasAttribute('readonly'));

      const hasIssues = this.#syntaxIssues.length > 0 || this.#validationIssues.length > 0;
      this.#issueContainer!.style.display = hasIssues ? 'block' : 'none';
      this.#successContainer!.style.display = !hasIssues ? 'block' : 'none';
    }
  }

  #hasAttributeChanged(attributeName: string, attribute: string | null): boolean {
    return this.#firstRender || !attribute || attribute === attributeName;
  }
}

customElements.define('code-step', CodeStepComponent);
