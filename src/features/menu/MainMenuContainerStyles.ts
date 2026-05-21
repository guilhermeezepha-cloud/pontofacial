import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const MainMenuContainerStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      gap: 24,
    },
    header: {
      gap: 4,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
    },
  });

export default MainMenuContainerStyles;
