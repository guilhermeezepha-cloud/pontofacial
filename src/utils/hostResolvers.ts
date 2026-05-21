import { NativeModules } from 'react-native';

// Configurações de host para debug
const DEBUG_CONFIG = {
  // Força um IP específico (descomente e ajuste conforme necessário)
  FORCE_HOST: undefined as string | undefined,
  // FORCE_HOST: '192.168.0.15', // IP da sua máquina na rede local
  // FORCE_HOST: '10.0.2.2', // IP especial do emulador Android

  // Usar adb reverse (padrão)
  USE_ADB_REVERSE: true,

  // Logs de debug
  ENABLE_LOGS: true,
};

export const resolveDevHostAndroid = () => {
  const log = (message: string) => {
    if (DEBUG_CONFIG.ENABLE_LOGS) {
      console.log(`[HostResolver] ${message}`);
    }
  };

  // Se há um host forçado para debug, use-o
  if (DEBUG_CONFIG.FORCE_HOST) {
    log(`Using forced host: ${DEBUG_CONFIG.FORCE_HOST}`);
    return DEBUG_CONFIG.FORCE_HOST;
  }

  const scriptURL = (NativeModules as any)?.SourceCode?.scriptURL as
    | string
    | undefined;
  const hostname = scriptURL ? new URL(scriptURL).hostname : undefined;

  log(`Script URL: ${scriptURL}`);
  log(`Extracted hostname: ${hostname}`);

  // em caso de IP válido vindo do Metro, use-o (conexão por rede)
  if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    log(`Using Metro-provided hostname: ${hostname}`);
    return hostname;
  }

  // Escolher estratégia baseada na configuração
  if (DEBUG_CONFIG.USE_ADB_REVERSE) {
    log('Using localhost with adb reverse');
    return 'localhost';
  } else {
    log('Using emulator special IP');
    return '10.0.2.2';
  }
};
