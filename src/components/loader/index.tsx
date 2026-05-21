import {useTheme} from '@react-navigation/native';

import React from 'react';
import {ActivityIndicator, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import Container from '../container';
import LoaderStyles from './Styles';

interface LoaderProps {
  size?: 'large' | 'small';
  style?: ViewStyle;
}

const Loader: React.FC<LoaderProps> = ({size = 'large', style}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = LoaderStyles(colors);

  return (
    <Container style={[styles.loaderContainer, style]} scrollable={false}>
      <ActivityIndicator size={size} />
    </Container>
  );
};

export default Loader;
