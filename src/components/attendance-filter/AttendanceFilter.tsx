import {useTheme} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {DateData} from 'react-native-calendars';

import {Colors} from '../../styles/Themes';
import Button from '../button';
import DatePickerTrigger from '../date-picker/Trigger';
import SearchInput from '../form/SearchInput';
import Icon from '../icon';
import Typography from '../typography';
import AttendanceFilterStyles from './AttendanceFilterStyles';

interface AttendanceFilterProps {
  currentRegistrationSearch?: string;
  selectedStartDate?: string;
  selectedEndDate?: string;
  onApply?: (payload: {
    startDate?: string;
    endDate?: string;
    registration?: string;
  }) => void;
  onClose?: () => void;
  onCancel?: () => void;
}

const AttendanceFilter: React.FC<AttendanceFilterProps> = ({
  currentRegistrationSearch,
  selectedStartDate,
  selectedEndDate,
  onClose,
  onCancel,
  onApply,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = AttendanceFilterStyles(colors);
  const [currentCalendarId, setCurrentCalendarId] = useState('');
  const [localStartDate, setLocalStartDate] = useState<string | undefined>(
    selectedStartDate,
  );
  const [localEndDate, setLocalEndDate] = useState<string | undefined>(
    selectedEndDate,
  );
  const [localRegistration, setLocalRegistration] = useState<string>(
    currentRegistrationSearch ?? '',
  );

  useEffect(() => {
    setLocalStartDate(selectedStartDate);
  }, [selectedStartDate]);

  useEffect(() => {
    setLocalEndDate(selectedEndDate);
  }, [selectedEndDate]);

  useEffect(() => {
    setLocalRegistration(currentRegistrationSearch ?? '');
  }, [currentRegistrationSearch]);

  const handleCalendarIdChange = (id: string) => {
    setCurrentCalendarId(prev => (prev === id ? '' : id));
  };

  const handleStartDaySelect = (day: DateData) =>
    setLocalStartDate(day.dateString);
  const handleEndDaySelect = (day: DateData) => setLocalEndDate(day.dateString);

  // reset internos
  const resetDates = () => {
    setLocalStartDate(undefined);
    setLocalEndDate(undefined);
  };
  const resetRegistration = () => setLocalRegistration('');

  const handleApply = () => {
    onApply?.({
      startDate: localStartDate || undefined,
      endDate: localEndDate || undefined,
      registration: localRegistration?.trim() || undefined,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          color="secondaryDark"
          fontFamily="Poppins-SemiBold"
          fontSize={12}>
          Filtros
        </Typography>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon
            name="close"
            width={22}
            height={22}
            fill={colors.secondaryDark}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.dates}>
        <View style={styles.labels}>
          <Typography color="secondaryDark" fontSize={12}>
            Data
          </Typography>

          <TouchableOpacity style={styles.reset} onPress={resetDates}>
            <Typography color="primary" fontSize={12}>
              Reset
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.datesWrapper}>
          <View
            style={[
              styles.dateItem,
              currentCalendarId === '1' && styles.dateItemActive,
            ]}>
            <DatePickerTrigger
              id="1"
              currentCalendarId={currentCalendarId}
              onInstanceSelect={handleCalendarIdChange}
              label="De"
              selectedDate={localStartDate}
              onDaySelect={handleStartDaySelect}
            />
          </View>

          <View
            style={[
              styles.dateItem,
              currentCalendarId === '1' && styles.dateItemActive,
            ]}>
            <DatePickerTrigger
              id="2"
              currentCalendarId={currentCalendarId}
              onInstanceSelect={handleCalendarIdChange}
              label="Até"
              selectedDate={localEndDate}
              onDaySelect={handleEndDaySelect}
            />
          </View>
        </View>
      </View>
      <View style={styles.registration}>
        <View style={styles.labels}>
          <Typography color="secondaryDark" fontSize={12}>
            Matrícula
          </Typography>

          <TouchableOpacity style={styles.reset} onPress={resetRegistration}>
            <Typography color="primary" fontSize={12}>
              Reset
            </Typography>
          </TouchableOpacity>
        </View>

        <SearchInput
          placeholder="Procurar..."
          value={localRegistration}
          onChangeText={setLocalRegistration}
          defaultValue={localRegistration}
        />
      </View>
      <View style={styles.actions}>
        <Button
          onPress={onCancel ?? (() => {})}
          variant="defaultOutline"
          textColor="primary">
          Cancelar
        </Button>

        <Button onPress={handleApply} variant="default" textColor="white">
          Aplicar
        </Button>
      </View>
    </View>
  );
};

export default AttendanceFilter;
