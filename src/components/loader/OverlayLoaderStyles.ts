import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const OverlayLoaderStyles = (colors: Colors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      minWidth: 120,
      paddingVertical: 28,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8, // Android
      shadowColor: colors.black, // iOS
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: {width: 0, height: 6},
    },
    text: {
      marginTop: 20,
    },
  });

export default OverlayLoaderStyles;
