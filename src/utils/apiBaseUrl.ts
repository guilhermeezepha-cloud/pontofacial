import {CollectorWithoutLogo} from '../features/register/Types';

import appConfig from '../config/App';
import {api} from '../config/Axios';
import {IDENTIFICATION_DATA_KEY} from './storageKeys';

const stripTrailingSlash = (url: string) =>
  String(url).trim().replace(/\/+$/, '');

export const getApiBaseURL = () => api.defaults.baseURL || '';

export const setApiBaseURL = (url: string) => {
  api.defaults.baseURL = stripTrailingSlash(url);
};

export async function initApiBaseURLFromIdentificationData(): Promise<void> {
  try {
    const Session = (await import('./session')).default;
    const identificationData = await Session.get<CollectorWithoutLogo>(
      IDENTIFICATION_DATA_KEY,
    );

    const endpoint = identificationData?.apiUrl ?? appConfig.endpoint;

    if (endpoint) {
      setApiBaseURL(endpoint);
    }
  } catch {
    if (appConfig.endpoint) setApiBaseURL(appConfig.endpoint);
  }
}

export function applyEndpointFromFirstAccess(apiUrlFromForm: string): void {
  setApiBaseURL(apiUrlFromForm);
}
