import loader from '@monaco-editor/loader';
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import templateTypesDeclaration from '../../../tensorflow.types.d.ts?raw';
export type IStandaloneCodeEditor = monacoEditor.editor.IStandaloneCodeEditor;
export type IModel = monacoEditor.editor.IModel;
export type Monaco = typeof monacoEditor;

const tfLibs = [
  {
    declaration: templateTypesDeclaration,
    uri: `types/template.types.d.ts`,
  },
  {
    declaration: `
    declare type Point3D = { x: number; y: number; z: number };
    declare function extractAllJointPositions(imageSource: CanvasImageSource, loadMirrored: boolean): Promise<Point3D[][]>;
  `,
    uri: `main.d.ts`,
  },
];

// eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
const initMonaco = new Promise(async (resolve) => {
  const monaco = await loader.init();
  // monaco.languages.typescript.javascriptDefaults.addExtraLib(tfLib, 'tensorflow/tfjs/dist/index.d.ts');
  for (const { declaration, uri } of tfLibs) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(declaration, uri);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(declaration, uri);
  }

  // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  //   // noSemanticValidation: true,
  //   // noSyntaxValidation: false,
  //   noSuggestionDiagnostics: true,
  // });
  const options = monaco.languages.typescript.typescriptDefaults.getCompilerOptions();
  options.noImplicitAny = true; // example change
  options.strict = false; // example change
  options.noUncheckedIndexedAccess = false;
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(options);

  resolve(monaco);
});

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

export async function getTSProxy(monaco: Monaco, model: IModel) {
  const worker = await monaco.languages.typescript.getTypeScriptWorker();
  return worker(model.uri);
}
