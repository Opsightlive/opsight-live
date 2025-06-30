import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, CreditCard, DollarSign, FileText, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';

interface PropertyPaymentSetupProps {
  onComplete: () => void;
}

interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  tier: string;
  cost: number;
  paymentMethod: string;
  paymentDetails?: any;
}

const PropertyPaymentSetup: React.FC<PropertyPaymentSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState({
    name: '',
    address: '',
    units: 0,
    tier: '',
    paymentMethod: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const tiers = [
    { name: 'Basic', price: 3, features: ['Basic KPI Tracking', 'Monthly Reports', 'Email Alerts'] },
    { name: 'Professional', price: 4, features: ['Advanced Analytics', 'Weekly Reports', 'SMS + Email Alerts', 'Custom Dashboards'] },
    { name: 'Enterprise', price: 5, features: ['Real-time Monitoring', 'Daily Reports', 'Multi-channel Alerts', 'API Access', 'Priority Support'] }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, discount: 10 },
    { id: 'ach', name: 'ACH Bank Transfer', icon: DollarSign, discount: 10 },
    { id: 'invoice', name: 'Invoice (Net 30)', icon: FileText, discount: 0 }
  ];

  const calculateCost = (units: number, tierPrice: number, paymentMethod: string) => {
    const baseCost = units * tierPrice;
    const discount = paymentMethods.find(pm => pm.id === paymentMethod)?.discount || 0;
    return baseCost * (1 - discount / 100);
  };

  const addProperty = () => {
    if (currentProperty.name && currentProperty.address && currentProperty.units > 0 && currentProperty.tier && currentProperty.paymentMethod) {
      const tierPrice = tiers.find(t => t.name === currentProperty.tier)?.price || 3;
      const cost = calculateCost(currentProperty.units, tierPrice, currentProperty.paymentMethod);
      
      const newProperty: Property = {
        id: Date.now().toString(),
        ...currentProperty,
        cost
      };
      
      setProperties([...properties, newProperty]);
      setCurrentProperty({ name: '', address: '', units: 0, tier: '', paymentMethod: '' });
    }
  };

  const removeProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handlePaymentSetup = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Save property data to localStorage
    localStorage.setItem('userProperties', JSON.stringify(properties));
    localStorage.setItem('onboardingCompleted', 'true');
    
    setIsProcessing(false);
    onComplete();
  };

  const getTotalCost = () => {
    return properties.reduce((total, property) => total + property.cost, 0);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        <Navigation />
        <div className="max-w-2xl mx-auto p-6 pt-20">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Setting Up Your Account</h3>
              <p className="text-gray-600 mb-4">Configuring your properties and payment methods...</p>
              <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Processing payment information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Setting up property profiles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Configuring dashboard and alerts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property & Payment Setup</h1>
          <p className="text-gray-600">Add your properties and configure payment methods</p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Add Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <Label className="mb-3 block">Select Tier</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        currentProperty.tier === tier.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setCurrentProperty(prev => ({ ...prev, tier: tier.name }))}
                    >
                      <div className="text-center mb-3">
                        <h3 className="font-semibold">{tier.name}</h3>
                        <div className="text-2xl font-bold text-blue-600">${tier.price}</div>
                        <div className="text-sm text-gray-500">per unit/month</div>
                      </div>
                      <ul className="space-y-1 text-sm">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <Check className="h-3 w-3 text-green-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {currentProperty.tier && currentProperty.units > 0 && (
                <div>
                  <Label className="mb-3 block">Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      const cost = calculateCost(currentProperty.units, tiers.find(t => t.name === currentProperty.tier)?.price || 3, method.id);
                      const originalCost = currentProperty.units * (tiers.find(t => t.name === currentProperty.tier)?.price || 3);
                      
                      return (
                        <div
                          key={method.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            currentProperty.paymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setCurrentProperty(prev => ({ ...prev, paymentMethod: method.id }))}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent className="h-5 w-5" />
                            <span className="font-medium">{method.name}</span>
                          </div>
                          {method.discount > 0 && (
                            <Badge className="mb-2 bg-green-100 text-green-800">
                              {method.discount}% discount
                            </Badge>
                          )}
                          <div className="text-sm">
                            <div className="font-semibold">${cost.toFixed(2)}/month</div>
                            {method.discount > 0 && (
                              <div className="text-gray-500 line-through">${originalCost.toFixed(2)}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button onClick={addProperty} disabled={!currentProperty.name || !currentProperty.address || currentProperty.units === 0 || !currentProperty.tier || !currentProperty.paymentMethod}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
                {properties.length > 0 && (
                  <Button onClick={() => setStep(2)} variant="outline">
                    Continue to Payment ({properties.length} {properties.length === 1 ? 'property' : 'properties'})
                  </Button>
                )}
              </div>

              {properties.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Added Properties</h3>
                  <div className="space-y-2">
                    {properties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{property.name}</div>
                          <div className="text-sm text-gray-600">
                            {property.units} units • {property.tier} • ${property.cost.toFixed(2)}/month
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProperty(property.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold">Total Monthly Cost: ${getTotalCost().toFixed(2)}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Payment Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Order Summary</h3>
                <div className="space-y-2">
                  {properties.map((property) => (
                    <div key={property.id} className="flex justify-between text-sm">
                      <span>{property.name} ({property.units} units, {property.tier})</span>
                      <span>${property.cost.toFixed(2)}/month</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-semibold">
                    <div className="flex justify-between">
                      <span>Total Monthly</span>
                      <span>${getTotalCost().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your payment methods and billing will be set up based on your property configurations.
                </p>
                <Button onClick={handlePaymentSetup} className="w-full" size="lg">
                  Complete Setup & Continue to Dashboard
                </Button>
              </div>

              <div className="flex justify-center">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back to Properties
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PropertyPaymentSetup;
