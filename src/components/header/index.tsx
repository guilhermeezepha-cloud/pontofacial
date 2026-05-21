import {useTheme} from '@react-navigation/native';

import React, {Fragment} from 'react';
import {ImageSourcePropType, View, ViewStyle} from 'react-native';

import partnerLogoPlaceholder from '../../../assets/logos/partner-logo.png';
import {Colors} from '../../styles/Themes';
import CloseButton from '../button/CloseButton';
import Logo from '../logo';
import Typography from '../typography';
import HeaderStyles from './Styles';

interface HeaderProps {
  style?: ViewStyle;
  partnerLogo?: string | ImageSourcePropType | null;
  onClose?: () => void;
  partnerLogoHeight?: number;
  collectorCode?: string;
  groupCode?: string;
}

const Header: React.FC<HeaderProps> = ({
  style,
  partnerLogo,
  collectorCode,
  groupCode,
  onClose,
  partnerLogoHeight = 25,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = HeaderStyles(colors);

  let finalLogoSource: ImageSourcePropType;
  if (partnerLogo) {
    finalLogoSource =
      typeof partnerLogo === 'string' ? {uri: partnerLogo} : partnerLogo;
  } else {
    finalLogoSource = partnerLogoPlaceholder;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoWrapper}>
        {onClose && (
          <View style={styles.close}>
            <CloseButton showText onPress={onClose} />
          </View>
        )}
        <Logo dormaLogo height={partnerLogoHeight} />
        <View style={styles.line} />
        <Logo source={finalLogoSource} height={partnerLogoHeight} />
      </View>
      {collectorCode && groupCode ? (
        <View style={styles.info}>
          <Typography fontSize={16} color="textPrimary" lineHeight={1.3}>
            {`${collectorCode} - ${groupCode}`}
          </Typography>
        </View>
      ) : (
        <Fragment />
      )}
      <View style={styles.flag}>
        <View style={styles.blueBar} />
        <View style={styles.redBar} />
      </View>
    </View>
  );
};

export default Header;
