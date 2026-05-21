import React from 'react';

import Container from '../../components/container';
import Header from '../../components/header';
import SettingsMainContainer from '../../features/settings/SettingsMainContainer';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {useIdentificationData} from '../../hooks/useIdentificationData';
import {usePartnerLogo} from '../../hooks/useLocalPartnerLogo';

const SettingsMainView = () => {
  const navigation = useAppNavigation();
  const {logoUri} = usePartnerLogo();
  const {identificationData} = useIdentificationData();

  return (
    <Container fixedFullWidth keyboardAvoiding keyboardVerticalOffset={20}>
      <Header
        onClose={() => navigation.navigate('Home')}
        partnerLogo={logoUri}
        collectorCode={identificationData?.code}
        groupCode={identificationData?.groupCode}
      />
      <SettingsMainContainer />
    </Container>
  );
};

export default SettingsMainView;
