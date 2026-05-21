import {useTheme} from '@react-navigation/native';

import React, {useContext} from 'react';
import {View} from 'react-native';

import {Colors} from '../../styles/Themes';
import CloseButton from '../button/CloseButton';
import Icon, {IconName} from '../icon';
import Typography from '../typography';
import BasicToastStyles from './BasicToastStyles';
import {ToastContext} from './ToastProvider';

type DefaultTypes = 'error' | 'success' | 'processing';
interface BasicToastProps {
  message: string;
  type?: DefaultTypes;
}

type IconMap = {
  [key in DefaultTypes]: {
    icon: IconName;
    color: keyof Colors;
  };
};

const BasicToast: React.FC<BasicToastProps> = ({
  message,
  type = 'processing',
}) => {
  const useToast = useContext(ToastContext);
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const iconMap: IconMap = {
    error: {icon: 'warning', color: 'red'},
    success: {icon: 'circleCheck', color: 'success'},
    processing: {icon: 'warning', color: 'info'},
  };
  const styles = BasicToastStyles(colors, iconMap[type].color);

  return (
    <View style={styles.container}>
      <Icon
        name={iconMap[type].icon}
        fill={colors.white}
        width={32}
        height={32}
      />
      <Typography
        style={styles.message}
        fontSize={28}
        lineHeight={1.4}
        color="white">
        {message}
      </Typography>

      <CloseButton
        style={styles.close}
        onPress={() => useToast?.hideToast()}
        color="white"
      />
    </View>
  );
};

export default BasicToast;
