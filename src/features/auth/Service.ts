import {AxiosResponse} from 'axios';

import {AuthRequestData} from './Types';

import {api} from '../../config/Axios';

class AuthService {
  static postAuth(params: AuthRequestData): Promise<AxiosResponse<any>> {
    return api.post('/auth/token', params);
  }
}

export default AuthService;
