import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const InputStyles = (colors: Colors, hasError: boolean, hasValue: boolean) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    label: {
      paddingHorizontal: 4,
      backgroundColor: colors.white,
      position: 'absolute',
      top: -6,
      left: 12,
      zIndex: 4,
    },
    inputContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingRight: 48,
      borderColor: hasError ? colors.red : colors.outline,
      backgroundColor: colors.white,
      minHeight: 48,
      fontSize: hasValue ? 14 : 16,
      color: colors.textPrimary,
      lineHeight: 14,
      alignItems: 'center',
    },
    iconButton: {
      position: 'absolute',
      right: 12,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      position: 'absolute',
      top: '103%',
      left: 0,
      zIndex: 4,
    },
  });

export default InputStyles;
