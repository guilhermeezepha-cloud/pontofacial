import { useTheme } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  StyleSheet,
  View,
  useWindowDimensions, // <- IMPORTANTE: Hook dinâmico
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Face,
  FaceDetectionOptions,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

import { Colors } from '../../styles/Themes';
import { FaceRecognitionStatus } from '../../types';
import { mapFrameToView, rotateAndCropFace } from '../../utils/faceCrop';
import { FaceCameraStyles } from './FaceCameraStyles';

let timeout: ReturnType<typeof setTimeout>;

interface Props {
  debug?: boolean;
  isLoading?: boolean;
  minFaceRatio?: number;
  onFaceDetectStart?: () => void;
  onFaceDetect?: (photoUri: string) => void;
}

export const FaceCamera = ({
  debug,
  isLoading,
  minFaceRatio = 0.18, // Você pode diminuir para 0.15 se o rosto estiver difícil de encaixar em celulares
  onFaceDetectStart,
  onFaceDetect,
}: Props) => {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');

  // Trazemos as dimensões para DENTRO do componente para serem dinâmicas
  const { width, height } = useWindowDimensions();
  const canvasArea = width * height;

  const [status, setStatus] = useState<FaceRecognitionStatus>('idle');
  const [currentFace, setCurrentFace] = useState<Face | null>(null);
  const [croppedUri, setCroppedUri] = useState<string | null>(null);

  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = FaceCameraStyles(colors);

  const statusRef = useRef<FaceRecognitionStatus>('idle');

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const takePhoto = useCallback(
    async (face: Face) => {
      if (statusRef.current !== 'idle' || face == null) return;
      setStatus('processing');
      setCurrentFace(face);

      try {
        const photo = await camera.current?.takePhoto({
          flash: 'off',
        });
        if (!photo?.path) throw new Error('no-photo-path');

        const imageUri = await rotateAndCropFace(photo, face.bounds, width, height);
        setCroppedUri(imageUri);

        if (onFaceDetect) onFaceDetect(imageUri);

        setStatus('success');

        setTimeout(() => {
          setStatus('idle');
          setCroppedUri(null);
        }, 2000);
      } catch (err) {
        setStatus('error');
      }
    },
    [onFaceDetect, width, height],
  );

  const handleDetectedFaces = useCallback(
    (faces: Face[], rawFrameWidth?: number, rawFrameHeight?: number) => {
      if (status !== 'idle' || isLoading) return;

      if (faces.length === 0 || status !== 'idle') {
        setStatus('idle');
        setCurrentFace(null);
        return; // Retorno antecipado importante
      }

      const face = faces[0];

      // Detecta orientação do frame
      const isPortrait = height > width;
      const frameWidth = isPortrait ? (rawFrameHeight ?? height) : (rawFrameWidth ?? width);
      const frameHeight = isPortrait ? (rawFrameWidth ?? width) : (rawFrameHeight ?? height);

      // Desfaz o escala simples que o plugin nativo aplica por padrão (windowWidth/windowHeight)
      const simpleScaledBounds = face.bounds;
      const frameBounds = {
        x: (simpleScaledBounds.x / width) * frameWidth,
        y: (simpleScaledBounds.y / height) * frameHeight,
        width: (simpleScaledBounds.width / width) * frameWidth,
        height: (simpleScaledBounds.height / height) * frameHeight,
      };

      // Mapeia os limites do frame para os limites da visualização (View) com o comportamento do cover
      const viewBounds = mapFrameToView(
        frameBounds,
        frameWidth,
        frameHeight,
        width,
        height
      );

      const correctedFace = {
        ...face,
        bounds: viewBounds,
      };

      const faceArea = correctedFace.bounds.height * correctedFace.bounds.width;
      const faceRatio = faceArea / canvasArea;

      if (
        faceRatio >= minFaceRatio &&
        correctedFace.bounds.y > 320 &&
        correctedFace.bounds.y < 412
      ) {
        setCurrentFace(correctedFace);
        if (onFaceDetectStart) {
          onFaceDetectStart();
        }
        clearTimeout(timeout);
        timeout = setTimeout(takePhoto, 200, correctedFace);
      } else {
        setCurrentFace(null);
      }
    },
    [status, isLoading, minFaceRatio, onFaceDetectStart, takePhoto, canvasArea, width, height],
  );

  const runOnJS = useMemo(
    () => Worklets.createRunOnJS(handleDetectedFaces),
    [handleDetectedFaces],
  );

  // Agora as opções se atualizam se a tela girar
  const faceDetectionOptions = useMemo<FaceDetectionOptions>(
    () => ({
      performanceMode: 'fast',
      landmarkMode: 'none',
      contourMode: 'none',
      classificationMode: 'none',
      trackingEnabled: false,
      autoMode: true,
      // Correção do BUG: Passamos a largura/altura exata atual
      windowWidth: width,
      windowHeight: height,
    }),
    [width, height],
  );

  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const faces: Face[] = detectFaces(frame);
      runOnJS(faces, frame.width, frame.height);
    },
    [detectFaces, runOnJS],
  );

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          photo
          frameProcessor={frameProcessor}
          androidPreviewViewType="texture-view"
          pixelFormat="yuv"
          resizeMode="cover"
        />
      )}

      {debug && croppedUri ? (
        <Image source={{ uri: croppedUri }} style={[styles.preview]} />
      ) : null}

      {debug && currentFace ? (
        <View
          style={[
            styles.faceDebug,
            {
              width: currentFace.bounds.width,
              height: currentFace.bounds.height,
              left: currentFace.bounds.x, // x e y geralmente são invertidos pela biblioteca nativa, verifique se debuga corretamente
              top: currentFace.bounds.y,
            },
          ]}
        />
      ) : null}
    </View>
  );
};