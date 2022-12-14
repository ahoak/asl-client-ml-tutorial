import '../IssueDisplay';

import type { Position } from 'monaco-editor';

// import { MarkerSeverity } from 'monaco-editor';
import { fastDebounce } from '../../utils/utils';
import BaseComponent from '../BaseComponent';
import template from './template.html?raw';
import type { CodeEditorChangeEventArgs, CodeHints, CodeIssue } from './types';
import type { IModel, IStandaloneCodeEditor, Monaco } from './utils/monaco';
import { getTypescriptWorker, languages, loadMonaco } from './utils/monaco';

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
      'hints',
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
  #hints: CodeHints | null = null;

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
   * Gets the hints used for the code editor
   */
  get hints(): CodeHints | null {
    return this.#hints;
  }

  /**
   * Sets to readonly mode
   */
  set hints(value: CodeHints | null) {
    this.setAttribute('hints', JSON.stringify(value || {}));
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
      this.#model?.setValue(this.#placeholder ?? '');
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
    } else if (name === 'hints') {
      try {
        this.#hints = JSON.parse(newValue ? newValue : '{}') as CodeHints;
      } catch (e) {
        console.error('Could not parse hints', e);
      }
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
    this.#monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
        return this.#provideCompletionItems(model, position);
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

    this.#model!.onDidChangeContent(
      fastDebounce(async () => {
        if (this.#allowBackgroundExecution || this.#isVisibleOnScreen) {
          const code = this.#model!.getValue() ?? '';
          const fileName = `${this.#model!.uri.toString()}`;
          const transpiledCode = (await tsWorker.getEmitOutput(fileName)).outputFiles[0].text;

          // eslint-disable-next-line @essex/adjacent-await
          const [semanticErrors, syntacticErrors] = await Promise.all([
            await tsWorker.getSemanticDiagnostics(fileName),
            await tsWorker.getSyntacticDiagnostics(fileName),
          ]);
          const markers = semanticErrors.concat(syntacticErrors).map((n) => {
            const pos = (n.start != null && this.#model?.getPositionAt(n.start)) || {
              lineNumber: -1,
              column: -1,
            };
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              type: (n.category === 1 ? 'error' : 'hint') as any,
              startLineNumber: pos.lineNumber,
              startColumn: pos.column,
              message: `${n.messageText}`,
            };
          });

          const newMarkerKey = markers
            .map((n) => `${n.type}:${n.startLineNumber}:${n.startColumn}`)
            .join(',');
          if (
            code !== lastCode ||
            transpiledCode !== lastTranspiledCode ||
            newMarkerKey !== lastMarkerKey
          ) {
            lastCode = code;
            lastTranspiledCode = transpiledCode;
            lastMarkerKey = newMarkerKey;

            this.#currentCode = code;

            // Update our code attributes to match the newest code in the editors
            this.setAttribute('code', code);
            this.setAttribute('transpiled-code', transpiledCode);
            this.#emitChangeEvent(code, transpiledCode, markers);
          }
        }
      }, 500),
    );

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
   * Forces an editor layout
   */
  #layoutEditor() {
    if (this.#editor) {
      this.#editor.layout();
    }
  }

  #provideCompletionItems(model: IModel, position: Position) {
    // Only provide completion for my model
    if (model === this.#model && this.#hints) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: Object.keys(this.#hints || {}).map((n) => ({
          label: n,
          kind: languages.CompletionItemKind.Function,
          detail: this.#hints![n].detail ?? '',
          documentation: this.#hints![n].documentation ?? '',
          insertText: this.#hints![n].code,
          insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
        })),
      };
    }
    return {
      suggestions: [],
    };
  }
}

customElements.define('code-editor', CodeEditorComponent);
