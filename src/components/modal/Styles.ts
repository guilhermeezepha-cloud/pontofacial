import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const ReusableModalStyles = (colors: Colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      padding: 16,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardWrapper: {
      width: '100%',
      maxWidth: 420,
      borderRadius: 12,
      backgroundColor: colors.white,
      elevation: 8,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 6},
      overflow: 'visible', // evita cortar overlay
    },
  });

export default ReusableModalStyles;
