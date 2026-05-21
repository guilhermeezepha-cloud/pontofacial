import {useTheme} from '@react-navigation/native';

import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';

import {fetchUnifiedTimeRecords} from '../attendance/Slice';
import {adminAuthDoneSelector} from '../auth/Slice';
import {changeLastSyncDate} from './Slice';

import ActionFeedback from '../../components/action-feedback';
import FakeProgressBar from '../../components/loader/FakeProgressBar';
import ScreenShell from '../../components/screen-shell';
import Typography from '../../components/typography';
import {useAppDispatch, useAppSelector} from '../../hooks/Redux';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {useIdentificationData} from '../../hooks/useIdentificationData';
import {Colors} from '../../styles/Themes';
import {formatDate} from '../../utils/dateFormatters';
import OfflineQueue from '../../utils/OfflineQueue';
import Session from '../../utils/session';
import {LAST_SYNC_DATE_KEY} from '../../utils/storageKeys';
import AttendanceService from '../attendance/Service';
import SyncService from '../sync/SyncService';
import SynchronizationContainerStyles from './SynchronizationContainerStyles';

const SynchronizationContainer = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = SynchronizationContainerStyles(colors);
  const navigation = useAppNavigation();
  const adminAuthDone = useAppSelector(adminAuthDoneSelector);
  const {identificationData} = useIdentificationData();

  const [loading, setLoading] = useState(true);
  const [syncDone, setSyncDone] = useState(false);
  const [lastSync, setLastSync] = useState('');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncStats, setSyncStats] = useState<{
    offlineRecords: number;
    syncedRecords: number;
    failedRecords: number;
    details: string[];
  } | null>(null);
  const [syncStep, setSyncStep] = useState<string>('Iniciando...');

  const runSync = useCallback(async () => {
    setLoading(true);
    setSyncDone(false);
    setSyncError(null);
    setSyncStats(null);

    try {
      setSyncStep('Verificando marcações offline...');
      // 1. Verificar estatísticas antes da sincronização
      const preStats = await OfflineQueue.getQueueStats();

      setSyncStep('Sincronizando marcações pendentes...');

      // 2. Sincronizar marcações pendentes offline (queue local)
      const offlineResult = await OfflineQueue.syncPendingRecords();

      // 3. Sincronizar marcações pendentes do banco (via API)
      setSyncStep('Sincronizando marcações pendentes do banco...');
      let backendResult: {synced: number; failed: number; details: string[]} = {
        synced: 0,
        failed: 0,
        details: [],
      };

      try {
        const response = await AttendanceService.syncPendingRecords();
        backendResult = response.data;
      } catch (error) {
        backendResult = {
          synced: 0,
          failed: 1,
          details: ['Erro ao sincronizar com backend'],
        };
      }

      setSyncStep('Atualizando modelo de reconhecimento facial...');

      // 4. Forçar reload do modelo dinâmico
      await SyncService.loadTrainedModel();

      setSyncStep('Finalizando sincronização...');

      // 5. Verificar estatísticas pós-sincronização
      const postStats = await OfflineQueue.getQueueStats();

      // 6. Atualizar lista de marcações no estado global usando API específica do coletor
      if (identificationData?.id) {
        dispatch(
          fetchUnifiedTimeRecords(identificationData.id, {
            page: 1,
            limit: 50,
          }),
        );
      }

      // 7. Definir estatísticas de sincronização combinadas
      const totalSynced = offlineResult.synced + backendResult.synced;
      const totalFailed = offlineResult.failed + backendResult.failed;
      const combinedDetails = [
        ...offlineResult.details,
        ...backendResult.details,
      ];

      setSyncStats({
        offlineRecords: preStats.pending,
        syncedRecords: totalSynced,
        failedRecords: totalFailed,
        details: combinedDetails,
      });

      // Simular tempo mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      const overallSuccess =
        offlineResult.success &&
        (backendResult.synced > 0 || backendResult.failed === 0);
      setSyncDone(overallSuccess);

      if (!overallSuccess) {
        const errorMessages = [];
        if (!offlineResult.success) {
          errorMessages.push('Falha na sincronização offline');
        }
        if (backendResult.failed > 0) {
          errorMessages.push(
            `Falha em ${backendResult.failed} marcação(ões) do banco`,
          );
        }
        setSyncError(errorMessages.join('; ') || 'Erro na sincronização');
      }
    } catch (error) {
      setSyncError(
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
      setSyncDone(false);
    } finally {
      setLoading(false);
    }
  }, [dispatch, identificationData?.id]);

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

  const handleLastSyncDate = useCallback(async () => {
    const lastSyncDate = new Date().toISOString();
    setLastSync(lastSyncDate);
    dispatch(changeLastSyncDate(lastSyncDate));
    try {
      await Session.setRaw(LAST_SYNC_DATE_KEY, lastSyncDate);
    } catch (e) {}
  }, [dispatch]);

  useEffect(() => {
    if (syncDone) handleLastSyncDate();
  }, [syncDone, handleLastSyncDate]);

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
            Sincronizando.
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
                ? `Sincronização concluída dia ${formatDate(lastSync)}.${
                    syncStats
                      ? ` ${syncStats.syncedRecords} marcações sincronizadas, ${syncStats.failedRecords} falharam.`
                      : ''
                  }`
                : syncError ||
                  'Sincronização não concluída, por favor tente novamente.'
            }
            onAction={syncDone ? () => navigation.goBack() : runSync}
            actionLabel={syncDone ? 'Fechar' : 'Tente novamente'}
          />
        </View>
      )}
    </ScreenShell>
  );
};

export default SynchronizationContainer;
