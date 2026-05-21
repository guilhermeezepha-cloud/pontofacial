import {useTheme} from '@react-navigation/native';

import React from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import Icon from '../icon';
import Typography from '../typography';
import MenuButtonStyles from './MenuButtonStyles';

interface MenuButtonProps {
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon: 'clockIn' | 'settings' | 'list' | 'synchronize' | 'badge' | 'shapes';
  title: string;
  subTitle?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  disabled = false,
  onPress,
  title,
  subTitle,
  style,
  icon,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = MenuButtonStyles(colors);

  const iconSizeMap = {
    clockIn: {
      width: 80,
      height: 81,
    },
    settings: {width: 64, height: 65},
    list: {width: 65, height: 65},
    synchronize: {width: 65, height: 65},
    badge: {width: 65, height: 65},
    shapes: {width: 65, height: 65},
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}>
      <View style={styles.header}>
        <Typography
          fontSize={16}
          color="textPrimary"
          lineHeight={1.3}
          style={styles.title}>
          {title}
        </Typography>
        {subTitle && (
          <Typography fontSize={9} color="textPrimary" style={styles.subTitle}>
            {subTitle}
          </Typography>
        )}
      </View>
      <View style={styles.icon}>
        <Icon
          name={icon}
          width={iconSizeMap[icon].width}
          height={iconSizeMap[icon].height}
        />
      </View>
    </TouchableOpacity>
  );
};

export default MenuButton;
