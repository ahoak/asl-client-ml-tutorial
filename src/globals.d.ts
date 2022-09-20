declare type Point3D = {
  x: number;
  y: number;
  z: number;
};
declare module '*.ts?raw' {
  const contents: string;
  export default contents;
}
declare module '*.html' {
  const contents: string;
  export default contents;
}

declare module '*.md' {
  const contents: string;
  export default contents;
}

declare module 'npyjs' {
  export class NpyjsParser {
    parse(arrayBufferContents: ArrayBuffer): {
      dtype: string;
      data:
        | Uint8Array
        | Uint16Array
        | Int16Array
        | Int8Array
        | BigUint64Array
        | Int32Array
        | Float32Array
        | BigInt64Array
        | Float64Array;
      shape: string;
      fortranOrder: string;
    };
  }
  export default NpyjsParser;
}
