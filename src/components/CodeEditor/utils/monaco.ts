import loader from '@monaco-editor/loader';
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import jszipTypes from './codeEditorTypes/jszip.d.ts?raw';
import mainTypes from './codeEditorTypes/main.d.ts?raw';
import tensorFlowTypes from './codeEditorTypes/tensorflow.d.ts?raw';

export type ITypescriptWorker = monacoEditor.languages.typescript.TypeScriptWorker;
export type IStandaloneCodeEditor = monacoEditor.editor.IStandaloneCodeEditor;
export type IModel = monacoEditor.editor.IModel;
export type Monaco = typeof monacoEditor;

/**
 * The type declarations for the monaco editor
 */
const editorDeclarations = [
  {
    declaration: jszipTypes,
    uri: `types/jszip.d.ts`,
  },
  {
    declaration: tensorFlowTypes,
    uri: `types/tensorflow.d.ts`,
  },
  {
    declaration: mainTypes,
    uri: `types/main.d.ts`,
  },
];

/**
 * A promise which returns an initialized monaco instance
 */
// eslint-disable-next-line no-async-promise-executor
const initMonaco = new Promise(async (resolve) => {
  const monaco = await loader.init();
  // monaco.languages.typescript.javascriptDefaults.addExtraLib(tfLib, 'tensorflow/tfjs/dist/index.d.ts');
  for (const { declaration, uri } of editorDeclarations) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(declaration, uri);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(declaration, uri);
  }

  // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  //   // noSemanticValidation: true,
  //   // noSyntaxValidation: false,
  //   noSuggestionDiagnostics: true,
  // });
  const options = monaco.languages.typescript.typescriptDefaults.getCompilerOptions();
  options.noImplicitAny = false; // example change
  options.strict = false; // example change
  options.noUncheckedIndexedAccess = false;
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(options);

  resolve(monaco);
});

/**
 * Loads the monaco instance into the given element
 * @param element The parent element of the monaco instance
 * @returns The monaco instance
 */
export async function loadMonaco(element: HTMLElement): Promise<Monaco> {
  const monaco = await initMonaco;
  const documentLinks = Array.prototype.slice
    .call(document.getElementsByTagName('link'), 0)
    .filter((documentLink: HTMLLinkElement) => {
      if (/vs\/(base|editor|platform)/.test(documentLink.getAttribute('href') ?? '')) {
        return true;
      }
      // console.log(`Not moving: `, documentLink);
      return true;
    }) as HTMLLinkElement[];
  documentLinks.forEach((documentLink) => element.appendChild(documentLink.cloneNode()));

  return monaco as Monaco;
}

/**
 * Gets the typescript worker for the given monaco instance and model
 * @param monaco The monaco instance
 * @param model The model to get the TS proxy for
 * @returns The TS Proxy
 */
export async function getTypescriptWorker(
  monaco: Monaco,
  model: IModel,
): Promise<ITypescriptWorker> {
  const worker = await monaco.languages.typescript.getTypeScriptWorker();
  return worker(model.uri);
}
