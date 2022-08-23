import type { ValidationResult } from '../../../../types';
import { createUnknownValidationError } from '../../../../utils/utils';
import type {
  CodeEditorChangeEvent,
  CodeEditorChangeEventArgs,
  CodeEditorComponent,
  CodeIssue,
  CodeIssueType,
  StepContainerComponent,
} from '../../components';
import { BaseComponent } from '../../components';
import { createImplForStepCode } from '../helpers/createImplForCode';
import type { CodeStepState, PredictPipelineState, StepState } from '../types';
import defaultTemplate from './template.html?raw';

type ValidationFunction<StateType extends StepState> = (
  state: StateType,
  pipelineState: PredictPipelineState | null,
) => Promise<ValidationResult>;

export abstract class CodeStepBaseComponent<StateType extends CodeStepState> extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style'];
  }

  /**
   * The root of the app component
   */
  #connected = false;

  /**
   * The code editor
   */
  #codeEditor: CodeEditorComponent | null = null;

  /**
   * The step container element
   */
  #stepContainerEle: StepContainerComponent | null = null;

  /**
   * The toggle solution button
   */
  #toggleSolutionButton: HTMLElement | null = null;

  /**
   * The solution container element
   */
  #solutionEditorEle: HTMLElement | null = null;

  /**
   * The internal step state (DONT USE DIRECTLY)
   */
  #__stepState: StateType;

  /**
   * The default code
   */
  readonly defaultCode: string;

  /**
   * The solution code
   */
  readonly solutionCode: string | null;

  /**
   * The success message
   */
  readonly successMessage: string | null;

  /**
   * The validation function
   */
  readonly validate: ValidationFunction<StateType>;

  /**
   * True if the editor is readonly
   */
  readonly readonly: boolean;

  constructor({
    defaultCode,
    defaultState,
    solutionCode,
    readonly,
    validate,
    template = defaultTemplate,
    successMessage,
  }: {
    defaultCode: string;
    solutionCode?: string | null;
    readonly?: boolean;
    defaultState: StateType;
    validate: ValidationFunction<StateType>;
    template?: string;
    successMessage?: string;
  }) {
    super(template);

    this.defaultCode = defaultCode;
    this.solutionCode = solutionCode ?? null;
    this.successMessage = successMessage ?? null;
    this.readonly = readonly ?? false;
    this.validate = validate;
    this.#__stepState = {
      ...defaultState,
    };
  }

  /**
   * True if the solution is visible
   */
  get solutionVisible() {
    return this.#solutionEditorEle?.style.display !== 'none';
  }

  /**
   * If true, the solution will be visible
   */
  set solutionVisible(value: boolean) {
    if (this.#solutionEditorEle) {
      this.#solutionEditorEle.style.display = value ? '' : 'none';
    }
  }

  /**
   * Gets the current step state
   */
  get stepState(): StateType {
    return this.#__stepState!;
  }

  /**
   * Sets the step state
   */
  set stepState(state: StateType) {
    const oldState = this.#__stepState;
    if (state !== this.#__stepState) {
      this.#__stepState = state;

      if (oldState.code !== state.code) {
        this.#codeEditor?.setAttribute('code', state.code || this.defaultCode);
      }

      this?.toggleAttribute('valid', state.valid);
      this.#stepContainerEle?.toggleAttribute('valid', state.valid);

      const issues: CodeIssue[] = state.syntaxIssues || [];
      if (issues.length === 0) {
        issues.push(
          ...(state.validationIssues || []).map((n) => ({
            type: 'validation' as CodeIssueType,
            message: n.detail,
          })),
        );
      }
      this.#stepContainerEle?.setAttribute(
        'step-issues',
        issues ? JSON.stringify(issues || []) : '',
      );

      this?.toggleAttribute('valid', state.valid);
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
  /* protected */ get root(): HTMLElement {
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
    this.#codeEditor = this.root.querySelector('.code-editor');
    this.#stepContainerEle = this.root.querySelector('.step-container');
    this.#solutionEditorEle = this.root.querySelector('.solution-editor');
    this.#toggleSolutionButton = this.root.querySelector('.toggle-solution-button');
    if (this.solutionCode) {
      this.#solutionEditorEle?.setAttribute('code', this.solutionCode);
      this.#toggleSolutionButton?.addEventListener('click', () => {
        this.solutionVisible = !this.solutionVisible;
      });
    } else {
      // There is no solution, so hide it
      if (this.#toggleSolutionButton) {
        this.#toggleSolutionButton.style.display = 'none';
      }
    }

    const successMessageEle = this.root.querySelector('.success-message');
    if (this.successMessage && successMessageEle) {
      successMessageEle.innerHTML = this.successMessage;
    }
    this.#codeEditor?.toggleAttribute('readonly', this.readonly);
    this.#codeEditor?.setAttribute('code', this.stepState.code || this.defaultCode);
    this.#codeEditor?.addEventListener('change', (rawEvent: Event) => {
      void this.#loadStateFromCodeEditor((rawEvent as CodeEditorChangeEvent).detail);
    });
  }

  /**
   * Loads the step state from the code editor
   * @param event The optional event which triggered the load
   * @returns
   */
  async #loadStateFromCodeEditor(event?: CodeEditorChangeEventArgs) {
    let code: string;
    let transpiledCode: string;
    let issues: CodeIssue[];
    if (event) {
      ({ code, transpiledCode, issues } = event);
    } else {
      code = this.#codeEditor?.getAttribute('code') || '';
      transpiledCode = this.#codeEditor?.getAttribute('transpiled-code') || '';
      issues = JSON.parse(this.#codeEditor?.getAttribute('issues') || '[]') as CodeIssue[];
    }

    const syntaxIssues =
      (issues ?? []).filter((n) => n.type === 'error' || n.type === 'warning') || [];
    const state = {
      valid: false,
      code,
      transpiledCode,
      syntaxIssues,
      data: null,
      instance: null,
    } as StateType;

    state.valid = syntaxIssues.length === 0;

    state.validationIssues = [];
    state.instance = undefined;
    if (state.transpiledCode && state?.syntaxIssues?.length === 0) {
      try {
        state.instance = createImplForStepCode(state.transpiledCode);
        const validationResult = await this.validate(state, null);
        state.valid = validationResult.valid;
        state.validationIssues.push(...(validationResult.errors || []));
      } catch (e) {
        state.valid = false;
        state.validationIssues.push(...createUnknownValidationError(`${e}`).errors);
      }
    }

    this.stepState = Object.freeze(state);
  }

  /**
   * Listener for when the element is removed from the dom
   */
  disconnectedCallback() {
    this.#connected = false;
  }
}
