import {useTheme} from '@react-navigation/native';

import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';

import {Colors} from '../../styles/Themes';
import Typography from '../typography';
import OverlayLoaderStyles from './OverlayLoaderStyles';

type OverlayLoaderProps = {
  visible: boolean;
  text?: string;
  blockTouch?: boolean;
};

const OverlayLoader: React.FC<OverlayLoaderProps> = ({
  visible,
  text,
  blockTouch = true,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = OverlayLoaderStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade">
      <View
        style={[styles.backdrop, {backgroundColor: colors.outlineBorder}]}
        pointerEvents={blockTouch ? 'auto' : 'none'}>
        <View
          style={[
            styles.card,
            {backgroundColor: colors.background, borderRadius: 16},
          ]}>
          <ActivityIndicator size="large" />
          {!!text && (
            <Typography
              fontSize={18}
              fontFamily="Poppins-SemiBold"
              color="textPrimary"
              style={styles.text}>
              {text}
            </Typography>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default OverlayLoader;
