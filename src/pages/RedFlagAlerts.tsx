
import React, { useState } from 'react';
import { AlertTriangle, Filter, Clock, Send, CheckCircle, Calendar, Plus, Eye, UserPlus, ChevronDown } from 'lucide-react';
import AIAdvisor from '../components/ai/AIAdvisor';
import SendToPMModal from '../components/modals/SendToPMModal';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const RedFlagAlerts = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
  const [sendToPMModal, setSendToPMModal] = useState<{isOpen: boolean, alertData?: any}>({isOpen: false});
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const alerts = [
    {
      id: 1,
      metric: "Collections Rate",
      property: "Oak Ridge Complex",
      severity: "critical" as const,
      value: "93.2%",
      threshold: "95%",
      daysActive: 3,
      category: "collections",
      description: "Collections rate has fallen below critical threshold",
      assignedPM: "Sarah Johnson",
      status: "active"
    },
    {
      id: 2,
      metric: "Physical Occupancy",
      property: "Cedar Point Villas", 
      severity: "warning" as const,
      value: "89.1%",
      threshold: "90%",
      daysActive: 1,
      category: "leasing",
      description: "Occupancy trending below target range",
      assignedPM: "Mike Torres",
      status: "active"
    },
    {
      id: 3,
      metric: "Days to Lease",
      property: "Meridian Apartments",
      severity: "critical" as const,
      value: "28 days",
      threshold: "20 days",
      daysActive: 5,
      category: "leasing", 
      description: "Leasing velocity significantly slower than target",
      assignedPM: "Lisa Chen",
      status: "active"
    },
    {
      id: 4,
      metric: "Work Order Response",
      property: "Sunset Gardens",
      severity: "warning" as const,
      value: "72 hours",
      threshold: "48 hours",
      daysActive: 2,
      category: "maintenance",
      description: "PM response time exceeding acceptable range",
      assignedPM: "David Kim",
      status: "active"
    }
  ];

  const forecastedAlerts = [
    {
      id: 5,
      metric: "Renewal Rate",
      property: "Oak Ridge Complex",
      severity: "warning" as const,
      currentValue: "78.5%",
      projectedValue: "74.2%",
      estimatedTrigger: "7 days",
      category: "leasing",
      description: "Renewal rate trending toward yellow threshold",
      recommendation: "Review renewal incentives and resident satisfaction"
    },
    {
      id: 6,
      metric: "Economic Occupancy", 
      property: "Cedar Point Villas",
      severity: "critical" as const,
      currentValue: "85.3%",
      projectedValue: "81.8%", 
      estimatedTrigger: "12 days",
      category: "leasing",
      description: "Economic occupancy projected to hit critical threshold",
      recommendation: "Immediate leasing campaign and pricing review required"
    }
  ];

  const handleAddProperty = () => {
    toast({
      title: "Add Property",
      description: "Property addition functionality coming soon",
    });
  };

  const handleSendToPM = (alert: any) => {
    setSendToPMModal({ 
      isOpen: true, 
      alertData: {
        metric: alert.metric,
        property: alert.property,
        value: alert.value,
        severity: alert.severity
      }
    });
  };

  const handleAssignTask = (alert: any) => {
    toast({
      title: "Task Assigned",
      description: `Task created for ${alert.metric} at ${alert.property} and assigned to ${alert.assignedPM}`,
    });
    console.log('Assigning task for alert:', alert);
  };

  const handleResolveAlert = (alertId: number, resolution?: string) => {
    setResolvedAlerts(prev => new Set([...prev, alertId]));
    toast({
      title: "Alert Resolved",
      description: resolution || `Alert ${alertId} has been marked as resolved`,
    });
    console.log(`Alert ${alertId} resolved with: ${resolution || 'Manual resolution'}`);
  };

  const handleViewDetails = (alert: any) => {
    toast({
      title: "Alert Details",
      description: `Viewing details for ${alert.metric} at ${alert.property}`,
    });
    console.log('Viewing alert details:', alert);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    toast({
      title: "Timeframe Updated",
      description: `Alert data filtered for ${timeframe}`,
    });
    console.log('Timeframe changed to:', timeframe);
  };

  const handleCreateActionPlan = (alert: any) => {
    toast({
      title: "Action Plan",
      description: `Creating action plan for ${alert.metric || alert.property}`,
    });
    console.log('Creating action plan for:', alert);
  };

  const handleMonitorAlert = (alert: any) => {
    toast({
      title: "Monitoring Alert",
      description: `Added ${alert.property} to monitoring list`,
    });
    console.log('Monitoring alert:', alert);
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    return (selectedSeverity === 'all' || alert.severity === selectedSeverity) &&
           (selectedProperty === 'all' || alert.property === selectedProperty) &&
           (selectedCategory === 'all' || alert.category === selectedCategory);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Red Flag Alert System</h1>
              <p className="text-xl text-blue-100 max-w-3xl">Monitor and resolve critical performance alerts across all properties with real-time insights and automated notifications</p>
            </div>
            
            {/* Navigation Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
                  Alert Views <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Active Red Flags
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="h-4 w-4 mr-2" />
                  Forecasted Alerts
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="h-4 w-4 mr-2" />
                  Alert Timeline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-6 mb-8 rounded-lg shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-base font-medium text-black">Property:</label>
              <select 
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="all">All Properties</option>
                <option value="Oak Ridge Complex">Oak Ridge Complex</option>
                <option value="Cedar Point Villas">Cedar Point Villas</option>
                <option value="Meridian Apartments">Meridian Apartments</option>
                <option value="Sunset Gardens">Sunset Gardens</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-base font-medium text-black">Category:</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="leasing">Leasing</option>
                <option value="collections">Collections</option>
                <option value="maintenance">Maintenance</option>
                <option value="financials">Financials</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-base font-medium text-black">Timeframe:</label>
              <select 
                value={selectedTimeframe}
                onChange={(e) => handleTimeframeChange(e.target.value)}
                className="border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
                <option value="1y">1 year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Active Red Flags ({filteredAlerts.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="space-y-4">
                <div className={`border-2 p-6 ${getSeverityColor(alert.severity)} ${resolvedAlerts.has(alert.id) ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityBadge(alert.severity)}`}>
                        {resolvedAlerts.has(alert.id) ? 'RESOLVED' : alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {alert.daysActive} days active
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-black mb-2">{alert.metric}</h3>
                  <p className="text-sm text-gray-600 mb-1">{alert.property}</p>
                  <p className="text-sm text-gray-700 mb-4">{alert.description}</p>

                  <div className="bg-white p-3 mb-4 border border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Value:</span>
                      <span className="font-medium text-black">{alert.value}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Threshold:</span>
                      <span className="font-medium text-black">{alert.threshold}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assigned PM:</span>
                      <span className="font-medium text-black">{alert.assignedPM}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-4">
                    <button 
                      onClick={() => handleSendToPM(alert)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                      disabled={resolvedAlerts.has(alert.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send to PM
                    </button>
                    <button 
                      onClick={() => handleAssignTask(alert)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 text-sm font-medium hover:bg-purple-700 flex items-center justify-center"
                      disabled={resolvedAlerts.has(alert.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Assign Task
                    </button>
                    <button 
                      onClick={() => handleResolveAlert(alert.id)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 text-sm font-medium hover:bg-green-700 flex items-center justify-center"
                      disabled={resolvedAlerts.has(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {resolvedAlerts.has(alert.id) ? 'Resolved' : 'Resolve'}
                    </button>
                  </div>

                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => handleViewDetails(alert)}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 text-sm font-medium hover:bg-gray-700 flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>

                  <button
                    onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 text-sm font-medium hover:bg-indigo-700 rounded"
                    disabled={resolvedAlerts.has(alert.id)}
                  >
                    {expandedAlert === alert.id ? 'Hide AI Advisor' : 'Get AI Advice & Resolution'}
                  </button>
                </div>

                {/* AI Advisor Component */}
                {expandedAlert === alert.id && !resolvedAlerts.has(alert.id) && (
                  <AIAdvisor 
                    alert={alert} 
                    onResolve={(resolution) => handleResolveAlert(alert.id, resolution)}
                    onCreateActionPlan={() => handleCreateActionPlan(alert)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Forecasted Alerts */}
        <div>
          <h2 className="text-lg font-semibold text-black mb-4">Forecasted Alerts ({forecastedAlerts.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {forecastedAlerts.map((alert) => (
              <div key={alert.id} className="bg-blue-50 border-2 border-blue-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityBadge(alert.severity)}`}>
                      FORECASTED
                    </span>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Est. trigger: {alert.estimatedTrigger}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-black mb-2">{alert.metric}</h3>
                <p className="text-sm text-gray-600 mb-1">{alert.property}</p>
                <p className="text-sm text-gray-700 mb-4">{alert.description}</p>

                <div className="bg-white p-3 mb-4 border border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-medium text-black">{alert.currentValue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Projected Value:</span>
                    <span className="font-medium text-red-600">{alert.projectedValue}</span>
                  </div>
                </div>

                <div className="bg-blue-100 p-3 mb-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">Recommended Action:</p>
                  <p className="text-sm text-blue-700">{alert.recommendation}</p>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleCreateActionPlan(alert)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 text-sm font-medium hover:bg-blue-700"
                  >
                    Create Action Plan
                  </button>
                  <button 
                    onClick={() => handleMonitorAlert(alert)}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 text-sm font-medium hover:bg-gray-700"
                  >
                    Monitor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SendToPMModal 
          isOpen={sendToPMModal.isOpen}
          onClose={() => setSendToPMModal({isOpen: false})}
          alertData={sendToPMModal.alertData}
        />
      </div>
    </div>
  );
};

export default RedFlagAlerts;
