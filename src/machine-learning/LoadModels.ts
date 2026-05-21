import * as ort from 'onnxruntime-react-native';
import RNFS from 'react-native-fs';

let detectorSession: ort.InferenceSession | null = null;
let landmarkerSession: ort.InferenceSession | null = null;
let embedderSession: ort.InferenceSession | null = null;

async function loadOnnxModel(modelName: string): Promise<ort.InferenceSession> {
  const dest = `${RNFS.DocumentDirectoryPath}/${modelName}`;

  const exists = await RNFS.exists(dest);
  if (!exists) {
    await RNFS.copyFileAssets(modelName, dest);
  }

  try {
    return await ort.InferenceSession.create(dest);
  } catch (err) {
    console.error('Erro ao carregar o modelo ONNX:', err);
    throw err;
  }
}

export async function loadFaceModels() {
  if (detectorSession && landmarkerSession && embedderSession) {
    return {
      detector: detectorSession,
      landmarker: landmarkerSession,
      embedder: embedderSession,
    };
  }

  const [detector, landmarker, embedder] = await Promise.all([
    loadOnnxModel('det_10g.onnx'),
    loadOnnxModel('2d106det.onnx'),
    loadOnnxModel('w600k_r50.onnx'),
  ]);

  // salva no cache
  detectorSession = detector;
  landmarkerSession = landmarker;
  embedderSession = embedder;

  return {detector, landmarker, embedder};
}
