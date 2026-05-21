import {zodResolver} from '@hookform/resolvers/zod';
import {useTheme} from '@react-navigation/native';

import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View, ViewStyle} from 'react-native';

import {Colors} from '../../styles/Themes';
import {
  IdentificationDataFormValues,
  identificationDataSchema,
} from '../../utils/form-validators/identificationDataSchema';
import Button from '../button';
import IdentificationDataFormStyles from './IdentificationDataFormStyles';
import Input from './Input';

interface IdentificationDataFormProps {
  defaultValues?: Partial<IdentificationDataFormValues>;
  onSubmit: (values: IdentificationDataFormValues) => void;
  containerStyle?: ViewStyle;
  submitButtonText?: string;
  isLoading?: boolean;
}

const IdentificationDataForm: React.FC<IdentificationDataFormProps> = ({
  defaultValues,
  onSubmit,
  containerStyle,
  submitButtonText = 'Continuar',
  isLoading = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors as Colors;

  const styles = IdentificationDataFormStyles(colors);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IdentificationDataFormValues>({
    resolver: zodResolver(identificationDataSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      code: '',
      groupCode: '',
      apiUrl: '',
      identifier: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      code: defaultValues?.code ?? '',
      groupCode: defaultValues?.groupCode ?? '',
      apiUrl: defaultValues?.apiUrl ?? '',
      identifier: defaultValues?.identifier ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reset,
    defaultValues?.code,
    defaultValues?.groupCode,
    defaultValues?.apiUrl,
    defaultValues?.identifier,
  ]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Controller
        name="code"
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label="Código do coletor"
            placeholder="123"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.code?.message}
          />
        )}
      />

      <Controller
        name="groupCode"
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label="Código do grupo"
            placeholder="00001"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.groupCode?.message}
          />
        )}
      />

      <Controller
        name="apiUrl"
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            label="URL"
            placeholder="https://www.exemplo.com"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.apiUrl?.message}
            inputStyle={{textTransform: 'none'}}
          />
        )}
      />

      <Controller
        name="identifier"
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Identificador único"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.identifier?.message}
          />
        )}
      />

      <Button
        fluid
        onPress={handleSubmit(onSubmit)}
        variant="default"
        textColor="white"
        isLoading={isLoading}
        fixedWidth={92}
        textSemiBold>
        {submitButtonText}
      </Button>
    </View>
  );
};

export default IdentificationDataForm;
