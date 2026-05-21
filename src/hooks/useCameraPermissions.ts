// hooks/useCameraPermission.ts
import {
  useEffect,
  useState,
} from 'react';
import { Camera } from 'react-native-vision-camera';

export function useCameraPermission(): boolean | null {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    Camera.requestCameraPermission().then(status => {
      if (!mounted) return;
      setHasPermission(status === 'granted');
    });

    return () => {
      mounted = false;
    };
  }, []);

  return hasPermission;
}
