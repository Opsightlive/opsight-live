
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, User, AlertTriangle } from 'lucide-react';

interface SendToPMModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertData?: {
    metric: string;
    property: string;
    value: string;
    severity?: string;
  };
  kpiData?: {
    metric: string;
    property: string;
    value: string;
    target?: string;
  };
}

const SendToPMModal: React.FC<SendToPMModalProps> = ({ isOpen, onClose, alertData, kpiData }) => {
  const [selectedPM, setSelectedPM] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const propertyManagers = [
    { id: 'sarah.johnson', name: 'Sarah Johnson', email: 'sarah.johnson@opsight.com' },
    { id: 'mike.torres', name: 'Mike Torres', email: 'mike.torres@opsight.com' },
    { id: 'lisa.chen', name: 'Lisa Chen', email: 'lisa.chen@opsight.com' },
    { id: 'david.kim', name: 'David Kim', email: 'david.kim@opsight.com' }
  ];

  React.useEffect(() => {
    if (isOpen) {
      if (alertData) {
        setSubject(`Alert: ${alertData.metric} - ${alertData.property}`);
        setMessage(`Alert Details:
Property: ${alertData.property}
Metric: ${alertData.metric}
Current Value: ${alertData.value}
${alertData.severity ? `Severity: ${alertData.severity}` : ''}

Please review and take appropriate action.`);
      } else if (kpiData) {
        setSubject(`KPI Review: ${kpiData.metric} - ${kpiData.property}`);
        setMessage(`KPI Performance Review:
Property: ${kpiData.property}
Metric: ${kpiData.metric}
Current Value: ${kpiData.value}
${kpiData.target ? `Target: ${kpiData.target}` : ''}

Please review performance and provide updates.`);
      }
    }
  }, [isOpen, alertData, kpiData]);

  const handleSend = async () => {
    if (!selectedPM || !subject.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const selectedPMData = propertyManagers.find(pm => pm.id === selectedPM);
    
    toast({
      title: "Message Sent Successfully",
      description: `Your message has been sent to ${selectedPMData?.name}.`
    });

    setIsLoading(false);
    onClose();
    
    // Reset form
    setSelectedPM('');
    setSubject('');
    setMessage('');
    setPriority('normal');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5 text-blue-600" />
            <span>Send to Property Manager</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="pm-select">Select Property Manager *</Label>
              <Select value={selectedPM} onValueChange={setSelectedPM}>
                <SelectTrigger id="pm-select">
                  <SelectValue placeholder="Choose a property manager" />
                </SelectTrigger>
                <SelectContent>
                  {propertyManagers.map((pm) => (
                    <SelectItem key={pm.id} value={pm.id}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{pm.name}</div>
                          <div className="text-sm text-gray-500">{pm.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={8}
              />
            </div>
          </div>

          {(alertData?.severity === 'critical' || priority === 'urgent') && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">High Priority Alert</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                This message will be marked as urgent and sent immediately.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendToPMModal;
