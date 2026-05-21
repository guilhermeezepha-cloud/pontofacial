import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const HeaderStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      height: 80,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      paddingLeft: 18,
      paddingRight: 32,
    },
    logoWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    line: {
      width: 1,
      height: 14,
      backgroundColor: colors.secondaryBorder,
    },
    info: {},
    flag: {
      position: 'absolute',
      top: 0,
      right: 0,
      height: 80,
      width: 8,
    },
    blueBar: {
      flex: 1,
      width: 8,
      backgroundColor: colors.primary,
    },
    redBar: {
      flex: 1,
      width: 8,
      backgroundColor: colors.red,
    },
    close: {
      marginRight: 12,
    },
  });

export default HeaderStyles;
