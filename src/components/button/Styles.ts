import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const ButtonStyles = (colors: Colors) =>
  StyleSheet.create({
    button: {
      height: 38,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      paddingHorizontal: 16,
      alignSelf: 'flex-start',
    },
    disabled: {
      backgroundColor: colors.gray200,
      borderColor: colors.gray200,
    },
    default: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    defaultOutline: {
      backgroundColor: colors.utilsTransparent,
      borderColor: colors.primary,
    },
    fluid: {
      width: '100%',
    },
  });

export default ButtonStyles;
