import {useTheme} from '@react-navigation/native';

import React, {useEffect, useRef} from 'react';
import {Animated} from 'react-native';

import {Colors} from '../../styles/Themes';
import Styles from './Styles';

interface CustomToastProps {
  children: React.ReactNode;
  onHide: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({children, onHide}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = Styles(colors);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onHide());
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={[styles.toastContainer, {opacity}]}>
      {children}
    </Animated.View>
  );
};

export default CustomToast;
