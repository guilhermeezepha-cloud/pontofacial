import ImageEditor from '@react-native-community/image-editor';
import { PhotoFile } from 'react-native-vision-camera';

export type Bounds = { x: number; y: number; width: number; height: number };

/**
 * Maps a bounding box from Frame Coordinate Space to View Coordinate Space (incorporating 'cover' scaling and offsets).
 */
export function mapFrameToView(
  bounds: Bounds,
  frameWidth: number,
  frameHeight: number,
  viewWidth: number,
  viewHeight: number
): Bounds {
  const scale = Math.max(viewWidth / frameWidth, viewHeight / frameHeight);
  const scaledFrameWidth = frameWidth * scale;
  const scaledFrameHeight = frameHeight * scale;
  const offsetX = (scaledFrameWidth - viewWidth) / 2;
  const offsetY = (scaledFrameHeight - viewHeight) / 2;

  return {
    x: bounds.x * scale - offsetX,
    y: bounds.y * scale - offsetY,
    width: bounds.width * scale,
    height: bounds.height * scale,
  };
}

/**
 * Maps a bounding box from View Coordinate Space back to Frame Coordinate Space (reversing 'cover' scaling and offsets).
 */
export function mapViewToFrame(
  bounds: Bounds,
  frameWidth: number,
  frameHeight: number,
  viewWidth: number,
  viewHeight: number
): Bounds {
  const scale = Math.max(viewWidth / frameWidth, viewHeight / frameHeight);
  const scaledFrameWidth = frameWidth * scale;
  const scaledFrameHeight = frameHeight * scale;
  const offsetX = (scaledFrameWidth - viewWidth) / 2;
  const offsetY = (scaledFrameHeight - viewHeight) / 2;

  return {
    x: (bounds.x + offsetX) / scale,
    y: (bounds.y + offsetY) / scale,
    width: bounds.width / scale,
    height: bounds.height / scale,
  };
}

export async function rotateAndCropFace(
  photo: PhotoFile,
  bounds: Bounds,
  winW: number,
  winH: number
): Promise<string> {
  // Detecta orientação do tablet/celular
  const isPortrait = winH > winW;

  // 1. Mapear de View space (screen) de volta para o Photo space orientado (portrait ou landscape)
  const orientedPhotoWidth = isPortrait ? photo.height : photo.width;
  const orientedPhotoHeight = isPortrait ? photo.width : photo.height;

  const photoFrameBounds = mapViewToFrame(
    bounds,
    orientedPhotoWidth,
    orientedPhotoHeight,
    winW,
    winH
  );

  // 2. Rotacionar as coordenadas de volta para o espaço landscape original não-rotacionado
  let cropX = photoFrameBounds.x;
  let cropY = photoFrameBounds.y;
  let cropW = photoFrameBounds.width;
  let cropH = photoFrameBounds.height;

  if (isPortrait) {
    // Rotação de 90 graus CW da imagem significa que para reverter:
    // px = py_rotated
    // py = photo.height - px_rotated - pw_rotated
    cropX = photoFrameBounds.y;
    cropY = photo.height - photoFrameBounds.x - photoFrameBounds.width;
    cropW = photoFrameBounds.height;
    cropH = photoFrameBounds.width;
  }

  // Se estiver na vertical, aplicamos uma rotação de 90 graus na imagem
  // para alinhar o sensor fixo com a visão vertical do usuário
  const rotation = isPortrait ? 90 : 0;

  // Garante que o crop config esteja dentro dos limites da imagem original (unrotated)
  const margin = 20; // margem extra para o rosto
  const offsetCropX = Math.max(0, Math.round(cropX) - margin);
  const offsetCropY = Math.max(0, Math.round(cropY) - margin);
  const cropWidth = Math.min(photo.width - offsetCropX, Math.round(cropW) + margin * 2);
  const cropHeight = Math.min(photo.height - offsetCropY, Math.round(cropH) + margin * 2);

  const cropConfig = {
    offset: {
      x: offsetCropX,
      y: offsetCropY,
    },
    size: {
      width: cropWidth,
      height: cropHeight,
    },
    displaySize: { width: 640, height: 640 },
    resizeMode: 'contain' as const,
    rotation: rotation, // AQUI está o segredo: desentortamos a foto antes de ir para a IA
  };

  const { uri } = await ImageEditor.cropImage(`file://${photo.path}`, cropConfig);
  return uri;
}