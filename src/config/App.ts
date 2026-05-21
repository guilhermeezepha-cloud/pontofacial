import {Platform} from 'react-native';

import {version} from '../../package.json';
import {AppConfig, TargetEnvConfig} from '../types/Config';
import {resolveDevHostAndroid} from '../utils/hostResolvers';

const LOCAL_API_PORT = 3000;

const devEndpoint =
  Platform.OS === 'android'
    ? `http://${resolveDevHostAndroid()}:${LOCAL_API_PORT}/api`
    : `http://localhost:${LOCAL_API_PORT}/api`; // iOS simulador;

const env = process.env.NODE_ENV || 'development';

const config: TargetEnvConfig = {
  development: {
    path: '/',
    baseUrl: '',
    endpoint: devEndpoint,
  },

  uat: {
    path: '',
    baseUrl: '',
    endpoint: '',
  },
  production: {
    path: '/',
    baseUrl: '',
    endpoint: '',
  },
};

export const appVersion = version;

export default {
  ...config[env],
  env,
} as AppConfig;
