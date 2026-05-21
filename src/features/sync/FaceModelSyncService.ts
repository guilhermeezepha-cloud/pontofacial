import NetInfo from '@react-native-community/netinfo';

import { AppState, AppStateStatus } from 'react-native';

import { AppDispatch } from '../../config/Redux';
import { getFaceModels } from '../face-recognition/Slice';
import FaceRecognitionService from '../face-recognition/Service';
import EmployeeService from '../employees/Service';
import { CollectorWithoutLogo } from '../register/Types';
import Session from '../../utils/session';
import {
  IDENTIFICATION_DATA_KEY,
  FACE_MODEL_VERSION_KEY,
  EMPLOYEES_LIST_KEY,
} from '../../utils/storageKeys';

class FaceModelSyncService {
  private static instance: FaceModelSyncService;
  private checkInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private isChecking = false;
  private dispatch: AppDispatch | null = null;
  private appStateListener: any = null;
  private connectivityListener: (() => void) | null = null;
  private lastCheckAt = 0;

  // Intervalo entre verificações periódicas de nova versão do modelo.
  private readonly FACE_MODEL_CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

  // Tempo mínimo entre verificações forçadas (ex: ao voltar ao foreground).
  private readonly MIN_CHECK_COOLDOWN_MS = 1 * 60 * 1000; // 1 minuto

  private constructor() {}

  static getInstance(): FaceModelSyncService {
    if (!FaceModelSyncService.instance) {
      FaceModelSyncService.instance = new FaceModelSyncService();
    }

    return FaceModelSyncService.instance;
  }

  setDispatch(dispatch: AppDispatch): void {
    this.dispatch = dispatch;
  }

  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastCheckAt = Date.now();

    this.appStateListener = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );

    this.setupConnectivityListener();
    this.startCheckTimer();
  }

  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }

    if (this.connectivityListener) {
      this.connectivityListener();
      this.connectivityListener = null;
    }
  }

  private setupConnectivityListener(): void {
    this.connectivityListener = NetInfo.addEventListener(async state => {
      const isOnline =
        (state.isConnected ?? false) && (state.isInternetReachable ?? false);

      const timeSinceLastCheck = Date.now() - this.lastCheckAt;

      if (isOnline && timeSinceLastCheck >= this.MIN_CHECK_COOLDOWN_MS) {
        await this.checkAndUpdateIfNeeded();
      }
    });
  }

  private handleAppStateChange = async (
    nextAppState: AppStateStatus,
  ): Promise<void> => {
    if (nextAppState === 'active') {
      const timeSinceLastCheck = Date.now() - this.lastCheckAt;

      if (timeSinceLastCheck >= this.MIN_CHECK_COOLDOWN_MS) {
        await this.checkAndUpdateIfNeeded();
      }
    }
  };

  private startCheckTimer(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      if (this.isRunning) {
        await this.checkAndUpdateIfNeeded();
      }
    }, this.FACE_MODEL_CHECK_INTERVAL_MS);
  }

  private async checkAndUpdateIfNeeded(): Promise<void> {
    if (this.isChecking) {
      return;
    }

    this.isChecking = true;

    if (!this.dispatch) {
      this.isChecking = false;
      return;
    }

    try {
      const netState = await NetInfo.fetch();

      const isOnline =
        (netState.isConnected ?? false) &&
        (netState.isInternetReachable ?? false);

      if (!isOnline) {
        console.warn('[FaceModelSyncService] Offline, abortando');
        return;
      }

      const identificationData = await Session.get<CollectorWithoutLogo>(
        IDENTIFICATION_DATA_KEY,
      );

      if (!identificationData?.id) {
        console.warn('[FaceModelSyncService] identificationData não encontrado, abortando');
        return;
      }

      const collectorId = Number(identificationData.id);

      this.lastCheckAt = Date.now();

      const { data } = await FaceRecognitionService.getModelVersion(collectorId);
      const remoteUpdatedAt = data.updatedAt;

      const localUpdatedAt = await Session.get<string>(FACE_MODEL_VERSION_KEY);

      const employeesResponse = await EmployeeService.getFilteredEmployees({
        groupCode: identificationData.groupCode,
        collectorCode: identificationData.code,
      });

      await Session.set(EMPLOYEES_LIST_KEY, employeesResponse.data);

      if (localUpdatedAt === remoteUpdatedAt) {
        return;
      }

      await this.dispatch(getFaceModels(collectorId));

      await Session.set(FACE_MODEL_VERSION_KEY, remoteUpdatedAt);

    } catch (error: any) {
      console.warn(
        '[FaceModelSyncService] Erro ao verificar versão do modelo:',
        error?.message ?? error,
      );
    } finally {
      this.isChecking = false;
    }
  }
}

export default FaceModelSyncService;
