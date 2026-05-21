import {Dimensions, StyleSheet} from 'react-native';

export const width = Dimensions.get('window').width;

export const height = Dimensions.get('screen').height;

export const pixel = (value: number) =>
  isNaN(value) ? value : (width * value) / 390;

export const screen = {
  width,
  height,
};

const Patterns = {
  padding: 18,
};
export const Grid = StyleSheet.create({
  container: {
    paddingHorizontal: Patterns.padding,
    width: '100%',
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: pixel(Patterns.padding),
  },
  col1: {
    width: '8.33%',
  },
  col2: {
    width: '16.66%',
  },
  col3: {
    width: '25%',
  },
  col4: {
    width: '33.33%',
  },
  col5: {
    width: '41.66%',
  },
  col6: {
    width: '50%',
  },
  col7: {
    width: '58.33%',
  },
  col8: {
    width: '66.66%',
  },
  col9: {
    width: '75%',
  },
  col10: {
    width: '83.33%',
  },
  col11: {
    width: '91.66%',
  },
  col12: {
    width: '100%',
  },
});
