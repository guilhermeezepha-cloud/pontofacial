import NetInfo from '@react-native-community/netinfo';

import {
  CreateTimeRecordRequest,
  CreateTimeRecordResponse,
  OfflineTimeRecord,
} from '../features/attendance/Types';

import AttendanceService from '../features/attendance/Service';
import SyncService from '../features/sync/SyncService';
import Session from './session';

class OfflineQueue {
  private static readonly QUEUE_KEY = 'offline_time_records_queue';
  private static readonly MAX_ATTEMPTS = 3;

  /**
   * Adiciona uma marcação à queue offline
   */
  static async addTimeRecord(data: CreateTimeRecordRequest): Promise<string> {
    try {
      const recordId = `offline_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const offlineRecord: OfflineTimeRecord = {
        ...data,
        id: recordId,
        synced: false,
        attempts: 0,
        createdAt: new Date().toISOString(),
      };

      const queue = await this.getQueue();
      queue.push(offlineRecord);

      await this.saveQueue(queue);
      await SyncService.updateSyncStatus({
        pendingRecords: queue.filter(r => !r.synced).length,
      });
      return recordId;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tenta criar uma marcação online, se falhar adiciona à queue
   */
  static async createTimeRecord(data: CreateTimeRecordRequest): Promise<{
    success: boolean;
    online: boolean;
    recordId?: string;
    response?: CreateTimeRecordResponse;
    error?: string;
  }> {
    try {
      // 1. Verificar conectividade
      const isOnline = await this.checkConnectivity();

      if (isOnline) {
        try {
          // 2. Tentar criar online
          const response = await AttendanceService.createTimeRecord(data);

          return {
            success: true,
            online: true,
            response: response.data,
          };
        } catch (apiError: any) {
          // 3. Se falhar, salvar offline
          const recordId = await this.addTimeRecord(data);
          return {
            success: true,
            online: false,
            recordId,
          };
        }
      } else {
        // 4. Sem conectividade, salvar offline
        const recordId = await this.addTimeRecord(data);
        return {
          success: true,
          online: false,
          recordId,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        online: false,
        error: error.message,
      };
    }
  }

  /**
   * Sincroniza marcações pendentes
   */
  static async syncPendingRecords(): Promise<{
    success: boolean;
    synced: number;
    failed: number;
    details: string[];
  }> {
    try {
      // 1. Verificar conectividade
      const isOnline = await SyncService.checkConnectivity();
      if (!isOnline) {
        return {
          success: false,
          synced: 0,
          failed: 0,
          details: ['Sem conectividade com a API'],
        };
      }

      await SyncService.updateSyncStatus({syncing: true});

      // 2. Obter queue
      const queue = await this.getQueue();
      const pendingRecords = queue.filter(
        r => !r.synced && r.attempts < this.MAX_ATTEMPTS,
      );

      if (pendingRecords.length === 0) {
        await SyncService.updateSyncStatus({syncing: false});
        return {
          success: true,
          synced: 0,
          failed: 0,
          details: ['Nenhuma marcação pendente'],
        };
      }

      // 3. Sincronizar cada marcação
      let synced = 0;
      let failed = 0;
      const details: string[] = [];

      for (const record of pendingRecords) {
        try {
          const syncData: CreateTimeRecordRequest = {
            registration: record.registration,
            employeeId: record.employeeId,
            collectorId: record.collectorId,
            collectorCode: record.collectorCode,
            collectorIdentifier: record.collectorIdentifier,
            groupCode: record.groupCode,
            timestamp: record.timestamp,
          };

          await AttendanceService.createTimeRecord(syncData);

          // Marcar como sincronizado
          record.synced = true;
          record.lastAttempt = new Date().toISOString();
          synced++;

          details.push(`✓ ${record.registration} - ${record.timestamp}`);
        } catch (error: any) {
          // Incrementar tentativas
          record.attempts++;
          record.lastAttempt = new Date().toISOString();
          failed++;

          const errorMsg = `✗ ${record.registration} - Tentativa ${record.attempts}/${this.MAX_ATTEMPTS}: ${error.message}`;
          details.push(errorMsg);
        }
      }

      // 4. Salvar queue atualizada
      await this.saveQueue(queue);

      // 5. Atualizar status
      const remainingPending = queue.filter(
        r => !r.synced && r.attempts < this.MAX_ATTEMPTS,
      ).length;
      await SyncService.updateSyncStatus({
        syncing: false,
        pendingRecords: remainingPending,
        lastSync: new Date().toISOString(),
      });

      return {
        success: true,
        synced,
        failed,
        details,
      };
    } catch (error: any) {
      await SyncService.updateSyncStatus({syncing: false});

      return {
        success: false,
        synced: 0,
        failed: 0,
        details: [`Erro na sincronização: ${error.message}`],
      };
    }
  }

  /**
   * Obter queue atual
   */
  static async getQueue(): Promise<OfflineTimeRecord[]> {
    try {
      const queue = await Session.get<OfflineTimeRecord[]>(this.QUEUE_KEY);
      return queue || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Salvar queue
   */
  private static async saveQueue(queue: OfflineTimeRecord[]): Promise<void> {
    try {
      await Session.set(this.QUEUE_KEY, queue);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Limpar registros já sincronizados ou com muitas tentativas
   */
  static async cleanupQueue(): Promise<void> {
    try {
      const queue = await this.getQueue();

      // Manter apenas registros não sincronizados e com tentativas < MAX
      const cleanQueue = queue.filter(
        r => !r.synced && r.attempts < this.MAX_ATTEMPTS,
      );

      await this.saveQueue(cleanQueue);
      await SyncService.updateSyncStatus({
        pendingRecords: cleanQueue.length,
      });

      const removed = queue.length - cleanQueue.length;
      if (removed > 0) {
      }
    } catch (error) {}
  }

  /**
   * Obter estatísticas da queue
   */
  static async getQueueStats(): Promise<{
    total: number;
    pending: number;
    synced: number;
    failed: number;
  }> {
    try {
      const queue = await this.getQueue();

      return {
        total: queue.length,
        pending: queue.filter(r => !r.synced && r.attempts < this.MAX_ATTEMPTS)
          .length,
        synced: queue.filter(r => r.synced).length,
        failed: queue.filter(r => !r.synced && r.attempts >= this.MAX_ATTEMPTS)
          .length,
      };
    } catch (error) {
      return {total: 0, pending: 0, synced: 0, failed: 0};
    }
  }

  /**
   * Verifica se há conectividade com a internet
   */
  static async checkConnectivity(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      return (
        (state.isConnected ?? false) && (state.isInternetReachable ?? false)
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Inicializa listener para detectar quando volta online e sincronizar automaticamente
   */
  static initializeAutoSync(): () => void {
    let wasOffline = false;

    const unsubscribe = NetInfo.addEventListener(async state => {
      const isOnline =
        (state.isConnected ?? false) && (state.isInternetReachable ?? false);

      // Se acabou de ficar online e havia registros pendentes
      if (isOnline && wasOffline) {
        const stats = await this.getQueueStats();
        if (stats.pending > 0) {
          // Aguardar um pouco para estabilizar a conexão
          setTimeout(async () => {
            try {
              await this.syncPendingRecords();
            } catch (error) {}
          }, 2000);
        }
      }

      wasOffline = !isOnline;
    });

    return unsubscribe;
  }

  /**
   * Para usar em conjunto com useEffect no app
   * Permite fácil integração com hooks de conectividade
   */
  static async handleConnectivityChange(
    isOnline: boolean,
    wasOnline: boolean,
  ): Promise<void> {
    // Se acabou de ficar online
    if (isOnline && !wasOnline) {
      const stats = await this.getQueueStats();
      if (stats.pending > 0) {
        await this.syncPendingRecords();
      }
    }
  }
}

export default OfflineQueue;
