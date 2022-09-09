import type { ValidationResult } from '../../../../types';
import { createUnknownValidationError } from '../../../../utils/utils';
import type {
  CodeEditorChangeEvent,
  CodeEditorChangeEventArgs,
  CodeEditorComponent,
  CodeHints,
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

export const attributes = ['style'] as const;
type AttributeName = typeof attributes[number];

export abstract class CodeStepBaseComponent<
  StateType extends CodeStepState,
> extends BaseComponent<AttributeName> {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return attributes;
  }

  /**
   * The code editor
   */
  #codeEditor: CodeEditorComponent | null = null;

  /**
   * The step container element
   */
  #stepContainerEle: StepContainerComponent | null = null;

  /**
   * The solution container element
   */
  #solutionEditorEle: HTMLElement | null = null;

  /**
   * The solution tab element
   */
  #solutionTabEle: HTMLElement | null = null;

  /**
   * The instructions tab element
   */
  #instructionsTabEle: HTMLElement | null = null;

  /**
   * The instructions image element
   */
  #instructionsImageEle: HTMLImageElement | null = null;

  #instructionsElement: HTMLElement | null = null;

  /**
   * The solve button
   */
  #solveButton: HTMLElement | null = null;

  /**
   * The reset button
   */
  #resetButton: HTMLElement | null = null;

  /**
   * The internal step state (DONT USE DIRECTLY)
   */
  #__stepState: StateType;

  /**
   * The default code
   */
  readonly defaultCode: string;

  /**
   * The solution code without all extra comments
   */
  readonly solutionCode: string | null;

  /**
   * The fully commented solution code
   */
  readonly fullyCommentedSolutionCode: string | null;

  /**
   * The instructions url
   */
  readonly instructionsUrl: string | null;

  readonly instructionsMarkdown: string | null;

  /**
   * True if the code toggle button should be visible
   */
  readonly showCodeToggleButton: boolean;

  /**
   * The code hints to use
   */
  readonly codeHints: CodeHints | null;

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
    fullyCommentedSolutionCode,
    readonly,
    showCodeToggleButton = false,
    hints,
    validate,
    template = defaultTemplate,
    instructionsUrl,
    instructionsMarkdown,
  }: {
    defaultCode: string;
    solutionCode?: string | null;
    fullyCommentedSolutionCode?: string | null;
    readonly?: boolean;
    hints?: CodeHints;
    showCodeToggleButton?: boolean;
    defaultState: StateType;
    validate: ValidationFunction<StateType>;
    template?: string;
    instructionsUrl?: string;
    instructionsMarkdown?: string;
  }) {
    console.log('instructionsUrl', instructionsUrl);
    super(template);

    this.defaultCode = defaultCode;
    this.fullyCommentedSolutionCode = fullyCommentedSolutionCode ?? solutionCode ?? null;
    this.solutionCode = solutionCode ?? fullyCommentedSolutionCode ?? null;
    this.instructionsUrl = instructionsUrl ?? null;
    this.instructionsMarkdown = instructionsMarkdown ?? null;
    this.showCodeToggleButton = showCodeToggleButton ?? false;
    this.readonly = readonly ?? false;
    this.codeHints = hints ?? null;
    this.validate = validate;
    this.#__stepState = {
      ...defaultState,
    };
  }

  /**
   * True if the code is visible
   */
  get codeVisible() {
    return this.#codeEditor?.style.display !== 'none';
  }

  /**
   * If true, the code will be visible
   */
  set codeVisible(value: boolean) {
    if (this.#codeEditor) {
      this.#codeEditor.style.display = value ? '' : 'none';
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
    this.#codeEditor = this.root.querySelector('.code-editor');
    this.#stepContainerEle = this.root.querySelector('.step-container');
    this.#solutionEditorEle = this.root.querySelector('.solution-editor');
    this.#solutionTabEle = this.root.querySelector('#solution-tab');
    this.#solveButton = this.root.querySelector('.solve-button');
    this.#resetButton = this.root.querySelector('.reset-button');
    this.#instructionsImageEle = this.root.querySelector('.instructions-image');
    this.#instructionsElement = this.root.querySelector('.instructions-md');
    this.#instructionsTabEle = this.root.querySelector('#instructions-tab');

    if (this.#instructionsImageEle) {
      this.#instructionsImageEle.style.display = this.instructionsUrl ? '' : 'none';
      this.#instructionsImageEle.src = this.instructionsUrl ?? 'about:blank';
    }
    if (this.#instructionsElement) {
      this.#instructionsElement.style.display = this.instructionsMarkdown ? '' : 'none';
      this.#instructionsElement.innerHTML = this.instructionsMarkdown ?? 'about:blank';
    }
    if (this.#instructionsTabEle) {
      this.#instructionsTabEle.style.display = this.instructionsUrl ? '' : 'none';
    }
    if (this.#resetButton) {
      this.#resetButton.style.display = !this.readonly ? '' : 'none';
      this.#resetButton.addEventListener('click', () => {
        this.#codeEditor?.setAttribute('code', this.defaultCode!);
      });
    }

    if (this.#solveButton) {
      this.#solveButton.style.display = !this.readonly && this.solutionCode ? '' : 'none';
      if (!this.readonly && this.#codeEditor && this.solutionCode) {
        this.#solveButton.addEventListener('click', () => {
          this.#codeEditor?.setAttribute('code', this.solutionCode!);
        });
      }
    }

    if (this.#solutionEditorEle) {
      this.#solutionEditorEle.style.display =
        !this.readonly && this.fullyCommentedSolutionCode ? '' : 'none';
      if (this.fullyCommentedSolutionCode) {
        this.#solutionEditorEle?.setAttribute('code', this.fullyCommentedSolutionCode);
      }
    }

    if (this.#solutionTabEle) {
      this.#solutionTabEle.style.display = this.#solutionEditorEle?.style.display ?? 'none';
    }

    this.#codeEditor?.toggleAttribute('readonly', this.readonly);
    this.#codeEditor?.setAttribute('code', this.stepState.code || this.defaultCode);
    this.#codeEditor?.setAttribute('hints', JSON.stringify(this.codeHints || {}));
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
}
