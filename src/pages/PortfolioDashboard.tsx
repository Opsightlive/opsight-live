
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, DollarSign, TrendingUp, AlertCircle, Calendar, MapPin, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const PortfolioDashboard = () => {
  const [selectedProperty, setSelectedProperty] = useState('all');

  // Multifamily-focused data
  const multifamilyProperties = [
    {
      id: 1,
      name: 'Sunset Gardens',
      units: 248,
      occupancy: 96.2,
      avgRent: 1850,
      noi: 285000,
      location: 'Austin, TX',
      yearBuilt: 2018,
      amenityScore: 4.8,
      waitingList: 45
    },
    {
      id: 2,
      name: 'Metro Plaza',
      units: 156,
      occupancy: 92.1,
      avgRent: 2100,
      noi: 320000,
      location: 'Dallas, TX',
      yearBuilt: 2020,
      amenityScore: 4.6,
      waitingList: 32
    },
    {
      id: 3,
      name: 'Riverside Towers',
      units: 184,
      occupancy: 89.4,
      avgRent: 1650,
      noi: 195000,
      location: 'Houston, TX',
      yearBuilt: 2016,
      amenityScore: 4.2,
      waitingList: 18
    },
    {
      id: 4,
      name: 'Oak Street Commons',
      units: 312,
      occupancy: 97.8,
      avgRent: 1950,
      noi: 410000,
      location: 'San Antonio, TX',
      yearBuilt: 2019,
      amenityScore: 4.9,
      waitingList: 67
    }
  ];

  const occupancyTrends = [
    { month: 'Jan', sunset: 94, metro: 91, riverside: 87, oak: 96 },
    { month: 'Feb', sunset: 95, metro: 92, riverside: 88, oak: 97 },
    { month: 'Mar', sunset: 96, metro: 91, riverside: 89, oak: 98 },
    { month: 'Apr', sunset: 96, metro: 92, riverside: 89, oak: 97 },
    { month: 'May', sunset: 96, metro: 92, riverside: 89, oak: 98 },
    { month: 'Jun', sunset: 96, metro: 92, riverside: 89, oak: 98 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2100000, expenses: 1200000 },
    { month: 'Feb', revenue: 2150000, expenses: 1220000 },
    { month: 'Mar', revenue: 2200000, expenses: 1240000 },
    { month: 'Apr', revenue: 2250000, expenses: 1260000 },
    { month: 'May', revenue: 2300000, expenses: 1280000 },
    { month: 'Jun', revenue: 2350000, expenses: 1300000 }
  ];

  const unitMixData = [
    { type: 'Studio', count: 120, avgRent: 1450, occupancy: 98 },
    { type: '1BR', count: 380, avgRent: 1750, occupancy: 95 },
    { type: '2BR', count: 420, avgRent: 2150, occupancy: 94 },
    { type: '3BR', count: 80, avgRent: 2650, occupancy: 92 }
  ];

  const totalUnits = multifamilyProperties.reduce((sum, prop) => sum + prop.units, 0);
  const avgOccupancy = multifamilyProperties.reduce((sum, prop) => sum + prop.occupancy, 0) / multifamilyProperties.length;
  const totalNOI = multifamilyProperties.reduce((sum, prop) => sum + prop.noi, 0);
  const avgRent = multifamilyProperties.reduce((sum, prop) => sum + prop.avgRent, 0) / multifamilyProperties.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Blue Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Multifamily Portfolio Dashboard</h1>
              <p className="text-blue-100 text-lg">Real-time insights for your multifamily assets</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{multifamilyProperties.length}</div>
                <div className="text-blue-200">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{totalUnits.toLocaleString()}</div>
                <div className="text-blue-200">Total Units</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Occupancy</p>
                  <p className="text-3xl font-bold text-green-600">{avgOccupancy.toFixed(1)}%</p>
                  <p className="text-sm text-green-600">+2.1% vs last month</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly NOI</p>
                  <p className="text-3xl font-bold text-blue-600">${(totalNOI / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-blue-600">+8.5% vs last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rent</p>
                  <p className="text-3xl font-bold text-purple-600">${avgRent.toFixed(0)}</p>
                  <p className="text-sm text-purple-600">+3.2% vs last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Waiting List</p>
                  <p className="text-3xl font-bold text-orange-600">162</p>
                  <p className="text-sm text-orange-600">Strong demand</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy Trends</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
            <TabsTrigger value="units">Unit Mix</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multifamily Properties Performance</CardTitle>
                <CardDescription>Detailed view of each property in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {multifamilyProperties.map((property) => (
                    <Card key={property.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center">
                              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                              {property.name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {property.location} • Built {property.yearBuilt}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{property.amenityScore}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Units</p>
                            <p className="text-lg font-semibold">{property.units}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Occupancy</p>
                            <p className="text-lg font-semibold text-green-600">{property.occupancy}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Avg Rent</p>
                            <p className="text-lg font-semibold">${property.avgRent}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Waiting List</p>
                            <p className="text-lg font-semibold text-orange-600">{property.waitingList}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Occupancy</span>
                            <span>{property.occupancy}%</span>
                          </div>
                          <Progress value={property.occupancy} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant={property.occupancy > 95 ? 'default' : property.occupancy > 90 ? 'secondary' : 'destructive'}>
                            {property.occupancy > 95 ? 'Excellent' : property.occupancy > 90 ? 'Good' : 'Needs Attention'}
                          </Badge>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="occupancy">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Trends by Property</CardTitle>
                <CardDescription>6-month occupancy tracking for all multifamily properties</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={occupancyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sunset" stroke="#3B82F6" strokeWidth={3} name="Sunset Gardens" />
                    <Line type="monotone" dataKey="metro" stroke="#10B981" strokeWidth={3} name="Metro Plaza" />
                    <Line type="monotone" dataKey="riverside" stroke="#F59E0B" strokeWidth={3} name="Riverside Towers" />
                    <Line type="monotone" dataKey="oak" stroke="#8B5CF6" strokeWidth={3} name="Oak Street Commons" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses Analysis</CardTitle>
                <CardDescription>Monthly financial performance across the portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${(value / 1000).toFixed(0)}K`, '']} />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units">
            <Card>
              <CardHeader>
                <CardTitle>Unit Mix Analysis</CardTitle>
                <CardDescription>Portfolio composition by unit type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {unitMixData.map((unit) => (
                    <Card key={unit.type} className="bg-gray-50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{unit.type}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Units:</span>
                            <span className="font-medium">{unit.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Rent:</span>
                            <span className="font-medium">${unit.avgRent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Occupancy:</span>
                            <span className="font-medium text-green-600">{unit.occupancy}%</span>
                          </div>
                          <Progress value={unit.occupancy} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for multifamily property management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-16 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-5 w-5" />
                <span>Schedule Tours</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                <Users className="h-5 w-5" />
                <span>Manage Waitlist</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="h-5 w-5" />
                <span>Market Analysis</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
