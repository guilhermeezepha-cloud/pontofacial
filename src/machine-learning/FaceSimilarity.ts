import {readFacebank} from './FacebankManager';

export interface FaceEmbedding {
  id: string;
  embedding: number[];
}

export interface FaceBestMatching {
  faceId: string;
  distance: number;
}

let facebankCache: FaceEmbedding[] | null = null;

export async function preloadFacebank(force = false): Promise<void> {
  if (facebankCache && !force) return;
  const local = await readFacebank();
  if (!local || local.length === 0) {
    throw new Error('[FaceSimilarity] Facebank local indisponível ou vazio');
  }
  facebankCache = local;
}

export function reloadDynamicModel(): void {
  facebankCache = null;
}

function l2Normalize(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return norm === 0 ? v : v.map(x => x / norm);
}

function cosineDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Infinity;
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return Infinity;
  return 1 - dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function findMatchingFace(
  rawEmbedding: number[],
  threshold = 0.65,
): FaceBestMatching | null {
  if (!facebankCache || facebankCache.length === 0) {
    console.warn('[FaceSimilarity] findMatchingFace: facebank não carregado');
    return null;
  }
  const embedding = l2Normalize(rawEmbedding);

  let best: FaceBestMatching | null = null;
  let min = Infinity;

  for (const face of facebankCache) {
    const d = cosineDistance(embedding, l2Normalize(face.embedding));
    if (d < min) {
      min = d;
      best = {faceId: face.id, distance: d};
    }
  }
  return min < threshold ? best : null;
}

export async function findMatchingFaceAsync(
  rawEmbedding: number[],
  threshold = 0.65,
): Promise<FaceBestMatching | null> {
  try {
    await preloadFacebank();
  } catch (e) {
    console.warn(
      '[FaceSimilarity] facebank indisponível:',
      (e as Error)?.message,
    );
    return null;
  }
  return findMatchingFace(rawEmbedding, threshold);
}

export function isFacebankLoadedInMemory(): boolean {
  return Array.isArray(facebankCache) && facebankCache.length > 0;
}

export function getFacebankCount(): number {
  return facebankCache?.length ?? 0;
}
