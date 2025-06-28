
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Zap, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeKPIs } from '@/hooks/useRealtimeKPIs';

const KPIDemoDataGenerator = () => {
  const { user } = useAuth();
  const { generateSampleData } = useRealtimeKPIs();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSampleData = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      await generateSampleData();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-blue-200 bg-blue-50/30">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Database className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl text-blue-900">KPI Demo Data</CardTitle>
        <p className="text-blue-700 text-sm">
          Generate sample KPI data to explore the dashboard features
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <BarChart3 className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <Badge variant="outline" className="text-xs">Leasing KPIs</Badge>
            <p className="text-xs text-gray-600 mt-1">Occupancy rates, lease renewals</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-2" />
            <Badge variant="outline" className="text-xs">Revenue KPIs</Badge>
            <p className="text-xs text-gray-600 mt-1">Rent revenue, collections</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Zap className="h-5 w-5 text-purple-600 mx-auto mb-2" />
            <Badge variant="outline" className="text-xs">Financial KPIs</Badge>
            <p className="text-xs text-gray-600 mt-1">Operating expenses, NOI</p>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateSampleData}
          disabled={isGenerating || !user}
          className="w-full"
          variant="outline"
        >
          {isGenerating ? (
            <>
              <Database className="h-4 w-4 mr-2 animate-spin" />
              Generating Sample Data...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Generate Sample KPI Data
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          This will create sample metrics across different categories to demonstrate the KPI Command Center functionality.
        </p>
      </CardContent>
    </Card>
  );
};

export default KPIDemoDataGenerator;
