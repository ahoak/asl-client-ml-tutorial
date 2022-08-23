import '../../components/StepContainer';

import BaseComponent from '../../../../components/BaseComponent';
import {
  createIncompleteImplValidationError,
  createUnknownValidationError,
} from '../../../../utils/utils';
import type { StepContainerComponent } from '../../components/StepContainer';
import type { StepDisplayElement } from '../types';
import { defaultState } from './state';
import template from './template.html';
import type { ImportStepState } from './types';
import { validate } from './validate';

export const elementName = 'import-model-step';

export class ImportModelStep extends BaseComponent implements StepDisplayElement {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style'];
  }

  constructor() {
    super(template);
  }

  /**
   * True if the element is connected to the document
   */
  #connected = false;

  /**
   * The model import file element
   */
  #modelImportFileEle: HTMLInputElement | null = null;

  /**
   * The model import container element
   */
  #modelImportContainer: HTMLElement | null = null;

  /**
   * The model reset button
   */
  #modelResetButton: HTMLElement | null = null;

  /**
   * The step container element
   */
  #stepContainerEle: StepContainerComponent | null = null;

  /**
   * The internal step state (DONT USE DIRECTLY)
   */
  #__stepState: ImportStepState = {
    ...defaultState,
  };

  /**
   * Gets the current step state
   */
  get stepState(): ImportStepState {
    return this.#__stepState!;
  }

  /**
   * Sets the step state
   */
  set stepState(state: ImportStepState) {
    if (state !== this.#__stepState) {
      this.#__stepState = state;

      this?.toggleAttribute('valid', state.valid);
      this.#stepContainerEle?.toggleAttribute('valid', state.valid);
      this.#stepContainerEle?.setAttribute(
        'step-issues',
        state.validationIssues
          ? JSON.stringify(
              (state.validationIssues || []).map((n) => ({
                type: 'validation',
                message: n.detail,
              })),
            )
          : '',
      );
      if (this.#modelResetButton) {
        this.#modelResetButton.style.display = state.valid ? '' : 'none';
      }
      if (this.#modelImportContainer) {
        this.#modelImportContainer.style.display = state.valid ? 'none' : '';
      }
      this.dispatchEvent(
        new CustomEvent('stateChanged', {
          detail: state,
        }),
      );
    }
  }

  /**
   * The root of the app component
   */
  #__root: HTMLElement | null = null;
  get #root(): HTMLElement {
    if (!this.#__root) {
      this.#__root = this.templateRoot.querySelector('.root');
    }
    return this.#__root!;
  }

  /**
   * Listener for when the element is initialized
   */
  connectedCallback() {
    this.#connected = true;
    this.#stepContainerEle = this.#root.querySelector('.step-container');
    this.#modelImportContainer = this.#root.querySelector('.model-import-container');
    this.#modelResetButton = this.#root.querySelector('.model-reset-button');
    this.#modelResetButton?.addEventListener('click', () => {
      this.stepState = {
        valid: false,
        validationIssues: createIncompleteImplValidationError('No model data selected!').errors,
        data: null,
      };
    });

    this.#modelImportFileEle = this.#root.querySelector('.model-import-file');
    this.#modelImportFileEle?.addEventListener(
      'change',
      () => void this.#loadStateFromFileElement(),
    );

    void this.#loadStateFromFileElement();
  }

  /**
   * Listener for when the element is removed from the dom
   */
  disconnectedCallback() {
    this.#connected = false;
  }

  /**
   * Syncronizes the internal state with the elements on the page
   */
  async #loadStateFromFileElement() {
    const state: ImportStepState = {
      valid: false,
      data: null,
    };
    const files = this.#modelImportFileEle?.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const fileData = await file.arrayBuffer();
        Object.assign(state, await validate(fileData));
      } catch (e) {
        state.valid = false;
        state.validationIssues = createUnknownValidationError(
          `Could not load zip file, ${e}`,
        ).errors;
        console.error(e);
      }

      // Clear it out, we're done with it
      this.#modelImportFileEle!.value = '';
    } else {
      state.valid = false;
      state.validationIssues =
        createIncompleteImplValidationError('No model data selected!').errors;
    }

    this.stepState = Object.freeze(state);
  }
}

customElements.define(elementName, ImportModelStep);
