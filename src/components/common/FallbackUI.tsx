
import React from 'react';
import { AlertCircle, Database, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FallbackUIProps {
  type?: 'no-data' | 'error' | 'offline' | 'loading';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const FallbackUI: React.FC<FallbackUIProps> = ({
  type = 'no-data',
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'no-data':
        return {
          icon: <Database className="h-12 w-12 text-gray-400" />,
          title: 'No Data Available',
          description: 'There\'s no data to display at the moment. Try refreshing or check back later.'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-12 w-12 text-red-500" />,
          title: 'Something Went Wrong',
          description: 'We encountered an error while loading this content.'
        };
      case 'offline':
        return {
          icon: <WifiOff className="h-12 w-12 text-orange-500" />,
          title: 'You\'re Offline',
          description: 'Check your internet connection and try again.'
        };
      default:
        return {
          icon: <Wifi className="h-12 w-12 text-blue-500" />,
          title: 'Loading...',
          description: 'Please wait while we fetch your data.'
        };
    }
  };

  const defaultContent = getDefaultContent();

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center min-h-[300px]',
      className
    )}>
      {icon || defaultContent.icon}
      <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
        {title || defaultContent.title}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {description || defaultContent.description}
      </p>
      {onAction && actionLabel && (
        <Button onClick={onAction} variant={type === 'error' ? 'default' : 'outline'}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default FallbackUI;
