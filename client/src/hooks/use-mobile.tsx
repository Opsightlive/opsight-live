
import { useDeviceDetection } from './use-device-detection';

export function useIsMobile() {
  const { isMobile } = useDeviceDetection();
  return isMobile;
}
