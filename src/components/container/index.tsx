import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import ContainerStyles from './Styles';

interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  horizontalPadding?: 'none' | 'both' | 'left' | 'right';
  fixedFullWidth?: boolean;
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
  contentContainerStyle?: StyleProp<ViewStyle>; // apenas para scrollable === true
}

const Container: React.FC<ContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  scrollable = true,
  horizontalPadding = 'none',
  fixedFullWidth = false,
  keyboardAvoiding = false,
  keyboardVerticalOffset = 0,
}) => {
  const getPaddingStyle = () => {
    switch (horizontalPadding) {
      case 'both':
        return {paddingHorizontal: 64};
      case 'left':
        return {paddingLeft: 64};
      case 'right':
        return {paddingRight: 64};
      default:
        return {};
    }
  };

  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        {flexGrow: 1},
        getPaddingStyle(),
        contentContainerStyle,
      ]}
      style={[
        ContainerStyles.container,
        fixedFullWidth && ContainerStyles.fixedFullWidth,
        style,
      ]}
      keyboardShouldPersistTaps="never">
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        ContainerStyles.container,
        getPaddingStyle(),
        fixedFullWidth && ContainerStyles.fixedFullWidth,
        style,
      ]}>
      {children}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        {content}
      </KeyboardAvoidingView>
    );
  }

  return <>{content}</>;
};

export default Container;
