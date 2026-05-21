import {useTheme} from '@react-navigation/native';

import React from 'react';
import {View, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import CloseButton from '../button/CloseButton';
import Container from '../container';
import ScreenShellStyles from './Styles';

interface ScreenShellProps {
  children: React.ReactNode;
  onClose?: () => void;
  style?: ViewStyle;
}

const ScreenShell: React.FC<ScreenShellProps> = ({
  children,
  onClose,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = ScreenShellStyles(colors);

  return (
    <Container scrollable={false} style={styles.shellContainer}>
      <View style={styles.header}>
        {onClose && <CloseButton onPress={onClose} showText />}
      </View>

      <Container
        horizontalPadding="both"
        contentContainerStyle={styles.content}
        style={style}
        keyboardAvoiding
        keyboardVerticalOffset={20}>
        {children}
      </Container>
    </Container>
  );
};

export default ScreenShell;
