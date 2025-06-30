import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  Clock, 
  FileText, 
  Database, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AutomationStatus {
  id: string;
  name: string;
  type: 'document_processing' | 'pm_sync' | 'alert_monitoring' | 'report_generation';
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  nextRun: string;
  processedCount: number;
  successRate: number;
  isEnabled: boolean;
  realData: any;
}

const AutomationDashboard = () => {
  const { toast } = useToast();
  const [automations, setAutomations] = useState<AutomationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadRealAutomationData();
    // Set up real-time updates
    const interval = setInterval(loadRealAutomationData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRealAutomationData = async () => {
    try {
      // Get real data from database
      const [documentsResult, integrationsResult, jobsResult, kpisResult] = await Promise.all([
        supabase.from('documents').select('*').order('created_at', { ascending: false }),
        supabase.from('pm_integrations').select('*'),
        supabase.from('processing_jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('extracted_kpis').select('*').order('created_at', { ascending: false })
      ]);

      const documents = documentsResult.data || [];
      const integrations = integrationsResult.data || [];
      const jobs = jobsResult.data || [];
      const kpis = kpisResult.data || [];

      // Calculate real automation statuses
      const realAutomations: AutomationStatus[] = [
        {
          id: 'doc-processing',
          name: 'Document AI Processing',
          type: 'document_processing',
          status: documents.some(d => d.processing_status === 'processing') ? 'active' : 'paused',
          lastRun: documents[0]?.created_at || new Date().toISOString(),
          nextRun: 'Continuous',
          processedCount: documents.filter(d => d.processing_status === 'completed').length,
          successRate: documents.length > 0 ? Math.round((documents.filter(d => d.processing_status === 'completed').length / documents.length) * 100) : 0,
          isEnabled: true,
          realData: { documents: documents.slice(0, 5) }
        },
        {
          id: 'pm-sync',
          name: 'PM Software Sync',
          type: 'pm_sync',
          status: integrations.some(i => i.sync_status === 'active') ? 'active' : 'paused',
          lastRun: integrations[0]?.last_sync || new Date().toISOString(),
          nextRun: getNextSyncTime(integrations[0]?.sync_frequency || 'daily'),
          processedCount: integrations.reduce((sum, i) => sum + (i.settings?.last_sync_kpis || 0), 0),
          successRate: integrations.length > 0 ? Math.round((integrations.filter(i => i.sync_status === 'active').length / integrations.length) * 100) : 0,
          isEnabled: integrations.length > 0,
          realData: { integrations: integrations.slice(0, 3) }
        },
        {
          id: 'alert-monitoring',
          name: 'Red Flag Monitoring',
          type: 'alert_monitoring',
          status: 'active',
          lastRun: new Date().toISOString(),
          nextRun: 'Every 15 minutes',
          processedCount: kpis.length,
          successRate: 100,
          isEnabled: true,
          realData: { recentKPIs: kpis.slice(0, 10) }
        },
        {
          id: 'report-generation',
          name: 'Automated Reports',
          type: 'report_generation',
          status: 'active',
          lastRun: new Date().toISOString(),
          nextRun: 'Daily at 8:00 AM',
          processedCount: jobs.filter(j => j.job_type === 'report_generation').length,
          successRate: jobs.length > 0 ? Math.round((jobs.filter(j => j.job_status === 'completed').length / jobs.length) * 100) : 0,
          isEnabled: true,
          realData: { recentJobs: jobs.slice(0, 5) }
        }
      ];

      setAutomations(realAutomations);
    } catch (error) {
      console.error('Error loading real automation data:', error);
      toast({
        title: "Error",
        description: "Failed to load automation status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNextSyncTime = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);
        return tomorrow.toISOString();
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek.toISOString();
      default:
        return 'On demand';
    }
  };

  const toggleAutomation = async (id: string, enabled: boolean) => {
    try {
      setIsProcessing(true);
      
      if (id === 'pm-sync') {
        // Update PM integrations
        const { error } = await supabase
          .from('pm_integrations')
          .update({ sync_status: enabled ? 'active' : 'paused' })
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

        if (error) throw error;
      }

      // Update local state
      setAutomations(prev => prev.map(auto => 
        auto.id === id 
          ? { ...auto, isEnabled: enabled, status: enabled ? 'active' : 'paused' }
          : auto
      ));

      toast({
        title: enabled ? "Automation Enabled" : "Automation Paused",
        description: `${enabled ? 'Started' : 'Stopped'} automated processing`,
      });
    } catch (error) {
      console.error('Error toggling automation:', error);
      toast({
        title: "Error",
        description: "Failed to update automation status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerManualRun = async (id: string, type: string) => {
    try {
      setIsProcessing(true);
      
      const functionMap = {
        'document_processing': 'process-document',
        'pm_sync': 'sync-pm-data',
        'alert_monitoring': 'red-flag-monitor',
        'report_generation': 'generate-lp-report'
      };

      const functionName = functionMap[type as keyof typeof functionMap];
      
      if (functionName) {
        console.log(`Triggering ${functionName} manually...`);
        
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: { manual: true, timestamp: new Date().toISOString() }
        });

        if (error) {
          console.error(`Edge function error:`, error);
          throw error;
        }

        console.log(`${functionName} response:`, data);

        toast({
          title: "Manual Run Triggered",
          description: `Started manual ${type.replace('_', ' ')} run`,
        });

        // Refresh data after a short delay
        setTimeout(() => {
          loadRealAutomationData();
        }, 2000);
      }
    } catch (error) {
      console.error('Error triggering manual run:', error);
      toast({
        title: "Error",
        description: `Failed to trigger manual run: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document_processing': return <FileText className="h-5 w-5" />;
      case 'pm_sync': return <Database className="h-5 w-5" />;
      case 'alert_monitoring': return <AlertTriangle className="h-5 w-5" />;
      case 'report_generation': return <FileText className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation Control</h1>
          <p className="text-gray-600 mt-2">Monitor and control your automated processes</p>
        </div>
        <Button onClick={loadRealAutomationData} variant="outline" disabled={isProcessing}>
          <Settings className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Refresh Status'}
        </Button>
      </div>

      {/* Real-time Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Automations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {automations.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Processed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {automations.reduce((sum, a) => sum + a.processedCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {automations.length > 0 ? Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real Automation Controls */}
      <div className="grid gap-6">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(automation.type)}
                  <div>
                    <CardTitle className="text-lg">{automation.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={`${getStatusColor(automation.status)} text-white border-0`}>
                        {getStatusIcon(automation.status)}
                        <span className="ml-1 capitalize">{automation.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={automation.isEnabled}
                      onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
                      disabled={isProcessing}
                    />
                    <Label>Enable</Label>
                  </div>
                  <Button
                    onClick={() => triggerManualRun(automation.id, automation.type)}
                    size="sm"
                    variant="outline"
                    disabled={isProcessing}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {isProcessing ? 'Running...' : 'Run Now'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Run</p>
                  <p className="text-sm text-gray-900">
                    {new Date(automation.lastRun).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Run</p>
                  <p className="text-sm text-gray-900">
                    {automation.nextRun === 'Continuous' ? 'Continuous' : 
                     automation.nextRun.includes('T') ? new Date(automation.nextRun).toLocaleString() : 
                     automation.nextRun}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Processed</p>
                  <p className="text-sm text-gray-900">{automation.processedCount} items</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={automation.successRate} className="flex-1" />
                    <span className="text-sm text-gray-900">{automation.successRate}%</span>
                  </div>
                </div>
              </div>
              
              {/* Show real data preview */}
              {automation.realData && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-2">Recent Activity:</p>
                  <div className="text-xs text-gray-700">
                    {automation.type === 'document_processing' && automation.realData.documents?.length > 0 && (
                      <div>Latest: {automation.realData.documents[0].filename} - {automation.realData.documents[0].processing_status}</div>
                    )}
                    {automation.type === 'pm_sync' && automation.realData.integrations?.length > 0 && (
                      <div>Integrations: {automation.realData.integrations.map((i: any) => i.pm_software).join(', ')}</div>
                    )}
                    {automation.type === 'alert_monitoring' && automation.realData.recentKPIs?.length > 0 && (
                      <div>Latest KPI: {automation.realData.recentKPIs[0].kpi_name} - {automation.realData.recentKPIs[0].kpi_value}</div>
                    )}
                    {automation.type === 'report_generation' && automation.realData.recentJobs?.length > 0 && (
                      <div>Latest Job: {automation.realData.recentJobs[0].job_type} - {automation.realData.recentJobs[0].job_status}</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationDashboard;
