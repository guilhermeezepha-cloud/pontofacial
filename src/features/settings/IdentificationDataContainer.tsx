import {useTheme} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

import {adminAuthDoneSelector} from '../auth/Slice';
import {
  changeStatus,
  isLoadingSelector,
  statusSelector,
  updateCollector,
} from '../register/Slice';

import ActionFeedback from '../../components/action-feedback';
import ContentHolder from '../../components/container/ContentHolder';
import IdentificationDataForm from '../../components/form/IdentificationDataForm';
import Loader from '../../components/loader';
import ScreenShell from '../../components/screen-shell';
import Typography from '../../components/typography';
import {useAppDispatch, useAppSelector} from '../../hooks/Redux';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {useIdentificationData} from '../../hooks/useIdentificationData';
import {Colors} from '../../styles/Themes';
import {IdentificationDataFormValues} from '../../utils/form-validators/identificationDataSchema';
import {ensureIdentificationFormValues} from '../../utils/identificationFormUtils';
import IdentificationDataContainerStyles from './IdentificationDataContainerStyles';

const IdentificationDataContainer = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = IdentificationDataContainerStyles(colors);
  const navigation = useAppNavigation();
  const adminAuthDone = useAppSelector(adminAuthDoneSelector);
  const isLoading = useAppSelector(isLoadingSelector);
  const globalStatus = useAppSelector(statusSelector);
  const {identificationData: storedCollector, loading: loadingCollector} =
    useIdentificationData();

  const [formValues, setFormValues] = useState<IdentificationDataFormValues>({
    code: '',
    groupCode: '',
    apiUrl: '',
    identifier: '',
  });

  useEffect(() => {
    if (!adminAuthDone) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  }, [adminAuthDone, navigation]);

  useEffect(() => {
    if (loadingCollector) return;
    const form = ensureIdentificationFormValues(storedCollector);
    if (form) setFormValues(form);
  }, [loadingCollector, storedCollector]);

  useEffect(() => {
    dispatch(changeStatus('idle'));

    return () => {
      dispatch(changeStatus('idle'));
    };
  }, [dispatch]);

  const handleSubmit = async (data: IdentificationDataFormValues) => {
    setFormValues(data);
    await dispatch(updateCollector(data));
  };

  const handleGoBack = () => {
    dispatch(changeStatus('idle'));
    navigation.goBack();
  };

  const showSuccess = globalStatus === 'success';

  return (
    <ScreenShell onClose={handleGoBack}>
      {!showSuccess ? (
        <>
          {!loadingCollector ? (
            <ContentHolder style={styles.contentHolder}>
              <View style={styles.contentHeader}>
                <Typography
                  fontSize={24}
                  color="textPrimary"
                  fontFamily="Poppins-SemiBold"
                  fontWeight="semibold">
                  Dados de identificação
                </Typography>
                <Typography fontSize={14} color="black">
                  Para garantir o funcionamento correto da solução, é essencial
                  que os dados cadastrais inseridos neste formulário, estejam em
                  total conformidade com o registro feito no Forponto.
                </Typography>
              </View>

              <IdentificationDataForm
                key={`${formValues.code}|${formValues.groupCode}|${formValues.apiUrl}|${formValues.identifier}`}
                onSubmit={handleSubmit}
                defaultValues={formValues}
                submitButtonText="Salvar"
                isLoading={isLoading}
              />
            </ContentHolder>
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <ActionFeedback
          message="Dados editados com sucesso."
          status="success"
          onAction={handleGoBack}
          actionLabel="Fechar"
        />
      )}
    </ScreenShell>
  );
};

export default IdentificationDataContainer;
