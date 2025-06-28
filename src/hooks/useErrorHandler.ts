
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  logToService?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | string,
    context?: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logToConsole = true,
      logToService = true
    } = options;

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    if (logToConsole) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, errorObj);
    }

    if (showToast) {
      toast.error(errorMessage, {
        description: context ? `Error occurred in ${context}` : undefined,
        duration: 5000
      });
    }

    if (logToService) {
      // In production, send to monitoring service
      logErrorToMonitoringService(errorObj, context);
    }
  }, []);

  return { handleError };
};

const logErrorToMonitoringService = (error: Error, context?: string) => {
  // This would integrate with services like Sentry, LogRocket, etc.
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.log('Error logged to monitoring service:', errorData);
};
