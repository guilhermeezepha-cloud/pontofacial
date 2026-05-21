// features/attendance/Slice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {
  OfflineTimeRecord,
  PaginatedResponse,
  TimeRecord,
  TimeRecordsFilters,
  TimeRecordsListRequest,
  TimeRecordsState,
} from './Types';

import {AppDispatch, RootState} from '../../config/Redux';
import {reduxNotifyError} from '../../utils/helpers';
import OfflineQueue from '../../utils/OfflineQueue';
import AttendanceService from './Service';

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------
const initialState: TimeRecordsState = {
  status: 'idle',
  records: [],
  pagination: undefined,
  filters: {},
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
export const AttendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    setTimeRecords: (state, action: PayloadAction<TimeRecord[]>) => {
      state.records = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<
        PaginatedResponse<TimeRecord>['pagination'] | undefined
      >,
    ) => {
      state.pagination = action.payload;
    },
    setFilters: (state, action: PayloadAction<TimeRecordsFilters>) => {
      state.filters = action.payload;
    },
    clearTimeRecords: state => {
      state.records = [];
      state.pagination = undefined;
    },
  },
});

export const {
  changeStatus,
  setTimeRecords,
  setPagination,
  setFilters,
  clearTimeRecords,
} = AttendanceSlice.actions;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const OFFLINE_MAX_ATTEMPTS = 3;
const ONLINE_CACHE_PREFIX = '@time-records:online';

const makeCacheKey = (
  collectorId?: number,
  params?: TimeRecordsListRequest,
) => {
  const a = typeof collectorId === 'number' ? String(collectorId) : 'all';
  const b = params ? JSON.stringify(params) : 'all';
  return `${ONLINE_CACHE_PREFIX}:${a}:${b}`;
};

const generateNumericId = (str: string): number => {
  const timestamp = Date.now();
  const stringSum = str
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return timestamp + stringSum;
};

// Converte OfflineTimeRecord → TimeRecord (usa a HORA DA MARCAÇÃO)
const offlineToTimeRecord = (offline: OfflineTimeRecord): TimeRecord => ({
  id: generateNumericId(offline.id), // ID local, não conflita com backend
  registration: offline.registration,
  employeeId: offline.employeeId,
  collectorId: offline.collectorId,
  collectorCode: offline.collectorCode,
  collectorIdentifier: offline.collectorIdentifier,
  groupCode: offline.groupCode,
  timestamp: offline.timestamp ?? offline.createdAt, // usa momento do ponto
  soapSynced: offline.synced, // false = pendente
  soapError: offline.synced ? null : 'Marcação offline pendente',
  soapAttempts: offline.attempts,
  lastSoapSyncAt: offline.synced ? offline.createdAt : null,
  createdAt: offline.createdAt,
  updatedAt: offline.createdAt,
});

// De-dup por registration|timestamp (ajuste se backend tiver outra granularidade)
const makeDedupKey = (r: Pick<TimeRecord, 'registration' | 'timestamp'>) =>
  `${String(r.registration)}|${new Date(r.timestamp).toISOString()}`;

// Aplica filtros também nos offline convertidos
function applyFiltersToRecord(
  r: TimeRecord,
  filters?: TimeRecordsListRequest & {collectorId?: number},
): boolean {
  if (!filters) return true;

  if (
    filters.registration &&
    String(r.registration) !== String(filters.registration)
  ) {
    return false;
  }

  if (typeof filters.collectorId === 'number') {
    if (Number(r.collectorId) !== Number(filters.collectorId)) return false;
  }

  if (filters.startDate) {
    if (
      new Date(r.timestamp).getTime() < new Date(filters.startDate).getTime()
    ) {
      return false;
    }
  }
  if (filters.endDate) {
    if (new Date(r.timestamp).getTime() > new Date(filters.endDate).getTime()) {
      return false;
    }
  }
  return true;
}

