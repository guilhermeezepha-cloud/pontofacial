import {useTheme} from '@react-navigation/native';

import React from 'react';
import {View, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import ContentHolderStyles from './ContentHolderStyles';

interface ContentHolderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ContentHolder: React.FC<ContentHolderProps> = ({children, style}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = ContentHolderStyles(colors);

  return <View style={[styles.container, style]}>{children}</View>;
};

export default ContentHolder;
