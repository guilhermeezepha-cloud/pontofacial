import { useTheme } from '@react-navigation/native';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { Asset } from 'react-native-image-picker';

import {
  createNewCollector,
  firstAccessDoneSelector,
  isLoadingSelector,
} from './Slice';

import Button from '../../components/button';
import ContentHolder from '../../components/container/ContentHolder';
import AdminPasswordSubtitleBLock from '../../components/content/AdminPasswordSubtitleBLock';
import LogoSubtitleBlock from '../../components/content/LogoSubtitleBlock';
import AdminPasswordForm, { AdminPasswordFormHandle } from '../../components/form/AdminAuthenticatorForm';
import IdentificationDataForm from '../../components/form/IdentificationDataForm';
import ImageUploader from '../../components/form/ImageUploader';
import ScreenShell from '../../components/screen-shell';
import Stepper from '../../components/stepper';
import Typography from '../../components/typography';
import {
  useAppDispatch,
  useAppSelector,
} from '../../hooks/Redux';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Colors } from '../../styles/Themes';
import { applyEndpointFromFirstAccess } from '../../utils/apiBaseUrl';
import { IdentificationDataFormValues } from '../../utils/form-validators/identificationDataSchema';
import FirstAccessContainerStyles from './FirstAccessContainerStyles';

type HeaderItem = {title: string; subTitle?: string | React.ReactNode};

const FirstAccessContainer = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<AdminPasswordFormHandle>(null);
  const navigation = useAppNavigation();
  const theme = useTheme();
  const colors = theme.colors as Colors;
  const styles = FirstAccessContainerStyles(colors);
  const firstAccessDone = useAppSelector(state =>
    firstAccessDoneSelector(state),
  );
  const isLoading = useAppSelector(isLoadingSelector);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPartnerLogo, setSelectedPartnerLogo] = useState<Asset | null>(
    null,
  );
  const initialIdentificationData: IdentificationDataFormValues = {
    code: '',
    groupCode: '',
    apiUrl: '',
    identifier: '',
  };
  const [identificationData, setIdentificationData] = useState(
    initialIdentificationData,
  );

  const headerTextContent: HeaderItem[] = [
    {
      title: 'Configurar primeiro acesso',
      subTitle:
        'Bem-vindo ao nosso inovador aplicativo de reconhecimento facial! Este aplicativo foi projetado para rodar em seu dispositivo junto ao software de Controle de Frequência Forponto, oferecendo uma experiência segura, conveniente e personalizada.',
    },
    {
      title: 'Dados de identificação',
      subTitle:
        'Para garantir o funcionamento correto da solução, é essencial que os dados cadastrais inseridos neste formulário, estejam em total conformidade com o registro feito no Forponto.',
    },
    {
      title: 'Logotipo Cliente',
      subTitle: <LogoSubtitleBlock />,
    },
    {
      title: 'Senha de Administrador',
      subTitle: <AdminPasswordSubtitleBLock />,
    },
  ];

  const handleIdentificationData = (data: IdentificationDataFormValues) => {
    setIdentificationData(data);
    if (!__DEV__) applyEndpointFromFirstAccess(data.apiUrl);
    setCurrentStep(2);
  };

  const handleAdminPassword = (password: string) => {
    dispatch(
      createNewCollector(
        identificationData,
        password,
        selectedPartnerLogo?.uri,
      ),
    );
  };

  useEffect(() => {
    if (firstAccessDone) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  }, [firstAccessDone, navigation]);

  return (
    <ScreenShell
      onClose={currentStep > 0 ? () => setCurrentStep(0) : undefined}>
      {currentStep === 0 && (
        <View style={styles.stepZeroContent}>
          <Typography
            fontSize={36}
            color="black"
            textAlign="center"
            fontFamily="Poppins-SemiBold"
            fontWeight="semibold">
            {headerTextContent[currentStep].title}
          </Typography>
          {typeof headerTextContent[currentStep].subTitle === 'string' && (
            <Typography
              fontSize={20}
              color="black"
              textAlign="center"
              style={styles.stepZeroDescription}>
              {headerTextContent[currentStep].subTitle as string}
            </Typography>
          )}
          <Button
            style={styles.stepZeroButton}
            onPress={() => setCurrentStep(1)}
            variant="default"
            textColor="white"
            textSemiBold
            fixedWidth={200}>
            Próximo
          </Button>
        </View>
      )}

      {currentStep > 0 && (
        <ContentHolder style={styles.contentHolder}>
          <View style={styles.contentHeader}>
            <Stepper totalSteps={3} currentStep={currentStep} />
            <Typography
              fontSize={24}
              color="textPrimary"
              fontFamily="Poppins-SemiBold"
              fontWeight="semibold"
              style={
                currentStep === 2
                  ? styles.stepTwoTitleOffset
                  : currentStep === 3
                  ? styles.stepThreeTitleOffset
                  : undefined
              }>
              {headerTextContent[currentStep].title}
            </Typography>

            {currentStep < 2 &&
              typeof headerTextContent[currentStep].subTitle === 'string' && (
                <Typography fontSize={14} color="black">
                  {headerTextContent[currentStep].subTitle as string}
                </Typography>
              )}

            {currentStep >= 2 &&
              typeof headerTextContent[currentStep].subTitle !== 'string' &&
              (headerTextContent[currentStep].subTitle as React.ReactNode)}
          </View>
          {currentStep === 1 && (
            <IdentificationDataForm
              onSubmit={handleIdentificationData}
              defaultValues={identificationData}
            />
          )}
          {currentStep === 2 && (
            <View style={styles.stepTwoContent}>
              <ImageUploader
                onImageChange={setSelectedPartnerLogo}
                initialBase64={selectedPartnerLogo?.base64}
              />

              <View style={styles.actions}>
                <Button
                  onPress={() => setCurrentStep(1)}
                  variant="defaultOutline"
                  textColor="primary">
                  Voltar
                </Button>

                <Button
                  onPress={() => setCurrentStep(3)}
                  variant="default"
                  textColor="white">
                  {selectedPartnerLogo ? 'Continuar' : 'Pular'}
                </Button>
              </View>
            </View>
          )}

          {currentStep === 3 && (
            <View style={styles.stepThreeContent}>
              <AdminPasswordForm onSubmit={handleAdminPassword} ref={formRef} />

              <View style={styles.actions}>
                <Button
                  onPress={() => setCurrentStep(2)}
                  variant="defaultOutline"
                  textColor="primary">
                  Voltar
                </Button>

                <Button
                  onPress={() => formRef.current?.submit()}
                  variant="default"
                  isLoading={isLoading}
                  disabled={isLoading}
                  fixedWidth={92}
                  textColor="white">
                  Salvar
                </Button>
              </View>
            </View>
          )}
        </ContentHolder>
      )}
    </ScreenShell>
  );
};

export default FirstAccessContainer;
