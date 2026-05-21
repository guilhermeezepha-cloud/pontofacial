import {useTheme} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';

import dayjs from '../../config/Dayjs';
import {Colors} from '../../styles/Themes';
import Icon from '../icon';
import Typography from '../typography';
import CustomDatePickerStyles from './Styles';

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
};
LocaleConfig.defaultLocale = 'pt';

interface CustomDatePickerProps {
  selectedDate?: string;
  onDaySelect?: (day: DateData) => void;
  autoSelectToday?: boolean;
}

type DayProps = {
  date?: DateData;
  state?: '' | 'today' | 'disabled' | 'selected' | 'inactive';
  onPress?: (date: DateData) => void;
  marking?: any;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onDaySelect,
  autoSelectToday = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = CustomDatePickerStyles(colors);

  const initialDate = selectedDate ?? dayjs().format('YYYY-MM-DD');

  const [internalSelected, setInternalSelected] = useState<string | undefined>(
    selectedDate ??
      (autoSelectToday ? dayjs().format('YYYY-MM-DD') : undefined),
  );

  useEffect(() => {
    setInternalSelected(
      selectedDate ??
        (autoSelectToday ? dayjs().format('YYYY-MM-DD') : undefined),
    );
  }, [selectedDate, autoSelectToday]);

  const effectiveSelected = selectedDate ?? internalSelected;

  const DayCell: React.FC<DayProps> = ({date, state, onPress}) => {
    if (!date) return <View style={{width: 26, height: 26, margin: 2}} />;

    const isExtraDay = state === 'disabled';
    const isSelected = effectiveSelected === date.dateString;

    const isToday = dayjs(date.dateString, 'YYYY-MM-DD', true).isSame(
      dayjs(),
      'day',
    );
    const dayOfWeek = dayjs(date.dateString, 'YYYY-MM-DD', true).day();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let bg = colors.utilsTransparent;
    let textColor: keyof Colors = 'textPrimary';

    if (isExtraDay) {
      bg = colors.utilsTransparent;
      textColor = 'gray';
    } else if (isSelected) {
      bg = colors.primary;
      textColor = 'white';
    } else if (isToday) {
      bg = colors.primaryOpacity;
      textColor = 'primary';
    } else if (isWeekend) {
      bg = colors.utilsTransparent;
      textColor = 'secondaryLight';
    }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setInternalSelected(date.dateString);
          onPress?.(date);
        }}
        style={{alignItems: 'center'}}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: bg,
            },
          ]}>
          <Typography
            fontSize={10}
            color={textColor}
            lineHeight={1}
            fontFamily="Poppins-SemiBold">
            {date.day < 10 ? `0${date.day}` : date.day}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Calendar
        minDate="1900-01-01"
        maxDate="2100-12-31"
        monthFormat="MMMM, yyyy"
        initialDate={initialDate}
        firstDay={1}
        hideExtraDays
        disableArrowLeft={false}
        disableArrowRight={false}
        dayComponent={DayCell}
        markedDates={
          effectiveSelected ? {[effectiveSelected]: {selected: true}} : {}
        }
        onDayPress={day => onDaySelect?.(day)}
        theme={
          {
            backgroundColor: colors.white,
            calendarBackground: colors.white,
            textSectionTitleColor: colors.secondaryLight,
            monthTextColor: colors.primary,
            textMonthFontSize: 14,
            textDayHeaderFontSize: 10,
            textMonthFontFamily: 'Poppins-SemiBold',
            textDayHeaderFontFamily: 'Poppins-SemiBold',
            // @ts-ignore
            'stylesheet.calendar.header': {
              header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 0,
                marginBottom: 0,
              },
              monthText: {
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: colors.textPrimary,
                textTransform: 'capitalize' as any,
                includeFontPadding: false,
              },
              week: {
                marginBottom: 4,
                marginTop: 7,
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            },
            // @ts-ignore
            'stylesheet.calendar.main': {
              container: {
                paddingLeft: 8,
                paddingRight: 8,
                paddingBottom: 10,
                paddingTop: 8,
                backgroundColor: colors.white,
              },
              week: {
                marginVertical: 0,
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            },
          } as any
        }
        renderArrow={direction => (
          <View style={{opacity: 1}}>
            <Icon
              name={direction === 'left' ? 'arrowLeft' : 'arrowRight'}
              height={20}
              width={20}
              fill={colors.textPrimary}
              fillOpacity={1}
            />
          </View>
        )}
      />
    </View>
  );
};

export default CustomDatePicker;
