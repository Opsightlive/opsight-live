
import React from 'react';
import { cn } from '@/lib/utils';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

interface AdaptiveGridProps {
  children: React.ReactNode;
  className?: string;
  minItemWidth?: number;
  gap?: 'sm' | 'md' | 'lg';
  autoFit?: boolean;
}

const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  children,
  className,
  minItemWidth = 300,
  gap = 'md',
  autoFit = true
}) => {
  const { screenInfo, layoutSettings } = useAdaptiveLayoutContext();

  const getGridCols = () => {
    if (layoutSettings.cardLayout === 'list') {
      return 'grid-cols-1';
    }

    const containerWidth = screenInfo.width - (screenInfo.isMobile ? 32 : 64); // Account for padding
    const cols = Math.floor(containerWidth / minItemWidth);
    
    if (screenInfo.isMobile) {
      return layoutSettings.compactView ? 'grid-cols-2' : 'grid-cols-1';
    }
    
    if (screenInfo.isTablet) {
      return cols >= 2 ? 'grid-cols-2' : 'grid-cols-1';
    }
    
    if (screenInfo.isDesktop) {
      if (cols >= 4) return 'grid-cols-4';
      if (cols >= 3) return 'grid-cols-3';
      if (cols >= 2) return 'grid-cols-2';
      return 'grid-cols-1';
    }
    
    if (screenInfo.isTV) {
      if (cols >= 6) return 'grid-cols-6';
      if (cols >= 5) return 'grid-cols-5';
      if (cols >= 4) return 'grid-cols-4';
      return 'grid-cols-3';
    }

    return 'grid-cols-1';
  };

  const getGap = () => {
    const baseGaps = {
      sm: 'gap-2 sm:gap-3',
      md: 'gap-3 sm:gap-4 md:gap-6',
      lg: 'gap-4 sm:gap-6 md:gap-8'
    };

    let selectedGap = baseGaps[gap];

    if (layoutSettings.layoutDensity === 'compact') {
      selectedGap = selectedGap.replace(/gap-\d+/g, (match) => {
        const num = parseInt(match.split('-')[1]);
        return `gap-${Math.max(1, num - 1)}`;
      });
    }

    if (layoutSettings.layoutDensity === 'spacious') {
      selectedGap = selectedGap.replace(/gap-\d+/g, (match) => {
        const num = parseInt(match.split('-')[1]);
        return `gap-${num + 1}`;
      });
    }

    return selectedGap;
  };

  const gridStyle = autoFit ? {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
  } : {};

  return (
    <div 
      className={cn(
        'grid w-full',
        !autoFit && getGridCols(),
        getGap(),
        'transition-all duration-200 ease-in-out',
        className
      )}
      style={autoFit ? gridStyle : {}}
    >
      {children}
    </div>
  );
};

export default AdaptiveGrid;
