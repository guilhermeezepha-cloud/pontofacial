import {Employee} from '../employees';

export interface RegisterState {
  status: Status;
  firstAccessDone: boolean;
  firstAccessSteps: number;
}
export interface Group {
  id: number;
  code: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectorRequestPayload {
  groupCode?: string;
  active?: boolean;
  code?: string;
  identifier?: string;
  apiUrl?: string;
  partnerLogo?: string;
  adminPassword?: string;
}

export interface Collector {
  id: number;
  groupCode: string;
  active: boolean;
  code: string;
  identifier: string;
  apiUrl: string;
  partnerLogo?: string;
  lastSynchronization: string | null;
  createdAt: string;
  updatedAt: string;
  group?: Group;
  employees?: Employee[]; // provisório
}

export type CollectorWithoutLogo = Omit<Collector, 'partnerLogo'>;
