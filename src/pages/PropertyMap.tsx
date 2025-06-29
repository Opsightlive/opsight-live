
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Building2, 
  Users, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Filter
} from 'lucide-react';

const PropertyMap = () => {
  const properties = [
    {
      id: 1,
      name: 'Sunset Gardens',
      address: '123 Oak Street, Downtown',
      units: 48,
      occupancy: 96,
      monthlyRevenue: 45000,
      status: 'excellent',
      alerts: 0,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: 'Metro Plaza',
      address: '456 Pine Avenue, Midtown',
      units: 32,
      occupancy: 88,
      monthlyRevenue: 38000,
      status: 'good',
      alerts: 2,
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 3,
      name: 'Riverside Commons',
      address: '789 River Road, Eastside',
      units: 64,
      occupancy: 94,
      monthlyRevenue: 52000,
      status: 'excellent',
      alerts: 1,
      coordinates: { lat: 40.7282, lng: -73.7949 }
    },
    {
      id: 4,
      name: 'Park View Apartments',
      address: '321 Park Boulevard, Westside',
      units: 28,
      occupancy: 82,
      monthlyRevenue: 28000,
      status: 'attention',
      alerts: 4,
      coordinates: { lat: 40.7831, lng: -73.9712 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'attention': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'attention': return <Badge className="bg-orange-100 text-orange-800">Needs Attention</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Map</h1>
            <p className="text-gray-600 mt-1">
              Interactive geographic visualization of your property portfolio
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Properties
          </Button>
        </div>

        {/* Map Placeholder */}
        <Card className="h-96">
          <CardContent className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map View</h3>
              <p className="text-gray-600 max-w-md">
                Map integration would display your properties with real-time status indicators, 
                occupancy rates, and performance metrics overlaid on geographic locations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(property.status)}`}></div>
                    <div>
                      <CardTitle className="text-lg">{property.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(property.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Building2 className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600">Units</p>
                    <p className="font-semibold">{property.units}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600">Occupancy</p>
                    <p className="font-semibold text-green-600">{property.occupancy}%</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-semibold">${property.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>

                {/* Alerts */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    {property.alerts > 0 ? (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {property.alerts > 0 ? `${property.alerts} alert${property.alerts > 1 ? 's' : ''}` : 'All good'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Portfolio Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>
              Overview of your entire property portfolio performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600">
                  {properties.length}
                </h3>
                <p className="text-sm text-gray-600">Total Properties</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600">
                  {properties.reduce((sum, p) => sum + p.units, 0)}
                </h3>
                <p className="text-sm text-gray-600">Total Units</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600">
                  {Math.round(properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length)}%
                </h3>
                <p className="text-sm text-gray-600">Avg Occupancy</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-indigo-600">
                  ${properties.reduce((sum, p) => sum + p.monthlyRevenue, 0).toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyMap;
