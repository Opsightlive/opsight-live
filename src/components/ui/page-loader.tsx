
import React from 'react';
import LoadingSpinner from './loading-spinner';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

interface PageLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  text = "Loading...", 
  fullScreen = true 
}) => {
  const { screenInfo } = useAdaptiveLayoutContext();

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className={cn(
            "mt-4 text-gray-600 font-medium",
            screenInfo.isMobile ? "text-sm" : "text-base"
          )}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
};

export default PageLoader;
