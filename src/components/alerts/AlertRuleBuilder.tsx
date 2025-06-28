
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Eye, Save, TestTube } from 'lucide-react';

interface AlertRule {
  id?: string;
  rule_name: string;
  description?: string;
  kpi_type: string;
  property_ids: string[];
  threshold_green_min?: number;
  threshold_green_max?: number;
  threshold_yellow_min?: number;
  threshold_yellow_max?: number;
  threshold_red_min?: number;
  threshold_red_max?: number;
  alert_frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  notification_channels: string[];
  is_active: boolean;
  conditions?: any;
}

interface AlertRuleBuilderProps {
  rule?: AlertRule;
  onSave: (rule: AlertRule) => Promise<boolean>;
  onCancel: () => void;
  onPreview: (rule: AlertRule, sampleValue: number) => any;
}

const AlertRuleBuilder: React.FC<AlertRuleBuilderProps> = ({
  rule,
  onSave,
  onCancel,
  onPreview
}) => {
  const [formData, setFormData] = useState<AlertRule>({
    rule_name: '',
    description: '',
    kpi_type: 'occupancy',
    property_ids: [],
    threshold_red_min: undefined,
    threshold_red_max: undefined,
    threshold_yellow_min: undefined,
    threshold_yellow_max: undefined,
    threshold_green_min: undefined,
    threshold_green_max: undefined,
    alert_frequency: 'immediate',
    notification_channels: ['dashboard'],
    is_active: true,
    ...rule
  });

  const [testValue, setTestValue] = useState<number>(85);
  const [previewResult, setPreviewResult] = useState<any>(null);

  const kpiTypes = [
    { value: 'occupancy', label: 'Occupancy Rate (%)' },
    { value: 'noi', label: 'Net Operating Income ($)' },
    { value: 'collections', label: 'Rent Collections (%)' },
    { value: 'maintenance_costs', label: 'Maintenance Costs ($)' },
    { value: 'leasing_velocity', label: 'Leasing Velocity (days)' },
    { value: 'turnover_rate', label: 'Turnover Rate (%)' },
    { value: 'delinquency', label: 'Delinquency Rate (%)' }
  ];

  const handlePreview = () => {
    const result = onPreview(formData, testValue);
    setPreviewResult(result);
  };

  const handleSave = async () => {
    const success = await onSave(formData);
    if (success) {
      onCancel();
    }
  };

  const handleNotificationChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notification_channels: checked
        ? [...prev.notification_channels, channel]
        : prev.notification_channels.filter(c => c !== channel)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {rule ? 'Edit Alert Rule' : 'Create Alert Rule'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rule_name">Rule Name</Label>
              <Input
                id="rule_name"
                value={formData.rule_name}
                onChange={(e) => setFormData(prev => ({ ...prev, rule_name: e.target.value }))}
                placeholder="e.g., Low Occupancy Alert"
                required
              />
            </div>
            <div>
              <Label htmlFor="kpi_type">KPI Type</Label>
              <Select
                value={formData.kpi_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, kpi_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kpiTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this alert monitors"
            />
          </div>

          <Separator />

          {/* Thresholds */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Alert Thresholds</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Green Thresholds */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-green-800">Green Zone (Normal)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Minimum</Label>
                    <Input
                      type="number"
                      value={formData.threshold_green_min || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        threshold_green_min: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>Maximum</Label>
                    <Input
                      type="number"
                      value={formData.threshold_green_max || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        threshold_green_max: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Optional"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Yellow Thresholds */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-yellow-800">Yellow Zone (Warning)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Minimum</Label>
                    <Input
                      type="number"
                      value={formData.threshold_yellow_min || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        threshold_yellow_min: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Warning threshold"
                    />
                  </div>
                  <div>
                    <Label>Maximum</Label>
                    <Input
                      type="number"
                      value={formData.threshold_yellow_max || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        threshold_yellow_max: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Warning threshold"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Red Thresholds */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-red-800">Red Zone (Critical)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Minimum</Label>
                    <Input
                      type="number"
                      value={formData.threshold_red_min || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        threshold_red_min: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Critical threshold"
                    />
                  </div>
                  <div>
                    <Label>Maximum</Label>
                    <Input
                      type="number"
                      value={formData.threshold_red_max || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        threshold_red_max: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Critical threshold"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Alert Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Alert Frequency</Label>
              <Select
                value={formData.alert_frequency}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, alert_frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notification Channels</Label>
              <div className="flex flex-col space-y-2 mt-2">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'email', label: 'Email' },
                  { id: 'sms', label: 'SMS' }
                ].map(channel => (
                  <div key={channel.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel.id}
                      checked={formData.notification_channels.includes(channel.id)}
                      onCheckedChange={(checked) => 
                        handleNotificationChannelChange(channel.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={channel.id}>{channel.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
            />
            <Label htmlFor="is_active">Enable this alert rule</Label>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Alert Logic Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Test Value</Label>
              <Input
                type="number"
                value={testValue}
                onChange={(e) => setTestValue(Number(e.target.value))}
                placeholder="Enter a test value"
              />
            </div>
            <Button onClick={handlePreview} variant="outline" className="mt-6">
              <TestTube className="h-4 w-4 mr-2" />
              Test Logic
            </Button>
          </div>

          {previewResult && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={
                  previewResult.level === 'red' ? 'destructive' :
                  previewResult.level === 'yellow' ? 'secondary' : 'default'
                }>
                  {previewResult.level.toUpperCase()}
                </Badge>
                <span className="font-medium">
                  {previewResult.wouldTrigger ? 'ALERT WOULD TRIGGER' : 'NO ALERT'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{previewResult.message}</p>
              
              <div className="text-xs text-gray-500">
                <p><strong>Logic:</strong> {previewResult.explanation.logic}</p>
                <p><strong>Test Value:</strong> {previewResult.explanation.value}</p>
                <div className="mt-2">
                  <strong>Thresholds:</strong>
                  <ul className="ml-4">
                    <li>Red: {previewResult.explanation.thresholds.red.min || 'none'} - {previewResult.explanation.thresholds.red.max || 'none'}</li>
                    <li>Yellow: {previewResult.explanation.thresholds.yellow.min || 'none'} - {previewResult.explanation.thresholds.yellow.max || 'none'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Alert Rule
        </Button>
      </div>
    </div>
  );
};

export default AlertRuleBuilder;
