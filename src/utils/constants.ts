// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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

export const useFullDataset =
  (window.location.search || '').toLocaleLowerCase().indexOf('full=true') >= 0;
export const defaultTrainEpochs = useFullDataset ? 5 : 50;
export const localStorageModelPath = 'localstorage://model';
const slimAssetURL = `${import.meta.env.BASE_URL}data/alphabet_tensors.zip`;
const fullAssetURL = `${import.meta.env.BASE_URL}data/alphabet_tensors_full.zip`;
export const assetURL = useFullDataset ? fullAssetURL : slimAssetURL;
