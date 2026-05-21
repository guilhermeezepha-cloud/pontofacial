import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HomeViewStyles = StyleSheet.create({
  search: {
    width: '100%',
    height: '100%',
  },

  text: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Poppins-ExtraBoldItalic',
    fontWeight: 'normal',
  },
});

export default HomeViewStyles;
