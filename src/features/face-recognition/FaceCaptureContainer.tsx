import {useTheme} from '@react-navigation/native';

import React, {useContext, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import {useCameraDevice} from 'react-native-vision-camera';

import CloseButton from '../../components/button/CloseButton';
import BasicToast from '../../components/custom-toast/BasicToast';
import {ToastContext} from '../../components/custom-toast/ToastProvider';
import {FaceCamera} from '../../components/face-capture/FaceCamera';
import FaceMaskOverlay from '../../components/face-capture/FaceMaskOverlay';
import Typography from '../../components/typography';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {useCameraPermission} from '../../hooks/useCameraPermissions';
import {useConnectivity, useOnOnline} from '../../hooks/useConnectivity';
import {useIdentificationData} from '../../hooks/useIdentificationData';
import {getFaceEmbeddingFromUri} from '../../machine-learning/FaceEmbedding';
import {findMatchingFaceAsync} from '../../machine-learning/FaceSimilarity';
import {Colors} from '../../styles/Themes';
import {FaceRecognitionStatus} from '../../types';
import {
  formatDate,
  getLocalDateTimeWithTimezone,
} from '../../utils/dateFormatters';
import OfflineQueue from '../../utils/OfflineQueue';
import EmployeeService from '../employees/Service';
import {FaceCaptureContainerStyles} from './FaceCaptureContainerStyles';

const {width, height} = Dimensions.get('window');

const FaceCaptureContainer: React.FC = () => {
  const hasPermission = useCameraPermission();
  const device = useCameraDevice('front');
  const navigation = useAppNavigation();
  const toast = useContext(ToastContext);
  const {identificationData} = useIdentificationData();

  // Hook de conectividade
  const {isOnline, status: connectivityStatus} = useConnectivity();

  // Sincronização automática quando volta online
  useOnOnline(async () => {
    const stats = await OfflineQueue.getQueueStats();
  });

  const [status, setStatus] = useState<FaceRecognitionStatus>('idle');
  const [lastTimestamp, setLastTimestamp] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [employeeName, setEmployeeName] = useState<string | null>(null);

  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = FaceCaptureContainerStyles(colors);

  const borderWidth = 10;
  const frameWidth = width * 0.32;
  const frameHeight = height * 0.7;
  const frameCx = width / 2;
  const frameCy = height / 2;

  const statusColorMap = {
    idle: colors.white,
    processing: colors.info,
    success: colors.success,
    error: colors.red,
  };

  const statusRef = useRef<FaceRecognitionStatus>('idle');
  const lastToastStatus = useRef<FaceRecognitionStatus | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const faceRecognition = async (photoUri: string) => {
    setStatus('processing');

    try {
      // 1. Reconhecimento facial (usando modelo dinâmico)
      const faceEmbedding = await getFaceEmbeddingFromUri(photoUri);
      const result = await findMatchingFaceAsync(faceEmbedding, 0.65);

      if (!result) {
        setUserId(null);
        setEmployeeName(null);
        setStatus('error');
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
        return;
      }

      // 2. Buscar dados do funcionário (online ou cache)
      const registration = result.faceId; // faceId é a matrícula

      const employeeResult =
        await EmployeeService.getByRegistrationWithFallback(registration);

      if (!employeeResult.success || !employeeResult.employee) {
        setUserId(registration);
        setEmployeeName('Funcionário não encontrado');
        setStatus('error');
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
        return;
      }

      const employee = employeeResult.employee;

      // 3. Verificar se funcionário está ativo
      if (employee.status !== 'Active') {
        setUserId(registration);
        setEmployeeName(employee.name);
        setStatus('error');
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
        return;
      }

      // 4. Verificar se temos dados do coletor
      if (!identificationData?.id) {
        setStatus('error');
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
        return;
      }

      // 5. Preparar dados da marcação
      const timestamp = getLocalDateTimeWithTimezone();
      setLastTimestamp(timestamp);
      setUserId(registration);
      setEmployeeName(employee.name);

      // 6. Criar marcação (online ou offline)
      const timeRecordResult = await OfflineQueue.createTimeRecord({
        registration: registration,
        employeeId: employee.id,
        collectorId: identificationData.id,
        collectorCode: identificationData.code,
        collectorIdentifier: identificationData.identifier,
        groupCode: employee.groupCode,
        timestamp: timestamp,
      });

      if (timeRecordResult.success) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      }
    } catch (error) {
      setUserId(null);
      setEmployeeName(null);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  };
  useEffect(() => {
    if (!toast) return;

    if (status === 'idle') {
      toast.hideToast?.();
      lastToastStatus.current = 'idle';
      return;
    }
    // não repetir o mesmo status
    if (lastToastStatus.current === status) return;

    const message =
      status === 'processing'
        ? 'Perfeito, mantenha-se parado até o fim da análise.'
        : status === 'success'
        ? `Ponto registrado com sucesso dia ${formatDate(
            lastTimestamp,
          )}. Matrícula: ${userId || employeeName}.`
        : 'Não foi possível fazer o reconhecimento facial. Tente novamente.';

    toast.showToast(<BasicToast message={message} type={status} />);

    lastToastStatus.current = status;
  }, [status, lastTimestamp, userId, employeeName]);

  if (hasPermission === null || device == null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasPermission) navigation.goBack();

  return (
    <View style={styles.container}>
      <FaceCamera
        isLoading={status !== 'idle'}
        debug={false}
        onFaceDetectStart={() =>
          setStatus(s => (s === 'idle' ? 'processing' : s))
        }
        onFaceDetect={photo => faceRecognition(photo)}
      />

      <FaceMaskOverlay
        frameBorderWidth={borderWidth}
        frameCx={frameCx}
        frameCy={frameCy}
        frameWidth={frameWidth}
        frameHeight={frameHeight}
        color={statusColorMap[status]}
      />

      {(status === 'idle' || status === 'processing') && (
        <View
          pointerEvents="none"
          style={[
            styles.instructions,
            {
              width: frameWidth,
              left: frameCx - frameWidth / 2,
              bottom: frameCy - frameHeight / 2 - 62,
            },
          ]}>
          <Typography fontSize={20} color="white">
            Centralize o rosto na moldura.
          </Typography>
        </View>
      )}

      {/* Indicador de conectividade */}
      <View style={styles.connectivityIndicator}>
        <View
          style={[
            styles.connectivityDot,
            isOnline
              ? styles.connectivityDotOnline
              : styles.connectivityDotOffline,
          ]}
        />
        <Typography fontSize={12} color="white" style={styles.connectivityText}>
          {connectivityStatus}
        </Typography>
      </View>

      <CloseButton
        showText
        color="white"
        onPress={() => navigation.goBack()}
        style={styles.close}
      />
    </View>
  );
};

export default FaceCaptureContainer;
