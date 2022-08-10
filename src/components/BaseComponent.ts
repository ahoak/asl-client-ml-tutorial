const baseAttributes = ['style', 'class'];
type BaseAttributeNames = typeof baseAttributes[number];

/**
 * Provides from basic scaffolding for defining a component in the app
 */
export default class BaseComponent<AttributeNames extends string = any> extends HTMLElement {
  /**
   * The root element of the template
   */
  templateRoot!: HTMLElement;

  /**
   * The constructor for the component
   * @param {string?} template The HTML template for the component
   */
  constructor(template?: string) {
    super();

    this.#initElement(true, template);
  }

  getAttribute(qualifiedName: AttributeNames | BaseAttributeNames): string | null {
    return super.getAttribute(qualifiedName);
  }

  setAttribute(qualifiedName: AttributeNames | BaseAttributeNames, value: string): void {
    return super.setAttribute(qualifiedName, value);
  }

  /**
   * Initializes this element
   */
  #initElement(shadow = false, templateContent: string | undefined) {
    if (shadow) {
      this.attachShadow({ mode: 'open' }); // sets and returns 'this.shadowRoot'
      this.templateRoot = (this.shadowRoot ?? this) as HTMLElement;
    } else {
      this.templateRoot = this;
    }
    this.templateRoot.innerHTML = templateContent ?? '';
  }
}
