import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useConnectivityDebug } from '../hooks/useConnectivityDebug';

interface ConnectivityDebugPanelProps {
  visible?: boolean;
}

/**
 * Painel de debug para monitorar conectividade
 * Adicione temporariamente à sua tela principal para debug
 */
const ConnectivityDebugPanel: React.FC<ConnectivityDebugPanelProps> = ({
  visible = true,
}) => {
  const connectivity = useConnectivityDebug(5000); // Check a cada 5 segundos

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Debug Panel</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Endpoint:</Text>
        <Text style={[styles.value, styles.endpoint]}>
          {connectivity.endpoint}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>API Status:</Text>
        <Text
          style={[
            styles.value,
            connectivity.isApiReachable ? styles.success : styles.error,
          ]}>
          {connectivity.isApiReachable ? '✅ Online' : '❌ Offline'}
        </Text>
      </View>

      {connectivity.error && (
        <View style={styles.row}>
          <Text style={styles.label}>Error:</Text>
          <Text style={[styles.value, styles.error]}>{connectivity.error}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Last Check:</Text>
        <Text style={styles.value}>
          {connectivity.lastCheck
            ? connectivity.lastCheck.toLocaleTimeString()
            : 'Never'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={connectivity.checkNow}>
        <Text style={styles.buttonText}>🔄 Check Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 12,
    borderRadius: 8,
    minWidth: 250,
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  label: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
    minWidth: 70,
  },
  value: {
    color: 'white',
    fontSize: 12,
    flex: 1,
  },
  endpoint: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  success: {
    color: '#4CAF50',
  },
  error: {
    color: '#F44336',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ConnectivityDebugPanel;
