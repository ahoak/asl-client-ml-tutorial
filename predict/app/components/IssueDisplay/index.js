import template from "./template.html";
import BaseComponent from "../BaseComponent";
import { ERROR_SEVERITY, WARNING_SEVERITY, INFO_SEVERITY } from '../CodeEditor/constants'

export class CodeEditorIssueDisplay extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ["style", "issues"];
  }

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #root = null;
  #connected = false;

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Make our "style", match the host value
    if (name == "style") {
      this.#getRoot().style.cssText = newValue;
    } else if (name === "issues") {
      this.#render();
    }
  }

  /**
   * Listener for when the element is initialized
   */
  async connectedCallback() {
    this.#connected = true;
    this.#render();
  }

  /**
   * Listener for when the element is removed from the dom
   */
  async disconnectedCallback() {
    this.#connected = false;
  }

  /**
   * Renders this component
   */
  #render() {
    const root = this.#getRoot();
    root.innerHTML = "";

    const issueStr = this.getAttribute("issues");
    if (issueStr) {
      const issues = JSON.parse(issueStr)
        .sort((a, b) => b.severity - a.severity)
      for (const error of issues) {
        const locationStr = error.startLineNumber ? `(${error.startLineNumber}:${error.startColumn})` : ''
        const errorEle = document.createElement("div");
        errorEle.className = `issue-container`
        errorEle.innerHTML = `
          <div class="issue ${this.#getSeverityClass(error.severity)}">
            <div class="severity-display">${this.#getSeverityText(error.severity)}${locationStr}</div>
            <div class="detail">${error.message}</div>
          </div>
        `
        root.appendChild(errorEle)
      }
    }
  }

  /**
   * Gets a classname for the given severity
   * @param {number} severity The severity
   */
  #getSeverityClass(severity) {
    if (severity != null) {
      if (severity === ERROR_SEVERITY) {
        return 'error'
      } else if (severity === WARNING_SEVERITY) {
        return 'warning'
      } else if (severity === INFO_SEVERITY) {
        return 'info'
      } else {
        return 'hint'
      }
    }
    return ''
  }

  /**
   * Gets a text for the given severity
   * @param {number} severity The severity
   */
  #getSeverityText(severity) {
    if (severity != null) {
      if (severity === ERROR_SEVERITY) {
        return 'Error'
      } else if (severity === WARNING_SEVERITY) {
        return 'Warning'
      } else if (severity === INFO_SEVERITY) {
        return 'Info'
      } else {
        return 'Hint'
      }
    }
    return ''
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

customElements.define("code-editor-issue-display", CodeEditorIssueDisplay);