// OVERLAY: mantém ordem do backend para ONLINE e coloca OFFLINE pendentes (filtrados) no topo
function overlayOfflineOntoOnline(
  online: TimeRecord[],
  offlinePendentes: OfflineTimeRecord[],
  filters?: TimeRecordsListRequest & {collectorId?: number},
): {list: TimeRecord[]; offlineAdded: number} {
  // 1) offline → TimeRecord + filtros + ordena DESC
  const offlineConverted = offlinePendentes
    .map(offlineToTimeRecord)
    .filter(r => applyFiltersToRecord(r, filters))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  // 2) set de keys dos online (para de-dup)
  const onlineKeys = new Set(online.map(rec => makeDedupKey(rec)));

  // 3) somente offline que NÃO existem online
  const offlineOnly = offlineConverted.filter(
    rec => !onlineKeys.has(makeDedupKey(rec)),
  );

  // 4) overlay: offline pendente (topo) + online (na ordem do backend)
  return {list: [...offlineOnly, ...online], offlineAdded: offlineOnly.length};
}

// Ajusta o campo "total" (ou similar) da paginação, se existir
function adjustPaginationTotal<T extends Record<string, any> | undefined>(
  pagination: T,
  offlineAdded: number,
): T {
  if (!pagination || !offlineAdded) return pagination;

  const clone: any = {...pagination};

  if (typeof clone.total === 'number') {
    clone.total += offlineAdded;
  } else if (typeof clone.totalItems === 'number') {
    clone.totalItems += offlineAdded;
  } else if (typeof clone.count === 'number') {
    clone.count += offlineAdded;
  }
  // se sua API usa outro nome, adicione aqui

  return clone as T;
}

// ---------------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------------

// ✅ Unificado (overlay): busca ONLINE (ou snapshot local) + OFFLINE pendentes e mescla
export const fetchUnifiedTimeRecords =
  (collectorId: number, params?: TimeRecordsListRequest) =>
  async (dispatch: AppDispatch) => {
    dispatch(changeStatus('loading'));

    try {
      const Session = (await import('../../utils/session')).default;
      const cacheKey = makeCacheKey(collectorId, params);

      // 1) Tenta buscar ONLINE
      let onlineRecords: TimeRecord[] = [];
      let pagination: PaginatedResponse<TimeRecord>['pagination'] | undefined;

      try {
        if (typeof collectorId === 'number' && !Number.isNaN(collectorId)) {
          const {data} = await AttendanceService.getTimeRecordsByCollectorId(
            collectorId,
            params,
          );
          // esse endpoint costuma retornar array simples
          onlineRecords = Array.isArray(data) ? data : data?.data ?? [];
          pagination = undefined;
        } else {
          const {data} = await AttendanceService.getTimeRecords(params);
          if (Array.isArray(data)) {
            onlineRecords = data;
            pagination = undefined;
          } else {
            onlineRecords = data.data;
            pagination = data.pagination;
          }
        }
        // snapshot local dos online
        await Session.set(cacheKey, onlineRecords);
      } catch (error) {
        console.warn(
          '[fetchUnifiedTimeRecords] Falha ao buscar online; usando snapshot local:',
          error,
        );
        // offline: carrega snapshot local dos online
        onlineRecords = (await Session.get<TimeRecord[]>(cacheKey)) ?? [];
        // pagination permanece indefinida (ou você pode cachear também, se quiser)
      }

      // 2) Carrega fila OFFLINE (sempre), apenas pendentes
      const offlineQueue = await OfflineQueue.getQueue();
      let offlinePendentes = offlineQueue.filter(
        r => !r.synced && r.attempts < OFFLINE_MAX_ATTEMPTS,
      );

      // (Opcional) Mostrar pendentes só na primeira página:
      // if (params?.page && params.page > 1) offlinePendentes = [];

      // 3) Overlay: offline pendente (filtrado) no topo + online do backend
      const {list, offlineAdded} = overlayOfflineOntoOnline(
        onlineRecords,
        offlinePendentes,
        {
          ...params,
          collectorId,
        },
      );

      // 4) Ajustar total da paginação incluindo os offline adicionados
      const adjustedPagination = adjustPaginationTotal(
        pagination,
        offlineAdded,
      );

      dispatch(setTimeRecords(list));
      dispatch(setPagination(adjustedPagination));
      dispatch(changeStatus('success'));
    } catch (error) {
      console.error('Erro ao carregar marcações unificadas:', error);
      dispatch(reduxNotifyError(error));
      dispatch(changeStatus('error'));
    }
  };

