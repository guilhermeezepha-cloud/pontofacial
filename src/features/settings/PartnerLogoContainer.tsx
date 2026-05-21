import {useTheme} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {Image, ImageURISource, View} from 'react-native';
import {Asset} from 'react-native-image-picker';

import {adminAuthDoneSelector} from '../auth/Slice';
import {
  changeStatus,
  isLoadingSelector,
  statusSelector,
  updateCollector,
} from '../register/Slice';

import ActionFeedback from '../../components/action-feedback';
import Button from '../../components/button';
import ContentHolder from '../../components/container/ContentHolder';
import LogoSubtitleBlock from '../../components/content/LogoSubtitleBlock';
import ImageUploader from '../../components/form/ImageUploader';
import ScreenShell from '../../components/screen-shell';
import Typography from '../../components/typography';
import {useAppDispatch, useAppSelector} from '../../hooks/Redux';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {useImageAspectRatio} from '../../hooks/useImageAspectRatio';
import {usePartnerLogo} from '../../hooks/useLocalPartnerLogo';
import {Colors} from '../../styles/Themes';
import PartnerLogoContainerStyles from './PartnerLogoContainerStyles';

const PartnerLogoContainer = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = PartnerLogoContainerStyles(colors);
  const navigation = useAppNavigation();
  const {logoUri} = usePartnerLogo();
  const adminAuthDone = useAppSelector(adminAuthDoneSelector);
  const isLoading = useAppSelector(isLoadingSelector);
  const globalStatus = useAppSelector(statusSelector);

  const [newPartnerLogo, setNewPartnerLogo] = useState<Asset | null>(null);
  const [edit, setEdit] = useState(false);

  const {ratio} = useImageAspectRatio(logoUri);

  useEffect(() => {
    if (!adminAuthDone) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  }, [adminAuthDone, navigation]);

  useEffect(() => {
    dispatch(changeStatus('idle'));

    return () => {
      dispatch(changeStatus('idle'));
    };
  }, [dispatch]);

  const handleCancel = () => {
    setNewPartnerLogo(null);
    dispatch(changeStatus('idle'));
    if (!logoUri) {
      navigation.goBack();
    } else {
      setEdit(false);
    }
  };

  const handleSaveNewLogo = async () => {
    if (!newPartnerLogo?.uri) return;

    await dispatch(updateCollector({partnerLogo: newPartnerLogo.uri}));
    setEdit(false);
    setNewPartnerLogo(null);
  };

  const handleGoBack = () => {
    dispatch(changeStatus('idle'));
    navigation.goBack();
  };

  const showSuccess = globalStatus === 'success';

  return (
    <ScreenShell onClose={() => navigation.goBack()}>
      {!showSuccess ? (
        <ContentHolder style={styles.contentHolder}>
          <Typography
            fontSize={24}
            color="textPrimary"
            lineHeight={1.5}
            fontFamily="Poppins-SemiBold"
            fontWeight="semibold">
            Logotipo Cliente
          </Typography>
          <LogoSubtitleBlock />
          {!edit ? (
            <View style={styles.previewContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: logoUri} as ImageURISource}
                  style={[styles.image, {aspectRatio: ratio}]}
                  resizeMode="contain"
                />
              </View>
              <Button
                onPress={() => setEdit(true)}
                variant="default"
                fluid
                textSemiBold
                textColor="white">
                Editar logo
              </Button>
            </View>
          ) : (
            <View style={styles.imagePickerContainer}>
              <ImageUploader
                onImageChange={setNewPartnerLogo}
                initialBase64={logoUri}
              />

              <View style={styles.actions}>
                <Button
                  onPress={handleCancel}
                  variant="defaultOutline"
                  textColor="primary">
                  Cancelar
                </Button>

                <Button
                  disabled={!newPartnerLogo}
                  isLoading={isLoading}
                  onPress={handleSaveNewLogo}
                  variant="default"
                  fixedWidth={92}
                  textColor="white">
                  Salvar
                </Button>
              </View>
            </View>
          )}
        </ContentHolder>
      ) : (
        <ActionFeedback
          message="Logotipo editado com sucesso."
          status="success"
          onAction={handleGoBack}
          actionLabel="Fechar"
        />
      )}
    </ScreenShell>
  );
};

export default PartnerLogoContainer;
