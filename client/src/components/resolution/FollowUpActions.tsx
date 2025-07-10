
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Phone, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FollowUpActionsProps {
  resolution: {
    id: string;
    property: string;
    issue: string;
    assignedPM: string;
    status: string;
  };
}

const FollowUpActions: React.FC<FollowUpActionsProps> = ({ resolution }) => {
  const { toast } = useToast();

  const handleSendToPM = () => {
    toast({
      title: "Message Sent",
      description: `Follow-up message sent to ${resolution.assignedPM}`,
    });
  };

  const handleScheduleCall = () => {
    toast({
      title: "Call Scheduled",
      description: `Call scheduled with ${resolution.assignedPM} for tomorrow at 2 PM`,
    });
  };

  const handleCreateReport = () => {
    toast({
      title: "Report Created",
      description: `Follow-up report generated for ${resolution.property}`,
    });
  };

  const handleEscalate = () => {
    toast({
      title: "Issue Escalated",
      description: `${resolution.issue} has been escalated to senior management`,
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Follow-Up Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendToPM}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send to PM
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleScheduleCall}
            className="flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Schedule Call
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateReport}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Create Report
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleEscalate}
            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <AlertCircle className="h-4 w-4" />
            Escalate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowUpActions;
