/**
 * Provides from basic scaffolding for defining a component in the app
 */
export default class BaseComponent extends HTMLElement {
  
  /**
   * The root element of the template
   */
  templateRoot = null;
  
  /**
   * The constructor for the component
   * @param {string?} template The HTML template for the component
   */
  constructor(template) {
    super();

    this.#initElement(true, template);
  }

  /**
   * Initializes this element
   */
  #initElement(shadow = false, templateContent) {
    if (shadow) {
      this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
      this.templateRoot = this.shadowRoot;
    } else {
      this.templateRoot = this;
    }
    this.templateRoot.innerHTML = templateContent ?? '';
  };
}