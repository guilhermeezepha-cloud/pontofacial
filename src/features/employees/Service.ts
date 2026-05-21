import {AxiosResponse} from 'axios';

import {
  Employee,
  EmployeeFilterParams,
  ForpontoEmployees,
  ForpontoEmployeesRequestParams,
  ProcessingJob,
} from './Types';

import {api} from '../../config/Axios';

class EmployeeService {
  /**
   * Busca funcionário por matrícula (sem JWT - público)
   */
  static async getByRegistration(registration: string) {
    try {
      const response = await api.get(`/employees/registration/${registration}`);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Busca funcionário por ID (com JWT)
   */
  static async getById(employeeId: number) {
    try {
      const response = await api.get(`/employees/${employeeId}`);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Busca funcionário no AsyncStorage usando a lista completa de funcionários
   */
  static async getEmployeeFromAsyncStorage(
    registration: string,
  ): Promise<Employee | null> {
    try {
      const Session = (await import('../../utils/session')).default;
      const {EMPLOYEES_LIST_KEY} = await import('../../utils/storageKeys');

      const employeesList = await Session.get<Employee[]>(EMPLOYEES_LIST_KEY);

      if (!employeesList || employeesList.length === 0) {
        return null;
      }

      const employee = employeesList.find(
        emp => emp.registration === registration,
      );
      return employee || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Busca funcionário (online ou AsyncStorage offline)
   */
  static async getByRegistrationWithFallback(registration: string): Promise<{
    success: boolean;
    employee?: Employee;
    fromCache: boolean;
    error?: string;
  }> {
    try {
      // 1. Tentar buscar online primeiro
      const response = await this.getByRegistration(registration);
      const employee = response.data as Employee;

      return {
        success: true,
        employee,
        fromCache: false,
      };
    } catch (error: any) {
      // 2. Tentar buscar no AsyncStorage
      const cachedEmployee = await this.getEmployeeFromAsyncStorage(
        registration,
      );

      if (cachedEmployee) {
        return {
          success: true,
          employee: cachedEmployee,
          fromCache: true,
        };
      }

      return {
        success: false,
        fromCache: false,
        error: `Funcionário ${registration} não encontrado online nem no AsyncStorage`,
      };
    }
  }

  static getForpontoEmployees(
    params: ForpontoEmployeesRequestParams,
  ): Promise<AxiosResponse<ForpontoEmployees>> {
    return api.post(`/forponto-facial/employees`, params);
  }

  static getFilteredEmployees(
    params: EmployeeFilterParams,
  ): Promise<AxiosResponse<Employee[]>> {
    return api.get(`/employees/filter`, {params});
  }

  static getEmployeesJobStatus(
    jobId: string,
  ): Promise<AxiosResponse<ProcessingJob>> {
    return api.get(`/forponto-facial/employees/status/${jobId}`);
  }
}

export default EmployeeService;
