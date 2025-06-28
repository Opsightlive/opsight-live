
import React, { Suspense, ReactNode } from 'react';
import PageLoader from './page-loader';
import ErrorBoundary from '../error/ErrorBoundary';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  loadingText?: string;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback,
  errorFallback,
  loadingText = "Loading..."
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || <PageLoader text={loadingText} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseWrapper;
