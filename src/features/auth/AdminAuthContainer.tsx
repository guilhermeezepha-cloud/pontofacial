import {useNetInfo} from '@react-native-community/netinfo';
import {useTheme} from '@react-navigation/native';

import React, {useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';

import {
  adminAuthDoneSelector,
  doAuth,
  isLoadingSelector,
  setAdminAuthDone,
  statusSelector,
} from './Slice';

import Button from '../../components/button';
import ContentHolder from '../../components/container/ContentHolder';
import AdminPasswordForm, {
  AdminPasswordFormHandle,
} from '../../components/form/AdminAuthenticatorForm';
import ScreenShell from '../../components/screen-shell';
import Typography from '../../components/typography';
import {useAppDispatch, useAppSelector} from '../../hooks/Redux';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {Colors} from '../../styles/Themes';
import Session from '../../utils/session';
import {ADMIN_PASSWORD_KEY} from '../../utils/storageKeys';

const AdminAuthContainer = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<AdminPasswordFormHandle>(null);
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const [admPassword, setAdmPassword] = useState<string | null>(null);
  const isLoading = useAppSelector(isLoadingSelector);
  const globalStatus = useAppSelector(statusSelector);

  const navigation = useAppNavigation();
  const netInfo = useNetInfo();
  const isOnline =
    netInfo.isConnected === true && netInfo.isInternetReachable !== false;
  const adminAuthDone = useAppSelector(adminAuthDoneSelector);

  useEffect(() => {
    (async () => {
      const stored = await Session.getRaw(ADMIN_PASSWORD_KEY);
      setAdmPassword(stored);
    })();
  }, []);

  useEffect(() => {
    if (adminAuthDone) {
      navigation.reset({
        index: 0,
        routes: [{name: 'SettingsMain'}],
      });
    }
  }, [adminAuthDone, navigation]);

  useEffect(() => {
    if (globalStatus === 'error') {
      Alert.alert('Senha incorreta');
    }
  }, [globalStatus]);

  const handleAdminPassword = (password: string) => {
    const isValidLocal = password === admPassword;

    if (!isOnline) {
      if (isValidLocal) {
        dispatch(setAdminAuthDone(true));
      } else {
        Alert.alert('Senha incorreta');
      }
      return;
    }

    if (!isValidLocal) {
      Alert.alert('Senha incorreta');
      return;
    }

    dispatch(doAuth(password));
  };

  return (
    <ScreenShell onClose={() => navigation.navigate('Home')}>
      <ContentHolder>
        <Typography
          fontSize={24}
          color="textPrimary"
          fontFamily="Poppins-SemiBold"
          fontWeight="semibold">
          Senha de Administrador
        </Typography>
        <Typography fontSize={14} color="black">
          Para garantir a segurança e a integridade do seu equipamento,
          solicitamos que você insira a senha de administrador. Este passo é
          necessário para acessar todas as funcionalidades de configuração e
          personalizar o sistema conforme suas necessidades.
        </Typography>

        <AdminPasswordForm
          onSubmit={handleAdminPassword}
          isLogin
          ref={formRef}
        />

        <Button
          onPress={() => formRef.current?.submit()}
          variant="default"
          textSemiBold
          isLoading={isLoading}
          disabled={isLoading}
          fixedWidth={200}
          fluid
          textColor="white">
          Continuar
        </Button>
      </ContentHolder>
    </ScreenShell>
  );
};

export default AdminAuthContainer;
