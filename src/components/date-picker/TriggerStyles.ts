import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const DatePickerTriggerStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      backgroundColor: colors.white,
      width: '100%',
      height: 36,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.outline,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      paddingHorizontal: 4,
      backgroundColor: colors.white,
      position: 'absolute',
      top: -7,
      left: 10,
      zIndex: 4,
    },
    selectedDate: {
      flex: 1,
      maxWidth: '80%',
    },
    calendarContainer: {
      backgroundColor: colors.white,
      elevation: 32,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 6},
    },
  });

export default DatePickerTriggerStyles;
