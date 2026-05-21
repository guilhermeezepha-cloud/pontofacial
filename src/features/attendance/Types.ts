import { Collector } from '../register/Types';

import { Employee } from '../employees';

// Interface para uma marcação individual
export interface TimeRecord {
  id: number;
  registration: string;
  employeeId: number;
  collectorId: number;
  collectorCode: string;
  collectorIdentifier: string;
  groupCode: string;
  timestamp: string; // ISO string
  localDateTime?: string;
  timezoneOffset?: string;
  soapSynced: boolean;
  lastSoapSyncAt?: string | null;
  soapError?: string | null;
  soapAttempts: number;
  createdAt: string;
  updatedAt: string;

  // Relacionamentos incluídos via API
  employee?: Employee;
  collector?: Collector;
}

// Interface para resposta paginada da API
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Interface para parâmetros de paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Interface para filtros de marcações
export interface TimeRecordsFilters extends PaginationParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  registration?: string;
  employeeId?: number;
  collectorId?: number;
}

// State do Redux para marcações
export interface TimeRecordsState {
  status: Status;
  records: TimeRecord[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters: TimeRecordsFilters;
}

// Interface para requisição de listagem
export interface TimeRecordsListRequest {
  page?: number;
  limit?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  registration?: string;
}

// Interface para resposta da API de listagem
export type TimeRecordsListResponse =
  | PaginatedResponse<TimeRecord>
  | TimeRecord[];

// ========== NOVAS INTERFACES PARA INTEGRAÇÃO ==========

// Tipos para criação de marcações
export interface CreateTimeRecordRequest {
  registration: string;
  employeeId: number;
  collectorId: number;
  collectorCode: string;
  collectorIdentifier: string;
  groupCode: string;
  timestamp: string;
}

export interface CreateTimeRecordResponse {
  localData: {
    id: number;
    registration: string;
    employeeId: number;
    collectorId: number;
    collectorCode: string;
    collectorIdentifier: string;
    groupCode: string;
    timestamp: string;
    localDateTime: string;
    timezoneOffset: string;
    synced: boolean;
    createdAt: string;
    updatedAt: string;
  };
  soapSync: {
    success: boolean;
    synced: number;
    failed: number;
    details: string;
  };
}

// Tipos para queue offline
export interface OfflineTimeRecord extends CreateTimeRecordRequest {
  id: string;
  synced: boolean;
  attempts: number;
  lastAttempt?: string;
  createdAt: string;
}

// Tipos para download de modelo
export interface ModelDownloadResponse {
  success: boolean;
  modelPath?: string;
  error?: string;
}

// Tipos para dados do modelo
export interface FaceEmbedding {
  faceId: string;
  registration: string;
  employeeId: number;
  embedding: number[];
  name?: string;
}

export interface TrainedModel {
  embeddings: FaceEmbedding[];
  collectorId: number;
  createdAt: string;
  version: string;
}

// Tipos para sincronização
export interface SyncStatus {
  isOnline: boolean;
  pendingRecords: number;
  lastSync?: string;
  syncing: boolean;
}

// Tipos para configurações
export interface CollectorData {
  id: number;
  code: string;
  identifier: string;
  groupId: number;
  groupCode: string;
  active: boolean;
}
