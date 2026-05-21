import React from 'react';
import {Image, ImageSourcePropType, ImageStyle, StyleProp} from 'react-native';

import taskLogo from '../../../assets/logos/task-logo.png';
import {useImageAspectRatio} from '../../hooks/useImageAspectRatio';
import LogoStyles from './Styles';

interface LogoProps {
  dormaLogo?: boolean;
  source?: ImageSourcePropType | string;
  height?: number;
  style?: StyleProp<ImageStyle>;
}

const DEFAULT_HEIGHT = 15;

const Logo: React.FC<LogoProps> = ({
  dormaLogo = false,
  source,
  height = DEFAULT_HEIGHT,
  style,
}) => {
  const chosenLogo = dormaLogo ? taskLogo : source ?? null;

  const {ratio, source: finalSource} = useImageAspectRatio(chosenLogo);

  if (!finalSource) return null;

  return (
    <Image
      source={finalSource}
      style={[{height, aspectRatio: ratio}, LogoStyles.logo, style]}
      resizeMode="contain"
    />
  );
};

export default Logo;
