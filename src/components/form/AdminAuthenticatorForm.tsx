import {zodResolver} from '@hookform/resolvers/zod';

import React, {forwardRef, useImperativeHandle} from 'react';
import {Controller, useForm} from 'react-hook-form';

import {
  AdminPasswordFormValues,
  adminPasswordLoginSchema,
  adminPasswordSchema,
} from '../../utils/form-validators/adminPasswordSchema';
import Input from './Input';

export type AdminPasswordFormHandle = {
  submit: () => void;
};

interface AdminPasswordFormProps {
  onSubmit: (password: string) => void;
  isLogin?: boolean;
}

const AdminPasswordForm = forwardRef<
  AdminPasswordFormHandle,
  AdminPasswordFormProps
>(({onSubmit, isLogin}, ref) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AdminPasswordFormValues>({
    resolver: zodResolver(
      isLogin ? adminPasswordLoginSchema : adminPasswordSchema,
    ),
    mode: 'onBlur',
  });

  useImperativeHandle(
    ref,
    () => ({
      submit: handleSubmit(data => onSubmit(data.adminPassword)),
    }),
    [handleSubmit, onSubmit],
  );

  return (
    <Controller
      name="adminPassword"
      control={control}
      render={({field: {value, onChange, onBlur}}) => (
        <Input
          secureTextEntry
          showPasswordToggle
          autoCapitalize="none"
          label="Senha de Administrador"
          placeholder="Digite a senha"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors.adminPassword?.message}
        />
      )}
    />
  );
});

export default AdminPasswordForm;
