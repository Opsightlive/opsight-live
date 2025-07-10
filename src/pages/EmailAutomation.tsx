
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Save, X, Settings, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';

const EmailAutomation = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    enableEmailAlerts: true,
    senderEmail: 'opsight.com',
    priority: 'Normal',
    sendCopyTo: 'manager@example.com'
  });

  const [emailComposer, setEmailComposer] = useState({
    from: 'alerts@opsight.com',
    to: 'owner@example.com',
    subject: 'Delinquency Alert for Greenview Apartments',
    template: 'Red Flag',
    body: 'The delinquency rate at Greenview Apartments has exceeded 8% for May. Please review the account statuses and take necessary action.'
  });

  const [deliveryHistory] = useState([
    {
      date: 'Jun 11',
      property: 'Greenview Apts',
      recipient: 'Sarah Jones',
      status: 'Delivered',
      subject: 'Red Flag Alert'
    },
    {
      date: 'Jun 11',
      property: 'Greenwood Vilas',
      recipient: 'PM Team',
      status: 'Pending',
      subject: 'Monthly Report'
    },
    {
      date: 'Jun 09',
      property: 'Lakewood Lofts',
      recipient: 'Ops Manager',
      status: 'Failed',
      subject: 'Maintenance Alert'
    }
  ]);

  const handleSendEmail = async () => {
    console.log('Sending email:', emailComposer);
    
    // Use the existing email service
    try {
      const success = await emailService.sendDemoRequest({
        firstName: 'System',
        lastName: 'Alert',
        email: emailComposer.to,
        phone: '',
        company: 'OPSIGHT',
        properties: 'Property Alert',
        message: emailComposer.body,
        selectedDate: new Date(),
        selectedTime: new Date().toLocaleTimeString()
      });

      if (success) {
        toast({
          title: "Email Sent",
          description: `Email sent successfully to ${emailComposer.to}`,
        });
      }
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEmailComposer({
      from: 'alerts@opsight.com',
      to: 'owner@example.com',
      subject: '',
      template: 'Red Flag',
      body: ''
    });
    
    toast({
      title: "Email Cancelled",
      description: "Email composition has been cancelled",
    });
  };

  const handleSaveAsTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Email template has been saved successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">ADVANCED EMAIL COMPOSER + SETTINGS PANEL</h1>
          <p className="text-xl text-blue-100 max-w-3xl">Compose and manage automated email alerts for property management</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Composer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Composer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="from">From:</Label>
                <Input
                  id="from"
                  value={emailComposer.from}
                  onChange={(e) => setEmailComposer(prev => ({ ...prev, from: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="to">To:</Label>
                <Select 
                  value={emailComposer.to} 
                  onValueChange={(value) => setEmailComposer(prev => ({ ...prev, to: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner@example.com">owner@example.com</SelectItem>
                    <SelectItem value="manager@example.com">manager@example.com</SelectItem>
                    <SelectItem value="team@example.com">team@example.com</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject:</Label>
                <Input
                  id="subject"
                  value={emailComposer.subject}
                  onChange={(e) => setEmailComposer(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="template">Template:</Label>
                <Select 
                  value={emailComposer.template} 
                  onValueChange={(value) => setEmailComposer(prev => ({ ...prev, template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Red Flag">Red Flag</SelectItem>
                    <SelectItem value="Monthly Report">Monthly Report</SelectItem>
                    <SelectItem value="Maintenance Alert">Maintenance Alert</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="body">Message:</Label>
                <Textarea
                  id="body"
                  value={emailComposer.body}
                  onChange={(e) => setEmailComposer(prev => ({ ...prev, body: e.target.value }))}
                  rows={6}
                  placeholder="Enter your email message here..."
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSendEmail} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleSaveAsTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable Email Alerts */}
              <div className="flex items-center justify-between">
                <Label>Enable email alerts</Label>
                <Switch 
                  checked={emailSettings.enableEmailAlerts}
                  onCheckedChange={(checked) => 
                    setEmailSettings(prev => ({ ...prev, enableEmailAlerts: checked }))
                  }
                />
              </div>

              {/* Email Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Email Settings</h4>
                
                <div>
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input
                    id="senderEmail"
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, senderEmail: e.target.value }))}
                  />
                </div>
              </div>

              {/* Delivery Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Options</h4>
                
                <div>
                  <Label htmlFor="priority">Priority:</Label>
                  <Select 
                    value={emailSettings.priority} 
                    onValueChange={(value) => setEmailSettings(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sendCopyTo">Send Copy to</Label>
                  <Input
                    id="sendCopyTo"
                    value={emailSettings.sendCopyTo}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, sendCopyTo: e.target.value }))}
                  />
                </div>
              </div>

              {/* Default Templates */}
              <div className="space-y-4">
                <h4 className="font-medium">Default Templates</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Red Flag</span>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Monthly Report</span>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery History */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Property</th>
                    <th className="text-left p-2">Recipient</th>
                    <th className="text-left p-2">Subject</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.map((entry, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{entry.date}</td>
                      <td className="p-2">{entry.property}</td>
                      <td className="p-2">{entry.recipient}</td>
                      <td className="p-2">{entry.subject}</td>
                      <td className="p-2">{getStatusBadge(entry.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button variant="outline">View Report</Button>
              <Button variant="outline">Edit Template...</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailAutomation;
