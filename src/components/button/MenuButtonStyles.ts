import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const MenuButtonStyles = (colors: Colors) =>
  StyleSheet.create({
    button: {
      height: 198,
      width: 198,
      backgroundColor: colors.white,
      padding: 12,
      paddingTop: 8,
      alignSelf: 'flex-start',
    },
    disabled: {
      opacity: 0.5,
    },
    header: {
      minHeight: 32,
      position: 'relative',
    },
    title: {
      width: '100%',
    },
    subTitle: {
      position: 'absolute',
      left: 0,
      width: '71%',
      top: '74%',
      opacity: 0.6,
    },
    icon: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default MenuButtonStyles;
