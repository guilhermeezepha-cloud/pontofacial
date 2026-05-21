import axios, {AxiosError, AxiosInstance} from 'axios';
import {Store} from 'redux';

import Session from '../utils/session';
import appConfig from './App';
import {RootState} from './Redux';

// let store: Store;

// Injetores
export const injectStore = (_store: Store<RootState>) => {
  // store = _store;
};

// Tipos
export interface AuthSession {
  accessToken?: string | null;
  tokenType?: 'Bearer' | string;

  // opcionais
  refreshToken?: string | null;
  expiresAt?: number | null;
  expiresInSec?: number | null;
  expiresInMs?: number | null;
}

// Instâncias
export const api: AxiosInstance = axios.create({
  baseURL: appConfig.endpoint,
  timeout: 20000, // 20 segundos de timeout
});

// Interceptor comum de requisição
const attachAuthToken = async (config: any) => {
  try {
    const session = await Session.get<AuthSession>('auth');
    const token = session?.accessToken ?? null;
    const type = session?.tokenType ?? 'Bearer';

    if (token) {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `${type} ${token}`,
      };
    }
  } catch (err) {}

  return config;
};

// Interceptor comum de erro
const handleResponseError = async (error: AxiosError) => {
  const status = error.response?.status;

  if (status === 401 || status === 403) {
    /*     await Session.destroy('auth');

    const state = store?.getState();
    const firstAccessDone = state ? firstAccessDoneSelector(state) : false;
    resetTo(firstAccessDone ? 'Home' : 'FirstAccess'); */
  }

  return Promise.reject(error);
};

// Aplica os interceptors
[api].forEach(instance => {
  // Interceptor de requisição com debug
  instance.interceptors.request.use(
    config => {
      return attachAuthToken(config);
    },
    error => {
      return Promise.reject(error);
    },
  );

  // Interceptor de resposta com debug
  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      /*       console.error('[API] ❌ Response error:', {
        status: error.response?.status || 'No response',
        statusCode: error.code || 'Unknown',
        message: error.message,
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        timeout: error.code === 'ECONNABORTED' ? 'Request timeout' : false,
      }); */
      return handleResponseError(error);
    },
  );
});

export default {
  api,
  injectStore,
};
