import {useNetInfo} from '@react-native-community/netinfo';
import {useTheme} from '@react-navigation/native';

import React, {useEffect} from 'react';
import {View} from 'react-native';

import {firstAccessDoneSelector} from '../register/Slice';

import MenuButton from '../../components/button/MenuButton';
import Container from '../../components/container';
import OverlayLoader from '../../components/loader/OverlayLoader';
import Typography from '../../components/typography';
import {useAppDispatch, useAppSelector} from '../../hooks/Redux';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {useGoToSettings} from '../../hooks/useGoToSettings';
import {Colors} from '../../styles/Themes';
import {
  employeesIsLoadingSelector,
  getAllEmployees,
  jobIdSelector,
} from '../employees';
import MainMenuContainerStyles from './MainMenuContainerStyles';

const MainMenuContainer = () => {
  const dispatch = useAppDispatch();
  const {isConnected, isInternetReachable} = useNetInfo();
  const online = isConnected === true && isInternetReachable !== false;

  const theme = useTheme();
  const colors = theme.colors as Colors;

  const navigation = useAppNavigation();
  const styles = MainMenuContainerStyles(colors);
  const firstAccessDone = useAppSelector(state =>
    firstAccessDoneSelector(state),
  );
  const isLoading = useAppSelector(employeesIsLoadingSelector);
  const currentJobId = useAppSelector(jobIdSelector);

  const goToSettings = useGoToSettings();

  useEffect(() => {
    if (!firstAccessDone) {
      navigation.reset({
        index: 0,
        routes: [{name: 'FirstAccess'}],
      });
    }
  }, [firstAccessDone, navigation]);

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
            onPress={() => navigation.navigate('FaceRecognition')}
            icon="clockIn"
            title="Registrar ponto"
          />
          <MenuButton
            onPress={goToSettings}
            icon="settings"
            title="Configurações"
          />
        </View>
      </View>

      <OverlayLoader visible={isLoading} text="Carregando matrículas..." />
    </Container>
  );
};

export default MainMenuContainer;
