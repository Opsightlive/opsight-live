
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Save, Send, Mail, Phone, Bell } from 'lucide-react';
import { MessageTemplate } from '@/services/alertDeliveryService';

interface MessageTemplateEditorProps {
  template?: MessageTemplate;
  onSave: (template: MessageTemplate) => Promise<boolean>;
  onCancel: () => void;
  onPreview: (template: MessageTemplate, sampleData: Record<string, any>) => Promise<any>;
  onTest: (template: MessageTemplate, recipient: string, testData: Record<string, any>) => Promise<boolean>;
  availableVariables: Record<string, string>;
}

const MessageTemplateEditor: React.FC<MessageTemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  onPreview,
  onTest,
  availableVariables
}) => {
  const [formData, setFormData] = useState<MessageTemplate>({
    template_name: '',
    template_type: 'email',
    subject: '',
    message_content: '',
    variables: {},
    is_active: true,
    ...template
  });

  const [testRecipient, setTestRecipient] = useState('');
  const [previewResult, setPreviewResult] = useState<any>(null);

  const sampleData = {
    property_name: 'Sunset Apartments',
    alert_level: 'red',
    metric_name: 'Occupancy Rate',
    metric_value: '78%',
    target_value: '95%',
    change_percentage: '-5.2%',
    alert_message: 'Occupancy rate has dropped below target threshold',
    user_name: 'John Doe',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  const handlePreview = async () => {
    const result = await onPreview(formData, sampleData);
    setPreviewResult(result);
  };

  const handleTest = async () => {
    if (!testRecipient) return;
    await onTest(formData, testRecipient, sampleData);
  };

  const handleSave = async () => {
    const success = await onSave(formData);
    if (success) {
      onCancel();
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('message_content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = formData.message_content;
      const newContent = content.slice(0, start) + `{{${variable}}}` + content.slice(end);
      
      setFormData(prev => ({
        ...prev,
        message_content: newContent
      }));
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length + 4;
        textarea.focus();
      }, 0);
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTemplateIcon(formData.template_type)}
            {template ? 'Edit Message Template' : 'Create Message Template'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template_name">Template Name</Label>
              <Input
                id="template_name"
                value={formData.template_name}
                onChange={(e) => setFormData(prev => ({ ...prev, template_name: e.target.value }))}
                placeholder="e.g., Critical Alert Email"
                required
              />
            </div>
            <div>
              <Label htmlFor="template_type">Template Type</Label>
              <Select
                value={formData.template_type}
                onValueChange={(value: 'email' | 'sms' | 'push') => 
                  setFormData(prev => ({ ...prev, template_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value="push">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Push Notification
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject Line (Email Only) */}
          {formData.template_type === 'email' && (
            <div>
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={formData.subject || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Alert: {{metric_name}} - {{property_name}}"
              />
            </div>
          )}

          {/* Message Content */}
          <div>
            <Label htmlFor="message_content">Message Content</Label>
            <Textarea
              id="message_content"
              value={formData.message_content}
              onChange={(e) => setFormData(prev => ({ ...prev, message_content: e.target.value }))}
              placeholder="Enter your message template here..."
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Available Variables */}
          <div>
            <Label>Available Variables</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(availableVariables).map(([variable, description]) => (
                <Badge
                  key={variable}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => insertVariable(variable)}
                  title={description}
                >
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Click on a variable to insert it into your message
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Template is active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Template Preview & Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handlePreview} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Template
            </Button>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder={formData.template_type === 'email' ? 'test@example.com' : '+1234567890'}
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
              />
              <Button 
                onClick={handleTest} 
                disabled={!testRecipient}
                variant="outline"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Test
              </Button>
            </div>
          </div>

          {previewResult && (
            <div className="border rounded-lg p-4 bg-gray-50">
              {previewResult.subject && (
                <div className="mb-3">
                  <Label className="text-sm font-medium">Subject:</Label>
                  <p className="text-sm font-semibold">{previewResult.subject}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Message:</Label>
                <div className="mt-1 p-3 bg-white border rounded text-sm whitespace-pre-wrap">
                  {previewResult.content}
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
          Save Template
        </Button>
      </div>
    </div>
  );
};

export default MessageTemplateEditor;
