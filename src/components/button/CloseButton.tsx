import { useTheme } from '@react-navigation/native';

import React from 'react';
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { Colors } from '../../styles/Themes';
import Icon from '../icon';
import Typography from '../typography';
import CloseButtonStyles from './CloseButtonStyles';

interface CloseButtonProps {
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  showText?: boolean;
  color?: keyof Colors;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  disabled = false,
  onPress,
  style,
  showText = false,
  color = 'secondaryDark',
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = CloseButtonStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}>
      <Icon name="close" width={32} height={32} fill={colors[color]} />

      {showText && (
        <Typography fontSize={20} color={color} style={{letterSpacing: 0.111}}>
          Fechar
        </Typography>
      )}
    </TouchableOpacity>
  );
};

export default CloseButton;
