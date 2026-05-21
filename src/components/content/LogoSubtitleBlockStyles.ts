import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const LogoSubtitleBlockStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      gap: 14,
      width: '100%',
    },
    contentList: {
      gap: 4,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    listItemText: {},
  });

export default LogoSubtitleBlockStyles;
