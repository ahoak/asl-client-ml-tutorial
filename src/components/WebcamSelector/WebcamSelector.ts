import type { Select } from '@fluentui/web-components';

import BaseComponent from '../BaseComponent';
import template from './template.html?raw';

export class WebcamSelectorComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style', 'class'];
  }

  /**
   * The select element
   */
  #selectElement: Select | null = null;

  /**
   * The root element of the template
   */
  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #__root: HTMLElement | null = null;
  get #root(): HTMLElement {
    if (!this.#__root) {
      this.#__root = this.templateRoot.querySelector('.root');
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.#__root!;
  }

  /**
   * Gets the selected device id
   */
  get selectedDeviceId(): string | null {
    return this.#selectElement?.currentValue ?? null;
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    // Make our "style", match the host value
    if (name === 'style') {
      this.#root.style.cssText = newValue ?? '';
    } else if (name === 'class') {
      this.#root.className = `root ${newValue ?? ''}`;
    }
  }

  /**
   * Callback for when the element is attached to a document somewhere
   */
  connectedCallback() {
    this.#selectElement = this.#root.querySelector('.select-element');
    this.#selectElement?.addEventListener('change', () => this.#handleSelectChanged());

    void this.#loadSelectElement();
  }

  /**
   * Loads the select element
   */
  async #loadSelectElement() {
    if (this.#selectElement) {
      let options = '';
      const devices = await navigator.mediaDevices.enumerateDevices();
      let foundDevice = false;
      let selectedDevice: string | null = null;
      for (const device of devices) {
        if (device.kind === 'videoinput') {
          foundDevice = true;
          selectedDevice = device.deviceId;
          options += `<option value="${device.deviceId}">${device.label}</option>`;
        }
      }

      this.#selectElement.value = selectedDevice ?? '';

      if (!foundDevice) {
        options = '<option>No video devices found!</option>';
      }
      this.#selectElement.innerHTML = options;
      this.#handleSelectChanged();
    }
  }

  /**
   * Handler for when the webcam selector is changed
   */
  #handleSelectChanged() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          deviceId: this.selectedDeviceId,
        },
      }),
    );
  }
}

customElements.define('webcam-selector', WebcamSelectorComponent);
