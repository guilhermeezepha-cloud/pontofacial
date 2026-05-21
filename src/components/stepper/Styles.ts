import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const StepperStyles = (color: Colors) =>
  StyleSheet.create({
    container: {
      gap: 14,
    },
    barsContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
    },
    bar: {
      flex: 1,
      height: 8,
    },
  });

export default StepperStyles;
