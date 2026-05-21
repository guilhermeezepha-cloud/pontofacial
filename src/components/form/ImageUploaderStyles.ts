import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const ImageUploaderStyles = (colors: Colors) =>
  StyleSheet.create({
    placeholderContainer: {
      width: '100%',
    },
    placeholder: {
      height: 112,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      backgroundColor: colors.primaryOpacity,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderText: {
      marginTop: 14,
    },
    subText: {
      marginTop: 24,
    },
    previewContainer: {
      width: '100%',
      height: 112,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.outline,
      padding: 24,
      backgroundColor: colors.white,
    },
    image: {
      height: 52,
      maxWidth: '84%',
    },
    deleteButton: {
      paddingRight: 8,
    },
  });

export default ImageUploaderStyles;
