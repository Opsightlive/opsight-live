
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, X, Check, Database, Upload, Eye, EyeOff } from 'lucide-react';
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
    pmPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    { value: 'entrata', label: 'Entrata' },
    { value: 'onesite', label: 'OneSite' },
    { value: 'rentmanager', label: 'Rent Manager' },
    { value: 'propertymatrix', label: 'Property Matrix' },
    { value: 'mri', label: 'MRI Software' },
    { value: 'realpage', label: 'RealPage' },
    { value: 'costar', label: 'CoStar' },
    { value: 'console', label: 'Console Group' },
    { value: 'rentspree', label: 'RentSpree' },
    { value: 'zillow', label: 'Zillow Rental Manager' },
    { value: 'apartments', label: 'Apartments.com' },
    { value: 'other', label: 'Other (please specify)' }
  ];

  const calculateCost = (units: number, tierPrice: number) => {
    return units * tierPrice;
  };

  const addProperty = () => {
    if (currentProperty.name && currentProperty.address && currentProperty.units > 0 && currentProperty.tier) {
      if (currentProperty.dataSource === 'connect' && (!currentProperty.pmSoftware || !currentProperty.pmUsername || !currentProperty.pmPassword)) {
        return;
      }
      
      if (currentProperty.dataSource === 'connect' && currentProperty.pmPassword !== currentProperty.confirmPassword) {
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
        pmPassword: '',
        confirmPassword: ''
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
      const passwordsMatch = currentProperty.pmPassword === currentProperty.confirmPassword;
      return basicValid && currentProperty.pmSoftware && currentProperty.pmUsername && currentProperty.pmPassword && passwordsMatch;
    }
    return basicValid;
  };

  const passwordsMatch = currentProperty.pmPassword === currentProperty.confirmPassword;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navigation />
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 pt-16 sm:pt-20">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Setup Your Properties</h1>
          <p className="text-sm sm:text-base text-gray-600">Add your properties and configure their monitoring settings</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Add Property Form */}
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Add Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm sm:text-base">Property Name</Label>
                  <Input
                    value={currentProperty.name}
                    onChange={(e) => setCurrentProperty(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sunset Apartments"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label className="text-sm sm:text-base">Address</Label>
                  <Input
                    value={currentProperty.address}
                    onChange={(e) => setCurrentProperty(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Property address"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label className="text-sm sm:text-base">Number of Units</Label>
                  <Input
                    type="number"
                    value={currentProperty.units || ''}
                    onChange={(e) => setCurrentProperty(prev => ({ ...prev, units: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter number of units"
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Data Source Selection */}
              <div>
                <Label className="mb-3 block text-sm sm:text-base">Data Source</Label>
                <RadioGroup 
                  value={currentProperty.dataSource} 
                  onValueChange={(value: 'connect' | 'manual') => setCurrentProperty(prev => ({ ...prev, dataSource: value }))}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                >
                  <div className="flex items-center space-x-3 p-3 sm:p-4 border rounded-lg min-h-[60px] sm:min-h-[70px]">
                    <RadioGroupItem value="connect" id="connect" className="min-w-[20px] min-h-[20px]" />
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                      <Label htmlFor="connect" className="text-sm sm:text-base cursor-pointer">Connect PM System</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 sm:p-4 border rounded-lg min-h-[60px] sm:min-h-[70px]">
                    <RadioGroupItem value="manual" id="manual" className="min-w-[20px] min-h-[20px]" />
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                      <Label htmlFor="manual" className="text-sm sm:text-base cursor-pointer">Manual Upload</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* PM System Connection */}
              {currentProperty.dataSource === 'connect' && (
                <div className="space-y-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label className="text-sm sm:text-base">PM Software</Label>
                    <Select value={currentProperty.pmSoftware} onValueChange={(value) => setCurrentProperty(prev => ({ ...prev, pmSoftware: value }))}>
                      <SelectTrigger className="mt-1 h-10 sm:h-11">
                        <SelectValue placeholder="Select your PM software" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {pmSoftwareOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-sm sm:text-base">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {currentProperty.pmSoftware === 'other' && (
                    <div>
                      <Label className="text-sm sm:text-base">Please specify your PM software</Label>
                      <Input
                        placeholder="Enter your PM software name"
                        className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm sm:text-base">Username</Label>
                    <Input
                      value={currentProperty.pmUsername}
                      onChange={(e) => setCurrentProperty(prev => ({ ...prev, pmUsername: e.target.value }))}
                      placeholder="PM software username"
                      className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={currentProperty.pmPassword}
                        onChange={(e) => setCurrentProperty(prev => ({ ...prev, pmPassword: e.target.value }))}
                        placeholder="PM software password"
                        className="h-10 sm:h-11 text-sm sm:text-base pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 min-w-[24px] min-h-[24px]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={currentProperty.confirmPassword}
                        onChange={(e) => setCurrentProperty(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm PM software password"
                        className={`h-10 sm:h-11 text-sm sm:text-base pr-10 ${!passwordsMatch && currentProperty.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 min-w-[24px] min-h-[24px]"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {!passwordsMatch && currentProperty.confirmPassword && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tier Selection */}
              <div>
                <Label className="mb-3 block text-sm sm:text-base">Select Tier for This Property</Label>
                <div className="space-y-3">
                  {tiers.map((tier) => {
                    const cost = currentProperty.units > 0 ? calculateCost(currentProperty.units, tier.price) : 0;
                    return (
                      <div
                        key={tier.name}
                        className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors min-h-[80px] sm:min-h-[90px] ${
                          currentProperty.tier === tier.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setCurrentProperty(prev => ({ ...prev, tier: tier.name }))}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{tier.name}</h3>
                            <div className="text-xs sm:text-sm text-gray-600">${tier.price} per unit/month</div>
                          </div>
                          {currentProperty.units > 0 && (
                            <div className="text-right">
                              <div className="font-bold text-blue-600 text-sm sm:text-base">${cost.toFixed(2)}/month</div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
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
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Add Property
              </Button>
            </CardContent>
          </Card>

          {/* Properties List */}
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Added Properties ({properties.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Building2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">No properties added yet</p>
                  <p className="text-xs sm:text-sm">Add your first property to continue</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base truncate">{property.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{property.address}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProperty(property.id)}
                          className="ml-2 min-w-[32px] min-h-[32px] p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{property.units} units</Badge>
                        <Badge variant="outline" className="text-xs">{property.tier}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {property.dataSource === 'connect' ? `${property.pmSoftware}` : 'Manual Upload'}
                        </Badge>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-600">
                        ${property.cost.toFixed(2)}/month
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 sm:pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm sm:text-base">Total Monthly Cost:</span>
                      <span className="text-lg sm:text-xl font-bold text-blue-600">
                        ${getTotalCost().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Button variant="outline" onClick={onBack} className="h-11 sm:h-12 text-sm sm:text-base">
            Back
          </Button>
          <Button 
            onClick={() => onComplete(properties)}
            disabled={properties.length === 0}
            className="bg-blue-600 hover:bg-blue-700 h-11 sm:h-12 text-sm sm:text-base"
          >
            Continue to Payment ({properties.length} {properties.length === 1 ? 'property' : 'properties'})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiPropertySetup;
