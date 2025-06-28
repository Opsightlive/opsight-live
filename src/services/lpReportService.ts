
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LPReportTemplate {
  id?: string;
  template_name: string;
  description?: string;
  sections: ReportSection[];
  chart_configs: Record<string, any>;
  ai_summary_enabled: boolean;
  auto_generation_enabled: boolean;
  generation_schedule?: string;
  email_recipients: string[];
  is_active: boolean;
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'executive_summary' | 'financial_performance' | 'property_updates' | 'market_analysis' | 'distributions' | 'future_outlook';
  enabled: boolean;
  config: Record<string, any>;
}

export interface LPReport {
  id?: string;
  template_id?: string;
  report_title: string;
  report_period_start: string;
  report_period_end: string;
  property_ids: string[];
  report_data: Record<string, any>;
  ai_summary?: string;
  generation_status: 'queued' | 'processing' | 'completed' | 'failed';
  pdf_storage_path?: string;
  error_message?: string;
  generated_at?: string;
  email_sent_at?: string;
  download_count: number;
  file_size_bytes?: number;
  created_at?: string;
}

export interface ReportGenerationStats {
  total_reports: number;
  completed_reports: number;
  failed_reports: number;
  avg_generation_time_minutes: number;
  total_downloads: number;
  total_emails_sent: number;
}

