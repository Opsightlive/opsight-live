
import React from 'react';
import { cn } from '@/lib/utils';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'full',
  padding = 'md',
  center = true
}) => {
  const { screenInfo, layoutSettings } = useAdaptiveLayoutContext();

  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-4xl';
      case 'xl': return 'max-w-6xl';
      case '2xl': return 'max-w-7xl';
      default: return 'max-w-full';
    }
  };

  const getPadding = () => {
    const basePadding = {
      none: '',
      sm: 'p-2 sm:p-3 md:p-4',
      md: 'p-3 sm:p-4 md:p-6 lg:p-8',
      lg: 'p-4 sm:p-6 md:p-8 lg:p-12'
    }[padding];

    // Adjust padding based on device and layout density
    if (screenInfo.isMobile) {
      return basePadding.replace(/p-\d+/g, (match) => {
        const num = parseInt(match.split('-')[1]);
        return `p-${Math.max(1, num - 1)}`;
      });
    }

    if (layoutSettings.layoutDensity === 'compact') {
      return basePadding.replace(/p-\d+/g, (match) => {
        const num = parseInt(match.split('-')[1]);
        return `p-${Math.max(1, num - 1)}`;
      });
    }

    if (layoutSettings.layoutDensity === 'spacious') {
      return basePadding.replace(/p-\d+/g, (match) => {
        const num = parseInt(match.split('-')[1]);
        return `p-${num + 1}`;
      });
    }

    return basePadding;
  };

  const getSafeAreaPadding = () => {
    if (screenInfo.hasNotch && screenInfo.isMobile) {
      return 'pt-safe-area-inset-top pb-safe-area-inset-bottom pl-safe-area-inset-left pr-safe-area-inset-right';
    }
    return '';
  };

  return (
    <div className={cn(
      'w-full',
      getMaxWidth(),
      getPadding(),
      getSafeAreaPadding(),
      center && 'mx-auto',
      'transition-all duration-200 ease-in-out',
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
