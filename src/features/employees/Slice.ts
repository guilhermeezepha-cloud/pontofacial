import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { CollectorWithoutLogo } from '../register/Types';
import {
  Employee,
  EmployeeFilterParams,
  EmployeesState,
  ForpontoEmployeesRequestParams,
  ProcessingJob,
} from './Types';

import { getFaceModels } from '../face-recognition/Slice';
import FaceRecognitionService from '../face-recognition/Service';

import {
  AppDispatch,
  RootState,
} from '../../config/Redux';
import {
  reduxNotifyError,
  reduxNotifySuccess,
} from '../../utils/helpers';
import Session from '../../utils/session';
import {
  EMPLOYEES_LIST_KEY,
  FACE_MODEL_VERSION_KEY,
  IDENTIFICATION_DATA_KEY,
} from '../../utils/storageKeys';
import EmployeeService from './Service';

const initialState: EmployeesState = {
  status: 'idle',
  employees: null,
  jobId: null,
};

export const EmployeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    loadEmployyes: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    loadJobId: (state, action: PayloadAction<string>) => {
      state.jobId = action.payload;
    },
  },
});

export const {changeStatus, loadEmployyes, loadJobId} = EmployeesSlice.actions;

export const getAllEmployees = () => async (dispatch: AppDispatch) => {
  dispatch(changeStatus('loading'));

  const POLL_INTERVAL_MS = 8000;
  const MAX_POLLS = 135;

  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  try {
    const identificationData = await Session.get<CollectorWithoutLogo>(
      IDENTIFICATION_DATA_KEY,
    );
    const collectorId = identificationData?.id;
    if (!collectorId)
      throw new Error('Collector ID não encontrado no storage.');

    const forpontoEmployeesParams: ForpontoEmployeesRequestParams = {
      codigoGrupo: identificationData.groupCode,
      codigoColetor: identificationData.code,
      identificadorUnico: identificationData.identifier,
    };

    const employeesFilterParams: EmployeeFilterParams = {
      groupCode: identificationData.groupCode,
      collectorCode: identificationData.code,
    };

    const forpontoEmployeesResponse =
      await EmployeeService.getForpontoEmployees(forpontoEmployeesParams);

    const jobId = forpontoEmployeesResponse.data.localData.processingJob.jobId;
    dispatch(loadJobId(jobId));

    let completed = false;
    for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
      const jobStatusResponse = await EmployeeService.getEmployeesJobStatus(
        jobId,
      );
      const status: ProcessingJob['status'] = jobStatusResponse.data.status;

      if (status === 'COMPLETED') {
        completed = true;
        break;
      } else if (status === 'ERROR') {
        // Se deu erro, lançar exceção com a mensagem do erro
        const errorMessage =
          jobStatusResponse.data.error ||
          'Erro no processamento de funcionários';
        throw new Error(`Erro no processamento: ${errorMessage}`);
      }
      await sleep(POLL_INTERVAL_MS);
    }

    if (!completed) {
      throw new Error(`Timeout aguardando conclusão do job ${jobId}.`);
    }

    const employeesResponse = await EmployeeService.getFilteredEmployees(
      employeesFilterParams,
    );
    await Session.set<Employee[]>(EMPLOYEES_LIST_KEY, employeesResponse.data);

    await dispatch(getFaceModels(Number(collectorId)));

    const { data: modelData } = await FaceRecognitionService.getModelVersion(Number(collectorId));
    await Session.set(FACE_MODEL_VERSION_KEY, modelData.updatedAt);

    dispatch(changeStatus('success'));
    dispatch(
      reduxNotifySuccess({message: 'Matrículas carregadas com sucesso!'}),
    );
  } catch (error) {
    dispatch(reduxNotifyError(error));
  } finally {
    dispatch(changeStatus('idle'));
  }
};

// Selectors
const reducer = (state: RootState) => state.employees;

export const employeesStatusSelector = (state: RootState) =>
  reducer(state).status;

export const employeesIsLoadingSelector = (state: RootState) =>
  reducer(state).status === 'loading';

export const jobIdSelector = (state: RootState) => reducer(state).jobId;

export default EmployeesSlice.reducer;
