import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const FirstAccessContainerStyles = (colors: Colors) =>
  StyleSheet.create({
    stepZeroContent: {
      gap: 32,
      alignItems: 'center',
    },
    contentHolder: {
      minHeight: 566,
    },
    stepZeroButton: {
      alignSelf: 'center',
    },
    stepZeroDescription: {
      maxWidth: '76%',
    },
    contentHeader: {
      gap: 24,
    },
    stepTwoTitleOffset: {
      marginTop: 18,
    },
    stepThreeTitleOffset: {
      marginTop: 20,
    },
    stepTwoContent: {
      gap: 72,
      alignItems: 'flex-end',
    },
    stepThreeContent: {
      gap: 56,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
    },
  });

export default FirstAccessContainerStyles;
