import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const LoaderStyles = (colors: Colors) =>
  StyleSheet.create({
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
    },
  });

export default LoaderStyles;
