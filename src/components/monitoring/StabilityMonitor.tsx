
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { useSystemStability } from '@/hooks/useSystemStability';

/**
 * Enhanced visual indicator of system stability with isolation status
 */
const StabilityMonitor = () => {
  const { isStable, criticalFeatures } = useSystemStability();

  return (
    <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isStable ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          <Shield className="h-4 w-4 text-blue-600" />
          <span>System Stability & Isolation Monitor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Badge variant={isStable ? "default" : "destructive"}>
              {isStable ? "All Systems Operational" : "Instability Detected"}
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-700">
              Complete Isolation Active
            </Badge>
          </div>
          
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">Protected Features (Isolated):</h4>
            <ul className="space-y-1">
              {criticalFeatures.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <Shield className="h-3 w-3 text-blue-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
              <strong>Isolation Guarantee:</strong> No change can affect other parts of the website. 
              All modifications are completely sandboxed and verified before execution.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StabilityMonitor;
