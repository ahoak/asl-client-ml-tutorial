import { loadMonaco } from '../../utils/monaco'
import template from "./template.html";
import BaseComponent from "../BaseComponent";
import '../IssueDisplay'
import { WARNING_SEVERITY } from './constants';

export class CodeEditorComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ["style", "placeholder", "hide-errors"];
  }

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #root = null;
  #placeholder = null;
  #editor = null;
  #monaco = null;
  #model = null;
  #issueDisplayEle = null;
  #issueContainerEle = null;
  #codeEditorEle = null;
  #resizeObserver = null;
  #connected = false;

  /**
   * Gets whether or not errors are hidden
   */
  get hideErrors() {
	return this.hasAttribute("hide-errors")
  }

  /**
   * Hides or shows the error display
   */
  set hideErrors(value) {
	if (value) {
		this.setAttribute('hide-errors', '')
	} else {
		this.removeAttribute('hide-errors')
	}
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Make our "style", match the host value
    if (name == "style") {
      this.#getRoot().style.cssText = newValue;
    } else if (name === "placeholder") {
      this.#placeholder = newValue ?? 'function placeholder() {\n}';
	  if (this.#model) {
		this.#model.setValue(this.#placeholder)
	  }
    } else if (name === 'hide-errors') {
		if (this.#issueContainerEle) {
			this.#issueContainerEle.style.display = 'none'
		}
	}
  }

  /**
   * Listener for when the element is initialized
   */
  async connectedCallback() {
    this.#issueDisplayEle = this.#getRoot().querySelector('.issue-display');
    this.#issueContainerEle = this.#getRoot().querySelector('.issue-container');
	this.#codeEditorEle = this.#getRoot().querySelector('.editor-container');
    this.#monaco = await loadMonaco(this.#codeEditorEle);
    this.#editor = this.#monaco.editor.create(this.#codeEditorEle, {
      value: this.getAttribute("placeholder") ?? "",
      language: "typescript",
    });
	
    this.#resizeObserver = new ResizeObserver(() => {
		this.#layoutEditor();
	});
	this.#resizeObserver.observe(this.#getRoot());

    this.#model = this.#editor.getModel();
	let lastMarkerKey = ''
	let lastCode = ''
    this.#model.onDidChangeDecorations((event) => {
      const markers = this.#monaco.editor.getModelMarkers({
        resource: this.#model.uri,
      });
	  const newMarkerKey = markers.map(n => `${n.code}:${n.severity}`).join(",")
      const newCode = this.#model.getValue()
	  if (newCode !== lastCode || newMarkerKey !== lastMarkerKey) {
		lastCode = newCode
		lastMarkerKey = newMarkerKey
		this.dispatchEvent(
			new CustomEvent("change", {
				detail: {
					code: lastCode,
					issues: markers,
				},
			})
		);

		const issuesToDisplay = markers.filter(n => n.severity > WARNING_SEVERITY);
		this.#issueDisplayEle.setAttribute('issues', JSON.stringify(issuesToDisplay))

		if (!this.hideErrors) {
			const oldDisplay = this.#issueContainerEle.style.display
			const newDisplay = issuesToDisplay.length > 0 ? "block" : 'none';
			if (oldDisplay !== newDisplay) {
				this.#issueContainerEle.style.display = newDisplay
				this.#layoutEditor()
			}
		} else {
			this.#issueContainerEle.style.display = 'none';
		}
      }
    });

    this.#connected = true;
  }

  /**
   * Listener for when the element is removed from the dom
   */
  async disconnectedCallback() {
    this.#connected = false;
	if (this.#resizeObserver) {
		this.#resizeObserver.disconnect();
		this.#resizeObserver = null;
	}
  }

  /**
   * Forces an editor layout
   */
  #layoutEditor() {
	if (this.#editor) {
		this.#editor.layout();
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

customElements.define("code-editor", CodeEditorComponent);
