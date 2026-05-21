import {AxiosResponse} from 'axios';

import {Collector, CollectorRequestPayload} from './Types';

import {api} from '../../config/Axios';

class RegisterService {
  static postNewCollector(
    payload: CollectorRequestPayload,
  ): Promise<AxiosResponse<Collector>> {
    return api.post('/collectors', payload);
  }

  static updateCollectorData(
    payload: Partial<CollectorRequestPayload>,
    collectorId: number,
  ): Promise<AxiosResponse<Collector>> {
    return api.patch(`/collectors/${collectorId}`, payload);
  }
}

export default RegisterService;
