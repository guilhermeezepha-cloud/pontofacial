import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const Styles = (colors: Colors) =>
  StyleSheet.create({
    toastContainer: {
      position: 'absolute',
      top: 46,
      right: 44,
      alignSelf: 'center',
      borderRadius: 8,
      zIndex: 9999,
      elevation: 20,
      backgroundColor: colors.utilsTransparent,
    },
  });

export default Styles;
