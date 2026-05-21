import {AuthResponseData} from '../../features/auth/Types';

import {AuthSession} from '../../config/Axios';

export const toAuthSession = (raw: AuthResponseData): AuthSession => ({
  accessToken: raw?.access_token ?? null,
  tokenType: 'Bearer',
  refreshToken: null,
  expiresAt: null,
  expiresInSec: null,
  expiresInMs: null,
});
