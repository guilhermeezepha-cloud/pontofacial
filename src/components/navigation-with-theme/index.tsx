import {NavigationContainer} from '@react-navigation/native';

import React from 'react';
import {useColorScheme} from 'react-native';

import {LightTheme} from '../../styles/Themes';
import {navigationRef} from '../../utils/navigation';

interface Props {
  children: React.ReactNode;
}

const NavigationWithTheme = ({children}: Props) => {
  const scheme = useColorScheme();
  const theme = scheme == 'dark' ? LightTheme : LightTheme;

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      {children}
    </NavigationContainer>
  );
};

export default NavigationWithTheme;
