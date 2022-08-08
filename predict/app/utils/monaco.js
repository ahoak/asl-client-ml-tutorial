import loader from "@monaco-editor/loader";
import tfLib from '@tensorflow/tfjs/dist/index.d.ts?raw'

const initMonaco = new Promise(async (resolve) => {
  const monaco = await loader.init()
  // monaco.languages.typescript.javascriptDefaults.addExtraLib(tfLib, 'tensorflow/tfjs/dist/index.d.ts');
  monaco.languages.typescript.javascriptDefaults.addExtraLib(`
    interface Tensor1d {
      cleanup():
    };
    declare const tf = { 
      tensor1d(arr: number[]): Tensor1D;
      oneHot(): any;
    };
    
    declare function extractAllJointPositions(imageSource: CanvasImageSource, loadMirrored: boolean): Promise<number[]>;
  `, 'tf/index.d.ts');
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
      console.log(`Not moving: `, documentLink);
      return true;
    });
  documentLinks.forEach((documentLink) =>
    element.appendChild(documentLink.cloneNode())
  );
  return monaco
}