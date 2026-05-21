import {AxiosResponse} from 'axios';

import {api} from '../../config/Axios';
import {FaceEmbedding} from '../../machine-learning/FaceSimilarity';

class FaceRecognitionService {
  static getTrainedModel(
    collectorId: number,
  ): Promise<AxiosResponse<FaceEmbedding[]>> {
    return api.get<FaceEmbedding[]>(`/collectors/${collectorId}/model`, {
      responseType: 'json',
    });
  }

  static getModelVersion(
    collectorId: number,
  ): Promise<AxiosResponse<{updatedAt: string}>> {
    return api.get<{updatedAt: string}>(
      `/collectors/${collectorId}/model/version`,
    );
  }
}

export default FaceRecognitionService;
