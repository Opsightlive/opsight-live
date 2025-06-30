
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
}

const AutomationDashboard = () => {
  const { toast } = useToast();
  const [automations, setAutomations] = useState<AutomationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    try {
      // Load automation statuses from processing_jobs and pm_integrations
      const { data: jobs } = await supabase
        .from('processing_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: integrations } = await supabase
        .from('pm_integrations')
        .select('*');

      // Mock automation data based on actual system
      const mockAutomations: AutomationStatus[] = [
        {
          id: 'doc-processing',
          name: 'Document AI Processing',
          type: 'document_processing',
          status: 'active',
          lastRun: '2024-01-15T10:30:00Z',
          nextRun: 'Continuous',
          processedCount: jobs?.length || 0,
          successRate: 95,
          isEnabled: true
        },
        {
          id: 'pm-sync',
          name: 'PM Software Sync',
          type: 'pm_sync',
          status: integrations?.length ? 'active' : 'paused',
          lastRun: '2024-01-15T09:00:00Z',
          nextRun: '2024-01-15T12:00:00Z',
          processedCount: 47,
          successRate: 98,
          isEnabled: integrations?.length > 0
        },
        {
          id: 'alert-monitoring',
          name: 'Red Flag Monitoring',
          type: 'alert_monitoring',
          status: 'active',
          lastRun: '2024-01-15T10:45:00Z',
          nextRun: '2024-01-15T11:00:00Z',
          processedCount: 156,
          successRate: 100,
          isEnabled: true
        },
        {
          id: 'report-generation',
          name: 'Automated Reports',
          type: 'report_generation',
          status: 'active',
          lastRun: '2024-01-15T08:00:00Z',
          nextRun: '2024-01-16T08:00:00Z',
          processedCount: 12,
          successRate: 92,
          isEnabled: true
        }
      ];

      setAutomations(mockAutomations);
    } catch (error) {
      console.error('Error loading automations:', error);
      toast({
        title: "Error",
        description: "Failed to load automation status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutomation = async (id: string, enabled: boolean) => {
    try {
      // Update automation status
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
    }
  };

  const triggerManualRun = async (id: string, type: string) => {
    try {
      // Trigger the appropriate edge function
      const functionMap = {
        'document_processing': 'process-document',
        'pm_sync': 'sync-pm-data',
        'alert_monitoring': 'red-flag-monitor',
        'report_generation': 'generate-lp-report'
      };

      const functionName = functionMap[type as keyof typeof functionMap];
      
      if (functionName) {
        await supabase.functions.invoke(functionName, {
          body: { manual: true }
        });

        toast({
          title: "Manual Run Triggered",
          description: `Started manual ${type.replace('_', ' ')} run`,
        });

        // Refresh data
        await loadAutomations();
      }
    } catch (error) {
      console.error('Error triggering manual run:', error);
      toast({
        title: "Error",
        description: "Failed to trigger manual run",
        variant: "destructive",
      });
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
        <Button onClick={loadAutomations} variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Overview Cards */}
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
                  {Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Controls */}
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
                    />
                    <Label>Enable</Label>
                  </div>
                  <Button
                    onClick={() => triggerManualRun(automation.id, automation.type)}
                    size="sm"
                    variant="outline"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run Now
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
                  <p className="text-sm text-gray-900">{automation.nextRun}</p>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationDashboard;
