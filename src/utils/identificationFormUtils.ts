import {IdentificationDataFormValues} from './form-validators/identificationDataSchema';

export const isIdentificationFormValues = (
  value: unknown,
): value is IdentificationDataFormValues => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.code === 'string' &&
    typeof obj.groupCode === 'string' &&
    typeof obj.apiUrl === 'string' &&
    typeof obj.identifier === 'string'
  );
};

export const toIdentificationFormValues = (
  value: unknown,
): IdentificationDataFormValues | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const obj = value as Record<string, unknown>;

  const code = typeof obj.code === 'string' ? obj.code : '';
  const groupCode = typeof obj.groupCode === 'string' ? obj.groupCode : '';
  const apiUrl = typeof obj.apiUrl === 'string' ? obj.apiUrl : '';
  const identifier = typeof obj.identifier === 'string' ? obj.identifier : '';

  const hasAtLeastOneField = [code, groupCode, apiUrl, identifier].some(
    field => field !== '',
  );

  return hasAtLeastOneField ? {code, groupCode, apiUrl, identifier} : null;
};

/**
 * Garante que o valor retornado pelo Session será os 4 campos do form.
 * - Se já está no formato do form, retorna direto.
 * - Se for o objeto grande, extrai os 4 campos.
 * - Caso contrário, retorna null.
 */
export const ensureIdentificationFormValues = (
  input: unknown,
): IdentificationDataFormValues | null => {
  if (isIdentificationFormValues(input)) return input;
  return toIdentificationFormValues(input);
};
