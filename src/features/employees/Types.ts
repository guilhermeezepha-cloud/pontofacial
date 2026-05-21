export interface EmployeesState {
  status: Status;
  employees: Employee[] | null;
  jobId: string | null;
}

export interface Employee {
  id: number;
  name: string;
  registration: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  groupCode: string;
  collectorCode: string;
  admin: boolean;
  action: string;
  createdAt: string;
  updatedAt: string;
  photo?: string;
}

export interface EmployeeFilterParams {
  groupCode: string;
  collectorCode: string;
}

export interface ForpontoEmployees {
  localData: LocalData;
  soapSync: SoapSync;
}

export interface LocalData {
  funcionarios: Funcionario[];
  processingJob: ProcessingJob;
}

export interface Funcionario {
  CodigoGrupo: string;
  Matricula: string;
  Nome: string;
  CodigoColetor: string;
  Admin: boolean;
  Acao: string;
}

export interface ProcessingJob {
  jobId: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'TRAINING' | 'ERROR';
  startedAt: string;
  stats?: Stats;
  completedAt?: string;
  error?: string;
}

export interface Stats {
  processed: number;
  errors: number;
  total: number;
  successRate: number;
}

export interface SoapSync {
  success: boolean;
  details: Details;
}

export interface Details {
  consultedEmployees: number;
  consultTimestamp: string;
  tokenReceived: string;
  groupCode: string;
  collectorCode: string;
  uniqueIdentifier: string;
}

export interface ForpontoEmployeesRequestParams {
  codigoGrupo: string;
  codigoColetor: string;
  identificadorUnico: string;
}
