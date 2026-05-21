import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/Themes';

const CustomDatePickerStyles = (colors: Colors) =>
  StyleSheet.create({
    wrapper: {
      borderRadius: 6,
      elevation: 2,
      backgroundColor: colors.white,
    },
    dot: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default CustomDatePickerStyles;
