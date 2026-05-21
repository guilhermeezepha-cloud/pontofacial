import React from 'react';

import ConnectivityDebugPanel from '../../components/ConnectivityDebugPanel';
import Container from '../../components/container';
import Header from '../../components/header';
import MainMenuContainer from '../../features/menu/MainMenuContainer';
import { useIdentificationData } from '../../hooks/useIdentificationData';
import { usePartnerLogo } from '../../hooks/useLocalPartnerLogo';

const HomeView = () => {
  const {logoUri} = usePartnerLogo();
  const {identificationData} = useIdentificationData();

  return (
    <Container fixedFullWidth keyboardAvoiding keyboardVerticalOffset={20}>
      <Header
        partnerLogo={logoUri}
        collectorCode={identificationData?.code}
        groupCode={identificationData?.groupCode}
      />
      <MainMenuContainer />

      {/* Painel de debug temporário para conectividade Android */}
      {__DEV__ && <ConnectivityDebugPanel />}
    </Container>
  );
};

export default HomeView;
