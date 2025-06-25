
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const KPICommandCenter = () => {
  const [activeTab, setActiveTab] = useState('leasing');

  const tabs = [
    { id: 'leasing', name: 'Leasing', icon: TrendingUp },
    { id: 'collections', name: 'Collections', icon: CheckCircle },
    { id: 'financials', name: 'Financials', icon: TrendingUp },
    { id: 'pm-engagement', name: 'PM Engagement', icon: Clock },
    { id: 'red-flag-summary', name: 'Red Flag Summary', icon: AlertTriangle }
  ];

  const leasingKPIs = [
    {
      metric: "Physical Occupancy",
      current: 94.2,
      target: 95.0,
      threshold: { green: 95, yellow: 90, red: 85 },
      trend: "up",
      status: "yellow"
    },
    {
      metric: "Economic Occupancy", 
      current: 92.8,
      target: 94.0,
      threshold: { green: 94, yellow: 88, red: 82 },
      trend: "down",
      status: "yellow"
    },
    {
      metric: "Average Days to Lease",
      current: 18,
      target: 15,
      threshold: { green: 15, yellow: 20, red: 25 },
      trend: "up",
      status: "yellow"
    },
    {
      metric: "Renewal Rate",
      current: 76.5,
      target: 80.0,
      threshold: { green: 80, yellow: 75, red: 70 },
      trend: "down",
      status: "yellow"
    }
  ];

  const collectionsKPIs = [
    {
      metric: "Collections Rate",
      current: 96.8,
      target: 98.0,
      threshold: { green: 98, yellow: 95, red: 90 },
      trend: "up",
      status: "yellow"
    },
    {
      metric: "Past Due (30+ days)",
      current: 2.1,
      target: 1.5,
      threshold: { green: 1.5, yellow: 3.0, red: 5.0 },
      trend: "up",
      status: "yellow"
    },
    {
      metric: "Evictions Filed",
      current: 3,
      target: 2,
      threshold: { green: 2, yellow: 4, red: 6 },
      trend: "up",
      status: "yellow"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCurrentKPIs = () => {
    switch(activeTab) {
      case 'leasing': return leasingKPIs;
      case 'collections': return collectionsKPIs;
      default: return leasingKPIs;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">KPI Command Center</h1>
        <p className="text-gray-600">Monitor key performance indicators with real-time alerts</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getCurrentKPIs().map((kpi, index) => (
          <div key={index} className={`bg-white border-2 p-6 ${getStatusColor(kpi.status)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">{kpi.metric}</h3>
              <div className="flex items-center">
                {kpi.trend === 'up' ? (
                  <TrendingUp className={`h-4 w-4 ${kpi.status === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                ) : (
                  <TrendingDown className={`h-4 w-4 ${kpi.status === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-black">
                  {kpi.metric.includes('Rate') || kpi.metric.includes('Occupancy') ? `${kpi.current}%` : kpi.current}
                </p>
                <p className="ml-2 text-sm text-gray-600">
                  Target: {kpi.metric.includes('Rate') || kpi.metric.includes('Occupancy') ? `${kpi.target}%` : kpi.target}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Thresholds</span>
              </div>
              <div className="flex space-x-1">
                <div className="flex-1 bg-red-200 h-2"></div>
                <div className="flex-1 bg-yellow-200 h-2"></div>
                <div className="flex-1 bg-green-200 h-2"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>&lt;{kpi.threshold.red}</span>
                <span>{kpi.threshold.yellow}</span>
                <span>{kpi.threshold.green}+</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 text-xs font-medium hover:bg-blue-700">
                View Trend
              </button>
              {kpi.status !== 'green' && (
                <button className="flex-1 bg-red-600 text-white py-2 px-3 text-xs font-medium hover:bg-red-700">
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Red Flag Summary for this tab */}
      {activeTab === 'red-flag-summary' && (
        <div className="mt-8">
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">Active Red Flags</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-xs font-medium text-red-600">CRITICAL</span>
                  </div>
                  <h4 className="font-medium text-black mb-1">Collections Rate Below 95%</h4>
                  <p className="text-sm text-gray-600 mb-3">Oak Ridge Complex - 3 days active</p>
                  <button className="w-full bg-red-600 text-white py-2 px-3 text-xs font-medium">
                    Send to PM
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-600">WARNING</span>
                  </div>
                  <h4 className="font-medium text-black mb-1">Occupancy Below Target</h4>
                  <p className="text-sm text-gray-600 mb-3">Cedar Point Villas - 1 day active</p>
                  <button className="w-full bg-yellow-600 text-white py-2 px-3 text-xs font-medium">
                    Monitor
                  </button>
                </div>

                <div className="bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-xs font-medium text-red-600">CRITICAL</span>
                  </div>
                  <h4 className="font-medium text-black mb-1">Days to Lease > 25</h4>
                  <p className="text-sm text-gray-600 mb-3">Multiple Properties - 5 days active</p>
                  <button className="w-full bg-red-600 text-white py-2 px-3 text-xs font-medium">
                    Escalate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPICommandCenter;
