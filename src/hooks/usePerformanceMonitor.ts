
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  componentName: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const renderStartTime = useRef<number>(performance.now());

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    const loadTime = Date.now() - startTime.current;

    const metrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      componentName
    };

    // Log performance metrics
    console.log(`Performance Metrics for ${componentName}:`, metrics);

    // In production, you could send these metrics to an analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics service
      // analyticsService.track('component_performance', metrics);
    }

    // Alert if performance is poor
    if (renderTime > 100) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    if (loadTime > 1000) {
      console.warn(`Slow load detected in ${componentName}: ${loadTime}ms`);
    }
  }, [componentName]);

  return {
    startTime: startTime.current,
    componentName
  };
};
