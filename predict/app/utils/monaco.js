import loader from "@monaco-editor/loader";
const tfLibs = [{
  declaration: `
    interface Tensor1d {
      cleanup():
    };
    declare const tf = { 
      tensor1d(arr: number[]): Tensor1D;
      oneHot(): any;
    };
    
  `,
  uri: `tf/index.d.ts`
}, {
  declaration: `
    declare type Point3D = { x: number; y: number; z: number };
    declare function extractAllJointPositions(imageSource: CanvasImageSource, loadMirrored: boolean): Promise<Point3D[][]>;
  `,
  uri: `main.d.ts`
}]


const initMonaco = new Promise(async (resolve) => {
  const monaco = await loader.init()
  // monaco.languages.typescript.javascriptDefaults.addExtraLib(tfLib, 'tensorflow/tfjs/dist/index.d.ts');
  for (const { declaration, uri } of tfLibs) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(declaration, uri);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(declaration, uri);
  }
  resolve(monaco)
})

export async function loadMonaco(element) {
  const monaco = await initMonaco
  const documentLinks = Array.prototype.slice
    .call(document.getElementsByTagName("link"), 0)
    .filter((documentLink) => {
      if (
        /vs\/(base|editor|platform)/.test(
          documentLink.getAttribute("href")
        )
      ) {
        return true;
      }
      // console.log(`Not moving: `, documentLink);
      return true;
    });
  documentLinks.forEach((documentLink) =>
    element.appendChild(documentLink.cloneNode())
  );
  return monaco
}