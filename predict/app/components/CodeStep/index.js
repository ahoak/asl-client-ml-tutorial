import template from "./template.html";
import BaseComponent from "../BaseComponent";
import '../CodeEditor'
import '../IssueDisplay'
import { ERROR_SEVERITY, WARNING_SEVERITY } from "../CodeEditor/constants";

export class CodeStepComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ["style", "name", "code", "validation-issues"];
  }

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #root = null;
  #model = null;
  #nameEle = null;
  #issueContainer = null;
  #issueDisplay = null;
  #codeEditorEle = null;
  #connected = false;
  #syntaxIssues = null;

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Make our "style", match the host value
    if (name == "style") {
      this.#getRoot().style.cssText = newValue;
    } else if (name === 'code') {
      if (this.#codeEditorEle) {
        this.#codeEditorEle.setAttribute('placeholder', this.getAttribute('code'))
      }
    }
    this.#render(name, newValue);
  }

  /**
   * Listener for when the element is initialized
   */
  async connectedCallback() {
    this.#nameEle = this.#getRoot().querySelector(".name");
    this.#codeEditorEle = this.#getRoot().querySelector(".code-editor");
    this.#issueContainer = this.#getRoot().querySelector(".issue-container");
    this.#issueDisplay = this.#getRoot().querySelector(".issue-display");
    this.#nameEle.innerHTML = this.getAttribute("name");
    this.#codeEditorEle.setAttribute('placeholder', this.getAttribute('code') ?? '')

    const that = this
    this.#codeEditorEle.addEventListener('change', async (event) => {
      const issues = (event.detail.issues ?? []).filter(n => n.severity >= WARNING_SEVERITY)
      that.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            ...event.detail,
            hasSyntaxErrors: issues.filter(n => n.severity === ERROR_SEVERITY).length > 0
          },
        })
      );
      this.#syntaxIssues = issues ?? []
      this.#render()
    })

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
  async #render(attribute, attribValue = null) {
    if (this.#connected) {
      if (!attribute || attribute === 'name') {
        attribValue = attribute ? attribValue : this.getAttribute("name")
        if (this.#model) {
          this.#nameEle.innerHTML = attribValue;
        }
      }
      if (!attribute || attribute === 'validation-issues') {
        const issues = (this.#syntaxIssues ?? []).slice(0)
        const syntaxErrors = issues.filter(n => n.severity >= ERROR_SEVERITY)
        
        // If we have no code errors, then try validation
        if (syntaxErrors.length === 0) {
          const validationIssues = JSON.parse(this.getAttribute('validation-issues') ?? '[]')
          issues.push(...(validationIssues ?? []).map(n => ({
            severity: 8,
            message: n.detail
          })))
        }
        this.#issueContainer.style.display = issues.length > 0 ? "block" : 'none'
        this.#issueDisplay.setAttribute("issues", JSON.stringify(issues))
      }
    }
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

customElements.define("code-step", CodeStepComponent);
