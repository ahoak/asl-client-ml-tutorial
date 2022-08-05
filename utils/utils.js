import {assetURL, classes} from "./constants.js"
import { loadAsync } from "jszip";
import { npyJsParser} from "./NpyJsParser"

export function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  const timeString = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  const hasMinutes = minutes > 0 
  return [timeString, hasMinutes]
}

// Loads tensors based on image data processed using mediapipe hands model
// loads zip folder located in assets 
export async function loadTensorData() {
  const zippedModelBuffer = await (await fetch(assetURL)).arrayBuffer()
  const zipFolder = await loadAsync(zippedModelBuffer);
  const fileNames = Object.keys(zipFolder.files);
  const output =  await loadTensors(zipFolder)
  return output
}

async function loadTensors(zipFolder) {
  const np = new npyJsParser();
  const output = {};
  const numJoints = 21
  // x, y, z
  const numComponents = numJoints * 3
  await Promise.all(
    classes.map(async (n) => {
      const result = np.parse(await zipFolder.file(`${n}.npy`).async("arraybuffer"))      
      const numItems = result.shape[0];
      const data = [];
      for (let i = 0; i < numItems; i++) {
        // x, y, z...xₙ, yₙ, zₙ for each joint
        const tensor = Array.from(result.data.slice(i * numComponents, (i + 1) * numComponents));
        data.push(tensor);
        // Also push the mirror
        const mirror = tensor.slice(0);
        const wristX = mirror[0]
        // Skip the wrist
        for (let j = 1; j < numJoints; j++) {
          // 3 for x, y, z
          // 1 for x
          const jointCoordIdx = (j * 3) 
          const xVal = mirror[jointCoordIdx]
          // Mirror around wrist X
          mirror[jointCoordIdx] = wristX + (wristX - xVal) 
        }
        data.push(mirror)
      }
      output[n] = data;
    })
  );
  return output;
}


export function trainTestSplit(...datas) {
  const last = datas[datas.length - 1];
  let opts = {};
  if (!Array.isArray(last)) {
    opts = last;
    datas.pop();
  }
  const testSize = opts.test_size ?? opts.testSize ?? 0.2;
  const randSeed =
    opts.random_state ??
    opts.randomState ??
    Math.random() * Number.MAX_SAFE_INTEGER;

  const shuffled = datas.map((n) =>
    shuffle(n, null, randomGenerator(randSeed))
  );
  const output = [];
  shuffled.forEach((data) => {
    const train = data.slice(0, Math.floor((1 - testSize) * data.length));
    const test = data.slice(train.length);
    output.push(train, test);
  });
  return output;
}

function shuffle(items, seed = null, rand = null) {
  rand = rand ?? randomGenerator(seed);
  const copy = items.slice(0);
  for (let i = 0; i < copy.length; i++) {
    const idx1 = i == 0 ? 0 : Math.floor(rand() * copy.length);
    const idx2 = Math.floor(rand() * copy.length);
    const oldItem = copy[idx1];
    copy[idx1] = copy[idx2];
    copy[idx2] = oldItem;
  }
  return copy;
}

function randomGenerator(seed = null) {
  const finalSeed =
    (seed ?? Math.random() * Number.MAX_SAFE_INTEGER) ^ 0xafbfcfdf;
  let rand = sfc32(0x9e3779b9, 0x243f6a88, 0xb7e15162, finalSeed);
  // let rand = () => Math.random()
  for (var i = 0; i < 15; i++) {
    rand();
  }
  return rand;
}

// https://stackoverflow.com/a/47593316
function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function shuffleTest() {
  const counts = classes.reduce((acc, item) => {
    acc[item] = 0;
    return acc;
  }, {});

  for (let i = 0; i < 1000000; i++) {
    const shuffled = shuffle(classes);
    const item = shuffled[0];
    counts[item] = (counts[item] || 0) + 1;
  }

  let max = null;
  classes.forEach((item) => {
    if (max == null || counts[item] > counts[max]) {
      max = item;
    }
  });

  const normalizedCounts = classes.reduce((acc, item) => {
    acc[item] = counts[item] / counts[max];
    return acc;
  }, {});

  const numSegments = 50;
  classes.forEach((item) => {
    console.log(
      `${item} -> ${Array.from({
        length: Math.floor(numSegments * normalizedCounts[item]),
      }).join("█")}`
    );
  });
}