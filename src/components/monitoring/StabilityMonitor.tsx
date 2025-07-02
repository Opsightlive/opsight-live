
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useSystemStability } from '@/hooks/useSystemStability';

/**
 * Visual indicator of system stability - shows if functionality is preserved
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
          <span>System Stability Monitor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge variant={isStable ? "default" : "destructive"}>
            {isStable ? "All Systems Operational" : "Instability Detected"}
          </Badge>
          
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">Critical Features Status:</h4>
            <ul className="space-y-1">
              {criticalFeatures.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StabilityMonitor;
