import template from "./template.html";
import BaseComponent from "../BaseComponent";
import '../CodeEditor'
import '../IssueDisplay'
import { fastDebounce } from "../../utils/common";

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
  #successContainer = null;
  #issueContainer = null;
  #issueDisplay = null;
  #codeEditorEle = null;
  #connected = false;
  #syntaxIssues = null;
  #validateProgress = null;

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
    this.#successContainer = this.#getRoot().querySelector(".validate-success");
    this.#validateProgress = this.#getRoot().querySelector(".validate-progress");
    this.#issueContainer = this.#getRoot().querySelector(".issue-container");
    this.#issueDisplay = this.#getRoot().querySelector(".issue-display");
    this.#nameEle.innerHTML = this.getAttribute("name");
    this.#codeEditorEle.setAttribute('placeholder', this.getAttribute('code') ?? '')

    const that = this
    this.#codeEditorEle.addEventListener('change', async (event) => {
      this.#issueContainer.style.display = 'none'
      this.#validateProgress.style.display = 'flex'
      this.#successContainer.style.display = 'none'

      const issues = (event.detail.issues ?? []).filter(n => n.type === 'error' || n.type === 'warning')
      that.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            ...event.detail,
            hasSyntaxErrors: issues.filter(n => n.type === 'error').length > 0
          },
        })
      );
      this.#syntaxIssues = issues ?? []
      this.#render()
    })

    this.#connected = true;
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
  #render = fastDebounce(async (attribute, attribValue = null) => {
    if (this.#connected) {
      if (!attribute || attribute === 'name') {
        attribValue = attribute ? attribValue : this.getAttribute("name")
        if (this.#model) { 
          this.#nameEle.innerHTML = attribValue;
        }
      }
      if (!attribute || attribute === 'validation-issues') {
        const issues = (this.#syntaxIssues ?? []).slice(0)
        const syntaxErrors = issues.filter(n => n.type === 'error')
        
        // If we have no code errors, then try validation
        if (syntaxErrors.length === 0) {
          const validationIssues = JSON.parse(this.getAttribute('validation-issues') ?? '[]')
          issues.push(...(validationIssues ?? []).map(n => ({
            type: 'validation',
            message: n.detail
          })))
        }
        this.#issueContainer.style.display = issues.length > 0 ? "block" : 'none'
        this.#issueDisplay.setAttribute("issues", JSON.stringify(issues))

        this.#validateProgress.style.display = 'none'
        this.#successContainer.style.display = issues.length === 0 ? "block" : 'none'
      }
    }
  }, 1000)

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
