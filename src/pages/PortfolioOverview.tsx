
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Eye, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const PortfolioOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const portfolioData = [
    {
      id: 1,
      property: 'Sunset Gardens',
      location: 'Austin, TX',
      units: 240,
      occupancy: 87,
      noi: 1250000,
      lastUpdate: '2 hours ago',
      status: 'critical',
      redFlags: 3,
      manager: 'Sarah Johnson'
    },
    {
      id: 2,
      property: 'Park Vista Apartments',
      location: 'Dallas, TX',
      units: 180,
      occupancy: 92,
      noi: 980000,
      lastUpdate: '1 day ago',
      status: 'warning',
      redFlags: 2,
      manager: 'Mike Chen'
    },
    {
      id: 3,
      property: 'Metro Heights',
      location: 'Houston, TX',
      units: 320,
      occupancy: 95,
      noi: 1850000,
      lastUpdate: '3 hours ago',
      status: 'good',
      redFlags: 0,
      manager: 'Lisa Rodriguez'
    },
    {
      id: 4,
      property: 'Greenview Apartments',
      location: 'San Antonio, TX',
      units: 150,
      occupancy: 89,
      noi: 720000,
      lastUpdate: '6 hours ago',
      status: 'warning',
      redFlags: 1,
      manager: 'David Park'
    },
    {
      id: 5,
      property: 'Riverside Commons',
      location: 'Fort Worth, TX',
      units: 200,
      occupancy: 94,
      noi: 1100000,
      lastUpdate: '4 hours ago',
      status: 'good',
      redFlags: 0,
      manager: 'Jennifer White'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'good': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredData = portfolioData.filter(property => {
    const matchesSearch = property.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalUnits = portfolioData.reduce((sum, prop) => sum + prop.units, 0);
  const avgOccupancy = portfolioData.reduce((sum, prop) => sum + prop.occupancy, 0) / portfolioData.length;
  const totalNOI = portfolioData.reduce((sum, prop) => sum + prop.noi, 0);
  const totalRedFlags = portfolioData.reduce((sum, prop) => sum + prop.redFlags, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Overview</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your real estate portfolio</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="text-gray-700 border-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Eye className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{portfolioData.length}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">2 new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalUnits.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+3.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgOccupancy.toFixed(1)}%</div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm text-red-600">-1.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total NOI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${(totalNOI / 1000000).toFixed(1)}M</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+5.8% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-blue-200 border-2">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 border-gray-300 focus:border-blue-600 focus:ring-blue-600">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-600">{totalRedFlags} Active Red Flags</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card className="border-blue-200 border-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Properties</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Property</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Location</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Units</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Occupancy</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">NOI</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Manager</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Red Flags</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Last Update</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(property.status)}`}></div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{property.property}</div>
                    </td>
                    <td className="p-4 text-gray-600">{property.location}</td>
                    <td className="p-4 text-gray-900">{property.units}</td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900">{property.occupancy}%</span>
                    </td>
                    <td className="p-4 text-gray-900">${(property.noi / 1000).toFixed(0)}K</td>
                    <td className="p-4 text-gray-600">{property.manager}</td>
                    <td className="p-4">
                      {property.redFlags > 0 ? (
                        <Badge className={getStatusBadge(property.status)}>
                          {property.redFlags} Flag{property.redFlags > 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{property.lastUpdate}</td>
                    <td className="p-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
