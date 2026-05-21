import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const CloseButtonStyles = (colors: Colors) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.utilsTransparent,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });

export default CloseButtonStyles;
