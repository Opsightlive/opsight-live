
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAutomationNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Listen for document processing completions
    const documentsChannel = supabase
      .channel('document-processing')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'documents',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const document = payload.new as any;
        if (document.processing_status === 'completed') {
          toast.success(`Document "${document.filename}" processed successfully!`);
        } else if (document.processing_status === 'error') {
          toast.error(`Failed to process "${document.filename}"`);
        }
      })
      .subscribe();

    // Listen for PM integration sync completions
    const pmChannel = supabase
      .channel('pm-integrations')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pm_integrations',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const integration = payload.new as any;
        if (integration.sync_status === 'active' && payload.old.sync_status === 'syncing') {
          toast.success(`${integration.integration_name} sync completed!`);
        }
      })
      .subscribe();

    // Listen for new KPI extractions
    const kpiChannel = supabase
      .channel('kpi-extractions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'extracted_kpis',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const kpi = payload.new as any;
        toast.success(`New KPI extracted: ${kpi.kpi_name} = ${kpi.kpi_value}`);
      })
      .subscribe();

    // Listen for processing job completions
    const jobsChannel = supabase
      .channel('processing-jobs')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'processing_jobs',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const job = payload.new as any;
        if (job.job_status === 'completed') {
          toast.success(`${job.job_type} automation completed successfully!`);
        } else if (job.job_status === 'failed') {
          toast.error(`${job.job_type} automation failed: ${job.error_message}`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(documentsChannel);
      supabase.removeChannel(pmChannel);
      supabase.removeChannel(kpiChannel);
      supabase.removeChannel(jobsChannel);
    };
  }, [user]);
};
