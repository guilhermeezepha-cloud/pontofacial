import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const AttendanceTableStyles = (colors: Colors) =>
  StyleSheet.create({
    wrapper: {
      padding: 17.8,
      overflow: 'hidden',
      backgroundColor: colors.white,
      elevation: 2,
    },
    headerRow: {
      flexDirection: 'row',
      height: 38,
      alignItems: 'center',
    },
    headerCell: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    row: {
      flexDirection: 'row',
      height: 42,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.outlineBorder,
    },
    evenRow: {backgroundColor: colors.background},
    oddRow: {backgroundColor: colors.white},
    cell: {
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    flex1: {flex: 1.5},
    flex2: {flex: 1.8},
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 8,
      height: 38,
      borderTopWidth: 1,
      borderTopColor: colors.outlineBorder,
      gap: 16,
    },
    rowsPerPage: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    rowsPicker: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    navigation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    navigationActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    navigationBtn: {
      paddingHorizontal: 6,
    },
    emptyRow: {
      padding: 24,
      alignItems: 'center',
    },
  });

export default AttendanceTableStyles;
