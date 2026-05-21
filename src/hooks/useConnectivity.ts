import NetInfo from '@react-native-community/netinfo';

import { useEffect, useState } from 'react';

export interface ConnectivityInfo {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  details?: any;
}

/**
 * Hook personalizado para monitorar o status de conectividade
 * Usa @react-native-community/netinfo para detectar mudanças online/offline
 */
export const useConnectivity = () => {
  const [connectivity, setConnectivity] = useState<ConnectivityInfo>({
    isConnected: false,
    isInternetReachable: false,
    type: 'unknown',
  });

  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [previouslyOffline, setPreviouslyOffline] = useState<boolean>(false);
  const [justCameOnline, setJustCameOnline] = useState<boolean>(false);

  useEffect(() => {
    // Obter estado inicial
    NetInfo.fetch().then(state => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable ?? false;
      const online = connected && reachable;

      setConnectivity({
        isConnected: connected,
        isInternetReachable: reachable,
        type: state.type || 'unknown',
        details: state.details,
      });

      setIsOnline(online);
    });

    // Listener para mudanças de conectividade
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable ?? false;
      const online = connected && reachable;

      setConnectivity({
        isConnected: connected,
        isInternetReachable: reachable,
        type: state.type || 'unknown',
        details: state.details,
      });

      // Detectar quando volta online após estar offline
      if (online && previouslyOffline) {
        setJustCameOnline(true);
        // Reset o flag após um pequeno delay
        setTimeout(() => setJustCameOnline(false), 1000);
      }

      // Atualizar estados
      setPreviouslyOffline(!online);
      setIsOnline(online);
    });

    return () => unsubscribe();
  }, [previouslyOffline]);

  /**
   * Força uma verificação manual da conectividade
   */
  const checkConnectivity = async (): Promise<ConnectivityInfo> => {
    const state = await NetInfo.fetch();
    const connected = state.isConnected ?? false;
    const reachable = state.isInternetReachable ?? false;

    const info: ConnectivityInfo = {
      isConnected: connected,
      isInternetReachable: reachable,
      type: state.type || 'unknown',
      details: state.details,
    };

    setConnectivity(info);
    setIsOnline(connected && reachable);

    return info;
  };

  return {
    // Estados principais
    isOnline,
    isConnected: connectivity.isConnected,
    isInternetReachable: connectivity.isInternetReachable,

    // Informações detalhadas
    connectivity,

    // Eventos
    justCameOnline,

    // Métodos
    checkConnectivity,

    // Status legível
    status: isOnline ? 'online' : 'offline',
    connectionType: connectivity.type,
  };
};

/**
 * Hook simplificado que retorna apenas se está online/offline
 */
export const useIsOnline = (): boolean => {
  const {isOnline} = useConnectivity();
  return isOnline;
};

/**
 * Hook que executa callback quando volta online
 */
export const useOnOnline = (callback: () => void) => {
  const {justCameOnline} = useConnectivity();

  useEffect(() => {
    if (justCameOnline) {
      callback();
    }
  }, [justCameOnline, callback]);
};
