import { AxiosResponse } from 'axios';

import {
  CreateTimeRecordRequest,
  CreateTimeRecordResponse,
  TimeRecordsListRequest,
  TimeRecordsListResponse,
} from './Types';

import { api } from '../../config/Axios';

class AttendanceService {
  /**
   * Cria uma nova marcação de ponto
   */
  static createTimeRecord(
    data: CreateTimeRecordRequest,
  ): Promise<AxiosResponse<CreateTimeRecordResponse>> {
    return api.post('/time-records', data);
  }

  /**
   * Lista todas as marcações com paginação e filtros opcionais
   */
  static getTimeRecords(
    params?: TimeRecordsListRequest,
  ): Promise<AxiosResponse<TimeRecordsListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }

    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    if (params?.registration) {
      queryParams.append('registration', params.registration);
    }

    const url = `/time-records${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return api.get(url);
  }

  /**
   * Lista marcações por matrícula do funcionário
   */
  static getTimeRecordsByRegistration(
    registration: string,
    params?: TimeRecordsListRequest,
  ): Promise<AxiosResponse<TimeRecordsListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const url = `/time-records/registration/${registration}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return api.get(url);
  }

  /**
   * Lista marcações por ID do funcionário
   */
  static getTimeRecordsByEmployeeId(
    employeeId: number,
  ): Promise<AxiosResponse<TimeRecordsListResponse>> {
    return api.get(`/time-records/employee/${employeeId}`);
  }

  /**
   * Lista marcações por ID do coletor com filtros opcionais
   */
  static getTimeRecordsByCollectorId(
    collectorId: number,
    params?: TimeRecordsListRequest,
  ): Promise<AxiosResponse<TimeRecordsListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }

    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    if (params?.registration) {
      queryParams.append('registration', params.registration);
    }

    const url = `/time-records/collector/${collectorId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return api.get(url);
  }

  /**
   * Sincroniza marcações pendentes do banco com o SOAP
   */
  static syncPendingRecords(): Promise<
    AxiosResponse<{
      success: boolean;
      synced: number;
      failed: number;
      details: string[];
    }>
  > {
    return api.post('/time-records/sync-pending');
  }
}

export default AttendanceService;
