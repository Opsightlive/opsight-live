
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import StabilityMonitor from '@/components/monitoring/StabilityMonitor';
import { 
  Building2, 
  BarChart3,
  Database
} from 'lucide-react';

const Dashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* System Stability Monitor - enforces non-destructive changes */}
        <StabilityMonitor />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Connect your property management system to view your portfolio data.
            </p>
          </div>
        </div>

        {/* Integration Required Message */}
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Property Data Available</h3>
              <p className="text-gray-600 mb-6">
                To view your portfolio dashboard, you need to connect your property management system.
                This will automatically sync your property data, KPIs, and generate real-time insights.
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => window.location.href = '/data-integration'}>
                  <Database className="h-4 w-4 mr-2" />
                  Connect PM System
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/kpi-command-center'}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View KPI Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
