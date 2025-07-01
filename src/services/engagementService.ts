
import { supabase } from '@/integrations/supabase/client';

export interface EngagementMetrics {
  overallScore: number;
  responsiveness: number;
  proactivity: number;
  dataQuality: number;
  systemUsage: number;
  improvementTrend: 'improving' | 'declining' | 'stable';
  benchmarkComparison: number;
  recommendations: string[];
}

export interface UserActivity {
  login_frequency: number;
  data_sync_frequency: number;
  alert_response_time: number;
  feature_usage_count: number;
  red_flags_resolved: number;
  reports_generated: number;
  last_activity: Date;
}

class EngagementService {
  async calculateEngagementScore(userId: string): Promise<EngagementMetrics> {
    try {
      const activity = await this.getUserActivity(userId);
      const scores = this.calculateComponentScores(activity);
      
      const overallScore = Math.round(
        (scores.responsiveness * 0.3) +
        (scores.proactivity * 0.25) +
        (scores.dataQuality * 0.25) +
        (scores.systemUsage * 0.2)
      );

      return {
        overallScore,
        responsiveness: scores.responsiveness,
        proactivity: scores.proactivity,
        dataQuality: scores.dataQuality,
        systemUsage: scores.systemUsage,
        improvementTrend: this.calculateTrend(overallScore),
        benchmarkComparison: this.getBenchmarkComparison(overallScore),
        recommendations: this.generateRecommendations(scores)
      };
    } catch (error) {
      console.error('Error calculating engagement score:', error);
      return this.getDefaultMetrics();
    }
  }

  private async getUserActivity(userId: string): Promise<UserActivity> {
    try {
      // Get user activity logs
      const { data: logs } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Get alert response data
      const { data: alerts } = await supabase
        .from('alert_instances')
        .select('created_at, acknowledged_at, resolved_at')
        .eq('user_id', userId)
        .not('acknowledged_at', 'is', null);

      // Get PM integrations data
      const { data: integrations } = await supabase
        .from('pm_integrations')
        .select('last_sync, sync_frequency')
        .eq('user_id', userId);

      // Get reports data
      const { data: reports } = await supabase
        .from('lp_reports')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Calculate metrics
      const loginFrequency = this.calculateLoginFrequency(logs || []);
      const syncFrequency = this.calculateSyncFrequency(integrations || []);
      const responseTime = this.calculateAverageResponseTime(alerts || []);
      const featureUsage = this.calculateFeatureUsage(logs || []);
      const resolvedFlags = this.countResolvedFlags(alerts || []);
      const reportsGenerated = (reports || []).length;

      return {
        login_frequency: loginFrequency,
        data_sync_frequency: syncFrequency,
        alert_response_time: responseTime,
        feature_usage_count: featureUsage,
        red_flags_resolved: resolvedFlags,
        reports_generated: reportsGenerated,
        last_activity: new Date()
      };
    } catch (error) {
      console.error('Error getting user activity:', error);
      return this.getDefaultActivity();
    }
  }

  private calculateComponentScores(activity: UserActivity) {
    // Responsiveness Score (0-100)
    const responsiveness = Math.min(100, Math.max(0, 
      100 - (activity.alert_response_time / 24) * 10  // Penalty for slow response
    ));

    // Proactivity Score (0-100)
    const proactivity = Math.min(100,
      (activity.red_flags_resolved * 20) +
      (activity.reports_generated * 10) +
      (activity.login_frequency * 2)
    );

    // Data Quality Score (0-100)
    const dataQuality = Math.min(100,
      (activity.data_sync_frequency * 25) +
      50 // Base score for having any sync
    );

    // System Usage Score (0-100)
    const systemUsage = Math.min(100,
      (activity.feature_usage_count * 5) +
      (activity.login_frequency * 3)
    );

    return {
      responsiveness: Math.round(responsiveness),
      proactivity: Math.round(proactivity),
      dataQuality: Math.round(dataQuality),
      systemUsage: Math.round(systemUsage)
    };
  }

  private calculateLoginFrequency(logs: any[]): number {
    const loginLogs = logs.filter(log => log.action_type === 'login');
    return loginLogs.length;
  }

  private calculateSyncFrequency(integrations: any[]): number {
    if (integrations.length === 0) return 0;
    
    const recentSyncs = integrations.filter(integration => {
      if (!integration.last_sync) return false;
      const lastSync = new Date(integration.last_sync);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastSync > weekAgo;
    });

    return recentSyncs.length;
  }

  private calculateAverageResponseTime(alerts: any[]): number {
    if (alerts.length === 0) return 24; // Default to 24 hours if no alerts

    const responseTimes = alerts.map(alert => {
      const created = new Date(alert.created_at);
      const acknowledged = new Date(alert.acknowledged_at);
      return (acknowledged.getTime() - created.getTime()) / (1000 * 60 * 60); // Hours
    });

    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }

  private calculateFeatureUsage(logs: any[]): number {
    const uniqueFeatures = new Set(logs.map(log => log.action_type));
    return uniqueFeatures.size;
  }

  private countResolvedFlags(alerts: any[]): number {
    return alerts.filter(alert => alert.resolved_at).length;
  }

  private calculateTrend(currentScore: number): 'improving' | 'declining' | 'stable' {
    // This would typically compare with historical data
    // For now, simulate based on score
    if (currentScore > 80) return 'improving';
    if (currentScore < 60) return 'declining';
    return 'stable';
  }

  private getBenchmarkComparison(score: number): number {
    // Simulate industry benchmark comparison
    const industryAverage = 72;
    return Math.round(((score - industryAverage) / industryAverage) * 100);
  }

  private generateRecommendations(scores: any): string[] {
    const recommendations: string[] = [];

    if (scores.responsiveness < 70) {
      recommendations.push('Set up mobile notifications to respond to alerts faster');
      recommendations.push('Consider delegating alert monitoring during off-hours');
    }

    if (scores.proactivity < 60) {
      recommendations.push('Schedule regular property performance reviews');
      recommendations.push('Set up automated monthly reports to stay proactive');
    }

    if (scores.dataQuality < 70) {
      recommendations.push('Increase data sync frequency to daily or real-time');
      recommendations.push('Verify all PM software integrations are working correctly');
    }

    if (scores.systemUsage < 50) {
      recommendations.push('Explore more features like automated reporting');
      recommendations.push('Consider setting up custom dashboards for your properties');
    }

    if (recommendations.length === 0) {
      recommendations.push('Great job! Your engagement is excellent. Keep it up!');
    }

    return recommendations;
  }

  private getDefaultMetrics(): EngagementMetrics {
    return {
      overallScore: 75,
      responsiveness: 80,
      proactivity: 70,
      dataQuality: 75,
      systemUsage: 75,
      improvementTrend: 'stable',
      benchmarkComparison: 0,
      recommendations: ['Start by connecting your property management software']
    };
  }

  private getDefaultActivity(): UserActivity {
    return {
      login_frequency: 5,
      data_sync_frequency: 2,
      alert_response_time: 12,
      feature_usage_count: 8,
      red_flags_resolved: 3,
      reports_generated: 2,
      last_activity: new Date()
    };
  }

  // Track user engagement events
  async trackEngagementEvent(userId: string, eventType: string, eventData?: any): Promise<void> {
    try {
      await supabase.from('user_activity_logs').insert({
        user_id: userId,
        action_type: eventType,
        action_details: eventData || {},
        success: true
      });
    } catch (error) {
      console.error('Error tracking engagement event:', error);
    }
  }
}

export const engagementService = new EngagementService();
