
import { useEffect } from 'react';
import { useAdaptiveLayoutContext } from '@/contexts/AdaptiveLayoutContext';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  screenInfo: any;
  timestamp: string;
}

const PerformanceMonitor: React.FC = () => {
  const { screenInfo } = useAdaptiveLayoutContext();

  useEffect(() => {
    // Monitor page load performance
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const metrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        renderTime: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        memoryUsage: (performance as any).memory?.usedJSHeapSize,
        screenInfo,
        timestamp: new Date().toISOString()
      };

      // Log performance metrics
      console.log('Performance Metrics:', metrics);
      
      // In production, send to monitoring service
      logPerformanceMetrics(metrics);
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Monitor long tasks that could block UI
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => {
        observer.disconnect();
        window.removeEventListener('load', measurePerformance);
      };
    }
  }, [screenInfo]);

  return null; // This is a monitoring component, no UI
};

const logPerformanceMetrics = (metrics: PerformanceMetrics) => {
  // In production, integrate with monitoring services
  // Examples: DataDog, New Relic, Google Analytics, etc.
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    }).catch(console.error);
  }
};

export default PerformanceMonitor;
