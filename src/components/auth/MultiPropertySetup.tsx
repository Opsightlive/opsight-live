
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, X, Check, Database, Upload } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  tier: string;
  dataSource: 'connect' | 'manual';
  pmSoftware?: string;
  pmUsername?: string;
  pmPassword?: string;
  cost: number;
}

interface MultiPropertySetupProps {
  onComplete: (properties: Property[]) => void;
  onBack: () => void;
}

const MultiPropertySetup: React.FC<MultiPropertySetupProps> = ({ onComplete, onBack }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState({
    name: '',
    address: '',
    units: 0,
    tier: '',
    dataSource: 'connect' as 'connect' | 'manual',
    pmSoftware: '',
    pmUsername: '',
    pmPassword: ''
  });

  const tiers = [
    { name: 'Basic', price: 3, features: ['Basic KPI Tracking', 'Monthly Reports', 'Email Alerts'] },
    { name: 'Professional', price: 4, features: ['Advanced Analytics', 'Weekly Reports', 'SMS + Email Alerts', 'Custom Dashboards'] },
    { name: 'Enterprise', price: 5, features: ['Real-time Monitoring', 'Daily Reports', 'Multi-channel Alerts', 'API Access', 'Priority Support'] }
  ];

  const pmSoftwareOptions = [
    { value: 'yardi', label: 'Yardi' },
    { value: 'appfolio', label: 'AppFolio' },
    { value: 'buildium', label: 'Buildium' },
    { value: 'propertyware', label: 'Propertyware' },
    { value: 'resman', label: 'RESMan' },
    { value: 'entrata', label: 'Entrata' }
  ];

  const calculateCost = (units: number, tierPrice: number) => {
    return units * tierPrice * 0.9; // 10% discount
  };

  const addProperty = () => {
    if (currentProperty.name && currentProperty.address && currentProperty.units > 0 && currentProperty.tier) {
      if (currentProperty.dataSource === 'connect' && (!currentProperty.pmSoftware || !currentProperty.pmUsername || !currentProperty.pmPassword)) {
        return;
      }

      const tierPrice = tiers.find(t => t.name === currentProperty.tier)?.price || 3;
      const cost = calculateCost(currentProperty.units, tierPrice);
      
      const newProperty: Property = {
        id: Date.now().toString(),
        name: currentProperty.name,
        address: currentProperty.address,
        units: currentProperty.units,
        tier: currentProperty.tier,
        dataSource: currentProperty.dataSource,
        pmSoftware: currentProperty.dataSource === 'connect' ? currentProperty.pmSoftware : undefined,
        pmUsername: currentProperty.dataSource === 'connect' ? currentProperty.pmUsername : undefined,
        pmPassword: currentProperty.dataSource === 'connect' ? currentProperty.pmPassword : undefined,
        cost
      };
      
      setProperties([...properties, newProperty]);
      setCurrentProperty({
        name: '',
        address: '',
        units: 0,
        tier: '',
        dataSource: 'connect',
        pmSoftware: '',
        pmUsername: '',
        pmPassword: ''
      });
    }
  };

  const removeProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const getTotalCost = () => {
    return properties.reduce((total, property) => total + property.cost, 0);
  };

  const isCurrentPropertyValid = () => {
    const basicValid = currentProperty.name && currentProperty.address && currentProperty.units > 0 && currentProperty.tier;
    if (currentProperty.dataSource === 'connect') {
      return basicValid && currentProperty.pmSoftware && currentProperty.pmUsername && currentProperty.pmPassword;
    }
    return basicValid;
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Setup Your Properties</h1>
          <p className="text-gray-600">Add your properties and configure their monitoring settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Property Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Add Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Property Name</Label>
                  <Input
                    value={currentProperty.name}
                    onChange={(e) => setCurrentProperty(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sunset Apartments"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={currentProperty.address}
                    onChange={(e) => setCurrentProperty(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Property address"
                  />
                </div>
                <div>
                  <Label>Number of Units</Label>
                  <Input
                    type="number"
                    value={currentProperty.units || ''}
                    onChange={(e) => setCurrentProperty(prev => ({ ...prev, units: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter number of units"
                  />
                </div>
              </div>

              {/* Data Source Selection */}
              <div>
                <Label className="mb-3 block">Data Source</Label>
                <RadioGroup 
                  value={currentProperty.dataSource} 
                  onValueChange={(value: 'connect' | 'manual') => setCurrentProperty(prev => ({ ...prev, dataSource: value }))}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="connect" id="connect" />
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <Label htmlFor="connect" className="text-sm">Connect PM System</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="manual" id="manual" />
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <Label htmlFor="manual" className="text-sm">Manual Upload</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* PM System Connection */}
              {currentProperty.dataSource === 'connect' && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label className="text-sm">PM Software</Label>
                    <Select value={currentProperty.pmSoftware} onValueChange={(value) => setCurrentProperty(prev => ({ ...prev, pmSoftware: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your PM software" />
                      </SelectTrigger>
                      <SelectContent>
                        {pmSoftwareOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Username</Label>
                    <Input
                      value={currentProperty.pmUsername}
                      onChange={(e) => setCurrentProperty(prev => ({ ...prev, pmUsername: e.target.value }))}
                      placeholder="PM software username"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Password</Label>
                    <Input
                      type="password"
                      value={currentProperty.pmPassword}
                      onChange={(e) => setCurrentProperty(prev => ({ ...prev, pmPassword: e.target.value }))}
                      placeholder="PM software password"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Tier Selection */}
              <div>
                <Label className="mb-3 block">Select Tier for This Property</Label>
                <div className="space-y-3">
                  {tiers.map((tier) => {
                    const cost = currentProperty.units > 0 ? calculateCost(currentProperty.units, tier.price) : 0;
                    return (
                      <div
                        key={tier.name}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          currentProperty.tier === tier.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setCurrentProperty(prev => ({ ...prev, tier: tier.name }))}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{tier.name}</h3>
                            <div className="text-sm text-gray-600">${tier.price} per unit/month</div>
                          </div>
                          {currentProperty.units > 0 && (
                            <div className="text-right">
                              <div className="font-bold text-blue-600">${cost.toFixed(2)}/month</div>
                              <div className="text-xs text-green-600">10% discount applied</div>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {tier.features.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={addProperty} 
                disabled={!isCurrentPropertyValid()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </CardContent>
          </Card>

          {/* Properties List */}
          <Card>
            <CardHeader>
              <CardTitle>Added Properties ({properties.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No properties added yet</p>
                  <p className="text-sm">Add your first property to continue</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{property.name}</h3>
                          <p className="text-sm text-gray-600">{property.address}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProperty(property.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{property.units} units</Badge>
                        <Badge variant="outline">{property.tier}</Badge>
                        <Badge variant="outline">
                          {property.dataSource === 'connect' ? `${property.pmSoftware}` : 'Manual Upload'}
                        </Badge>
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        ${property.cost.toFixed(2)}/month
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Monthly Cost:</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${getTotalCost().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            onClick={() => onComplete(properties)}
            disabled={properties.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue to Payment ({properties.length} {properties.length === 1 ? 'property' : 'properties'})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiPropertySetup;
