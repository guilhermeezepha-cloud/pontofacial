import {useTheme} from '@react-navigation/native';

import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {Colors} from '../../styles/Themes';
import ReusableModalStyles from './Styles';

type WithClose = {onClose?: () => void};

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  backdropColor?: keyof Colors | string;
  centered?: boolean;
  contentStyle?: ViewStyle;
  avoidKeyboard?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'fade',
  backdropColor = 'textSecondary',
  centered = true,
  contentStyle,
  avoidKeyboard = true,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = ReusableModalStyles(colors);

  const resolvedBackdrop =
    typeof backdropColor === 'string' && backdropColor in colors
      ? (colors as any)[backdropColor]
      : (backdropColor as string);

  const injectedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    const c = child as React.ReactElement<WithClose>;
    return c.props?.onClose ? c : React.cloneElement<WithClose>(c, {onClose});
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[
          styles.root,
          {backgroundColor: resolvedBackdrop},
          centered && styles.centered,
        ]}
        behavior={
          avoidKeyboard
            ? Platform.OS === 'ios'
              ? 'padding'
              : undefined
            : undefined
        }>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[styles.cardWrapper, contentStyle]}
          onStartShouldSetResponder={() => true}>
          {injectedChildren}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReusableModal;
