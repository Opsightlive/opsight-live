import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, Send, History, Settings, Eye, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SMSAutomation = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    smsAlerts: true,
    redFlags: true,
    yellowFlags: true,
    escalationHours: '48'
  });
  const [messageTemplate, setMessageTemplate] = useState(
    'Opsight Alert – Greenview Apts\n\nRed Flag: Delinquency 8.24s\n\nAction: Reprice 2BPs, test art follow hip\n\n→View: opsightapp/flag 21204'
  );
  const { toast } = useToast();

  const logs = [
    { date: 'Jun 11', property: 'Greenview', channel: 'SMS', status: 'Delivered' },
    { date: 'Jun 10', property: 'Lakewood', channel: 'SMS', status: 'Delivered' },
    { date: 'Jun 9', property: 'Sunset Gardens', channel: 'SMS', status: 'Delivered' },
    { date: 'Jun 8', property: 'Cedar Point', channel: 'SMS', status: 'Failed' },
  ];

  const handleConfigChange = (key: string, value: boolean | string) => {
    setAlertConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "SMS automation settings have been updated successfully.",
    });
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleEditTemplate = () => {
    toast({
      title: "Template Editor",
      description: "Opening template editor...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">SMS Alert Automation Engine</h1>
          <p className="text-xl text-blue-100 max-w-3xl">Configure automated SMS alerts for red flag events and streamline property management communications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert Configuration */}
          <Card className="shadow-sm">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                SMS Alert Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms-alerts"
                    checked={alertConfig.smsAlerts}
                    onCheckedChange={(checked) => handleConfigChange('smsAlerts', checked)}
                  />
                  <Label htmlFor="sms-alerts" className="text-base font-medium">Enable SMS Alerts</Label>
                </div>

                <div className="pl-6 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Trigger SMS alerts for:</p>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="red-flags"
                      checked={alertConfig.redFlags}
                      onCheckedChange={(checked) => handleConfigChange('redFlags', checked)}
                    />
                    <Label htmlFor="red-flags">Red Flags</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="yellow-flags"
                      checked={alertConfig.yellowFlags}
                      onCheckedChange={(checked) => handleConfigChange('yellowFlags', checked)}
                    />
                    <Label htmlFor="yellow-flags">Yellow Flag (Monitor)</Label>
                  </div>
                </div>

                <div className="pt-4">
                  <Label className="text-sm font-medium text-gray-700">Escalate if no action in:</Label>
                  <div className="mt-2">
                    <Select 
                      value={alertConfig.escalationHours} 
                      onValueChange={(value) => handleConfigChange('escalationHours', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveConfig} className="w-full bg-blue-600 hover:bg-blue-700">
                Save Configuration
              </Button>
            </CardContent>
          </Card>

          {/* Preview Templates */}
          <Card className="shadow-sm">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Preview Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium text-blue-800">SMS Preview</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePreview}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>

                <div className="text-sm text-gray-700 mb-4">
                  <strong>Opsight Alert – Greenview Apts</strong><br />
                  Triggered a Red Flag:<br />
                  <strong>Red Flag: 9.2%</strong><br />
                  <br />
                  Action: Reprice 2BRs, restart follow-up<br />
                  <br />
                  → View: opsightapp/flag/21204
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditTemplate}
                  className="w-full"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit GP Message Template
                </Button>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Custom Message Template</Label>
                <Textarea
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Enter your custom SMS template..."
                  className="min-h-[100px]"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4 mr-2" />
                Send Test SMS
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Logs & History */}
        <Card className="shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-xl">
              <History className="h-6 w-6 mr-2" />
              SMS Logs & History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Property</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Channel</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{log.date}</td>
                      <td className="py-3 px-4">{log.property}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default">
                          {log.channel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={log.status === 'Delivered' ? 'default' : 'destructive'}
                          className={log.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* SMS Preview Modal - Custom iPhone Design */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
            <div className="bg-transparent p-4" onClick={(e) => e.stopPropagation()}>
              {/* iPhone Frame */}
              <div className="relative w-80 h-[600px] bg-black rounded-[60px] p-3">
                {/* iPhone Screen */}
                <div className="w-full h-full bg-white rounded-[50px] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-3 bg-white text-black text-sm font-medium">
                    <div>9:41</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 border border-black rounded-sm">
                        <div className="w-3 h-1 bg-black rounded-sm m-0.5"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages Header */}
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        O
                      </div>
                      <div>
                        <div className="font-semibold text-black">Opsight Alerts</div>
                        <div className="text-sm text-gray-500">Online</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages Content */}
                  <div className="flex-1 bg-white p-4 space-y-4">
                    {/* SMS Message Bubble */}
                    <div className="flex justify-start">
                      <div className="max-w-xs bg-gray-100 rounded-2xl rounded-bl-md p-3">
                        <div className="text-sm text-black leading-relaxed">
                          <div className="font-semibold mb-1">Opsight Alert – Greenview Apts</div>
                          <div className="mb-2">Red Flag: Delinquency 8.24%</div>
                          <div className="mb-2">Action: Reprice 2BRs, test art follow hip</div>
                          <div className="text-blue-500">→ View: opsightapp/flag/21204</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">2:34 PM</div>
                      </div>
                    </div>
                    
                    {/* Second Message */}
                    <div className="flex justify-start">
                      <div className="max-w-xs bg-gray-100 rounded-2xl rounded-bl-md p-3">
                        <div className="text-sm text-black leading-relaxed">
                          <div className="font-semibold mb-1">Opsight Alert – Lakewood</div>
                          <div className="mb-2">Yellow Flag: Occupancy 94.2%</div>
                          <div className="mb-2">Action: Monitor trends</div>
                          <div className="text-blue-500">→ View: opsightapp/flag/21205</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">3:15 PM</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Input Area */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                      <div className="flex-1 text-gray-500 text-sm">Message</div>
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 border-l-2 border-b-2 border-white transform rotate-45 -translate-x-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSAutomation;
