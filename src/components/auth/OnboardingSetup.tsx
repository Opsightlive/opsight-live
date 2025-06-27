
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, DollarSign, Database, CreditCard, Users, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface OnboardingSetupProps {
  onComplete: () => void;
}

const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    name: '',
    address: '',
    units: '',
    propertyType: 'multifamily'
  });
  
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const tiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      pricePerUnit: 2,
      features: ['Basic reporting', 'Email alerts', 'Up to 100 units']
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 199,
      pricePerUnit: 1.5,
      features: ['Advanced analytics', 'SMS + Email alerts', 'Up to 500 units', 'API access']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 499,
      pricePerUnit: 1,
      features: ['Full suite', 'Custom integrations', 'Unlimited units', 'Dedicated support']
    }
  ];

  const integrationOptions = [
    { id: 'yardi', name: 'Yardi', price: 50 },
    { id: 'appfolio', name: 'AppFolio', price: 75 },
    { id: 'buildium', name: 'Buildium', price: 40 },
    { id: 'propertyware', name: 'Propertyware', price: 60 }
  ];

  const calculateTotalCost = () => {
    const tierData = tiers.find(t => t.id === selectedTier);
    if (!tierData) return 0;
    
    const units = parseInt(propertyData.units) || 0;
    const baseCost = tierData.price + (units * tierData.pricePerUnit);
    const integrationCosts = selectedIntegrations.reduce((total, integrationId) => {
      const integration = integrationOptions.find(i => i.id === integrationId);
      return total + (integration?.price || 0);
    }, 0);
    
    return baseCost + integrationCosts;
  };

  const canProceedFromStep1 = () => {
    return propertyData.name.trim() !== '' && 
           propertyData.address.trim() !== '' && 
           propertyData.units.trim() !== '' &&
           parseInt(propertyData.units) > 0;
  };

  const canProceedFromStep2 = () => {
    return selectedTier !== '';
  };

  const canProceedFromStep3 = () => {
    return selectedIntegrations.length > 0;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Multifamily Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  value={propertyData.name}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sunset Gardens Apartments"
                />
              </div>
              
              <div>
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input
                  id="propertyAddress"
                  value={propertyData.address}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g., 123 Main St, City, State"
                />
              </div>
              
              <div>
                <Label htmlFor="units">Number of Units</Label>
                <Input
                  id="units"
                  type="number"
                  value={propertyData.units}
                  onChange={(e) => setPropertyData(prev => ({ ...prev, units: e.target.value }))}
                  placeholder="e.g., 150"
                />
              </div>

              <div>
                <Label>Property Type</Label>
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Multifamily</span>
                    <Badge className="bg-blue-100 text-blue-800">Selected</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Focus on apartment complexes, condominiums, and residential rental properties
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)}
                disabled={!canProceedFromStep1()}
                className="w-full"
              >
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Select Your Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTier === tier.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{tier.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          ${tier.price}/mo + ${tier.pricePerUnit}/unit
                        </p>
                        <ul className="mt-2 space-y-1">
                          {tier.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {selectedTier === tier.id && (
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!canProceedFromStep2()}
                  className="flex-1"
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Integration Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Select your property management system for data integration:</p>
              
              <div className="grid grid-cols-1 gap-3">
                {integrationOptions.map((integration) => (
                  <div
                    key={integration.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedIntegrations.includes(integration.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedIntegrations(prev => 
                        prev.includes(integration.id)
                          ? prev.filter(id => id !== integration.id)
                          : [...prev, integration.id]
                      );
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">+${integration.price}/month</p>
                      </div>
                      {selectedIntegrations.includes(integration.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)}
                  disabled={!canProceedFromStep3()}
                  className="flex-1"
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Review & Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Property: {propertyData.name}</span>
                    <span>{propertyData.units} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan: {tiers.find(t => t.id === selectedTier)?.name}</span>
                    <span>${tiers.find(t => t.id === selectedTier)?.price}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit cost ({propertyData.units} units)</span>
                    <span>${(parseInt(propertyData.units) || 0) * (tiers.find(t => t.id === selectedTier)?.pricePerUnit || 0)}/mo</span>
                  </div>
                  {selectedIntegrations.map(integrationId => {
                    const integration = integrationOptions.find(i => i.id === integrationId);
                    return (
                      <div key={integrationId} className="flex justify-between">
                        <span>{integration?.name} Integration</span>
                        <span>${integration?.price}/mo</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Monthly Cost:</span>
                    <span>${calculateTotalCost()}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit Card</span>
                    </div>
                  </div>
                  <div
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                      paymentMethod === 'bank' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Bank Transfer</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={onComplete}
                  disabled={!paymentMethod}
                  className="flex-1"
                >
                  Complete Setup & Pay
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Multifamily Property</h1>
        <p className="text-gray-600">
          Set up your multifamily property with OPSIGHT
        </p>
        <div className="flex items-center space-x-2 mt-4">
          <Badge variant="outline">Step {step} of 4</Badge>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default OnboardingSetup;
