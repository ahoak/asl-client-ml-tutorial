import BaseComponent from '../BaseComponent';
import type { CodeIssue, CodeIssueType } from '../CodeEditor';
import template from './template.html?raw';

const attributes = ['issues'];
type IssueAttributeNames = typeof attributes[number];
export class CodeIssueDisplayComponent extends BaseComponent<IssueAttributeNames> {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style', 'issues'];
  }

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #root: HTMLElement | null = null;

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    // Make our "style", match the host value
    if (name === 'style') {
      this.#getRoot().style.cssText = newValue ?? '';
    } else if (name === 'issues') {
      this.#render();
    }
  }

  /**
   * Listener for when the element is initialized
   */
  connectedCallback() {
    this.#render();
  }

  /**
   * Renders this component
   */
  #render() {
    const root = this.#getRoot();
    root.innerHTML = '';

    const issueStr = this.getAttribute('issues');
    if (issueStr) {
      const issues = JSON.parse(issueStr) as CodeIssue[];
      for (const error of issues) {
        const locationStr = error.startLineNumber
          ? `(${error.startLineNumber ?? ''}:${error.startColumn ?? ''})`
          : '';
        const errorEle = document.createElement('div');
        errorEle.className = `issue-container`;
        errorEle.innerHTML = `
          <div class="issue ${error.type}">
            <div class="issue-type">${this.#getFriendlyIssueType(error.type)}${locationStr}</div>
            <div class="detail">${error.message ?? error.detail ?? ''}</div>
          </div>
        `;
        root.appendChild(errorEle);
      }
    }
  }

  /**
   * Gets a text for the given issue type
   * @param {CodeIssueType} type The type
   */
  #getFriendlyIssueType(type: CodeIssueType) {
    if (type != null) {
      if (type === 'error') {
        return 'Error';
      } else if (type === 'warning') {
        return 'Warning';
      } else if (type === 'info') {
        return 'Info';
      } else if (type === 'validation') {
        return 'Validation';
      } else {
        return 'Hint';
      }
    }
    return '';
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

customElements.define('code-issue-display', CodeIssueDisplayComponent);
