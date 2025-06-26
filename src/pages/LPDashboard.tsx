import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Building2, DollarSign, Users, Calendar, Download, BarChart3, PiggyBank, Target, Clock } from 'lucide-react';

const LPDashboard = () => {
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const portfolioSummary = {
    totalValue: 47200000,
    monthlyRevenue: 394200,
    averageOccupancy: 91.8,
    totalUnits: 847,
    occupiedUnits: 777,
    portfolioGrowth: 5.8
  };

  const distributionsData = {
    recordedDistributions: {
      ytd: 2847500,
      lastQuarter: 698750,
      totalToDate: 12450000
    },
    projectedDistributions: {
      nextQuarter: 725000,
      yearEnd: 3200000,
      nextYear: 3850000
    },
    distributionYield: 8.2,
    irr: 14.7,
    equityMultiple: 1.43,
    cashOnCashReturn: 12.1
  };

  const properties = [
    {
      name: "Greenview Apartments",
      occupancy: 91,
      economicOccupancy: 86,
      collections: 92,
      workOrderCompletion: 96,
      status: "good",
      trend: "up",
      commentary: "During May, renewals and conversions improved while collections slightly dipped. All flagged issues were resolved within 3 days."
    },
    {
      name: "Oakwood Commons", 
      occupancy: 88,
      economicOccupancy: 84,
      collections: 89,
      workOrderCompletion: 94,
      status: "warning",
      trend: "down",
      commentary: "Occupancy decreased by 3% this month. Management is implementing new retention strategies and addressing maintenance concerns."
    },
    {
      name: "Cedar Ridge Complex",
      occupancy: 95,
      economicOccupancy: 92,
      collections: 97,
      workOrderCompletion: 98,
      status: "excellent",
      trend: "up", 
      commentary: "Exceptional performance across all metrics. New amenities have significantly improved tenant satisfaction and retention."
    }
  ];

  const availableReports = [
    { name: "May 2025", type: "Monthly Report" },
    { name: "Q1 2025 Summary", type: "Quarterly Report" },
    { name: "2024 Annual Report", type: "Annual Report" }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">LP Dashboard</h1>
              <p className="text-xl text-blue-100">Portfolio Performance Overview</p>
              <div className="mt-4 text-sm opacity-90">
                Viewer Mode • Last Updated: {new Date().toLocaleDateString()}
              </div>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-base font-medium text-black">Property:</label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="greenview">Greenview Apartments</SelectItem>
                  <SelectItem value="oakwood">Oakwood Commons</SelectItem>
                  <SelectItem value="cedar">Cedar Ridge Complex</SelectItem>
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
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Distributions Overview */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <PiggyBank className="h-8 w-8 text-green-600 mr-3" />
              Distributions & Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{formatCurrency(distributionsData.recordedDistributions.ytd)}</div>
                <div className="text-sm text-gray-600">YTD Distributions</div>
                <div className="text-xs text-green-600 mt-1">Total to Date: {formatCurrency(distributionsData.recordedDistributions.totalToDate)}</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(distributionsData.projectedDistributions.nextQuarter)}</div>
                <div className="text-sm text-gray-600">Next Quarter Projected</div>
                <div className="text-xs text-blue-600 mt-1">Year End: {formatCurrency(distributionsData.projectedDistributions.yearEnd)}</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{distributionsData.irr}%</div>
                <div className="text-sm text-gray-600">IRR</div>
                <div className="text-xs text-gray-600 mt-1">Equity Multiple: {distributionsData.equityMultiple}x</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{distributionsData.cashOnCashReturn}%</div>
                <div className="text-sm text-gray-600">Cash-on-Cash Return</div>
                <div className="text-xs text-gray-600 mt-1">Distribution Yield: {distributionsData.distributionYield}%</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-lg mb-3">Distribution Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Last Quarter:</span>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(distributionsData.recordedDistributions.lastQuarter)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Next Year Projected:</span>
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(distributionsData.projectedDistributions.nextYear)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Performance Status:</span>
                  <Badge className="bg-green-100 text-green-800 ml-2">On Track</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Summary */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{formatCurrency(portfolioSummary.monthlyRevenue)}</div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
                <div className="text-xs text-green-600 mt-1">+{portfolioSummary.portfolioGrowth}% vs last month</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{portfolioSummary.averageOccupancy}%</div>
                <div className="text-sm text-gray-600">Portfolio Occupancy</div>
                <div className="text-xs text-gray-600 mt-1">{portfolioSummary.occupiedUnits} of {portfolioSummary.totalUnits} units</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(portfolioSummary.totalValue)}</div>
                <div className="text-sm text-gray-600">Portfolio Value</div>
                <div className="text-xs text-green-600 mt-1">Strong performance</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{properties.length}</div>
                <div className="text-sm text-gray-600">Active Properties</div>
                <div className="text-xs text-gray-600 mt-1">Diversified portfolio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Performance Overview */}
        <div className="space-y-6">
          {properties.map((property) => (
            <Card key={property.name} className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <span>{property.name}</span>
                  </div>
                  <Badge className={`${getStatusColor(property.status)}`}>
                    {property.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg border text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">OCCUPANCY</div>
                    <div className="text-3xl font-bold text-gray-900">{property.occupancy}%</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">ECONOMIC OCCUPANCY</div>
                    <div className="text-3xl font-bold text-gray-900">{property.economicOccupancy}%</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">COLLECTIONS</div>
                    <div className="text-3xl font-bold text-gray-900">{property.collections}%</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">WORK ORDER COMPLETION</div>
                    <div className="text-3xl font-bold text-gray-900">{property.workOrderCompletion}%</div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <span className="font-medium text-sm">GP COMMENTARY</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">Resolved</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 ml-6">{property.commentary}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>TRENDS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Occupancy Trend</h4>
                  <div className="h-16 flex items-end space-x-1">
                    <div className="bg-blue-600 h-8 w-4 rounded-sm"></div>
                    <div className="bg-blue-600 h-12 w-4 rounded-sm"></div>
                    <div className="bg-blue-600 h-10 w-4 rounded-sm"></div>
                    <div className="bg-blue-600 h-14 w-4 rounded-sm"></div>
                    <div className="bg-blue-600 h-16 w-4 rounded-sm"></div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Collections vs Billed</h4>
                  <div className="h-16 flex items-end space-x-1">
                    <div className="bg-blue-600 h-12 w-6 rounded-sm"></div>
                    <div className="bg-blue-400 h-14 w-6 rounded-sm"></div>
                    <div className="bg-blue-300 h-16 w-6 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AVAILABLE REPORTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">[ {report.name} ]</div>
                    <div className="text-xs text-gray-500">{report.type}</div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LPDashboard;
