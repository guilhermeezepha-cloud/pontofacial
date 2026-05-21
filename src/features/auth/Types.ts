export interface AuthState {
  status: Status;
  adminAuthDone: boolean;
}

export interface AuthRequestData {
  code: string;
  identifier: string;
  password: string;
}

export interface AuthResponseData {
  access_token: string;
  collector_id: number;
  code: string;
  identifier: string;
}
