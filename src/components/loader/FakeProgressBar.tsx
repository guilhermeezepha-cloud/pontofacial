import {useTheme} from '@react-navigation/native';

import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, LayoutChangeEvent, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import FakeProgressBarStyles from './FakeProgressBarStyles';

interface Props {
  loading: boolean;
  initialDuration?: number;
  hideDelay?: number;
  style?: ViewStyle;
}

const FakeProgressBar: React.FC<Props> = ({
  loading,
  initialDuration = 10000,
  hideDelay = 200,
  style,
}) => {
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [visible, setVisible] = useState(loading);
  const pulseActiveRef = useRef(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = FakeProgressBarStyles(colors);

  const animateTo = (
    toValue: number,
    duration: number,
    callback?: () => void,
  ) => {
    progress.stopAnimation();
    Animated.timing(progress, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished && callback) callback();
    });
  };

  const startLoop = () => {
    pulseActiveRef.current = true;
    opacity.setValue(1);
    progress.setValue(0);
    animateTo(0.9, initialDuration, () => {
      const pulse = () => {
        if (!pulseActiveRef.current) return;
        Animated.sequence([
          Animated.timing(progress, {
            toValue: 0.95,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(progress, {
            toValue: 0.85,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ]).start(({finished}) => {
          if (finished && pulseActiveRef.current) pulse();
        });
      };
      if (pulseActiveRef.current) pulse();
    });
  };

  useEffect(() => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (loading) {
      pulseActiveRef.current = true;
      setVisible(true);
      opacity.setValue(1);
      startLoop();
    } else {
      pulseActiveRef.current = false;
      animateTo(1, 300, () => {
        hideTimeoutRef.current = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }).start(() => {
            setVisible(false);
            // reset only after fully hidden
            progress.setValue(0);
            opacity.setValue(1);
          });
        }, hideDelay) as unknown as number; // TypeScript inference for RN setTimeout return
      });
    }

    return () => {
      pulseActiveRef.current = false;
      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [loading, initialDuration, hideDelay]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth],
    extrapolate: 'clamp',
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, style, {opacity}]}
      onLayout={(e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: widthInterpolated,
          },
        ]}
      />
    </Animated.View>
  );
};

export default FakeProgressBar;
