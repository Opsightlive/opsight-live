
import React, { createContext, useContext, ReactNode } from 'react';
import { useAdaptiveLayout } from '@/hooks/useAdaptiveLayout';

type AdaptiveLayoutContextType = ReturnType<typeof useAdaptiveLayout>;

const AdaptiveLayoutContext = createContext<AdaptiveLayoutContextType | null>(null);

export const useAdaptiveLayoutContext = () => {
  const context = useContext(AdaptiveLayoutContext);
  if (!context) {
    throw new Error('useAdaptiveLayoutContext must be used within AdaptiveLayoutProvider');
  }
  return context;
};

interface AdaptiveLayoutProviderProps {
  children: ReactNode;
}

export const AdaptiveLayoutProvider: React.FC<AdaptiveLayoutProviderProps> = ({ children }) => {
  const adaptiveLayout = useAdaptiveLayout();

  return (
    <AdaptiveLayoutContext.Provider value={adaptiveLayout}>
      {children}
    </AdaptiveLayoutContext.Provider>
  );
};
