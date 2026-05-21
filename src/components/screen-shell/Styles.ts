import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const ScreenShellStyles = (colors: Colors) =>
  StyleSheet.create({
    shellContainer: {
      backgroundColor: colors.background,
    },
    header: {
      height: 80,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 18,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ScreenShellStyles;
