import { useTheme } from '@react-navigation/native';

import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { adminAuthDoneSelector } from '../auth/Slice';
import { getFaceModels } from '../face-recognition/Slice';

import ActionFeedback from '../../components/action-feedback';
import FakeProgressBar from '../../components/loader/FakeProgressBar';
import ScreenShell from '../../components/screen-shell';
import Typography from '../../components/typography';
import { useAppDispatch, useAppSelector} from '../../hooks/Redux';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useIdentificationData } from '../../hooks/useIdentificationData';
import { Colors } from '../../styles/Themes';
import Session from '../../utils/session';
import { EMPLOYEES_LIST_KEY } from '../../utils/storageKeys';
import { getApiBaseURL } from '../../utils/apiBaseUrl';
import EmployeeService from '../employees/Service';
import EmployeeSyncContainerStyles from './EmployeeSyncContainerStyles';

const EmployeeSyncContainer = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = EmployeeSyncContainerStyles(colors);
  const navigation = useAppNavigation();
  const adminAuthDone = useAppSelector(adminAuthDoneSelector);
  const {identificationData} = useIdentificationData();

  const [loading, setLoading] = useState(true);
  const [syncDone, setSyncDone] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncStep, setSyncStep] = useState<string>('Iniciando...');
  const [employeeCount, setEmployeeCount] = useState(0);

  const runSync = useCallback(async () => {
    setLoading(true);
    setSyncDone(false);
    setSyncError(null);
    setEmployeeCount(0);

    let currentStep = '';

    try {
      if (!identificationData) {
        throw new Error('Dados de identificação não encontrados.');
      }

      const collectorId = identificationData.id;
      const groupCode = identificationData.groupCode;
      const collectorCode = identificationData.code;

      // 1. Buscar lista atualizada de funcionários
      currentStep = 'Buscar funcionários (GET /employees/filter)';
      setSyncStep('Buscando lista de funcionários...');

      const employeesResponse = await EmployeeService.getFilteredEmployees({
        groupCode,
        collectorCode,
      });

      const employees = employeesResponse.data;

      setEmployeeCount(employees.length);

      // 2. Salvar no AsyncStorage
      currentStep = 'Salvar funcionários localmente';
      setSyncStep('Salvando lista de funcionários...');

      await Session.set(EMPLOYEES_LIST_KEY, employees);

      // 3. Baixar e recarregar embeddings
      currentStep = `Baixar embeddings (GET /collectors/${collectorId}/model)`;
      setSyncStep('Atualizando modelo de reconhecimento facial...');

      await dispatch(getFaceModels(Number(collectorId)));

      setSyncStep('Finalizado.');

      await new Promise(resolve => setTimeout(resolve, 500));

      setSyncDone(true);
    } catch (error: any) {
      const status = error?.response?.status ? ` (status ${error.response.status})` : '';
      const baseURL = getApiBaseURL();
      const url = error?.config?.url ? ` — URL: ${baseURL}${error.config.url}` : ` — baseURL: ${baseURL}`;

      const msg = error?.response?.data?.message
        || (error instanceof Error ? error.message : 'Erro desconhecido');

      setSyncError(`[${currentStep}] ${msg}${status}${url}`);
      setSyncDone(false);
    } finally {
      setLoading(false);
    }
  }, [dispatch, identificationData]);

  useEffect(() => {
    runSync();
  }, [runSync]);

  useEffect(() => {
    if (!adminAuthDone) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  }, [adminAuthDone, navigation]);

  return (
    <ScreenShell onClose={() => navigation.goBack()}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Typography
            fontSize={36}
            fontFamily="Poppins-SemiBold"
            fontWeight="semibold"
            color="black"
            textAlign="center"
            lineHeight={1.4}>
            Sincronizando funcionários.
          </Typography>
          <FakeProgressBar loading={loading} />

          <Typography
            fontSize={16}
            color="black"
            textAlign="center"
            lineHeight={1.4}>
            {syncStep}
          </Typography>

          <Typography
            fontSize={14}
            color="black"
            textAlign="center"
            lineHeight={1.4}>
            Por favor, aguarde até o fim da sincronização.
          </Typography>
        </View>
      ) : (
        <View style={styles.feedbackContainer}>
          <ActionFeedback
            status={syncDone ? 'success' : 'error'}
            message={
              syncDone
                ? 'Sincronização concluída com sucesso.'
                : 'Sincronização falhou.'
            }
            subMessage={
              syncDone
                ? `${employeeCount} funcionário(s) sincronizado(s).`
                : 'Não foi possível sincronizar, por favor tente novamente.'
            }
            onAction={syncDone ? () => navigation.goBack() : runSync}
            actionLabel={syncDone ? 'Fechar' : 'Tente novamente'}
          />
        </View>
      )}
    </ScreenShell>
  );
};

export default EmployeeSyncContainer;
