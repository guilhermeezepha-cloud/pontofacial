import ImageEditor from '@react-native-community/image-editor';
import {ImageCropData} from '@react-native-community/image-editor/lib/typescript/src/types';

import {Dimensions} from 'react-native';
import {PhotoFile} from 'react-native-vision-camera';

const {width, height} = Dimensions.get('window');

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function rotateAndCropFace(
  photo: PhotoFile,
  bounds: Bounds,
): Promise<string> {
  let correctedUri = photo.path;

  const faceWidth = (bounds.width * photo.width) / width;
  // const faceHeight = (bounds.height * photo.height) / height;

  // const faceX = (bounds.x * photo.width) / width;
  let faceY = (bounds.y * photo.height) / height;

  if (faceY < 0) faceY = 0;
  const cropConfig: ImageCropData = {
    offset: {
      x: Math.round(faceY) - 20,
      y: 0, //height - Math.round(faceX),
    },
    size: {
      width: Math.round(faceWidth),
      height: photo.height,
    },
    displaySize: {
      width: 640,
      height: 640,
    },
    resizeMode: 'contain',
  };

  const {uri} = await ImageEditor.cropImage(
    `file://${correctedUri}`,
    cropConfig,
  );

  return uri;
}
