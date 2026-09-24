import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORT = 3001;

// When running in Expo (device or simulator), the dev server host looks like
// "192.168.178.26:8081". We reuse that IP so a physical phone can reach the
// backend on the same machine instead of hitting its own localhost.
const hostUri =
  Constants.expoConfig?.hostUri ||
  Constants.expoGoConfig?.debuggerHost ||
  Constants.manifest2?.extra?.expoGo?.debuggerHost ||
  '';
const lanHost = hostUri.split(':')[0];

function resolveApiUrl() {
  // Web runs on the same machine as the backend.
  if (Platform.OS === 'web') return `http://localhost:${PORT}`;
  // Physical device or simulator reached over the Expo dev server IP.
  if (lanHost) return `http://${lanHost}:${PORT}`;
  // Fallbacks when no dev host is available.
  if (Platform.OS === 'android') return `http://10.0.2.2:${PORT}`;
  return `http://localhost:${PORT}`;
}

export const API_URL = resolveApiUrl();
