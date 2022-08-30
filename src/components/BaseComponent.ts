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

  hasAttribute(qualifiedName: AttributeNames | BaseAttributeNames): boolean {
    return super.hasAttribute(qualifiedName);
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
  connectedCallback() {
    // placeholder
  }

  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnectedCallback() {
    // placeholder
  }

  /**
   * Invoked each time the custom element is moved to a new document.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  adoptedCallback() {
    // placeholder
  }

  /**
   * Invoked each time one of the custom element's attributes is added, removed, or changed.
   * Which attributes to notice change for is specified in a static get _observedAttributes_ method
   */
  attributeChangedCallback(_name: string, _oldValue: string | null, _newValue: string | null) {
    // placeholder
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
    this.templateRoot.innerHTML = (templateContent ?? '').replaceAll(
      '{{baseUrl}}',
      import.meta.env.BASE_URL ?? '',
    );
  }
}
