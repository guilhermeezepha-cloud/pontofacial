import {useNetInfo} from '@react-native-community/netinfo';
import {useFocusEffect, useTheme} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

import {adminAuthDoneSelector} from '../auth/Slice';

import MenuButton from '../../components/button/MenuButton';
import Container from '../../components/container';
import Typography from '../../components/typography';
import {useAppSelector} from '../../hooks/Redux';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {Colors} from '../../styles/Themes';
import {formatDate} from '../../utils/dateFormatters';
import OfflineQueue from '../../utils/OfflineQueue';
import Session from '../../utils/session';
import {LAST_SYNC_DATE_KEY} from '../../utils/storageKeys';
import SettingsMainContainerStyles from './SettingsMainContainerStyles';

const SettingsMainContainer = () => {
  const navigation = useAppNavigation();
  const {isConnected, isInternetReachable} = useNetInfo();
  const online = isConnected === true && isInternetReachable !== false;
  const [lastSync, setLastSync] = useState('');
  const [pendingRecords, setPendingRecords] = useState(0);
  const adminAuthDone = useAppSelector(adminAuthDoneSelector);

  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = SettingsMainContainerStyles(colors);

  useEffect(() => {
    if (!adminAuthDone) {
      navigation.reset({
        index: 0,
        routes: [{name: 'AdminAuth'}],
      });
    }
  }, [adminAuthDone, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      (async () => {
        const iso = await Session.getRaw(LAST_SYNC_DATE_KEY);
        if (!active) return;
        setLastSync(iso || '');

        // Verificar marcações pendentes
        const stats = await OfflineQueue.getQueueStats();
        if (!active) return;
        setPendingRecords(stats.pending);
      })();

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Container
      scrollable={false}
      style={styles.container}
      horizontalPadding="both">
      <View style={styles.content}>
        <View style={styles.header}>
          <Typography
            fontSize={12}
            fontFamily="Poppins-Bold"
            fontWeight="bold"
            color="red"
            lineHeight={1.2}>
            Início
          </Typography>
        </View>
        <View style={styles.actions}>
          <MenuButton
            onPress={() => navigation.navigate('SettingsAttendanceReport')}
            icon="list"
            title="Lista de marcações"
          />
          <MenuButton
            onPress={() => navigation.navigate('SettingsSynchronization')}
            disabled={!online}
            icon="synchronize"
            title="Sincronizar"
            subTitle={
              lastSync
                ? `Última sincronização dia ${formatDate(lastSync)}${
                    pendingRecords > 0 ? ` • ${pendingRecords} pendente(s)` : ''
                  }`
                : pendingRecords > 0
                ? `${pendingRecords} marcações pendentes`
                : ''
            }
          />
          <MenuButton
            onPress={() => navigation.navigate('SettingsIdentificationData')}
            disabled={!online}
            icon="badge"
            title="identificação"
          />
          <MenuButton
            onPress={() => navigation.navigate('SettingsPartnerLogo')}
            disabled={!online}
            icon="shapes"
            title="Alterar logo"
          />
          <MenuButton
            onPress={() => navigation.navigate('SettingsEmployeeSync')}
            disabled={!online}
            icon="synchronize"
            title="Sincronizar funcionários"
          />
        </View>
      </View>
    </Container>
  );
};

export default SettingsMainContainer;
