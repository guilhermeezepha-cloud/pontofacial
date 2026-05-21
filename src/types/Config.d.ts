export interface EnvConfig {
  path: string;
  baseUrl: string;
  endpoint?: string;
  secret?: string;
  middleware?: {key: string};
  google?: {
    android: string;
    ios: string;
  };
}

export interface AppConfig extends EnvConfig {
  env: string;
  version: string;
}

export interface TargetEnvConfig {
  [key: string]: EnvConfig;
}

export interface CollectionResponse<T> {
  data: T[];
  meta: Meta;
}
export type MessageResponse = {code: number; messages: Array<string>};
