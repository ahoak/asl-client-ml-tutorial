// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
export const assetURL = `${import.meta.env.BASE_URL}data/alphabet_tensors.zip`;
export const classes: string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  /*'nothing', */
  // "space",
  // "del",
];

export enum BackendOptions {
  'webgl',
  'cpu',
  'wasm',
}
