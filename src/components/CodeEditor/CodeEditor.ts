import '../IssueDisplay';

import { fastDebounce } from '../../utils/utils';
import BaseComponent from '../BaseComponent';
import template from './template.html';
import type { CodeEditorChangeEventArgs, CodeIssue, CodeIssueType } from './types';
import type { IModel, IStandaloneCodeEditor, Monaco } from './utils/monaco';
import { getTSProxy, loadMonaco } from './utils/monaco';

// TODO: We can probably just import that enum
// https://microsoft.github.io/monaco-editor/api/enums/monaco.MarkerSeverity.html
const INFO_SEVERITY = 2;
const WARNING_SEVERITY = 4;
const ERROR_SEVERITY = 8;

export class CodeEditorComponent extends BaseComponent {
  /**
   * The list of observed attributes
   */
  static get observedAttributes() {
    return ['style', 'placeholder', 'code', 'hide-issues'];
  }

  constructor() {
    super(template);
  }

  /**
   * The root of the app component
   */
  #root: HTMLElement | null = null;
  #placeholder: string | null = null;
  #editor: IStandaloneCodeEditor | null = null;
  #monaco: Monaco | null = null;
  #model: IModel | null = null;
  #issueDisplayEle: HTMLElement | null = null;
  #issueContainerEle: HTMLElement | null = null;
  #codeEditorEle: HTMLElement | null = null;
  #resizeObserver: ResizeObserver | null = null;

  /**
   * Gets whether or not issues are hidden
   */
  get hideIssues() {
    return this.hasAttribute('hide-issues');
  }

  /**
   * Hides or shows the issues display
   */
  set hideIssues(value) {
    if (value) {
      this.setAttribute('hide-issues', '');
    } else {
      this.removeAttribute('hide-issues');
    }
  }

  /**
   * Listener for when the attribute changed
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    // Make our "style", match the host value
    if (name === 'style') {
      this.#getRoot().style.cssText = newValue ?? '';
    } else if (name === 'placeholder' || name === 'code') {
      this.#placeholder = newValue ?? 'function placeholder() {\n}';
      if (this.#model) {
        this.#model.setValue(this.#placeholder);
      }
    } else if (name === 'hide-issues') {
      if (this.#issueContainerEle) {
        this.#issueContainerEle.style.display = 'none';
      }
    }
  }

  /**
   * Listener for when the element is initialized
   */
  async connectedCallback() {
    this.#issueDisplayEle = this.#getRoot().querySelector('.issue-display');
    this.#issueContainerEle = this.#getRoot().querySelector('.issue-container');
    this.#codeEditorEle = this.#getRoot().querySelector('.editor-container');
    this.#monaco = await loadMonaco(this.#codeEditorEle!);
    this.#editor = this.#monaco!.editor.create(this.#codeEditorEle!, {
      value: this.#placeholder ?? '',
      language: 'typescript',
      minimap: {
        enabled: false,
      },
    });

    this.#resizeObserver = new ResizeObserver(() => {
      this.#layoutEditor();
    });
    this.#resizeObserver.observe(this.#getRoot());

    this.#model = this.#editor.getModel();
    const tsProxy = await getTSProxy(this.#monaco!, this.#model!);
    let first = true;
    this.#model!.onDidChangeDecorations(async () => {
      const markers = this.#monaco!.editor.getModelMarkers({
        resource: this.#model!.uri,
      });
      const code = this.#model!.getValue() ?? '';
      const transpiledCode = (await tsProxy.getEmitOutput(`${this.#model!.uri.toString()}`))
        .outputFiles[0].text;
      const issues = markers.map((n) => ({
        type: this.#getIssueTypeFromSeverity(n.severity)!,
        startLineNumber: n.startLineNumber,
        startColumn: n.startColumn,
        message: n.message,
      }));
      if (first) {
        this.#emitChangeEvent(code, transpiledCode, issues);
      } else {
        this.#debouncedEmitChangeEvent(code, transpiledCode, issues);
      }
      first = false;
    });
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

    const issuesToDisplay = issues.filter((n) => n.type === 'error' || n.type === 'warning');

    this.#issueDisplayEle!.setAttribute('issues', JSON.stringify(issuesToDisplay));

    if (!this.hideIssues) {
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
   * Dispatches the "change" event, debounced
   * @param {string} code The new code
   * @param {string} transpiledCode The transpiled code
   * @param {any[]} issues The list of issues with the code
   */
  #debouncedEmitChangeEvent = fastDebounce(
    (code: string, transpiledCode: string, issues: CodeIssue[]) => {
      this.#emitChangeEvent(code, transpiledCode, issues);
    },
    500,
  );

  /**
   * Gets an issue type for the given severity
   * @param {number} severity The severity
   */
  #getIssueTypeFromSeverity(severity: number): CodeIssueType | null {
    if (severity != null) {
      if (severity === ERROR_SEVERITY) {
        return 'error';
      } else if (severity === WARNING_SEVERITY) {
        return 'warning';
      } else if (severity === INFO_SEVERITY) {
        return 'info';
      } else {
        return 'hint';
      }
    }
    return null;
  }

  /**
   * Listener for when the element is removed from the dom
   */
  disconnectedCallback() {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = null;
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

  /**
   * Gets the root element for the component
   */
  #getRoot(): HTMLElement {
    if (!this.#root) {
      this.#root = this.templateRoot.querySelector('.root');
    }
    return this.#root!;
  }
}

customElements.define('code-editor', CodeEditorComponent);