import {DefaultTheme, Theme} from '@react-navigation/native';

export interface ExtendedTheme extends Theme {
  colors: Theme['colors'] & {
    background: string;
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    black: string;
    white: string;
    primary: string;
    primaryOpacity: string;
    secondaryDark: string;
    secondaryLight: string;
    placeholder: string;
    gray: string;
    gray200: string;
    outline: string;
    outlineBorder: string;
    dividerBorder: string;
    red: string;
    info: string;
    success: string;
    warning: string;
    utilsTransparent: string;
    secondaryBorder: string;
  };
}

export const colorPrimitives = {};

export type Colors = ExtendedTheme['colors'];

export const customDefaultTheme: ExtendedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F5F5F5',
    black: '#000000',
    white: '#FFFFFF',
    primary: '#003594',
    secondaryDark: '#262625',
    secondaryLight: '#959595',
    gray: '#D9D9D9',
    gray200: '#E0E0E0',
    outline: 'rgba(0, 0, 0, 0.23)',
    outlineBorder: 'rgba(0, 0, 0, 0.12)',
    dividerBorder: 'rgba(0, 0, 0, 0.25)',
    textSecondary: 'rgba(0, 0, 0, 0.54)',
    textPrimary: 'rgba(0, 0, 0, 0.87)',
    textDisabled: 'rgba(0, 0, 0, 0.26)',
    placeholder: 'rgba(0, 0, 0, 0.38)',
    primaryOpacity: 'rgba(0, 53, 148, 0.10)',
    red: '#E4002B',
    info: '#416CBA',
    success: '#5FA82A',
    warning: '#FFBB00',
    utilsTransparent: 'rgba(255, 255, 255, 0)',
    secondaryBorder: 'rgba(72, 72, 72, 0.50)',
  },
};

export const LightTheme: ExtendedTheme = {
  ...customDefaultTheme,
  colors: {
    ...customDefaultTheme.colors,
  },
};

export const DarkTheme: ExtendedTheme = {
  ...customDefaultTheme,
  colors: {
    ...customDefaultTheme.colors,
  },
};
