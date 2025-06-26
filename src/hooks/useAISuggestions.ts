
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AISuggestion {
  id: string;
  type: 'trial' | 'alert' | 'performance' | 'recommendation' | 'action';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  action?: {
    label: string;
    route?: string;
    handler?: () => void;
  };
  dismissible: boolean;
  timestamp: Date;
}

export const useAISuggestions = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateAISuggestions = (): AISuggestion[] => {
    const now = new Date();
    const suggestions: AISuggestion[] = [];

    // Trial expiration suggestions
    if (user?.subscription?.status === 'trial') {
      const trialEnd = new Date(user.subscription.trialEnd || '2025-01-29');
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft <= 3) {
        suggestions.push({
          id: 'trial-ending',
          type: 'trial',
          priority: 'high',
          title: `⏰ Trial Ending in ${daysLeft} Days`,
          message: `Your free trial expires soon. Upgrade now to continue accessing all features without interruption.`,
          action: {
            label: 'Upgrade Now',
            route: '/subscription'
          },
          dismissible: false,
          timestamp: now
        });
      } else if (daysLeft <= 7) {
        suggestions.push({
          id: 'trial-reminder',
          type: 'trial',
          priority: 'medium',
          title: `📅 ${daysLeft} Days Left in Trial`,
          message: `Make the most of your remaining trial days. Consider upgrading to secure your preferred plan.`,
          action: {
            label: 'View Plans',
            route: '/subscription'
          },
          dismissible: true,
          timestamp: now
        });
      }
    }

    // Red flag alerts
    suggestions.push({
      id: 'new-red-flags',
      type: 'alert',
      priority: 'high',
      title: '🚨 3 New Red Flag Alerts',
      message: 'Oak Ridge Complex has critical collection issues. Sunset Gardens shows declining occupancy trends.',
      action: {
        label: 'Review Alerts',
        route: '/red-flag-alerts'
      },
      dismissible: true,
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
    });

    // Performance insights
    suggestions.push({
      id: 'performance-insight',
      type: 'performance',
      priority: 'medium',
      title: '📊 Weekly Performance Summary Ready',
      message: 'Your portfolio performance has improved 15% this week. 2 properties need attention.',
      action: {
        label: 'View Report',
        route: '/portfolio'
      },
      dismissible: true,
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000) // 4 hours ago
    });

    // Recommendations
    suggestions.push({
      id: 'pm-engagement-low',
      type: 'recommendation',
      priority: 'medium',
      title: '💡 PM Engagement Score Declining',
      message: 'Sarah Johnson\'s engagement score dropped to 72%. Consider scheduling a check-in meeting.',
      action: {
        label: 'View PM Scores',
        route: '/pm-engagement'
      },
      dismissible: true,
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000) // 6 hours ago
    });

    // Action items
    suggestions.push({
      id: 'maintenance-backlog',
      type: 'action',
      priority: 'low',
      title: '🔧 Maintenance Backlog Growing',
      message: 'You have 12 pending work orders across 3 properties. Response times are trending upward.',
      action: {
        label: 'View Timeline',
        route: '/timeline'
      },
      dismissible: true,
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000) // 12 hours ago
    });

    return suggestions.sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  };

  const refreshSuggestions = () => {
    setIsLoading(true);
    // Simulate AI processing time
    setTimeout(() => {
      const newSuggestions = generateAISuggestions();
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 1000);
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  useEffect(() => {
    refreshSuggestions();
  }, [user]);

  return {
    suggestions,
    isLoading,
    refreshSuggestions,
    dismissSuggestion
  };
};
