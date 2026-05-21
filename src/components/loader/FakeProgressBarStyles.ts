import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const FakeProgressBarStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      height: 20,
      backgroundColor: colors.gray,
      overflow: 'hidden',
    },
    bar: {
      height: '100%',
      backgroundColor: colors.success,
    },
  });

export default FakeProgressBarStyles;
