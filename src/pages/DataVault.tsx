import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Calendar,
  FileText,
  BarChart3,
  Building2,
  Users,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DataVault = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('30d');

  const dataCategories = [
    { id: 'all', name: 'All Data', count: 156 },
    { id: 'financial', name: 'Financial Reports', count: 42 },
    { id: 'leasing', name: 'Leasing Data', count: 38 },
    { id: 'maintenance', name: 'Maintenance Records', count: 28 },
    { id: 'tenant', name: 'Tenant Information', count: 35 },
    { id: 'legal', name: 'Legal Documents', count: 13 }
  ];

  const recentData = [
    {
      id: 1,
      name: 'Q4 Financial Summary',
      category: 'financial',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: '2024-01-15',
      source: 'Property Management System',
      status: 'verified'
    },
    {
      id: 2,
      name: 'Lease Renewals - January',
      category: 'leasing',
      type: 'Excel',
      size: '856 KB',
      lastModified: '2024-01-14',
      source: 'Leasing Portal',
      status: 'processing'
    },
    {
      id: 3,
      name: 'Maintenance Work Orders',
      category: 'maintenance',
      type: 'CSV',
      size: '1.2 MB',
      lastModified: '2024-01-13',
      source: 'Maintenance App',
      status: 'verified'
    }
  ];

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export has been initiated",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import Data",
      description: "Data import functionality coming soon",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'leasing': return <Users className="h-4 w-4" />;
      case 'maintenance': return <Building2 className="h-4 w-4" />;
      case 'tenant': return <Users className="h-4 w-4" />;
      case 'legal': return <FileText className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'verified': return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'processing': return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div>
            <h1 className="text-4xl font-bold mb-4">Data Vault</h1>
            <p className="text-xl text-blue-100 max-w-3xl">Centralized repository for all your property data with advanced search and analytics capabilities</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              <Input
                type="text"
                placeholder="Search data..."
                className="border-none focus:ring-0 shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 px-3 py-1 text-sm rounded-md"
              >
                <option value="all">All</option>
                <option value="financial">Financial</option>
                <option value="leasing">Leasing</option>
                <option value="maintenance">Maintenance</option>
                <option value="tenant">Tenant</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Date Range:</label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="border border-gray-300 px-3 py-1 text-sm rounded-md"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last 1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataCategories.map((category) => (
            <Card key={category.id} className="border-2 border-gray-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  {getCategoryIcon(category.id)}
                  {category.name}
                </CardTitle>
                <Badge variant="secondary">{category.count}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {category.name} and related documents
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Data */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.lastModified}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVault;
