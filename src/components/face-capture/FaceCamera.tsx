import { useTheme } from '@react-navigation/native';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
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
import { rotateAndCropFace } from '../../utils/faceCrop';
import { FaceCameraStyles } from './FaceCameraStyles';

const {width, height} = Dimensions.get('window');

const canvasArea = height * width;

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
  minFaceRatio = 0.18,
  onFaceDetectStart,
  onFaceDetect,
}: Props) => {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');

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

        const imageUri = await rotateAndCropFace(photo, face.bounds);
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
    [onFaceDetect],
  );

  const handleDetectedFaces = useCallback(
    (faces: Face[]) => {
      if (status !== 'idle' || isLoading) return;

      if (faces.length === 0 || status !== 'idle') {
        setStatus('idle');
        setCurrentFace(null);
      }

      const face = faces[0];
      const faceArea = face.bounds.height * face.bounds.width;
      const faceRatio = faceArea / canvasArea;

      if (
        faceRatio >= minFaceRatio &&
        face.bounds.y > 320 &&
        face.bounds.y < 412
      ) {
        if (onFaceDetectStart) {
          onFaceDetectStart();
        }
        clearTimeout(timeout);
        timeout = setTimeout(takePhoto, 200, face);
      } else {
        setCurrentFace(null);
      }
    },

    [status, isLoading, minFaceRatio, onFaceDetectStart, takePhoto],
  );

  const runOnJS = useMemo(
    () => Worklets.createRunOnJS(handleDetectedFaces),
    [handleDetectedFaces],
  );

  const faceDetectionOptions = useMemo<FaceDetectionOptions>(
    () => ({
      performanceMode: 'fast',
      landmarkMode: 'none',
      contourMode: 'none',
      classificationMode: 'none',
      trackingEnabled: false,
      autoMode: true,
      windowWidth: height,
      windowHeight: width,
    }),
    [],
  );
  const {detectFaces} = useFaceDetector(faceDetectionOptions);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const faces: Face[] = detectFaces(frame);
      runOnJS(faces);
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
        />
      )}

      {debug && croppedUri ? (
        <Image source={{uri: croppedUri}} style={[styles.preview]} />
      ) : null}

      {debug && currentFace ? (
        <View
          style={[
            styles.faceDebug,
            {
              width: currentFace.bounds.width,
              height: currentFace.bounds.height,
              left: currentFace.bounds.y,
              top: currentFace.bounds.x,
            },
          ]}
        />
      ) : null}
    </View>
  );
};
