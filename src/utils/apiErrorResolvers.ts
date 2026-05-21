import {AxiosError, isAxiosError} from 'axios';

export type ApiError = {
  status?: number;
  message: string;
  data?: any;
  url?: string;
  method?: string;
  code?: string;
};

export function extractApiError(err: unknown): ApiError {
  if (isAxiosError(err)) {
    const ae = err as AxiosError<any>;
    const status = ae.response?.status;
    const data = ae.response?.data;

    const msg =
      (typeof data === 'string' ? data : undefined) ||
      data?.message ||
      data?.error ||
      ae.message ||
      'Erro inesperado';

    return {
      status,
      message: msg,
      data,
      url: ae.config?.url,
      method: ae.config?.method?.toUpperCase(),
      code: ae.code,
    };
  }

  return {message: err instanceof Error ? err.message : String(err)};
}
