import appTemplate from "./app.html";
import BaseComponent from "../BaseComponent";
import '../Predictions';
import '../CodeStep';
import { loadZippedModelFromGlitch } from "../../../model/load";
import { validate, steps } from "../../../model/validate";

export class AppComponent extends BaseComponent {

  /**
   * The root of the app component
   */
  #appRoot = null;
  #predictions = null;
  #setupInstructions = null;
  #model = null;
  #connected = false;

  /**
   * The root element of the template
   */
  constructor() {
    super(appTemplate);
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Make our "style", match the host value
    if (name == "style") {
      this.#getRoot().style.cssText = newValue;
    }
  }

  /**
   * Listener for when the element is initialized
   */
  async connectedCallback() {
    console.log("App loaded");
    const root = this.#getRoot();
    this.#predictions = root.querySelector(".predictions");
    this.#setupInstructions = root.querySelector(".intstructions-container");
    this.#setupInstructions.innerHTML = "";
    const model = await loadZippedModelFromGlitch("model.zip");
    this.#model = model;
    
    const that = this;
    for (let i = 0; i < steps.length; i++) {
      const step = this.#createStep(steps[i])
      step.definition = steps[i]
      this.#setupInstructions.append(step)
    }

    this.#connected = true;
    this.#render()
  }
  
  disconnectedCallback() {
    this.#connected = false;
  }
  
  #createStep(stepDef) {
    const stepEle = document.createElement('code-step')
    stepEle.addEventListener('change', async (event) => {
      if (!event.detail.hasSyntaxErrors) {
        try {
          const newImpl = new Function(`return ${(event.detail.code)}`)();
          const results = await stepDef.validate(newImpl)
          if (results.valid) {
            stepDef.template = newImpl
          }
          stepEle.setAttribute("validation-issues", JSON.stringify(results.errors ?? []))
        } catch (e) {
          stepEle.setAttribute("validation-issues", JSON.stringify([]))
        }
      }
    })
    stepEle.setAttribute('code', `${stepDef.template}`)
    return stepEle
  }

  async #render() {
    if (this.#connected) {
      const { valid } = await validate();

      if (valid) {
        this.#predictions.style.display = "block";
        this.#predictions.model = this.#model;
      } else {
        this.#predictions.style.display = "none";
      }
    }
  }

  /**
   * Gets the root element for the component
   */
  #getRoot() {
    if (!this.#appRoot) {
      this.#appRoot = this.templateRoot.querySelector(".root");
    }
    return this.#appRoot;
  }
}

customElements.define("app-component", AppComponent);
