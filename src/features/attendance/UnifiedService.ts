import {
  CreateTimeRecordRequest,
  CreateTimeRecordResponse,
} from '../attendance/Types';

import OfflineQueue from '../../utils/OfflineQueue';

/**
 * Service unificado para criação de marcações
 * Automaticamente decide se cria online ou offline baseado na conectividade
 */
class UnifiedAttendanceService {
  /**
   * Cria uma marcação, automaticamente decidindo entre online ou offline
   */
  static async createTimeRecord(data: CreateTimeRecordRequest): Promise<{
    success: boolean;
    online: boolean;
    recordId?: string;
    response?: CreateTimeRecordResponse;
    error?: string;
  }> {
    try {
      // Usar o sistema de OfflineQueue que já faz essa lógica
      return await OfflineQueue.createTimeRecord(data);
    } catch (error: any) {
      return {
        success: false,
        online: false,
        error: error.message || 'Erro desconhecido',
      };
    }
  }

  /**
   * Verifica se há marcações pendentes
   */
  static async hasPendingRecords(): Promise<boolean> {
    try {
      const stats = await OfflineQueue.getQueueStats();
      return stats.pending > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém estatísticas de sincronização
   */
  static async getSyncStats(): Promise<{
    total: number;
    pending: number;
    synced: number;
    failed: number;
  }> {
    try {
      return await OfflineQueue.getQueueStats();
    } catch (error) {
      return {
        total: 0,
        pending: 0,
        synced: 0,
        failed: 0,
      };
    }
  }

  /**
   * Força sincronização manual
   */
  static async forceSynchronization(): Promise<{
    success: boolean;
    synced: number;
    failed: number;
    details: string[];
  }> {
    try {
      return await OfflineQueue.syncPendingRecords();
    } catch (error: any) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        details: [error.message || 'Erro desconhecido'],
      };
    }
  }
}

export default UnifiedAttendanceService;
