import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/Themes';

export const FaceCaptureContainerStyles = (_colors: Colors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: '#000', position: 'relative'},
    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    close: {
      position: 'absolute',
      top: 32,
      left: 32,
      zIndex: 20,
    },
    instructions: {
      position: 'absolute',
      alignItems: 'center',
    },
    connectivityIndicator: {
      position: 'absolute',
      top: 60,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      zIndex: 10,
    },
    connectivityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    connectivityDotOnline: {
      backgroundColor: '#4CAF50',
    },
    connectivityDotOffline: {
      backgroundColor: '#FF5722',
    },
    connectivityText: {
      textTransform: 'capitalize',
    },
  });
