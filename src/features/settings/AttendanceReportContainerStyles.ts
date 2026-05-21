import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/Themes';

const AttendanceReportContainerStyles = (_colors: Colors) =>
  StyleSheet.create({
    container: {
      width: '80%',
      maxWidth: 686,
      paddingBottom: 86,
      gap: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
    },
    headerContent: {},
    modalContent: {
      maxWidth: 400,
    },
  });

export default AttendanceReportContainerStyles;
