import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const PartnerLogoContainerStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {},
    contentHolder: {
      gap: 26,
    },
    imageContainer: {
      width: '100%',
      height: 112,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.outline,
      padding: 24,
      backgroundColor: colors.white,
    },
    previewContainer: {
      gap: 26,
    },
    image: {
      height: 52,
      maxWidth: '80%',
    },
    imagePickerContainer: {
      gap: 26,
      alignItems: 'flex-end',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
    },
  });

export default PartnerLogoContainerStyles;
