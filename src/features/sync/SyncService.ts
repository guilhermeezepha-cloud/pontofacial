import RNFS from 'react-native-fs';

import {
  ModelDownloadResponse,
  SyncStatus,
  TrainedModel,
} from '../attendance/Types';

import {api} from '../../config/Axios';
import Session from '../../utils/session';

class SyncService {
  private static readonly MODEL_STORAGE_KEY = 'trained_model';
  private static readonly SYNC_STATUS_KEY = 'sync_status';

  /**
   * Download do modelo de embeddings da API
   */
  static async downloadModel(
    collectorId: number,
  ): Promise<ModelDownloadResponse> {
    try {
      // 1. Fazer download do arquivo faces_embeddings.json
      const response = await api.get(`/collectors/${collectorId}/model`, {
        responseType: 'blob', // Para receber arquivo binário
      });

      // 2. Salvar arquivo no sistema de arquivos local
      const modelPath = `${RNFS.DocumentDirectoryPath}/faces_embeddings.json`;

      // Converter blob para string se necessário
      const modelData = response.data;

      if (typeof modelData === 'string') {
        await RNFS.writeFile(modelPath, modelData, 'utf8');
      } else {
        // Se for blob, converter para string
        const modelText = JSON.stringify(modelData);
        await RNFS.writeFile(modelPath, modelText, 'utf8');
      }

      // 3. Carregar e validar o modelo
      const savedModel = await this.loadTrainedModel();

      if (savedModel && savedModel.embeddings.length > 0) {
        return {
          success: true,
          modelPath,
        };
      } else {
        return {
          success: false,
          error: 'Modelo baixado mas está vazio ou inválido',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao baixar modelo',
      };
    }
  }

  /**
   * Carrega o modelo treinado do armazenamento local
   */
  static async loadTrainedModel(): Promise<TrainedModel | null> {
    try {
      // 1. Tentar carregar do arquivo first
      const modelPath = `${RNFS.DocumentDirectoryPath}/faces_embeddings.json`;

      if (await RNFS.exists(modelPath)) {
        const modelContent = await RNFS.readFile(modelPath, 'utf8');
        const model: TrainedModel = JSON.parse(modelContent);

        // Salvar também no AsyncStorage para cache
        await Session.set(this.MODEL_STORAGE_KEY, model);

        return model;
      }

      // 2. Se não existir arquivo, tentar carregar do AsyncStorage
      const cachedModel = await Session.get<TrainedModel>(
        this.MODEL_STORAGE_KEY,
      );
      return cachedModel || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Salva o modelo treinado no armazenamento local
   */
  static async saveTrainedModel(model: TrainedModel): Promise<boolean> {
    try {
      // 1. Salvar no arquivo
      const modelPath = `${RNFS.DocumentDirectoryPath}/faces_embeddings.json`;
      await RNFS.writeFile(modelPath, JSON.stringify(model, null, 2), 'utf8');

      // 2. Salvar também no AsyncStorage para cache
      await Session.set(this.MODEL_STORAGE_KEY, model);

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se existe modelo treinado
   */
  static async hasTrainedModel(): Promise<boolean> {
    try {
      const modelPath = `${RNFS.DocumentDirectoryPath}/faces_embeddings.json`;
      const fileExists = await RNFS.exists(modelPath);

      if (fileExists) {
        // Verificar se o arquivo não está vazio
        const stat = await RNFS.stat(modelPath);
        return stat.size > 0;
      }

      // Se não existe arquivo, verificar AsyncStorage
      const cachedModel = await Session.get<TrainedModel>(
        this.MODEL_STORAGE_KEY,
      );
      return cachedModel != null && cachedModel.embeddings.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obter status de sincronização
   */
  static async getSyncStatus(): Promise<SyncStatus> {
    try {
      const stored = await Session.get<SyncStatus>(this.SYNC_STATUS_KEY);
      return (
        stored || {
          isOnline: true,
          pendingRecords: 0,
          syncing: false,
        }
      );
    } catch (error) {
      return {
        isOnline: false,
        pendingRecords: 0,
        syncing: false,
      };
    }
  }

  /**
   * Atualizar status de sincronização
   */
  static async updateSyncStatus(status: Partial<SyncStatus>): Promise<void> {
    try {
      const current = await this.getSyncStatus();
      const updated = {...current, ...status};
      await Session.set(this.SYNC_STATUS_KEY, updated);
    } catch (error) {}
  }

  /**
   * Verificar conectividade com a API
   */
  static async checkConnectivity(): Promise<boolean> {
    try {
      await api.get('/health', {timeout: 5000});
      await this.updateSyncStatus({isOnline: true});
      return true;
    } catch (error) {
      await this.updateSyncStatus({isOnline: false});
      return false;
    }
  }
}

export default SyncService;
