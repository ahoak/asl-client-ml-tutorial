declare interface jsZipInstance {
  loadAsync: (data: InputFileFormat, options?: any) => Promise<jsZip>;
}

declare type loadAsync = (data: InputFileFormat, options?: any) => Promise<jsZip>;

declare const jszip: jsZipInstance;
