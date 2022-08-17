import '../IssueDisplay';

import { MarkerSeverity } from 'monaco-editor';

import BaseComponent from '../BaseComponent';
import template from './template.html';
import type { CodeEditorChangeEventArgs, CodeIssue, CodeIssueType } from './types';
import type { IModel, IStandaloneCodeEditor, Monaco } from './utils/monaco';
import { getTypescriptWorker, loadMonaco } from './utils/monaco';

export class CodeEditorComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return [
      'style',
      'placeholder',
      'code',
      'hide-issues',
      'readonly',
      'allow-background-execution',
    ];
  }

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #placeholder: string | null = null;
  #editor: IStandaloneCodeEditor | null = null;
  #monaco: Monaco | null = null;
  #model: IModel | null = null;
  #issueDisplayEle: HTMLElement | null = null;
  #issueContainerEle: HTMLElement | null = null;
  #codeEditorEle: HTMLElement | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #visibilityObserver: IntersectionObserver | null = null;
  #currentCode: string | null = null;
  #allowBackgroundExecution = false;

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
   * Gets whether or not issues are hidden
   */
  get hideIssues() {
    return this.hasAttribute('hide-issues');
  }

  /**
   * Hides or shows the issues display
   */
  set hideIssues(value: boolean) {
    this.toggleAttribute('hide-issues', value);
  }

  /**
   * Gets whether or not the editor is read only
   */
  get readOnly(): boolean {
    return this.hasAttribute('readonly');
  }

  /**
   * Sets to readonly mode
   */
  set readOnly(value: boolean) {
    this.toggleAttribute('readonly', value);
  }

  /**
   * Gets if the element is visible on the screen
   */
  #__isVisibleOnScreen = true;
  get #isVisibleOnScreen(): boolean {
    return this.#__isVisibleOnScreen!;
  }

  /**
   * Sets if the element is visible on the screen
   */
  set #isVisibleOnScreen(value: boolean) {
    if (this.#__isVisibleOnScreen !== value) {
      this.#__isVisibleOnScreen = value;
      this.#editor?.updateOptions({ readOnly: this.readOnly, domReadOnly: this.readOnly });
      if (value) {
        this.#model?.setValue(this.#placeholder ?? '');
      } else {
        this.#model?.setValue('');
      }
    }
  }

  /**
   * @inheritDoc
   */
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    // Make our "style", match the host value
    if (name === 'style') {
      this.#root.style.cssText = newValue ?? '';
    } else if (name === 'placeholder' || name === 'code') {
      this.#placeholder =
        this.getAttribute('code') ??
        this.getAttribute('placeholder') ??
        'function placeholder() {\n}';

      // Make sure the model code matches the new code passed in
      if (this.#model && this.#currentCode !== this.#placeholder) {
        this.#model.setValue(this.#placeholder);
      }
    } else if (name === 'hide-issues') {
      if (this.#issueContainerEle) {
        this.#issueContainerEle.style.display = 'none';
      }
    } else if (name === 'readonly') {
      this.#editor?.updateOptions({ readOnly: this.readOnly, domReadOnly: this.readOnly });
    } else if (name === 'allow-background-execution') {
      this.#allowBackgroundExecution = newValue !== null;
    }
  }

  /**
   * @inheritDoc
   */
  async connectedCallback() {
    this.#issueDisplayEle = this.#root.querySelector('.issue-display');
    this.#issueContainerEle = this.#root.querySelector('.issue-container');
    this.#codeEditorEle = this.#root.querySelector('.editor-container');
    this.#monaco = await loadMonaco(this.#codeEditorEle!);
    this.#editor = this.#monaco!.editor.create(this.#codeEditorEle!, {
      value: this.#placeholder ?? '',
      readOnly: this.readOnly,
      domReadOnly: this.readOnly,
      language: 'typescript',
      minimap: {
        enabled: false,
      },
    });

    this.#resizeObserver = new ResizeObserver(() => this.#layoutEditor());
    this.#resizeObserver.observe(this.#root);
    this.#visibilityObserver = new IntersectionObserver((entries) => {
      this.#isVisibleOnScreen = entries.some((entry) => entry.isIntersecting);
    });
    this.#visibilityObserver.observe(this.#root);

    this.#model = this.#editor.getModel();
    const tsWorker = await getTypescriptWorker(this.#monaco!, this.#model!);
    let lastCode: string | null = null;
    let lastTranspiledCode: string | null = null;
    let lastMarkerKey: string | null = null;
    this.#model!.onDidChangeDecorations(async () => {
      if (this.#isVisibleOnScreen || this.#allowBackgroundExecution) {
        const markers = this.#monaco!.editor.getModelMarkers({
          resource: this.#model!.uri,
        });
        const code = this.#model!.getValue() ?? '';
        const newMarkerKey = markers
          .map(
            (n) => `${n.severity}:${n.resource.toString()}:${n.startLineNumber}:${n.startColumn}`,
          )
          .join(',');
        const transpiledCode = (await tsWorker.getEmitOutput(`${this.#model!.uri.toString()}`))
          .outputFiles[0].text;
        if (
          code !== lastCode ||
          newMarkerKey !== lastMarkerKey ||
          transpiledCode !== lastTranspiledCode
        ) {
          lastMarkerKey = newMarkerKey;
          lastCode = code;
          lastTranspiledCode = transpiledCode;

          this.#currentCode = code;

          // Update our code attributes to match the newest code in the editors
          this.setAttribute('code', code);
          this.setAttribute('transpiled-code', transpiledCode);

          // Grab the issues from the editor
          const issues = markers.map((n) => ({
            type: this.#getIssueTypeFromSeverity(n.severity)!,
            startLineNumber: n.startLineNumber,
            startColumn: n.startColumn,
            message: n.message,
          }));
          this.#emitChangeEvent(code, transpiledCode, issues);
        }
      }
    });

    // Update the model with the current code
    this.#model!.setValue(
      this.#isVisibleOnScreen || this.#allowBackgroundExecution
        ? this.#placeholder ?? 'function placeholder() {}'
        : '',
    );
  }

  /**
   * Listener for when the element is removed from the dom
   */
  disconnectedCallback() {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = null;
    }

    if (this.#visibilityObserver) {
      this.#visibilityObserver.disconnect();
      this.#visibilityObserver = null;
    }
  }

  /**
   * Dispatches the "change" event
   * @param {string} code The new code
   * @param {string} transpiledCode The transpiled code
   * @param {any[]} issues The list of issues with the code
   */
  #emitChangeEvent(code: string, transpiledCode: string, issues: CodeIssue[]) {
    this.dispatchEvent(
      new CustomEvent<CodeEditorChangeEventArgs>('change', {
        detail: {
          code,
          transpiledCode,
          issues,
        },
      }),
    );

    if (!this.hideIssues) {
      const issuesToDisplay = issues.filter((n) => n.type === 'error' || n.type === 'warning');
      this.#issueDisplayEle!.setAttribute('issues', JSON.stringify(issues));

      const oldDisplay = this.#issueContainerEle!.style.display;
      const newDisplay = issuesToDisplay.length > 0 ? 'block' : 'none';
      if (oldDisplay !== newDisplay) {
        this.#issueContainerEle!.style.display = newDisplay;
        this.#layoutEditor();
      }
    } else {
      this.#issueContainerEle!.style.display = 'none';
    }
  }

  /**
   * Gets an issue type for the given severity
   * @param {number} severity The severity
   */
  #getIssueTypeFromSeverity(severity: number): CodeIssueType | null {
    if (severity != null) {
      if (severity === MarkerSeverity.Error) {
        return 'error';
      } else if (severity === MarkerSeverity.Warning) {
        return 'warning';
      } else if (severity === MarkerSeverity.Info) {
        return 'info';
      } else {
        return 'hint';
      }
    }
    return null;
  }

  /**
   * Forces an editor layout
   */
  #layoutEditor() {
    if (this.#editor) {
      this.#editor.layout();
    }
  }
}

customElements.define('code-editor', CodeEditorComponent);
