import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const IdentificationDataContainerStyles = (colors: Colors) =>
  StyleSheet.create({
    contentHolder: {
      minHeight: 566,
    },
    contentHeader: {
      gap: 24,
    },
  });

export default IdentificationDataContainerStyles;
