
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Users, DollarSign, AlertCircle, Plus, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from '@/hooks/use-device-detection';

const PortfolioOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMobile } = useDeviceDetection();

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
    toast({
      title: "Add Property",
      description: "Property addition functionality coming soon",
    });
  };

  const handleViewKPIs = (propertyId: number) => {
    navigate(`/kpi-center?property=${propertyId}`);
  };

  const handleViewAlerts = (propertyId: number) => {
    navigate(`/red-flag-alerts?property=${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`max-w-7xl mx-auto ${isMobile ? 'p-3' : 'p-6'} space-y-6`}>
        {/* Blue Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-8 rounded-lg shadow-lg">
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'}`}>
            <div>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-2 md:mb-4`}>Portfolio Overview</h1>
              <p className={`${isMobile ? 'text-sm' : 'text-xl'} text-blue-100 ${isMobile ? 'max-w-full' : 'max-w-3xl'}`}>
                Manage and monitor all your properties with comprehensive insights and analytics
              </p>
            </div>
            <Button 
              onClick={handleAddProperty} 
              className={`bg-white text-blue-600 hover:bg-blue-50 ${isMobile ? 'w-full' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>

        {/* Portfolio Summary - Mobile Optimized */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'} gap-3 md:gap-6`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Total Properties</CardTitle>
              <Building2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
            </CardHeader>
            <CardContent>
              <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{properties.length}</div>
              <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Total Units</CardTitle>
              <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
            </CardHeader>
            <CardContent>
              <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                {properties.reduce((sum, p) => sum + p.units, 0)}
              </div>
              <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                Across all properties
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Avg Occupancy</CardTitle>
              <TrendingUp className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
            </CardHeader>
            <CardContent>
              <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                {Math.round(properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length)}%
              </div>
              <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Total Revenue</CardTitle>
              <DollarSign className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
            </CardHeader>
            <CardContent>
              <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
                ${(properties.reduce((sum, p) => sum + p.revenue, 0) / 1000).toFixed(0)}K
              </div>
              <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                +8.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid - Mobile Optimized */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'} gap-3 md:gap-6`}>
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{property.name}</CardTitle>
                  <div className={`px-2 py-1 rounded-full ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium ${
                    property.status === 'healthy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status === 'healthy' ? 'Healthy' : 'Needs Attention'}
                  </div>
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>{property.address}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'gap-4'}`}>
                  <div>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Units</p>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>{property.units}</p>
                  </div>
                  <div>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Occupancy</p>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>{property.occupancy}%</p>
                  </div>
                </div>
                
                <div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Monthly Revenue</p>
                  <p className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>${property.revenue.toLocaleString()}</p>
                </div>

                <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'} pt-2`}>
                  <Button 
                    variant="outline" 
                    size={isMobile ? "sm" : "sm"}
                    onClick={() => handlePropertyClick(property.id)}
                    className={isMobile ? "w-full text-xs" : "flex-1"}
                  >
                    View Details
                  </Button>
                  <div className={`flex ${isMobile ? 'space-x-2' : 'space-x-2'}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewKPIs(property.id)}
                      className={isMobile ? "flex-1" : ""}
                    >
                      <BarChart3 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                      {isMobile && <span className="ml-1 text-xs">KPIs</span>}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewAlerts(property.id)}
                      className={isMobile ? "flex-1" : ""}
                    >
                      <AlertCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                      {isMobile && <span className="ml-1 text-xs">Alerts</span>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
