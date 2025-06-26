import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Users, DollarSign, AlertCircle, Plus, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioOverview = () => {
  const navigate = useNavigate();

  const properties = [
    {
      id: 1,
      name: 'Sunset Gardens',
      units: 120,
      occupancy: 94,
      revenue: 180000,
      status: 'healthy',
      address: '123 Main St, Austin, TX'
    },
    {
      id: 2,
      name: 'Oak Ridge Apartments',
      units: 85,
      occupancy: 88,
      revenue: 125000,
      status: 'attention',
      address: '456 Oak Ave, Dallas, TX'
    },
    {
      id: 3,
      name: 'Pine Valley Complex',
      units: 200,
      occupancy: 96,
      revenue: 290000,
      status: 'healthy',
      address: '789 Pine Rd, Houston, TX'
    }
  ];

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  const handleAddProperty = () => {
    navigate('/settings');
  };

  const handleViewKPIs = (propertyId: number) => {
    navigate(`/kpi-center?property=${propertyId}`);
  };

  const handleViewAlerts = (propertyId: number) => {
    navigate(`/red-flag-alerts?property=${propertyId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all your properties</p>
        </div>
        <Button onClick={handleAddProperty} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.reduce((sum, p) => sum + p.units, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(properties.reduce((sum, p) => sum + p.revenue, 0) / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{property.name}</CardTitle>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property.status === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.status === 'healthy' ? 'Healthy' : 'Needs Attention'}
                </div>
              </div>
              <p className="text-sm text-gray-600">{property.address}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Units</p>
                  <p className="text-lg font-semibold">{property.units}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Occupancy</p>
                  <p className="text-lg font-semibold">{property.occupancy}%</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-lg font-semibold">${property.revenue.toLocaleString()}</p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePropertyClick(property.id)}
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewKPIs(property.id)}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewAlerts(property.id)}
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortfolioOverview;
