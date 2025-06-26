
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, AlertTriangle, Building2, DollarSign, Users, Calendar, Send } from 'lucide-react';
import SendToPMModal from '@/components/modals/SendToPMModal';

const KPICommandCenter = () => {
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [sendToPMModal, setSendToPMModal] = useState<{isOpen: boolean, kpiData?: any}>({isOpen: false});

  const handleSendToPM = (kpiData: any) => {
    setSendToPMModal({ isOpen: true, kpiData });
  };

  const properties = [
    {
      name: "Oak Ridge Complex",
      kpis: [
        { metric: "Physical Occupancy", value: "94.5%", target: "95%", status: "warning", trend: "down", change: "-1.2%" },
        { metric: "Economic Occupancy", value: "91.8%", target: "93%", status: "critical", trend: "down", change: "-2.1%" },
        { metric: "Collections Rate", value: "96.7%", target: "95%", status: "good", trend: "up", change: "+0.8%" },
        { metric: "Average Rent", value: "$1,847", target: "$1,800", status: "good", trend: "up", change: "+2.6%" }
      ]
    },
    {
      name: "Cedar Point Villas",
      kpis: [
        { metric: "Physical Occupancy", value: "89.1%", target: "90%", status: "warning", trend: "down", change: "-0.9%" },
        { metric: "Economic Occupancy", value: "86.3%", target: "87%", status: "warning", trend: "down", change: "-1.7%" },
        { metric: "Collections Rate", value: "94.2%", target: "95%", status: "warning", trend: "down", change: "-0.8%" },
        { metric: "Average Rent", value: "$1,654", target: "$1,600", status: "good", trend: "up", change: "+3.4%" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="p-6">
      {/* Enhanced Header with more height */}
      <div className="mb-8 py-8 px-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <h1 className="text-4xl font-bold text-black mb-4">KPI Command Center</h1>
        <p className="text-lg text-gray-700 max-w-2xl">Monitor key performance indicators across all properties with real-time insights and actionable alerts</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-6 mb-8 rounded-lg shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <label className="text-base font-medium text-black">Property:</label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="oak-ridge">Oak Ridge Complex</SelectItem>
                <SelectItem value="cedar-point">Cedar Point Villas</SelectItem>
                <SelectItem value="meridian">Meridian Apartments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-base font-medium text-black">Timeframe:</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Property KPI Cards */}
      <div className="space-y-8">
        {properties.map((property) => (
          <Card key={property.name} className="border-2 border-gray-200">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span>{property.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {property.kpis.map((kpi, index) => (
                  <div key={index} className={`p-4 border-2 rounded-lg ${getStatusColor(kpi.status)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-sm">{kpi.metric}</h3>
                        <div className="text-2xl font-bold mt-1">{kpi.value}</div>
                        <div className="text-sm text-gray-600">Target: {kpi.target}</div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {getTrendIcon(kpi.trend)}
                        <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Badge className={`text-xs ${kpi.status === 'good' ? 'bg-green-600' : kpi.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'} text-white`}>
                        {kpi.status.toUpperCase()}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSendToPM({
                          metric: kpi.metric,
                          property: property.name,
                          value: kpi.value,
                          target: kpi.target
                        })}
                        className="text-xs h-7"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send to PM
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Summary */}
      <Card className="mt-8 border-2 border-blue-200">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">$94.2K</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
              <div className="text-xs text-green-600 mt-1">+5.8% vs last month</div>
            </div>
            
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">91.8%</div>
              <div className="text-sm text-gray-600">Avg Occupancy</div>
              <div className="text-xs text-yellow-600 mt-1">-1.5% vs target</div>
            </div>
            
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">95.5%</div>
              <div className="text-sm text-gray-600">Avg Collections</div>
              <div className="text-xs text-green-600 mt-1">+0.5% vs target</div>
            </div>
            
            <div className="text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">23</div>
              <div className="text-sm text-gray-600">Avg Days to Lease</div>
              <div className="text-xs text-red-600 mt-1">+3 days vs target</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SendToPMModal 
        isOpen={sendToPMModal.isOpen}
        onClose={() => setSendToPMModal({isOpen: false})}
        kpiData={sendToPMModal.kpiData}
      />
    </div>
  );
};

export default KPICommandCenter;
