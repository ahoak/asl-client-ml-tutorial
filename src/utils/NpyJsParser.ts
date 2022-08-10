interface DataType {
  [key: string]: {
    name: string;
    size: number;
    arrayConstructor:
      | Uint8ArrayConstructor
      | Uint16ArrayConstructor
      | Int16ArrayConstructor
      | Int8ArrayConstructor
      | BigUint64ArrayConstructor
      | Int32ArrayConstructor
      | Float32ArrayConstructor
      | BigInt64ArrayConstructor
      | Float64ArrayConstructor;
  };
}
export class npyJsParser {
  dtypes: DataType;

  constructor(opts?: any) {
    if (opts) {
      console.error(
        [
          'No arguments accepted to npyjs constructor.',
          'For usage, go to https://github.com/jhuapl-boss/npyjs.',
        ].join(' '),
      );
    }

    this.dtypes = {
      '<u1': {
        name: 'uint8',
        size: 8,
        arrayConstructor: Uint8Array,
      },
      '|u1': {
        name: 'uint8',
        size: 8,
        arrayConstructor: Uint8Array,
      },
      '<u2': {
        name: 'uint16',
        size: 16,
        arrayConstructor: Uint16Array,
      },
      '|i1': {
        name: 'int8',
        size: 8,
        arrayConstructor: Int8Array,
      },
      '<i2': {
        name: 'int16',
        size: 16,
        arrayConstructor: Int16Array,
      },
      '<u4': {
        name: 'uint32',
        size: 32,
        arrayConstructor: Int32Array,
      },
      '<i4': {
        name: 'int32',
        size: 32,
        arrayConstructor: Int32Array,
      },
      '<u8': {
        name: 'uint64',
        size: 64,
        arrayConstructor: BigUint64Array,
      },
      '<i8': {
        name: 'int64',
        size: 64,
        arrayConstructor: BigInt64Array,
      },
      '<f4': {
        name: 'float32',
        size: 32,
        arrayConstructor: Float32Array,
      },
      '<f8': {
        name: 'float64',
        size: 64,
        arrayConstructor: Float64Array,
      },
    };
  }

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
  } {
    // const version = arrayBufferContents.slice(6, 8); // Uint8-encoded
    const headerLength = new DataView(arrayBufferContents.slice(8, 10)).getUint8(0);
    const offsetBytes = 10 + headerLength;

    const hcontents = new TextDecoder('utf-8').decode(
      new Uint8Array(arrayBufferContents.slice(10, 10 + headerLength)),
    );
    const header = JSON.parse(
      hcontents
        .toLowerCase() // True -> true
        .replace(/'/g, '"')
        .replace('(', '[')
        .replace(/,*\),*/g, ']'),
    ) as { shape: string; descr: keyof DataType; fortran_order: string };
    const shape = header.shape;
    const dtype = this.dtypes[header.descr];
    const nums = new dtype['arrayConstructor'](arrayBufferContents, offsetBytes);
    return {
      dtype: dtype.name,
      data: nums,
      shape,
      fortranOrder: header.fortran_order,
    };
  }

  async load(
    filename: RequestInfo | URL,
    callback: (arg0: {
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
    }) => {
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
    },
    fetchArgs: RequestInit | undefined,
  ): Promise<{
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
  }> {
    /*
			Loads an array from a stream of bytes.
			*/
    fetchArgs = fetchArgs || {};
    const resp = await fetch(filename, { ...fetchArgs });
    const arrayBuf = await resp.arrayBuffer();
    const result = this.parse(arrayBuf);
    if (callback) {
      return callback(result);
    }
    return result;
  }
}
