
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, WifiOff, Activity, User } from 'lucide-react';
import { useRealtimePMIntegration } from '@/hooks/useRealtimePMIntegration';
import { useAuth } from '@/contexts/AuthContext';

const RealtimePMIntegrationStatus: React.FC = () => {
  const { isListening } = useRealtimePMIntegration();
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">
                  Real-time Status
                </span>
              </div>
              <Badge variant="secondary">
                Not Authenticated
              </Badge>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Please log in to enable real-time integration updates
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isListening ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm font-medium">
                Real-time Status
              </span>
            </div>
            <Badge 
              variant={isListening ? "default" : "secondary"}
              className={isListening ? "bg-green-100 text-green-800" : ""}
            >
              {isListening ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          
          {isListening && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Activity className="h-3 w-3 animate-pulse" />
              <span>Live updates active</span>
            </div>
          )}
        </div>
        
        {isListening && (
          <div className="mt-2 text-xs text-gray-500">
            You'll receive instant notifications when integration status changes or new KPI data arrives
          </div>
        )}
        
        {!isListening && user && (
          <div className="mt-2 text-xs text-orange-600">
            Real-time connection not established - check console for details
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimePMIntegrationStatus;
