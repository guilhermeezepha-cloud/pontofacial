import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/Themes';

const EmployeeSyncContainerStyles = (colors: Colors) =>
  StyleSheet.create({
    loadingContainer: {
      width: '100%',
      gap: 52,
    },
    feedbackContainer: {width: '100%'},
  });

export default EmployeeSyncContainerStyles;