// Online puro (mantido para usos específicos)
export const fetchTimeRecords =
  (params?: TimeRecordsListRequest) => async (dispatch: AppDispatch) => {
    dispatch(changeStatus('loading'));

    try {
      const {data} = await AttendanceService.getTimeRecords(params);

      if (Array.isArray(data)) {
        dispatch(setTimeRecords(data));
        dispatch(setPagination(undefined));
      } else {
        dispatch(setTimeRecords(data.data));
        dispatch(setPagination(data.pagination));
      }

      dispatch(changeStatus('success'));
    } catch (error) {
      console.error('Erro ao carregar marcações:', error);
      dispatch(reduxNotifyError(error));
      dispatch(changeStatus('error'));
    }
  };

export const fetchTimeRecordsByRegistration =
  (registration: string, params?: TimeRecordsListRequest) =>
  async (dispatch: AppDispatch) => {
    dispatch(changeStatus('loading'));

    try {
      const {data} = await AttendanceService.getTimeRecordsByRegistration(
        registration,
        params,
      );

      if (Array.isArray(data)) {
        dispatch(setTimeRecords(data));
        dispatch(setPagination(undefined));
      } else {
        dispatch(setTimeRecords(data.data));
        dispatch(setPagination(data.pagination));
      }

      dispatch(changeStatus('success'));
    } catch (error) {
      console.error('Erro ao carregar marcações por matrícula:', error);
      dispatch(reduxNotifyError(error));
      dispatch(changeStatus('error'));
    }
  };

export const fetchTimeRecordsByEmployeeId =
  (employeeId: number) => async (dispatch: AppDispatch) => {
    dispatch(changeStatus('loading'));

    try {
      const {data} = await AttendanceService.getTimeRecordsByEmployeeId(
        employeeId,
      );

      if (Array.isArray(data)) {
        dispatch(setTimeRecords(data));
        dispatch(setPagination(undefined));
      }

      dispatch(changeStatus('success'));
    } catch (error) {
      console.error('Erro ao carregar marcações por ID do funcionário:', error);
      dispatch(reduxNotifyError(error));
      dispatch(changeStatus('error'));
    }
  };

export const fetchTimeRecordsByCollectorId =
  (collectorId: number, params?: TimeRecordsListRequest) =>
  async (dispatch: AppDispatch) => {
    dispatch(changeStatus('loading'));

    try {
      const {data} = await AttendanceService.getTimeRecordsByCollectorId(
        collectorId,
        params,
      );

      if (Array.isArray(data)) {
        dispatch(setTimeRecords(data));
        dispatch(setPagination(undefined));
      } else {
        dispatch(setTimeRecords(data.data));
        dispatch(setPagination(data.pagination));
      }

      dispatch(changeStatus('success'));
    } catch (error) {
      console.error('Erro ao carregar marcações por ID do coletor:', error);
      dispatch(reduxNotifyError(error));
      dispatch(changeStatus('error'));
    }
  };

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
const reducer = (state: RootState) => state.attendance;

export const attendanceStatusSelector = (state: RootState) =>
  reducer(state).status;

export const attendanceIsLoadingSelector = (state: RootState) =>
  reducer(state).status === 'loading';

export const timeRecordsSelector = (state: RootState) => reducer(state).records;

export const attendancePaginationSelector = (state: RootState) =>
  reducer(state).pagination;

export const attendanceFiltersSelector = (state: RootState) =>
  reducer(state).filters;

export default AttendanceSlice.reducer;
