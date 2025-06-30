
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAutomationScheduler = () => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Record<string, Date>>({});

  useEffect(() => {
    if (!user) return;

    // Start the automation scheduler
    const scheduleInterval = setInterval(async () => {
      await runScheduledTasks();
    }, 15 * 60 * 1000); // Run every 15 minutes

    // Run immediately on mount
    runScheduledTasks();

    return () => clearInterval(scheduleInterval);
  }, [user]);

  const runScheduledTasks = async () => {
    if (isRunning || !user) return;
    
    setIsRunning(true);
    console.log('Running scheduled automation tasks...');

    try {
      const now = new Date();
      
      // Check for documents to process
      await processDocuments();
      
      // Check for PM sync schedules
      await syncPMIntegrations();
      
      // Run red flag monitoring
      await monitorRedFlags();
      
      // Generate scheduled reports
      await generateScheduledReports();
      
      setLastRun(prev => ({
        ...prev,
        scheduler: now
      }));
      
    } catch (error) {
      console.error('Error in scheduled tasks:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const processDocuments = async () => {
    try {
      // Get pending documents
      const { data: pendingDocs } = await supabase
        .from('documents')
        .select('*')
        .eq('processing_status', 'pending')
        .eq('user_id', user?.id);

      if (pendingDocs && pendingDocs.length > 0) {
        console.log(`Processing ${pendingDocs.length} pending documents`);
        
        for (const doc of pendingDocs) {
          try {
            const { error } = await supabase.functions.invoke('process-document', {
              body: { documentId: doc.id, userId: user?.id }
            });
            
            if (error) {
              console.error(`Error processing document ${doc.id}:`, error);
            } else {
              console.log(`Document ${doc.filename} processed successfully`);
            }
          } catch (error) {
            console.error(`Failed to process document ${doc.id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error in processDocuments:', error);
    }
  };

  const syncPMIntegrations = async () => {
    try {
      const { data: integrations } = await supabase
        .from('pm_integrations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('sync_status', 'active');

      if (integrations && integrations.length > 0) {
        for (const integration of integrations) {
          const shouldSync = checkSyncSchedule(integration);
          
          if (shouldSync) {
            console.log(`Syncing PM integration: ${integration.integration_name}`);
            
            try {
              const { error } = await supabase.functions.invoke('sync-pm-data', {
                body: { integrationId: integration.id, userId: user?.id }
              });
              
              if (error) {
                console.error(`Error syncing integration ${integration.id}:`, error);
              } else {
                console.log(`Integration ${integration.integration_name} synced successfully`);
              }
            } catch (error) {
              console.error(`Failed to sync integration ${integration.id}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in syncPMIntegrations:', error);
    }
  };

  const monitorRedFlags = async () => {
    try {
      console.log('Running red flag monitoring...');
      
      const { error } = await supabase.functions.invoke('red-flag-monitor', {
        body: { userId: user?.id, automated: true }
      });
      
      if (error) {
        console.error('Error in red flag monitoring:', error);
      } else {
        console.log('Red flag monitoring completed');
      }
    } catch (error) {
      console.error('Error in monitorRedFlags:', error);
    }
  };

  const generateScheduledReports = async () => {
    try {
      const now = new Date();
      const isReportTime = now.getHours() === 8 && now.getMinutes() < 15; // 8 AM daily
      
      if (isReportTime) {
        console.log('Generating scheduled reports...');
        
        const { error } = await supabase.functions.invoke('generate-lp-report', {
          body: { 
            userId: user?.id, 
            automated: true,
            reportType: 'daily'
          }
        });
        
        if (error) {
          console.error('Error generating scheduled report:', error);
        } else {
          console.log('Scheduled report generated successfully');
        }
      }
    } catch (error) {
      console.error('Error in generateScheduledReports:', error);
    }
  };

  const checkSyncSchedule = (integration: any) => {
    const now = new Date();
    const lastSync = integration.last_sync ? new Date(integration.last_sync) : new Date(0);
    const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    switch (integration.sync_frequency) {
      case 'hourly':
        return hoursSinceSync >= 1;
      case 'daily':
        return hoursSinceSync >= 24;
      case 'weekly':
        return hoursSinceSync >= 168;
      default:
        return false;
    }
  };

  const triggerManualSync = async (type: string) => {
    try {
      setIsRunning(true);
      
      switch (type) {
        case 'documents':
          await processDocuments();
          break;
        case 'pm_sync':
          await syncPMIntegrations();
          break;
        case 'red_flags':
          await monitorRedFlags();
          break;
        case 'reports':
          await generateScheduledReports();
          break;
        default:
          await runScheduledTasks();
      }
      
      toast.success(`Manual ${type} sync completed`);
    } catch (error) {
      console.error('Manual sync error:', error);
      toast.error(`Manual ${type} sync failed`);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    lastRun,
    triggerManualSync,
    runScheduledTasks
  };
};
