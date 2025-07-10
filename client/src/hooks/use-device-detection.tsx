import * as React from "react"

const MOBILE_BREAKPOINT = 768

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop',
    userAgent: ''
  });

  React.useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const screenWidth = window.innerWidth;
      
      // Check for mobile devices via user agent
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTabletUA = /ipad|android(?!.*mobile)/i.test(userAgent);
      
      // Combine user agent detection with screen size
      const isMobileDevice = isMobileUA && screenWidth < MOBILE_BREAKPOINT;
      const isTabletDevice = isTabletUA || (screenWidth >= MOBILE_BREAKPOINT && screenWidth < 1024);
      const isDesktopDevice = !isMobileDevice && !isTabletDevice;
      
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobileDevice) deviceType = 'mobile';
      else if (isTabletDevice) deviceType = 'tablet';
      
      setDeviceInfo({
        isMobile: isMobileDevice,
        isTablet: isTabletDevice,
        isDesktop: isDesktopDevice,
        deviceType,
        userAgent
      });
    };

    detectDevice();
    
    const handleResize = () => detectDevice();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
}

// Keep the original hook for backward compatibility
export function useIsMobile() {
  const { isMobile } = useDeviceDetection();
  return isMobile;
}
