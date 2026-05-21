import {useTheme} from '@react-navigation/native';

import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import Loader from '../loader';
import Typography from '../typography';
import ButtonStyles from './Styles';

interface ButtonProps {
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode | string;
  style?: StyleProp<ViewStyle>;
  textColor?: keyof Colors;
  textSemiBold?: boolean;
  variant?: 'default' | 'defaultOutline';
  fluid?: boolean;
  fixedWidth?: number;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  disabled = false,
  onPress,
  children,
  textColor,
  fluid,
  style,
  fixedWidth,
  textSemiBold,
  variant = 'default',
  isLoading,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = ButtonStyles(colors);

  const variantTextColorMap = {
    default: 'white',
    defaultOutline: 'primary',
  } as const;

  const effectiveDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        fixedWidth !== undefined ? {minWidth: fixedWidth} : {},
        fluid && styles.fluid,
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={effectiveDisabled}>
      {isLoading ? (
        <Loader size="small" />
      ) : typeof children === 'string' ? (
        <Typography
          fontSize={16}
          fontFamily={textSemiBold ? 'Poppins-SemiBold' : 'Poppins-Regular'}
          color={
            effectiveDisabled
              ? 'textDisabled'
              : textColor
              ? textColor
              : (variantTextColorMap[variant] as keyof Colors)
          }>
          {children}
        </Typography>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;
