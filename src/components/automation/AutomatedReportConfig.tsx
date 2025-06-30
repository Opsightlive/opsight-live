
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Mail, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AutomatedReportConfig {
  id?: string;
  report_type: string;
  report_name: string;
  enabled: boolean;
  schedule: string;
  email_recipients: string[];
  last_generated?: string;
}

const AutomatedReportConfig = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [configs, setConfigs] = useState<AutomatedReportConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const reportTypes = [
    { value: 'financial_summary', label: 'Financial Summary' },
    { value: 'occupancy_report', label: 'Occupancy Report' },
    { value: 'maintenance_summary', label: 'Maintenance Summary' },
    { value: 'kpi_dashboard', label: 'KPI Dashboard' },
    { value: 'red_flag_alerts', label: 'Red Flag Alerts' },
    { value: 'portfolio_overview', label: 'Portfolio Overview' }
  ];

  const scheduleOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  useEffect(() => {
    if (user) {
      loadConfigurations();
    }
  }, [user]);

  const loadConfigurations = async () => {
    try {
      // Load existing configurations from database
      const { data, error } = await supabase
        .from('automated_report_configs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // If no configs exist, create default ones
      if (!data || data.length === 0) {
        const defaultConfigs = reportTypes.map(type => ({
          report_type: type.value,
          report_name: type.label,
          enabled: false,
          schedule: 'weekly',
          email_recipients: []
        }));
        setConfigs(defaultConfigs);
      } else {
        setConfigs(data.map(config => ({
          id: config.id,
          report_type: config.report_type,
          report_name: config.report_name,
          enabled: config.enabled,
          schedule: config.schedule,
          email_recipients: config.email_recipients || [],
          last_generated: config.last_generated
        })));
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load report configurations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfiguration = async (config: AutomatedReportConfig) => {
    try {
      setIsSaving(true);

      const configData = {
        user_id: user?.id,
        report_type: config.report_type,
        report_name: config.report_name,
        enabled: config.enabled,
        schedule: config.schedule,
        email_recipients: config.email_recipients,
        settings: {
          auto_email: config.email_recipients.length > 0,
          format: 'pdf'
        }
      };

      if (config.id) {
        const { error } = await supabase
          .from('automated_report_configs')
          .update(configData)
          .eq('id', config.id)
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('automated_report_configs')
          .insert(configData)
          .select()
          .single();

        if (error) throw error;

        // Update local state with new ID
        setConfigs(prev => prev.map(c => 
          c.report_type === config.report_type 
            ? { ...c, id: data.id }
            : c
        ));
      }

      toast({
        title: "Configuration Saved",
        description: `${config.report_name} automation updated`,
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfig = (reportType: string, updates: Partial<AutomatedReportConfig>) => {
    setConfigs(prev => prev.map(config => 
      config.report_type === reportType 
        ? { ...config, ...updates }
        : config
    ));
  };

  const addEmailRecipient = (reportType: string, email: string) => {
    if (email && email.includes('@')) {
      updateConfig(reportType, {
        email_recipients: [...(configs.find(c => c.report_type === reportType)?.email_recipients || []), email]
      });
    }
  };

  const removeEmailRecipient = (reportType: string, email: string) => {
    const config = configs.find(c => c.report_type === reportType);
    if (config) {
      updateConfig(reportType, {
        email_recipients: config.email_recipients.filter(e => e !== email)
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Report Configuration</h2>
          <p className="text-gray-600 mt-2">Configure which reports to generate automatically</p>
        </div>
        <Button 
          onClick={() => configs.forEach(config => saveConfiguration(config))}
          disabled={isSaving}
        >
          <Settings className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid gap-6">
        {configs.map((config) => (
          <Card key={config.report_type}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{config.report_name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Automatically generate {config.report_name.toLowerCase()} reports
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => {
                    updateConfig(config.report_type, { enabled: checked });
                    saveConfiguration({ ...config, enabled: checked });
                  }}
                />
              </div>
            </CardHeader>

            {config.enabled && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Schedule</Label>
                    <Select 
                      value={config.schedule} 
                      onValueChange={(value) => updateConfig(config.report_type, { schedule: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Add Email Recipient</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="email@example.com"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const email = (e.target as HTMLInputElement).value;
                            addEmailRecipient(config.report_type, email);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                          if (input) {
                            addEmailRecipient(config.report_type, input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {config.email_recipients.length > 0 && (
                  <div>
                    <Label>Email Recipients</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {config.email_recipients.map((email, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <button
                            onClick={() => removeEmailRecipient(config.report_type, email)}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {config.last_generated && (
                  <div className="text-sm text-gray-600">
                    Last generated: {new Date(config.last_generated).toLocaleString()}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomatedReportConfig;
