
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'tv';
export type CardLayout = 'grid' | 'list' | 'compact';
export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';
export type FontSize = 'small' | 'medium' | 'large';

interface ScreenInfo {
  width: number;
  height: number;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTV: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  hasNotch: boolean;
  pixelRatio: number;
}

interface LayoutSettings {
  sidebarCollapsed: boolean;
  compactView: boolean;
  cardLayout: CardLayout;
  layoutDensity: LayoutDensity;
  fontSize: FontSize;
  customSettings: Record<string, any>;
}

const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024, max: 1919 },
  tv: { min: 1920, max: Infinity }
};

export const useAdaptiveLayout = () => {
  const { user } = useAuth();
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(() => getScreenInfo());
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    sidebarCollapsed: false,
    compactView: false,
    cardLayout: 'grid',
    layoutDensity: 'comfortable',
    fontSize: 'medium',
    customSettings: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  function getScreenInfo(): ScreenInfo {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    
    let deviceType: DeviceType = 'desktop';
    if (width <= BREAKPOINTS.mobile.max) deviceType = 'mobile';
    else if (width <= BREAKPOINTS.tablet.max) deviceType = 'tablet';
    else if (width >= BREAKPOINTS.tv.min) deviceType = 'tv';

    const isLandscape = width > height;
    const isPortrait = height > width;
    
    // Detect notch (common on modern phones)
    const hasNotch = 'CSS' in window && CSS.supports('padding-top: env(safe-area-inset-top)');

    return {
      width,
      height,
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      isTV: deviceType === 'tv',
      isLandscape,
      isPortrait,
      hasNotch,
      pixelRatio
    };
  }

  // Load user layout settings from Supabase
  const loadLayoutSettings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const currentScreen = getScreenInfo();
      const { data, error } = await supabase
        .from('user_layout_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('device_type', currentScreen.deviceType)
        .order('last_used', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading layout settings:', error);
        toast.error('Failed to load layout preferences');
      } else if (data) {
        // Safely handle the custom_settings Json type
        const customSettings = data.custom_settings && typeof data.custom_settings === 'object' && !Array.isArray(data.custom_settings) 
          ? data.custom_settings as Record<string, any>
          : {};

        setLayoutSettings({
          sidebarCollapsed: data.sidebar_collapsed || false,
          compactView: data.compact_view || false,
          cardLayout: (data.card_layout as CardLayout) || 'grid',
          layoutDensity: (data.layout_density as LayoutDensity) || 'comfortable',
          fontSize: (data.font_size as FontSize) || 'medium',
          customSettings
        });
      } else {
        // Create default settings for this device type
        await saveLayoutSettings(layoutSettings, currentScreen);
      }
    } catch (error) {
      console.error('Error loading layout settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save layout settings to Supabase
  const saveLayoutSettings = async (settings: LayoutSettings, screen?: ScreenInfo) => {
    if (!user) return false;

    const currentScreen = screen || getScreenInfo();
    
    try {
      const { error } = await supabase
        .from('user_layout_settings')
        .upsert({
          user_id: user.id,
          device_type: currentScreen.deviceType,
          screen_width: currentScreen.width,
          screen_height: currentScreen.height,
          sidebar_collapsed: settings.sidebarCollapsed,
          compact_view: settings.compactView,
          card_layout: settings.cardLayout,
          layout_density: settings.layoutDensity,
          font_size: settings.fontSize,
          custom_settings: settings.customSettings,
          last_used: new Date().toISOString()
        }, {
          onConflict: 'user_id,device_type',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error saving layout settings:', error);
        toast.error('Failed to save layout preferences');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving layout settings:', error);
      return false;
    }
  };

  // Update specific layout setting
  const updateLayoutSetting = async <K extends keyof LayoutSettings>(
    key: K,
    value: LayoutSettings[K]
  ) => {
    const newSettings = { ...layoutSettings, [key]: value };
    setLayoutSettings(newSettings);
    await saveLayoutSettings(newSettings);
  };

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const newScreenInfo = getScreenInfo();
      setScreenInfo(newScreenInfo);
      
      // Load settings for new device type if it changed
      if (newScreenInfo.deviceType !== screenInfo.deviceType) {
        loadLayoutSettings();
      }
    };

    const handleOrientationChange = () => {
      // Small delay to ensure screen dimensions are updated
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [screenInfo.deviceType, user]);

  // Load initial settings
  useEffect(() => {
    loadLayoutSettings();
  }, [user]);

  // Auto-save settings when they change
  useEffect(() => {
    if (!isLoading && user) {
      const timeoutId = setTimeout(() => {
        saveLayoutSettings(layoutSettings);
      }, 1000); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [layoutSettings, isLoading, user]);

  return {
    screenInfo,
    layoutSettings,
    isLoading,
    updateLayoutSetting,
    saveLayoutSettings: () => saveLayoutSettings(layoutSettings),
    loadLayoutSettings
  };
};
