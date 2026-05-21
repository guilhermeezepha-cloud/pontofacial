import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const AttendanceFilterStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      maxWidth: 400,
      backgroundColor: colors.white,
      elevation: 5,
      overflow: 'visible', // não corta o calendário
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 18,
    },
    dates: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: colors.dividerBorder,
      gap: 12,
    },
    registration: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderTopColor: colors.dividerBorder,
      gap: 12,
    },
    actions: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: colors.dividerBorder,
      gap: 12,
    },
    labels: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    datesWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    },
    dateItem: {flex: 1},
    // opcional (se usa currentCalendarId para “promover” o ramo)
    dateItemActive: {zIndex: 999, elevation: 24},

    closeButton: {},
    reset: {},
  });

export default AttendanceFilterStyles;
