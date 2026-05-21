import NetInfo from '@react-native-community/netinfo';

import {AppState, AppStateStatus} from 'react-native';

import OfflineQueue from '../../utils/OfflineQueue';
import SyncService from './SyncService';

class AutoSyncService {
  private static instance: AutoSyncService;
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private readonly SYNC_INTERVAL_MS = 30000; // 30 segundos
  private readonly MAX_SYNC_ATTEMPTS = 5;
  private syncAttempts = 0;
  private appStateListener: any = null;
  private connectivityListener: (() => void) | null = null;
  private wasOffline = false;

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): AutoSyncService {
    if (!AutoSyncService.instance) {
      AutoSyncService.instance = new AutoSyncService();
    }
    return AutoSyncService.instance;
  }

  /**
   * Inicia sincronização automática
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    // 1. Configurar listener para mudanças no estado do app
    this.appStateListener = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );

    // 2. Configurar listener para mudanças de conectividade
    this.setupConnectivityListener();

    // 3. Iniciar timer de sincronização
    this.startSyncTimer();

    // 4. Sincronização inicial
    this.performSync();
  }

  /**
   * Para sincronização automática
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Parar timer
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    // Remover listeners
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }

    if (this.connectivityListener) {
      this.connectivityListener();
      this.connectivityListener = null;
    }
  }

  /**
   * Configura listener para detectar mudanças de conectividade
   */
  private setupConnectivityListener(): void {
    this.connectivityListener = NetInfo.addEventListener(async state => {
      const isOnline =
        (state.isConnected ?? false) && (state.isInternetReachable ?? false);

      // Se acabou de ficar online
      if (isOnline && this.wasOffline) {
        // Verificar se há registros pendentes
        const stats = await OfflineQueue.getQueueStats();
        if (stats.pending > 0) {
          // Aguardar um pouco para estabilizar a conexão e fazer sync
          setTimeout(() => {
            this.performSync();
          }, 2000);
        }
      }

      this.wasOffline = !isOnline;
    });
  }

  /**
   * Força uma sincronização manual
   */
  async forcSync(): Promise<void> {
    await this.performSync();
  }

  /**
   * Verifica se está rodando
   */
  isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Manipula mudanças no estado do app
   */
  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if (nextAppState === 'active') {
      // App voltou ao foreground, sincronizar
      this.performSync();

      // Reiniciar timer se não estiver rodando
      if (this.isRunning && !this.syncInterval) {
        this.startSyncTimer();
      }
    } else if (nextAppState === 'background') {
      // App foi para background, continuar sincronização em background
    }
  };

  /**
   * Inicia timer de sincronização
   */
  private startSyncTimer(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isRunning) {
        this.performSync();
      }
    }, this.SYNC_INTERVAL_MS);
  }

  /**
   * Executa sincronização
   */
  private async performSync(): Promise<void> {
    try {
      // 1. Verificar conectividade
      const isOnline = await SyncService.checkConnectivity();
      if (!isOnline) {
        return;
      }

      // 2. Verificar se há marcações pendentes
      const stats = await OfflineQueue.getQueueStats();
      if (stats.pending === 0) {
        this.syncAttempts = 0; // Reset contador
        return;
      }
      // 3. Executar sincronização
      const result = await OfflineQueue.syncPendingRecords();

      if (result.success) {
        this.syncAttempts = 0; // Reset contador em caso de sucesso

        // 4. Limpar queue após sincronização bem-sucedida
        if (result.synced > 0) {
          await OfflineQueue.cleanupQueue();
        }
      } else {
        this.syncAttempts++;

        // Se exceder tentativas, parar tentativas por um tempo
        if (this.syncAttempts >= this.MAX_SYNC_ATTEMPTS) {
          this.pauseSyncTemporarily();
        }
      }
    } catch (error: any) {
      this.syncAttempts++;

      if (this.syncAttempts >= this.MAX_SYNC_ATTEMPTS) {
        this.pauseSyncTemporarily();
      }
    }
  }

  /**
   * Pausa sincronização temporariamente em caso de muitos erros
   */
  private pauseSyncTemporarily(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    // Tentar novamente em 5 minutos
    setTimeout(() => {
      if (this.isRunning) {
        this.syncAttempts = 0;
        this.startSyncTimer();
      }
    }, 300000); // 5 minutos
  }

  /**
   * Obter estatísticas de sincronização
   */
  async getSyncStats(): Promise<{
    isRunning: boolean;
    syncAttempts: number;
    queueStats: {
      total: number;
      pending: number;
      synced: number;
      failed: number;
    };
  }> {
    const queueStats = await OfflineQueue.getQueueStats();

    return {
      isRunning: this.isRunning,
      syncAttempts: this.syncAttempts,
      queueStats,
    };
  }
}

export default AutoSyncService;
