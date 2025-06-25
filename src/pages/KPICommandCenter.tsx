
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Users, FileText, Send, CheckCircle } from 'lucide-react';

const KPICommandCenter = () => {
  const [activeTab, setActiveTab] = useState('leasing');

  const kpiData = {
    leasing: [
      { name: 'Physical Occupancy', value: '87%', target: '90%', status: 'warning', trend: 'down' },
      { name: 'Economic Occupancy', value: '85%', target: '88%', status: 'critical', trend: 'down' },
      { name: 'Average Days to Lease', value: '28 days', target: '21 days', status: 'warning', trend: 'up' },
      { name: 'Leasing Velocity', value: '12 units/month', target: '15 units/month', status: 'warning', trend: 'down' }
    ],
    collections: [
      { name: 'Collection Rate', value: '94%', target: '96%', status: 'warning', trend: 'down' },
      { name: 'Delinquency Rate', value: '6%', target: '4%', status: 'critical', trend: 'up' },
      { name: 'Average Collection Time', value: '8 days', target: '5 days', status: 'warning', trend: 'up' },
      { name: 'NSF Rate', value: '3%', target: '2%', status: 'warning', trend: 'up' }
    ],
    financials: [
      { name: 'NOI Margin', value: '68%', target: '72%', status: 'warning', trend: 'down' },
      { name: 'Operating Expense Ratio', value: '32%', target: '28%', status: 'critical', trend: 'up' },
      { name: 'Revenue per Unit', value: '$1,850', target: '$1,950', status: 'warning', trend: 'down' },
      { name: 'Maintenance Cost per Unit', value: '$180', target: '$150', status: 'warning', trend: 'up' }
    ],
    engagement: [
      { name: 'PM Response Time', value: '4.2 hrs', target: '2 hrs', status: 'critical', trend: 'up' },
      { name: 'Work Order Completion', value: '78%', target: '85%', status: 'warning', trend: 'down' },
      { name: 'Report Submission Rate', value: '85%', target: '100%', status: 'warning', trend: 'stable' },
      { name: 'Escalation Rate', value: '15%', target: '8%', status: 'critical', trend: 'up' }
    ]
  };

  const redFlagSummary = [
    { property: 'Sunset Gardens', flags: 3, severity: 'critical', lastUpdate: '2 hours ago' },
    { property: 'Park Vista', flags: 2, severity: 'warning', lastUpdate: '1 day ago' },
    { property: 'Metro Heights', flags: 1, severity: 'warning', lastUpdate: '3 hours ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <div className="h-4 w-4" />;
  };

  const renderKPICards = (kpis: any[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="opsight-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-black">{kpi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-black">{kpi.value}</span>
                {getTrendIcon(kpi.trend)}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Target: {kpi.target}</span>
                <Badge className={`${getStatusColor(kpi.status)} text-xs`}>
                  {kpi.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="text-xs">
                  View Trend
                </Button>
                <Button size="sm" className="opsight-button text-xs">
                  Resolve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">KPI Command Center</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-black">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="opsight-button">
            <Send className="h-4 w-4 mr-2" />
            Send to PM
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="leasing">Leasing</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="engagement">PM Engagement</TabsTrigger>
          <TabsTrigger value="summary">Red Flag Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="leasing" className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-black">Leasing Performance</h2>
          </div>
          {renderKPICards(kpiData.leasing)}
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-black">Collections Performance</h2>
          </div>
          {renderKPICards(kpiData.collections)}
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-black">Financial Performance</h2>
          </div>
          {renderKPICards(kpiData.financials)}
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-black">PM Engagement Metrics</h2>
          </div>
          {renderKPICards(kpiData.engagement)}
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-black">Red Flag Summary</h2>
          </div>
          
          <div className="grid gap-4">
            {redFlagSummary.map((item, index) => (
              <Card key={index} className="opsight-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-black">{item.property}</h3>
                      <p className="text-sm text-gray-600">Last update: {item.lastUpdate}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusColor(item.severity)}`}>
                        {item.flags} Active Flags
                      </Badge>
                      <Button size="sm" className="opsight-button">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KPICommandCenter;
