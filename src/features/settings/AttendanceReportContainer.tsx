import { useTheme } from '@react-navigation/native';

import React, {
  useEffect,
  useState,
} from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';

import { TimeRecord } from '../attendance/Types';

import {
  attendanceIsLoadingSelector,
  fetchUnifiedTimeRecords,
  timeRecordsSelector,
} from '../attendance/Slice';
import { adminAuthDoneSelector } from '../auth/Slice';

import AttendanceFilter from '../../components/attendance-filter/AttendanceFilter';
import AttendanceTable from '../../components/attendance-table';
import Icon from '../../components/icon';
import Loader from '../../components/loader';
import ReusableModal from '../../components/modal';
import ScreenShell from '../../components/screen-shell';
import Typography from '../../components/typography';
import {
  useAppDispatch,
  useAppSelector,
} from '../../hooks/Redux';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useIdentificationData } from '../../hooks/useIdentificationData';
import { Colors } from '../../styles/Themes';
import AttendanceReportContainerStyles from './AttendanceReportContainerStyles';

interface Attendance {
  registration: string;
  syncStatus: boolean;
  dateTime: string;
  isOffline?: boolean; // Nova propriedade
}

// Função para transformar TimeRecord em Attendance para o componente de tabela
const transformTimeRecordToAttendance = (record: TimeRecord): Attendance => {
  const isOfflineRecord =
    record.id.toString().includes('offline') ||
    record.soapError === 'Marcação offline pendente';

  return {
    registration: record.registration,
    syncStatus: record.soapSynced,
    dateTime: record.timestamp,
    isOffline: isOfflineRecord,
  };
};

const AttendanceReportContainer = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = AttendanceReportContainerStyles(colors);
  const navigation = useAppNavigation();
  const adminAuthDone = useAppSelector(adminAuthDoneSelector);
  const {identificationData} = useIdentificationData();

  // Dados do Redux
  const timeRecords = useAppSelector(timeRecordsSelector);
  const isLoading = useAppSelector(attendanceIsLoadingSelector);
  // const pagination = useAppSelector(attendancePaginationSelector); // Para futuras implementações de paginação

  // Estados locais para filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<
    string | undefined
  >(undefined); // 'YYYY-MM-DD'
  const [selectedEndDate, setSelectedEndDate] = useState<string | undefined>(
    undefined,
  );
  const [currentRegistrationSearch, setCurrentRegistrationSearch] =
    useState<string>('');

  // Estados locais para dados filtrados
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>(
    [],
  );

  // Carrega dados iniciais
  useEffect(() => {
    if (identificationData?.id) {
      dispatch(
        fetchUnifiedTimeRecords(identificationData.id, {
          page: 1,
          limit: 50,
        }),
      );
    }
  }, [dispatch, identificationData?.id]);

  // Transforma dados quando timeRecords mudam (sem filtro local)
  useEffect(() => {
    const transformedRecords = timeRecords.map(transformTimeRecordToAttendance);
    setFilteredAttendance(transformedRecords);
  }, [timeRecords]);

  const handleApplyFilters = (payload: {
    startDate?: string;
    endDate?: string;
    registration?: string;
  }) => {
    let {startDate, endDate, registration} = payload;

    registration = (registration ?? '').trim();
    if (registration === '') registration = undefined;

    // se ambos existem e start > end, inverte
    if (startDate && endDate && startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }

    // Atualizar estados dos filtros
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    setCurrentRegistrationSearch(registration ?? '');

    // Enviar filtros para a API específica do coletor ao invés da API geral
    if (identificationData?.id) {
      dispatch(
        fetchUnifiedTimeRecords(identificationData.id, {
          page: 1,
          limit: 50,
          startDate,
          endDate,
          registration,
        }),
      );
    }

    setFilterOpen(false);
  };

  const handleCancel = () => setFilterOpen(false);

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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Typography fontSize={16} color="red" fontFamily="Poppins-Bold">
              {`${identificationData?.code} - ${identificationData?.groupCode}`}
            </Typography>

            <Typography
              fontSize={36}
              color="textPrimary"
              lineHeight={1.4}
              fontFamily="Poppins-SemiBold"
              fontWeight="semibold">
              Relatório de Envio das Marcações
            </Typography>
          </View>
          <TouchableOpacity onPress={() => setFilterOpen(!filterOpen)}>
            <Icon name="filter" width={28} height={29} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Loader size="large" />
        ) : (
          <AttendanceTable data={filteredAttendance} />
        )}
      </View>

      <ReusableModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        contentStyle={styles.modalContent}>
        <AttendanceFilter
          currentRegistrationSearch={currentRegistrationSearch}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          onApply={handleApplyFilters}
          onCancel={handleCancel}
        />
      </ReusableModal>
    </ScreenShell>
  );
};

export default AttendanceReportContainer;
