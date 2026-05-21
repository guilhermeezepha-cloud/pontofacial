import {useEffect, useState} from 'react';

import {api} from '../config/Axios';

interface ConnectivityStatus {
  isOnline: boolean;
  isApiReachable: boolean;
  lastCheck: Date | null;
  error: string | null;
  endpoint: string;
}

/**
 * Hook para monitorar conectividade com a API
 * Útil para debug de problemas de rede
 */
export const useConnectivityDebug = (checkInterval: number = 10000) => {
  const [status, setStatus] = useState<ConnectivityStatus>({
    isOnline: false,
    isApiReachable: false,
    lastCheck: null,
    error: null,
    endpoint: api.defaults.baseURL || 'undefined',
  });

  const checkConnectivity = async () => {
    try {
      // Tentar endpoint de health se existir, senão tentar qualquer endpoint
      const response = await api.get('/health', {timeout: 5000});

      setStatus({
        isOnline: true,
        isApiReachable: true,
        lastCheck: new Date(),
        error: null,
        endpoint: api.defaults.baseURL || 'undefined',
      });
    } catch (error: any) {
      const errorMessage =
        error.code === 'ECONNABORTED'
          ? 'Connection timeout'
          : error.message || 'Unknown error';

      setStatus({
        isOnline: true, // Assumir que tem internet, mas API não está acessível
        isApiReachable: false,
        lastCheck: new Date(),
        error: errorMessage,
        endpoint: api.defaults.baseURL || 'undefined',
      });
    }
  };

  // Verificar imediatamente e depois em intervalos
  useEffect(() => {
    checkConnectivity();

    const interval = setInterval(checkConnectivity, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval]);

  return {
    ...status,
    checkNow: checkConnectivity,
  };
};
