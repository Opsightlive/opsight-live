
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RedFlag {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  property?: string;
  kpiValue?: number;
  threshold?: number;
  trend?: 'improving' | 'declining' | 'stable';
  priority: number;
  daysActive: number;
  estimatedCost?: number;
  resolutionSteps?: string[];
  createdAt: Date;
  status: 'active' | 'acknowledged' | 'in_progress' | 'resolved';
}

interface TriggerData {
  description?: string;
  impact?: string;
  recommendation?: string;
  estimatedCost?: number;
  resolutionSteps?: string[];
  priority?: number;
  trend?: string;
  threshold?: number;
}

class RedFlagService {
  async analyzeKPIsForRedFlags(userId: string): Promise<RedFlag[]> {
    try {
      // Get recent KPI data
      const { data: kpis, error } = await supabase
        .from('kpi_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const redFlags: RedFlag[] = [];

      // Analyze each KPI for red flags
      for (const kpi of kpis || []) {
        const flags = this.analyzeKPIForFlags(kpi);
        redFlags.push(...flags);
      }

      // Store red flags in database
      await this.storeRedFlags(userId, redFlags);

      return redFlags;
    } catch (error) {
      console.error('Error analyzing KPIs for red flags:', error);
      return [];
    }
  }

  private analyzeKPIForFlags(kpi: any): RedFlag[] {
    const flags: RedFlag[] = [];
    const currentValue = kpi.metric_value;
    const targetValue = kpi.target_value;
    const zone = kpi.performance_zone;

    // Critical occupancy flag
    if (kpi.metric_name === 'Occupancy Rate' && currentValue < 80) {
      flags.push({
        id: `occupancy-critical-${Date.now()}`,
        type: 'critical',
        category: 'leasing',
        title: 'Critical Occupancy Drop',
        description: `Occupancy has dropped to ${currentValue}%, well below target of ${targetValue}%`,
        impact: 'Significant revenue loss and cash flow problems',
        recommendation: 'Immediate marketing push, review pricing strategy, inspect units',
        property: kpi.property_name,
        kpiValue: currentValue,
        threshold: 80,
        trend: 'declining',
        priority: 1,
        daysActive: Math.floor(Math.random() * 15) + 1,
        estimatedCost: Math.floor((targetValue - currentValue) * 1000),
        resolutionSteps: [
          'Launch emergency marketing campaign',
          'Review and adjust pricing',
          'Inspect vacant units for issues',
          'Increase showing availability',
          'Consider move-in incentives'
        ],
        createdAt: new Date(),
        status: 'active'
      });
    }

    // High maintenance cost flag
    if (kpi.metric_name === 'Maintenance Cost per Unit' && currentValue > 200) {
      flags.push({
        id: `maintenance-high-${Date.now()}`,
        type: 'high',
        category: 'maintenance',
        title: 'Elevated Maintenance Costs',
        description: `Maintenance costs at $${currentValue} per unit exceed target of $${targetValue}`,
        impact: 'Reduced NOI and potential equipment failures',
        recommendation: 'Review maintenance contracts and implement preventive measures',
        property: kpi.property_name,
        kpiValue: currentValue,
        threshold: 200,
        trend: 'declining',
        priority: 2,
        daysActive: Math.floor(Math.random() * 10) + 1,
        estimatedCost: Math.floor((currentValue - targetValue) * 12),
        resolutionSteps: [
          'Audit maintenance vendors',
          'Implement preventive maintenance schedule',
          'Review recurring issues',
          'Consider equipment upgrades',
          'Train maintenance staff'
        ],
        createdAt: new Date(),
        status: 'active'
      });
    }

    // Days to lease flag
    if (kpi.metric_name === 'Days to Lease' && currentValue > 25) {
      flags.push({
        id: `leasing-slow-${Date.now()}`,
        type: 'medium',
        category: 'leasing',
        title: 'Slow Leasing Velocity',
        description: `Average ${currentValue} days to lease exceeds target of ${targetValue} days`,
        impact: 'Increased vacancy costs and revenue loss',
        recommendation: 'Streamline leasing process and enhance marketing',
        property: kpi.property_name,
        kpiValue: currentValue,
        threshold: 25,
        trend: 'stable',
        priority: 3,
        daysActive: Math.floor(Math.random() * 8) + 1,
        estimatedCost: Math.floor((currentValue - targetValue) * 50),
        resolutionSteps: [
          'Review leasing process efficiency',
          'Enhance online marketing presence',
          'Increase showing availability',
          'Review application approval process',
          'Consider leasing incentives'
        ],
        createdAt: new Date(),
        status: 'active'
      });
    }

    // Revenue variance flag
    if (kpi.category === 'revenue' && targetValue && currentValue < targetValue * 0.9) {
      flags.push({
        id: `revenue-variance-${Date.now()}`,
        type: 'high',
        category: 'revenue',
        title: 'Revenue Underperformance',
        description: `Revenue at $${currentValue.toLocaleString()} is ${Math.round(((targetValue - currentValue) / targetValue) * 100)}% below target`,
        impact: 'Cash flow shortage and inability to meet debt obligations',
        recommendation: 'Immediate revenue recovery plan needed',
        property: kpi.property_name,
        kpiValue: currentValue,
        threshold: targetValue * 0.9,
        trend: 'declining',
        priority: 1,
        daysActive: Math.floor(Math.random() * 12) + 1,
        estimatedCost: targetValue - currentValue,
        resolutionSteps: [
          'Analyze revenue sources',
          'Review rent collection procedures',
          'Implement rent increase where possible',
          'Reduce vacancy time',
          'Optimize ancillary income'
        ],
        createdAt: new Date(),
        status: 'active'
      });
    }

    return flags;
  }

  private async storeRedFlags(userId: string, flags: RedFlag[]): Promise<void> {
    for (const flag of flags) {
      try {
        // Store as alert instance
        await supabase.from('alert_instances').insert({
          user_id: userId,
          property_name: flag.property,
          kpi_type: flag.category,
          kpi_value: flag.kpiValue,
          alert_level: flag.type === 'critical' ? 'red' : flag.type === 'high' ? 'red' : 'yellow',
          alert_message: flag.title,
          trigger_data: {
            description: flag.description,
            impact: flag.impact,
            recommendation: flag.recommendation,
            estimatedCost: flag.estimatedCost,
            resolutionSteps: flag.resolutionSteps,
            priority: flag.priority,
            trend: flag.trend
          },
          status: flag.status
        });
      } catch (error) {
        console.error('Error storing red flag:', error);
      }
    }
  }

  async getActiveRedFlags(userId: string): Promise<RedFlag[]> {
    try {
      const { data: alerts, error } = await supabase
        .from('alert_instances')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (alerts || []).map(alert => {
        const triggerData = alert.trigger_data as TriggerData || {};
        
        return {
          id: alert.id,
          type: this.mapAlertLevelToType(alert.alert_level),
          category: alert.kpi_type,
          title: alert.alert_message,
          description: triggerData.description || '',
          impact: triggerData.impact || '',
          recommendation: triggerData.recommendation || '',
          property: alert.property_name,
          kpiValue: alert.kpi_value,
          threshold: triggerData.threshold,
          trend: (triggerData.trend as 'improving' | 'declining' | 'stable') || 'stable',
          priority: triggerData.priority || 5,
          daysActive: Math.floor((new Date().getTime() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60 * 24)),
          estimatedCost: triggerData.estimatedCost,
          resolutionSteps: triggerData.resolutionSteps || [],
          createdAt: new Date(alert.created_at),
          status: alert.status as 'active' | 'acknowledged' | 'in_progress' | 'resolved'
        };
      });
    } catch (error) {
      console.error('Error fetching red flags:', error);
      return [];
    }
  }

  private mapAlertLevelToType(level: string): 'critical' | 'high' | 'medium' | 'low' {
    switch (level) {
      case 'red': return 'critical';
      case 'yellow': return 'medium';
      default: return 'low';
    }
  }

  async updateRedFlagStatus(flagId: string, status: 'acknowledged' | 'in_progress' | 'resolved'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('alert_instances')
        .update({ 
          status,
          acknowledged_at: status === 'acknowledged' ? new Date().toISOString() : undefined,
          resolved_at: status === 'resolved' ? new Date().toISOString() : undefined
        })
        .eq('id', flagId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating red flag status:', error);
      return false;
    }
  }
}

export const redFlagService = new RedFlagService();
