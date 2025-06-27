
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, DollarSign, TrendingUp, Eye } from 'lucide-react';

interface DemoDataGeneratorProps {
  onGenerate: () => void;
}

const DemoDataGenerator: React.FC<DemoDataGeneratorProps> = ({ onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDemo = async () => {
    setIsGenerating(true);
    // Simulate demo data generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    onGenerate();
  };

  const demoProperties = [
    {
      name: "Sunset Gardens",
      units: 124,
      occupancy: 91,
      revenue: 185000,
      trend: "up"
    },
    {
      name: "Metro Plaza",
      units: 89,
      occupancy: 87,
      revenue: 142000,
      trend: "stable"
    },
    {
      name: "Riverside Towers",
      units: 156,
      occupancy: 94,
      revenue: 248000,
      trend: "up"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Experience OPSIGHT</h1>
        <p className="text-gray-600 text-lg">
          See how OPSIGHT transforms your property data into actionable insights
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-6 w-6 text-blue-600 mr-2" />
            Demo Portfolio Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {demoProperties.map((property, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{property.name}</h3>
                  <Badge variant={property.trend === 'up' ? 'default' : 'secondary'}>
                    {property.trend === 'up' ? '↑' : '→'}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      Units
                    </span>
                    <span>{property.units}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Occupancy
                    </span>
                    <span>{property.occupancy}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Revenue
                    </span>
                    <span>${property.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleGenerateDemo}
              disabled={isGenerating}
              size="lg"
              className="px-8"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Demo...</span>
                </div>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Generate Demo Dashboard
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        This demo uses sample data to showcase OPSIGHT's capabilities
      </div>
    </div>
  );
};

export default DemoDataGenerator;
