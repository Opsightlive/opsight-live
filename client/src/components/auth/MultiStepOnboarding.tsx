
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Database, CreditCard, Check, Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface MultiStepOnboardingProps {
  onComplete: () => void;
}

interface Property {
  name: string;
  units: string;
  address: string;
  tier: 'basic' | 'professional' | 'enterprise';
  pmSoftware: string;
  paymentMethod: 'card' | 'ach';
}

const MultiStepOnboarding: React.FC<MultiStepOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    email: '',
    password: '',
    dataSource: 'connect',
    properties: [
      { name: '', units: '', address: '', tier: 'basic' as const, pmSoftware: '', paymentMethod: 'card' as const }
    ] as Property[],
    selectedPlan: 'professional',
    paymentInfo: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      name: '',
      country: 'US'
    }
  });

  const pricingTiers = [
    { 
      id: 'basic', 
      name: 'Basic', 
      price: 3, 
      features: ['Essential monitoring', 'Basic KPI tracking', 'Standard alerts', 'Monthly reporting', 'Email support']
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      price: 4, 
      features: ['Everything in Basic', 'Real-time KPI tracking', 'Predictive alerts', 'AI-powered insights', '24/7 support'],
      popular: true
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise', 
      price: 5, 
      features: ['Everything in Professional', 'Advanced analytics', 'Custom integrations', 'Dedicated account manager', 'Priority support']
    }
  ];

  const pmSoftwareOptions = [
    'AppFolio', 'Yardi', 'RentManager', 'Buildium', 'TenantCloud', 
    'Rent Spree', 'SimplifyEm', 'Landlord Studio', 'RentBerry', 'Avail', 'Other'
  ];

  const addProperty = () => {
    setFormData(prev => ({
      ...prev,
      properties: [...prev.properties, { name: '', units: '', address: '', tier: 'basic', pmSoftware: '', paymentMethod: 'card' }]
    }));
  };

  const removeProperty = (index: number) => {
    if (formData.properties.length > 1) {
      setFormData(prev => ({
        ...prev,
        properties: prev.properties.filter((_, i) => i !== index)
      }));
    }
  };

  const updateProperty = (index: number, updates: Partial<Property>) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.map((prop, i) => i === index ? { ...prop, ...updates } : prop)
    }));
  };

  const calculateTotalCost = () => {
    return formData.properties.reduce((total, property) => {
      const units = parseInt(property.units || '0');
      const tierPrice = pricingTiers.find(t => t.id === property.tier)?.price || 3;
      return total + (units * tierPrice);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Store data and complete onboarding
    localStorage.setItem('onboardingData', JSON.stringify(formData));
    toast.success('Setup completed successfully!');
    onComplete();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5, 6, 7].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step < currentStep ? <Check className="h-4 w-4" /> : step}
          </div>
          {step < 7 && <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Company & Role Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            placeholder="Jordan Equity Partners"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="role">Your Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gp">GP (General Partner)</SelectItem>
              <SelectItem value="lp">LP (Limited Partner)</SelectItem>
              <SelectItem value="pm">Property Manager</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="jordan@example.co"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••••"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Property Portfolio
          </CardTitle>
          <Button onClick={addProperty} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.properties.map((property, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Property {index + 1}</h4>
              {formData.properties.length > 1 && (
                <Button onClick={() => removeProperty(index)} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Property Name</Label>
                <Input
                  value={property.name}
                  onChange={(e) => updateProperty(index, { name: e.target.value })}
                  placeholder="Greenview Apartments"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Units</Label>
                <Input
                  type="number"
                  value={property.units}
                  onChange={(e) => updateProperty(index, { units: e.target.value })}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={property.address}
                  onChange={(e) => updateProperty(index, { address: e.target.value })}
                  placeholder="123 Main St, City, State"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>PM Software</Label>
                <Select 
                  value={property.pmSoftware} 
                  onValueChange={(value) => updateProperty(index, { pmSoftware: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select PM Software" />
                  </SelectTrigger>
                  <SelectContent>
                    {pmSoftwareOptions.map((software) => (
                      <SelectItem key={software} value={software}>
                        {software}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select 
                  value={property.paymentMethod} 
                  onValueChange={(value: 'card' | 'ach') => updateProperty(index, { paymentMethod: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit Card</SelectItem>
                    <SelectItem value="ach">ACH/Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Data Source Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={formData.dataSource} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, dataSource: value }))}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <RadioGroupItem value="connect" id="connect" />
            <div>
              <Label htmlFor="connect" className="font-medium">Connect My PM System</Label>
              <p className="text-sm text-gray-600">Automatically sync data from your property management software</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <RadioGroupItem value="upload" id="upload" />
            <div>
              <Label htmlFor="upload" className="font-medium">Upload Reports Manually</Label>
              <p className="text-sm text-gray-600">Manually upload your reports and data files</p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Choose Your Plan</CardTitle>
        <p className="text-center text-gray-600">Select the plan that best fits your needs</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all relative ${
                formData.selectedPlan === tier.id 
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, selectedPlan: tier.id }))}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="text-3xl font-bold text-blue-600">${tier.price}</p>
                <p className="text-sm text-gray-600">per unit/month</p>
              </div>
              <ul className="space-y-2 mb-4">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              {formData.selectedPlan === tier.id && (
                <Check className="h-6 w-6 text-blue-600 mx-auto" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep5 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            value={formData.paymentInfo.cardNumber}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, cardNumber: e.target.value }
            }))}
            placeholder="1234 5678 9012 3456"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              value={formData.paymentInfo.expiryDate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentInfo: { ...prev.paymentInfo, expiryDate: e.target.value }
              }))}
              placeholder="MM/YY"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              value={formData.paymentInfo.cvv}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentInfo: { ...prev.paymentInfo, cvv: e.target.value }
              }))}
              placeholder="123"
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="cardName">Name on Card</Label>
          <Input
            id="cardName"
            value={formData.paymentInfo.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              paymentInfo: { ...prev.paymentInfo, name: e.target.value }
            }))}
            placeholder="John Doe"
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep6 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Review & Start Trial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Company:</span>
            <span className="font-medium">{formData.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span>Properties:</span>
            <span className="font-medium">{formData.properties.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Units:</span>
            <span className="font-medium">
              {formData.properties.reduce((sum, prop) => sum + parseInt(prop.units || '0'), 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Selected Plan:</span>
            <span className="font-medium capitalize">{formData.selectedPlan}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-4">
            <span>Monthly Total:</span>
            <span>{formatCurrency(calculateTotalCost())}</span>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-green-800 font-medium">🎉 Start your 14-day free trial</p>
          <p className="text-sm text-green-600 mt-1">No charges until your trial ends</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep7 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Connecting Your Data</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Setting up your account...</h3>
          <p className="text-gray-600">
            We're connecting to your PM system and importing your data. This may take a few minutes.
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <span className="text-sm">Account created</span>
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <span className="text-sm">Connecting to {formData.properties[0]?.pmSoftware || 'PM System'}</span>
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-500">Importing property data</span>
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">OPSIGHT</h1>
          <p className="text-blue-600 text-lg">OPERATIONAL INSIGHT</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
          {currentStep === 7 && renderStep7()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto">
          <Button 
            onClick={handleBack} 
            variant="outline" 
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {currentStep < 6 && (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {currentStep === 6 && (
            <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
              Start Trial
            </Button>
          )}
          
          {currentStep === 7 && (
            <Button onClick={handleFinish} className="bg-blue-600 hover:bg-blue-700">
              Continue to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepOnboarding;
