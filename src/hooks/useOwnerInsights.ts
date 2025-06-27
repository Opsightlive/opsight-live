
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OwnerInsight {
  id: string;
  type: 'performance' | 'risk' | 'opportunity' | 'benchmark';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  insight: string;
  impact: string;
  recommendation: string;
  properties: string[];
  metrics: {
    current: number;
    benchmark: number;
    trend: 'up' | 'down' | 'stable';
  };
  timestamp: Date;
}

export const useOwnerInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<OwnerInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateOwnerInsights = (): OwnerInsight[] => {
    const now = new Date();
    
    return [
      {
        id: 'cash-flow-optimization',
        type: 'opportunity',
        priority: 'high',
        title: 'Cash Flow Optimization Opportunity',
        insight: 'Three properties are underperforming market rent by 8-12%',
        impact: 'Potential additional $45K monthly revenue',
        recommendation: 'Implement strategic rent increases at Oak Ridge, Sunset Gardens, and Metro Plaza',
        properties: ['Oak Ridge Complex', 'Sunset Gardens', 'Metro Plaza'],
        metrics: {
          current: 87,
          benchmark: 95,
          trend: 'up'
        },
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'pm-performance-risk',
        type: 'risk',
        priority: 'critical',
        title: 'Property Manager Performance Risk',
        insight: 'Johnson Property Management showing declining KPIs across 4 properties',
        impact: 'Occupancy down 6%, maintenance costs up 23%',
        recommendation: 'Schedule immediate performance review and consider management changes',
        properties: ['Riverside Towers', 'Downtown Lofts', 'Parkside Apartments', 'City Center'],
        metrics: {
          current: 73,
          benchmark: 88,
          trend: 'down'
        },
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'market-outperformance',
        type: 'performance',
        priority: 'medium',
        title: 'Market Outperformance Achieved',
        insight: 'Portfolio NOI exceeding market benchmarks by 12%',
        impact: 'Additional $180K quarterly performance vs peers',
        recommendation: 'Consider scaling successful strategies to underperforming assets',
        properties: ['All Properties'],
        metrics: {
          current: 112,
          benchmark: 100,
          trend: 'up'
        },
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000)
      },
      {
        id: 'maintenance-efficiency',
        type: 'benchmark',
        priority: 'low',
        title: 'Maintenance Cost Benchmarking',
        insight: 'Maintenance costs 15% below market average while maintaining high satisfaction',
        impact: 'Cost savings of $85K annually',
        recommendation: 'Document and replicate maintenance processes across portfolio',
        properties: ['Highland Park', 'Westside Commons'],
        metrics: {
          current: 85,
          benchmark: 100,
          trend: 'stable'
        },
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000)
      }
    ];
  };

  const refreshInsights = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newInsights = generateOwnerInsights();
      setInsights(newInsights);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    refreshInsights();
  }, [user]);

  return {
    insights,
    isLoading,
    refreshInsights
  };
};
