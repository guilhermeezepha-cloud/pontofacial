import { Platform } from 'react-native';
import { version } from '../../package.json';
import { AppConfig, TargetEnvConfig } from '../types/Config';
import { resolveDevHostAndroid } from '../utils/hostResolvers';

const LOCAL_API_PORT = 3000;
// URL que você quer testar no modo Debug sem alterar a produção
const DEBUG_ENDPOINT = 'https://pontofacial.ddns.net/api';

const devEndpoint = Platform.OS === 'android'
  ? `http://${resolveDevHostAndroid()}:${LOCAL_API_PORT}/api`
  : `http://localhost:${LOCAL_API_PORT}/api`;

const env = process.env.NODE_ENV || 'development';

const config: TargetEnvConfig = {
  development: {
    path: '/',
    baseUrl: '',
    // Se você quiser testar a NUVEM no modo Debug, comente a linha abaixo e descomente a de cima:
    endpoint: DEBUG_ENDPOINT,
    // endpoint: devEndpoint, 
  },

  uat: {
    path: '',
    baseUrl: '',
    endpoint: '',
  },

  production: {
    path: '/',
    baseUrl: '',
    endpoint: '', // MANTIDO VAZIO conforme exigido para funcionar via sessão
  },
};

export const appVersion = version;

export default {
  ...config[env],
  env,
} as AppConfig;