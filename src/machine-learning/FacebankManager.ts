import RNFS from 'react-native-fs';

import {FaceEmbedding} from './FaceSimilarity';

const DIR = `${RNFS.DocumentDirectoryPath}/facebank`;
const FILE = `${DIR}/faces_embeddings.json`;
const TMP = `${DIR}/faces_embeddings.json.tmp`;

export const FACEBANK_PATH = FILE; // útil para logs/debug

async function ensureDir() {
  try {
    const exists = await RNFS.exists(DIR);

    if (!exists) await RNFS.mkdir(DIR);
  } catch {
    console.warn('Erro ao criar diretório:', DIR);
  }
}

let writeQueue: Promise<void> = Promise.resolve();

// opcional — valida formato básico em runtime (pode remover se não quiser)
function validate(data: FaceEmbedding[]) {
  if (!Array.isArray(data)) throw new Error('facebank não é array');
  for (const r of data) {
    if (typeof r?.id !== 'string') throw new Error('id inválido');
    if (!Array.isArray(r?.embedding)) throw new Error('embedding inválido');
    if (r.embedding.length !== 512) throw new Error('embedding tamanho != 512');
  }
}

export function saveFacebank(data: FaceEmbedding[]): Promise<void> {
  const task = writeQueue.then(async () => {
    await ensureDir();
    //validate(data); // opcional se não quiser validar
    const json = JSON.stringify(data);

    await RNFS.writeFile(TMP, json, 'utf8'); // grava atômico
    await RNFS.moveFile(TMP, FILE);
  });

  writeQueue = task.catch(() => {}); // fila nunca rejeita; erros chegam só ao caller

  return task;
}

export async function readFacebank(): Promise<FaceEmbedding[] | null> {
  await ensureDir();
  const exists = await RNFS.exists(FILE);
  if (!exists) return null;
  const str = await RNFS.readFile(FILE, 'utf8');
  return JSON.parse(str) as FaceEmbedding[];
}
