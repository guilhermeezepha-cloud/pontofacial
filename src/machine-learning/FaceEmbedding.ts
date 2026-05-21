import {Buffer} from 'buffer';
import jpeg from 'jpeg-js';
import {Tensor} from 'onnxruntime-react-native';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

import {loadFaceModels} from './LoadModels';

if (!global.Buffer) {
  global.Buffer = Buffer;
}

async function resizeImageTo112(uri: string): Promise<Float32Array> {
  const resized = await ImageResizer.createResizedImage(
    uri,
    112,
    112,
    'JPEG',
    100,
    0,
    undefined,
    false,
    {mode: 'cover'},
  );

  const resizedUri = resized.uri;

  const base64 = await RNFS.readFile(resizedUri, 'base64');
  const jpegData = Buffer.from(base64, 'base64');
  const rawImage = jpeg.decode(jpegData, {useTArray: true});

  if (!rawImage || !rawImage.data) {
    throw new Error('Erro ao decodificar JPEG');
  }

  if (rawImage.width !== rawImage.height) {
    throw new Error(`Tamanho inesperado: ${rawImage.width}x${rawImage.height}`);
  }

  const {data, width, height} = rawImage;
  const chw = new Float32Array(3 * width * height);

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      chw[0 * width * height + y * width + x] = r / 255;
      chw[1 * width * height + y * width + x] = g / 255;
      chw[2 * width * height + y * width + x] = b / 255;
    }
  }

  return chw;
}

export async function getFaceEmbeddingFromUri(uri: string): Promise<number[]> {
  const {embedder} = await loadFaceModels();

  const inputTensorData = await resizeImageTo112(uri);

  const inputName = embedder.inputNames[0];
  const inputTensor = new Tensor('float32', inputTensorData, [1, 3, 112, 112]);

  const output = await embedder.run({[inputName]: inputTensor});
  const outputTensor = output[embedder.outputNames[0]];

  const embedding = Array.from(outputTensor.data as Float32Array);

  return embedding;
}
