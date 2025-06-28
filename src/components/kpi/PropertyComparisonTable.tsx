
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PropertyData {
  name: string;
  occupancy: number;
  revenue: number;
  expenses: number;
  noi: number;
  riskScore: number;
  zone: 'green' | 'yellow' | 'red';
}

const PropertyComparisonTable = () => {
  const properties: PropertyData[] = [
    { 
      name: 'Sunset Gardens', 
      occupancy: 96, 
      revenue: 285000, 
      expenses: 150000, 
      noi: 135000,
      riskScore: 1.8,
      zone: 'green'
    },
    { 
      name: 'Metro Plaza', 
      occupancy: 91, 
      revenue: 320000, 
      expenses: 170000, 
      noi: 150000,
      riskScore: 2.4,
      zone: 'yellow'
    },
    { 
      name: 'Riverside Towers', 
      occupancy: 88, 
      revenue: 195000, 
      expenses: 110000, 
      noi: 85000,
      riskScore: 3.1,
      zone: 'red'
    },
    { 
      name: 'Oak Street Commons', 
      occupancy: 94, 
      revenue: 410000, 
      expenses: 220000, 
      noi: 190000,
      riskScore: 2.0,
      zone: 'green'
    }
  ];

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (zone: string) => {
    switch (zone) {
      case 'green': return '#10B981';
      case 'yellow': return '#F59E0B';
      case 'red': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Performance Comparison</CardTitle>
        <CardDescription>Real-time performance metrics across all properties</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Property</th>
                <th className="text-left py-3 px-4 font-medium">Occupancy</th>
                <th className="text-left py-3 px-4 font-medium">Revenue</th>
                <th className="text-left py-3 px-4 font-medium">Expenses</th>
                <th className="text-left py-3 px-4 font-medium">NOI</th>
                <th className="text-left py-3 px-4 font-medium">Risk Score</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium">{property.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{property.occupancy}%</span>
                      <div className="w-16">
                        <Progress 
                          value={property.occupancy} 
                          className="h-2"
                          style={{ 
                            background: `linear-gradient(to right, ${getProgressColor(property.zone)} 0%, ${getProgressColor(property.zone)} ${property.occupancy}%, #e5e7eb ${property.occupancy}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">
                    ${property.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    ${property.expenses.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-medium text-green-600">
                    ${property.noi.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{property.riskScore.toFixed(1)}</span>
                      <div className="w-12">
                        <Progress 
                          value={(5 - property.riskScore) * 20} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getZoneColor(property.zone)}>
                      {property.zone.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyComparisonTable;
