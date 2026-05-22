import ImageEditor from '@react-native-community/image-editor';
import { Dimensions } from 'react-native';
import { PhotoFile } from 'react-native-vision-camera';


type Bounds = { x: number; y: number; width: number; height: number };

export async function rotateAndCropFace(photo: PhotoFile, bounds: Bounds): Promise<string> {
  const { width: winW, height: winH } = Dimensions.get('window');

  // Detecta orientação do tablet
  const isPortrait = winH > winW;

  // Fatores de escala para ajustar as coordenadas do retângulo (bounds)
  const scaleX = photo.width / winW;
  const scaleY = photo.height / winH;

  // Se estiver na vertical, aplicamos uma rotação de 90 graus na imagem
  // para alinhar o sensor fixo com a visão vertical do usuário
  const rotation = isPortrait ? 90 : 0;

  const cropConfig = {
    offset: {
      x: Math.max(0, Math.round(bounds.x * scaleX) - 20),
      y: Math.max(0, Math.round(bounds.y * scaleY) - 20),
    },
    size: {
      width: Math.round(bounds.width * scaleX) + 40,
      height: Math.round(bounds.height * scaleY) + 40,
    },
    displaySize: { width: 640, height: 640 },
    resizeMode: 'contain' as const,
    rotation: rotation, // AQUI está o segredo: desentortamos a foto antes de ir para a IA
  };

  const { uri } = await ImageEditor.cropImage(`file://${photo.path}`, cropConfig);
  return uri;
}