import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const ContentHolderStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      gap: 26,
      padding: 48,
      width: '100%',
      maxWidth: 460,
    },
  });

export default ContentHolderStyles;
