
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

interface AdaptiveCardProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  headerContent?: React.ReactNode;
  compact?: boolean;
}

const AdaptiveCard: React.FC<AdaptiveCardProps> = ({
  children,
  title,
  className,
  headerContent,
  compact = false
}) => {
  const { screenInfo, layoutSettings } = useAdaptiveLayoutContext();

  const getCardPadding = () => {
    if (compact || layoutSettings.compactView) {
      return screenInfo.isMobile ? 'p-3' : 'p-4';
    }
    
    if (layoutSettings.layoutDensity === 'compact') {
      return screenInfo.isMobile ? 'p-3' : 'p-4';
    }
    
    if (layoutSettings.layoutDensity === 'spacious') {
      return screenInfo.isMobile ? 'p-4' : 'p-8';
    }
    
    return screenInfo.isMobile ? 'p-4' : 'p-6';
  };

  const getHeaderSize = () => {
    if (compact || layoutSettings.compactView) {
      return screenInfo.isMobile ? 'text-base' : 'text-lg';
    }
    
    return screenInfo.isMobile ? 'text-lg' : 'text-xl';
  };

  return (
    <Card className={cn(
      'transition-all duration-200 ease-in-out',
      'hover:shadow-md',
      screenInfo.isMobile && 'rounded-lg',
      className
    )}>
      {(title || headerContent) && (
        <CardHeader className={cn(
          compact || layoutSettings.compactView ? 'pb-2' : 'pb-4',
          screenInfo.isMobile ? 'px-4 pt-4' : 'px-6 pt-6'
        )}>
          {title && (
            <CardTitle className={cn(
              'font-semibold text-gray-900',
              getHeaderSize()
            )}>
              {title}
            </CardTitle>
          )}
          {headerContent}
        </CardHeader>
      )}
      
      <CardContent className={cn(
        getCardPadding(),
        (title || headerContent) && 'pt-0'
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default AdaptiveCard;
