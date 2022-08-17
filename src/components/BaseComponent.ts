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
   * Invoked each time the custom element is appended into a document-connected element.
   * This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connectedCallback() {}

  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnectedCallback() {}

  /**
   * Invoked each time the custom element is moved to a new document.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  adoptedCallback() {}

  /**
   * Invoked each time one of the custom element's attributes is added, removed, or changed.
   * Which attributes to notice change for is specified in a static get _observedAttributes_ method
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {}

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
