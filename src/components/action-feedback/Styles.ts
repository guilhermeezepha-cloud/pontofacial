import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const ActionFeedbackStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
    },
    action: {
      marginTop: 8,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButton: {
      minWidth: 224,
      alignSelf: 'center',
    },
  });

export default ActionFeedbackStyles;