class LPReportService {
  // Report Templates
  async getReportTemplates(userId: string): Promise<LPReportTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('lp_report_templates')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        template_name: item.template_name,
        description: item.description,
        sections: (item.sections as any) || [],
        chart_configs: (item.chart_configs as any) || {},
        ai_summary_enabled: item.ai_summary_enabled,
        auto_generation_enabled: item.auto_generation_enabled,
        generation_schedule: item.generation_schedule,
        email_recipients: item.email_recipients || [],
        is_active: item.is_active
      }));
    } catch (error: any) {
      console.error('Error fetching report templates:', error);
      toast.error('Failed to load report templates');
      return [];
    }
  }

  async saveReportTemplate(userId: string, template: LPReportTemplate): Promise<boolean> {
    try {
      const templateData = {
        user_id: userId,
        template_name: template.template_name,
        description: template.description,
        sections: template.sections as any, // Cast to Json
        chart_configs: template.chart_configs as any, // Cast to Json
        ai_summary_enabled: template.ai_summary_enabled,
        auto_generation_enabled: template.auto_generation_enabled,
        generation_schedule: template.generation_schedule,
        email_recipients: template.email_recipients,
        is_active: template.is_active
      };

      const { error } = template.id
        ? await supabase
            .from('lp_report_templates')
            .update(templateData)
            .eq('id', template.id)
            .eq('user_id', userId)
        : await supabase
            .from('lp_report_templates')
            .insert(templateData);

      if (error) throw error;

      toast.success(template.id ? 'Template updated successfully' : 'Template created successfully');
      return true;
    } catch (error: any) {
      console.error('Error saving report template:', error);
      toast.error('Failed to save template');
      return false;
    }
  }

  async deleteReportTemplate(userId: string, templateId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lp_report_templates')
        .update({ is_active: false })
        .eq('id', templateId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Template deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      return false;
    }
  }

  // Report Generation
  async generateReport(userId: string, reportConfig: {
    template_id?: string;
    report_title: string;
    report_period_start: string;
    report_period_end: string;
    property_ids: string[];
    sections: ReportSection[];
    ai_summary_enabled: boolean;
    email_recipients?: string[];
  }): Promise<string | null> {
    try {
      // Create report record
      const { data: reportData, error: reportError } = await supabase
        .from('lp_reports')
        .insert({
          user_id: userId,
          template_id: reportConfig.template_id,
          report_title: reportConfig.report_title,
          report_period_start: reportConfig.report_period_start,
          report_period_end: reportConfig.report_period_end,
          property_ids: reportConfig.property_ids,
          report_data: { sections: reportConfig.sections } as any, // Cast to Json
          generation_status: 'queued'
        })
        .select('id')
        .single();

      if (reportError) throw reportError;

      // Add to generation queue
      const { error: queueError } = await supabase
        .from('report_generation_queue')
        .insert({
          user_id: userId,
          template_id: reportConfig.template_id,
          report_id: reportData.id,
          priority: 5
        });

      if (queueError) throw queueError;

      // Trigger report generation via edge function
      const { error: functionError } = await supabase.functions.invoke('generate-lp-report', {
        body: {
          report_id: reportData.id,
          user_id: userId,
          config: reportConfig
        }
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        // Don't fail completely - the queue will handle it
      }

      toast.success('Report generation started');
      return reportData.id;
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast.error('Failed to start report generation');
      return null;
    }
  }

  // Report Management
  async getReports(userId: string, limit: number = 50): Promise<LPReport[]> {
    try {
      const { data, error } = await supabase
        .from('lp_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        template_id: item.template_id,
        report_title: item.report_title,
        report_period_start: item.report_period_start,
        report_period_end: item.report_period_end,
        property_ids: item.property_ids || [],
        report_data: (item.report_data as any) || {},
        ai_summary: item.ai_summary,
        generation_status: item.generation_status as 'queued' | 'processing' | 'completed' | 'failed',
        pdf_storage_path: item.pdf_storage_path,
        error_message: item.error_message,
        generated_at: item.generated_at,
        email_sent_at: item.email_sent_at,
        download_count: item.download_count || 0,
        file_size_bytes: item.file_size_bytes,
        created_at: item.created_at
      }));
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
      return [];
    }
  }

  async downloadReport(userId: string, reportId: string): Promise<boolean> {
    try {
      // Get current download count first
      const { data: currentReport, error: fetchError } = await supabase
        .from('lp_reports')
        .select('download_count')
        .eq('id', reportId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Increment download count
      const { error: updateError } = await supabase
        .from('lp_reports')
        .update({ download_count: (currentReport.download_count || 0) + 1 })
        .eq('id', reportId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Log analytics
      await supabase
        .from('report_analytics')
        .insert({
          user_id: userId,
          report_id: reportId,
          event_type: 'downloaded'
        });

      // Get the report's PDF path
      const { data: report, error: fetchError2 } = await supabase
        .from('lp_reports')
        .select('pdf_storage_path, report_title')
        .eq('id', reportId)
        .eq('user_id', userId)
        .single();

      if (fetchError2) throw fetchError2;

      if (!report.pdf_storage_path) {
        toast.error('Report PDF not found');
        return false;
      }

      // Create download link (would integrate with storage in production)
      const link = document.createElement('a');
      link.href = `/api/reports/${reportId}/download`; // This would be handled by your API
      link.download = `${report.report_title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Report downloaded successfully');
      return true;
    } catch (error: any) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
      return false;
    }
  }

  async emailReport(userId: string, reportId: string, recipients: string[]): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('email-lp-report', {
        body: {
          user_id: userId,
          report_id: reportId,
          recipients
        }
      });

      if (error) throw error;

      toast.success('Report emailed successfully');
      return true;
    } catch (error: any) {
      console.error('Error emailing report:', error);
      toast.error('Failed to email report');
      return false;
    }
  }

  // Statistics
  async getReportStatistics(userId: string, days: number = 30): Promise<ReportGenerationStats | null> {
    try {
      const { data, error } = await supabase.rpc('get_report_statistics', {
        p_user_id: userId,
        p_days: days
      });

      if (error) throw error;
      
      return data?.[0] || null;
    } catch (error: any) {
      console.error('Error fetching report statistics:', error);
      return null;
    }
  }

  // Real-time subscriptions
  subscribeToReportUpdates(userId: string, callback: (report: LPReport) => void) {
    return supabase
      .channel('lp-reports-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lp_reports',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const updatedReport = payload.new as any;
          callback({
            id: updatedReport.id,
            template_id: updatedReport.template_id,
            report_title: updatedReport.report_title,
            report_period_start: updatedReport.report_period_start,
            report_period_end: updatedReport.report_period_end,
            property_ids: updatedReport.property_ids || [],
            report_data: updatedReport.report_data || {},
            ai_summary: updatedReport.ai_summary,
            generation_status: updatedReport.generation_status,
            pdf_storage_path: updatedReport.pdf_storage_path,
            error_message: updatedReport.error_message,
            generated_at: updatedReport.generated_at,
            email_sent_at: updatedReport.email_sent_at,
            download_count: updatedReport.download_count || 0,
            file_size_bytes: updatedReport.file_size_bytes,
            created_at: updatedReport.created_at
          });
        }
      )
      .subscribe();
  }

  // Default report sections
  getDefaultReportSections(): ReportSection[] {
    return [
      {
        id: 'executive_summary',
        name: 'Executive Summary',
        type: 'executive_summary',
        enabled: true,
        config: {
          include_ai_insights: true,
          include_key_metrics: true,
          include_highlights: true
        }
      },
      {
        id: 'financial_performance',
        name: 'Financial Performance',
        type: 'financial_performance',
        enabled: true,
        config: {
          include_revenue_charts: true,
          include_expense_breakdown: true,
          include_noi_trends: true,
          include_cash_flow: true
        }
      },
      {
        id: 'property_updates',
        name: 'Property Updates',
        type: 'property_updates',
        enabled: true,
        config: {
          include_occupancy_rates: true,
          include_maintenance_updates: true,
          include_lease_activity: true,
          include_property_photos: false
        }
      },
      {
        id: 'market_analysis',
        name: 'Market Analysis',
        type: 'market_analysis',
        enabled: false,
        config: {
          include_market_trends: true,
          include_comp_analysis: true,
          include_economic_indicators: true
        }
      },
      {
        id: 'distributions',
        name: 'Distributions',
        type: 'distributions',
        enabled: true,
        config: {
          include_distribution_history: true,
          include_projected_distributions: true,
          include_tax_implications: false
        }
      },
      {
        id: 'future_outlook',
        name: 'Future Outlook',
        type: 'future_outlook',
        enabled: true,
        config: {
          include_projections: true,
          include_planned_improvements: true,
          include_market_outlook: true
        }
      }
    ];
  }
}

export const lpReportService = new LPReportService();
