import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const BasicToastStyles = (colors: Colors, background: keyof Colors) =>
  StyleSheet.create({
    container: {
      maxWidth: 690,
      minHeight: 116,
      backgroundColor: colors[background],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 16,
      padding: 16,
    },
    close: {
      width: 32,
    },
    message: {
      maxWidth: 690 - 128,
    },
  });

export default BasicToastStyles;
