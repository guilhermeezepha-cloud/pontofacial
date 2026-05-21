import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

export const FaceCameraStyles = (colors: Colors) =>
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
      top: 0,
      left: 0,
      width: 112,
      height: 112,
      marginTop: 20,
      borderRadius: 0,
      zIndex: 9999,
      resizeMode: 'contain',
    },
    faceDebug: {
      borderColor: 'red',
      borderWidth: 2,
    },
    preview: {},
  });
