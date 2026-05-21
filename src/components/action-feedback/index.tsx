import {useTheme} from '@react-navigation/native';

import React from 'react';
import {View, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import Button from '../button';
import Icon from '../icon';
import Typography from '../typography';
import ActionFeedbackStyles from './Styles';

interface ActionFeedbackProps {
  status: 'success' | 'error';
  message: string;
  subMessage?: string;
  onAction?: () => void;
  actionLabel?: string;
  style?: ViewStyle;
}

const ActionFeedback: React.FC<ActionFeedbackProps> = ({
  status,
  message,
  subMessage,
  onAction,
  actionLabel,
  style,
}) => {
  const isSuccess = status === 'success';

  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = ActionFeedbackStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <Icon
        name={isSuccess ? 'checkLarge' : 'warningLarge'}
        fill={isSuccess ? colors.success : colors.red}
        width={isSuccess ? 70 : 128}
        height={isSuccess ? 87 : 129}
      />
      <Typography
        fontSize={36}
        fontFamily="Poppins-SemiBold"
        fontWeight="semibold"
        color="black"
        textAlign="center"
        lineHeight={1.4}>
        {message}
      </Typography>

      {subMessage && (
        <Typography
          fontSize={20}
          color="black"
          textAlign="center"
          lineHeight={1.4}>
          {subMessage}
        </Typography>
      )}

      {onAction && actionLabel && (
        <View style={styles.action}>
          <Button
            variant="default"
            fixedWidth={200}
            textColor="white"
            textSemiBold
            style={styles.actionButton}
            onPress={onAction}>
            {actionLabel}
          </Button>
        </View>
      )}
    </View>
  );
};

export default ActionFeedback;
