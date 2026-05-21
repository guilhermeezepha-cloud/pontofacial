import {StyleSheet} from 'react-native';

import {Colors} from '../../styles/Themes';

const SearchInputStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.white,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      height: 36,
      gap: 10,
    },
    icon: {},
    textInput: {
      backgroundColor: colors.white,
      height: 32,
      fontSize: 12,
      color: colors.textPrimary,
      padding: 0,
      alignItems: 'center',
      flex: 1,
    },
  });

export default SearchInputStyles;
