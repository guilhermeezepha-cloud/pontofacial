import { useTheme } from '@react-navigation/native';

import React, { useMemo, useState } from 'react';
import { FlatList, GestureResponderEvent, TouchableOpacity, View } from 'react-native';

import dayjs from '../../config/Dayjs';
import { Colors } from '../../styles/Themes';
import Icon from '../icon';
import Typography from '../typography';
import AttendanceTableStyles from './Styles';

export interface Attendance {
  registration: string;
  syncStatus: boolean;
  dateTime: string; // ISO
  isOffline?: boolean; // Nova propriedade para identificar marcações offline
}

interface AttendanceTableProps {
  data: Attendance[];
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30];

const formatDateTime = (iso: string) => dayjs(iso).format('DD.MM.YY - HH:mm');

const AttendanceTable: React.FC<AttendanceTableProps> = ({data}) => {
  const [asc, setAsc] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = AttendanceTableStyles(colors);

  // ordena por matrícula
  const sorted = useMemo(() => {
    return [...data].sort((a, b) =>
      asc
        ? a.registration.localeCompare(b.registration)
        : b.registration.localeCompare(a.registration),
    );
  }, [data, asc]);

  const total = sorted.length;
  const totalPages = Math.ceil(total / rowsPerPage);
  const from = page * rowsPerPage;
  const to = Math.min((page + 1) * rowsPerPage, total);
  const pageSlice = sorted.slice(from, to);

  const cycleRowsPerPage = () => {
    const idx = ROWS_PER_PAGE_OPTIONS.indexOf(rowsPerPage);
    const next =
      ROWS_PER_PAGE_OPTIONS[(idx + 1) % ROWS_PER_PAGE_OPTIONS.length];
    setRowsPerPage(next);
    setPage(0);
  };

  const onPrev = (_e: GestureResponderEvent) => {
    setPage(p => Math.max(p - 1, 0));
  };
  const onNext = (_e: GestureResponderEvent) => {
    setPage(p => Math.min(p + 1, totalPages - 1));
  };

  return (
    <View style={styles.wrapper}>
      {/* cabeçalho */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.headerCell, styles.flex2]}
          onPress={() => setAsc(v => !v)}
          activeOpacity={0.7}>
          <Typography
            fontSize={12}
            fontFamily="Poppins-ExtraBold"
            color="textPrimary"
            lineHeight={1.4}>
            Matrícula
          </Typography>
          <Icon name={asc ? 'arrowUp' : 'arrowDown'} width={12} height={13} />
        </TouchableOpacity>
        <View style={[styles.headerCell, styles.flex2]}>
          <Typography
            fontSize={12}
            fontFamily="Poppins-ExtraBold"
            color="textPrimary"
            lineHeight={1.4}>
            Status
          </Typography>
        </View>
        <View style={[styles.headerCell, styles.flex1]}>
          <Typography
            fontSize={12}
            fontFamily="Poppins-ExtraBold"
            color="textPrimary"
            lineHeight={1.4}>
            Data/Horário
          </Typography>
        </View>
      </View>

      {/* corpo */}
      <FlatList
        data={pageSlice}
        keyExtractor={(item, idx) =>
          `${item.registration}-${idx}-${item.dateTime}`
        }
        renderItem={({item, index}) => (
          <View
            style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}>
            <View style={[styles.cell, styles.flex2]}>
              <Typography fontSize={12} color="textPrimary" lineHeight={1.4}>
                {item.registration}
              </Typography>
            </View>
            <View style={[styles.cell, styles.flex2]}>
              <View style={styles.statusContainer}>
                {item.isOffline ? (
                  <>
                    <Icon
                      name="warning"
                      width={26}
                      height={27}
                      fill={colors.warning}
                    />
                    <Typography
                      fontSize={12}
                      color="textPrimary"
                      lineHeight={1.4}>
                      Offline
                    </Typography>
                  </>
                ) : (
                  <>
                    <Icon
                      name={item.syncStatus ? 'circleCheck' : 'warning'}
                      width={26}
                      height={27}
                      fill={item.syncStatus ? colors.success : colors.warning}
                    />
                    <Typography
                      fontSize={12}
                      color="textPrimary"
                      lineHeight={1.4}>
                      {item.syncStatus ? 'Enviado' : 'Pendente'}
                    </Typography>
                  </>
                )}
              </View>
            </View>

            <View style={[styles.cell, styles.flex1]}>
              <Typography fontSize={12} color="textPrimary" lineHeight={1.4}>
                {formatDateTime(item.dateTime)}
              </Typography>
            </View>
          </View>
        )}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyRow}>
            <Typography
              fontSize={14}
              color="textPrimary"
              fontFamily="Poppins-Bold"
              lineHeight={1.4}>
              Nenhum registro encontrado
            </Typography>
          </View>
        }
      />

      {/* paginação */}
      <View style={styles.pagination}>
        <View style={styles.rowsPerPage}>
          <Typography fontSize={10} color="textSecondary" lineHeight={1.4}>
            Rows per page:
          </Typography>

          <TouchableOpacity
            onPress={cycleRowsPerPage}
            style={styles.rowsPicker}>
            <Typography fontSize={10} color="textPrimary" lineHeight={1.4}>
              {rowsPerPage}
            </Typography>
            <Icon name={'dropDown'} width={23} height={23} />
          </TouchableOpacity>
        </View>

        <View style={styles.navigation} />

        <Typography fontSize={10} color="textSecondary" lineHeight={1.4}>
          {from + 1}-{to} of {total}
        </Typography>

        <View style={styles.navigationActions}>
          <TouchableOpacity
            onPress={onPrev}
            disabled={page === 0}
            style={styles.navigationBtn}>
            <Icon
              name={'arrowLeft'}
              width={21}
              height={21}
              fillOpacity={page === 0 ? 0.26 : 0.87}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNext}
            disabled={page >= totalPages - 1}
            style={styles.navigationBtn}>
            <Icon
              name={'arrowRight'}
              width={21}
              height={21}
              fillOpacity={page >= totalPages - 1 ? 0.26 : 0.87}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AttendanceTable;
