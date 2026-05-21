import {useTheme} from '@react-navigation/native';

import React, {ReactNode} from 'react';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import TypographyStyles from './Styles';

export interface TypographyProps extends TextProps {
  textAlign?: 'center' | 'right' | 'left' | 'justify';
  lineHeight?: 1 | 1.1 | 1.2 | 1.3 | 1.35 | 1.4 | 1.5 | 1.6 | 1.7 | 1.8;
  fontSize?: number;
  fontWeight?:
    | 'normal'
    | 'light'
    | 'semibold'
    | 'thin'
    | 'ultralight'
    | 'regular'
    | 'medium'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
  color?: keyof Colors;
  fontFamily?:
    | 'Poppins-BlackItalic'
    | 'Poppins-Bold'
    | 'Poppins-BoldItalic'
    | 'Poppins-ExtraBold'
    | 'Poppins-ExtraBoldItalic'
    | 'Poppins-ExtraLight'
    | 'Poppins-ExtraLightItalic'
    | 'Poppins-Italic'
    | 'Poppins-Light'
    | 'Poppins-LightItalic'
    | 'Poppins-Medium'
    | 'Poppins-MediumItalic'
    | 'Poppins-Regular'
    | 'Poppins-SemiBold'
    | 'Poppins-SemiBoldItalic'
    | 'Poppins-Thin'
    | 'Poppins-ThinItalic';
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

const Typography = ({
  textAlign = 'left',
  fontSize = 14,
  lineHeight = 1.35,
  fontWeight = '400',
  fontFamily = 'Poppins-Regular',
  color = 'textPrimary',
  style,
  children,
  ...rest
}: TypographyProps) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  return (
    <Text
      style={[
        {
          textAlign,
          fontSize: fontSize,
          fontWeight: fontWeight,
          fontFamily: fontFamily,
          color: colors[color],
          lineHeight: lineHeight * fontSize,
        },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

export default Typography;
