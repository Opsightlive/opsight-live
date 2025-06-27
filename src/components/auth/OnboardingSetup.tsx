
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Database, Plus, Trash2, ArrowLeft, Check, Star, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  name: string;
  units: string;
  address: string;
}

interface OnboardingSetupProps {
  onComplete: () => void;
}

const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onComplete }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    selectedTier: '',
    dataSource: 'connect-pm',
    pmSoftware: '',
    otherSoftware: '',
    pmUsername: '',
    pmPassword: '',
    pmConfirmPassword: ''
  });

  const [properties, setProperties] = useState<Property[]>([
    { id: '1', name: '', units: '', address: '' }
  ]);

  const tiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: 295,
      description: 'Essential multifamily management tools',
      features: [
        'Property performance tracking',
        'Basic KPI dashboard',
        'Monthly reports',
        'Email support',
        'Up to 500 units'
      ],
      icon: Star,
      color: 'blue'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 495,
      description: 'Advanced analytics and automation',
      features: [
        'Everything in Basic',
        'AI-powered insights',
        'Predictive analytics',
        'Red flag alerts',
        'PM system integration',
        'Priority support',
        'Up to 2,000 units'
      ],
      icon: Crown,
      color: 'purple',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 795,
      description: 'Complete portfolio management suite',
      features: [
        'Everything in Premium',
        'Custom integrations',
        'White-label options',
        'Dedicated account manager',
        'Advanced user management',
        'Custom reporting',
        'Unlimited units'
      ],
      icon: Building,
      color: 'gold'
    }
  ];

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const addProperty = () => {
    const newProperty: Property = {
      id: Date.now().toString(),
      name: '',
      units: '',
      address: ''
    };
    setProperties([...properties, newProperty]);
  };

  const removeProperty = (id: string) => {
    if (properties.length > 1) {
      setProperties(properties.filter(prop => prop.id !== id));
    }
  };

  const updateProperty = (id: string, field: keyof Property, value: string) => {
    setProperties(properties.map(prop => 
      prop.id === id ? { ...prop, [field]: value } : prop
    ));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate basic info
      if (!formData.companyName.trim() || !formData.role) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Validate properties
      const validProperties = properties.filter(prop => 
        prop.name.trim() && prop.units.trim() && prop.address.trim()
      );
      if (validProperties.length === 0) {
        alert('Please add at least one complete property');
        return;
      }
      
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate tier selection
      if (!formData.selectedTier) {
        alert('Please select a pricing tier');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Validate data setup
      if (formData.dataSource === 'connect-pm') {
        if (!formData.pmSoftware) {
          alert('Please select your property management software');
          return;
        }
        if (formData.pmSoftware === 'other' && !formData.otherSoftware.trim()) {
          alert('Please specify your property management software');
          return;
        }
        if (!formData.pmUsername.trim()) {
          alert('Please enter your property management platform username');
          return;
        }
        if (!formData.pmPassword.trim()) {
          alert('Please enter your property management platform password');
          return;
        }
        if (formData.pmPassword !== formData.pmConfirmPassword) {
          alert('Passwords do not match');
          return;
        }
      }
      setCurrentStep(4);
    }
  };

  const handleSubmit = async () => {
    const validProperties = properties.filter(prop => 
      prop.name.trim() && prop.units.trim() && prop.address.trim()
    );

    const selectedTierData = tiers.find(tier => tier.id === formData.selectedTier);
    const totalCost = selectedTierData ? selectedTierData.price : 0;
    
    // Store the registration data for use after payment
    localStorage.setItem('pendingRegistration', JSON.stringify({
      userData: {
        companyName: formData.companyName,
        role: formData.role,
        selectedTier: formData.selectedTier,
        properties: validProperties,
        dataSource: formData.dataSource,
        pmSoftware: formData.pmSoftware === 'other' ? formData.otherSoftware : formData.pmSoftware,
        pmCredentials: formData.dataSource === 'connect-pm' ? {
          username: formData.pmUsername,
          password: formData.pmPassword
        } : null,
        propertyCount: validProperties.length,
        totalCost: totalCost
      }
    }));
    
    // Move to payment step
    onComplete();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalProperties = properties.filter(prop => 
    prop.name.trim() && prop.units.trim() && prop.address.trim()
  ).length;

  const selectedTierData = tiers.find(tier => tier.id === formData.selectedTier);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                {currentStep === 1 && 'Add New Property'}
                {currentStep === 2 && 'Choose Your Plan'}
                {currentStep === 3 && 'Data Setup'}
                {currentStep === 4 && 'Review & Payment'}
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                {currentStep === 1 && "Let's get your new property set up with OPSIGHT"}
                {currentStep === 2 && 'Select the plan that best fits your portfolio needs'}
                {currentStep === 3 && 'Configure your data integration preferences'}
                {currentStep === 4 && 'Review your selection and complete setup'}
              </p>
              {currentStep === 1 && totalProperties > 0 && (
                <p className="text-blue-100 mt-2">
                  {totalProperties} {totalProperties === 1 ? 'property' : 'properties'} configured
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="text-white hover:bg-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-white text-blue-600 border-white' 
                    : 'border-blue-300 text-blue-300'
                }`}>
                  {step < currentStep ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 ${
                    step < currentStep ? 'bg-white' : 'bg-blue-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Property Setup */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Company & Role Section */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center mb-4">
                <Building className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-bold">Company & Role</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name:</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter your company name"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => handleInputChange('role', value)} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gp">GP</SelectItem>
                      <SelectItem value="lp">LP</SelectItem>
                      <SelectItem value="asset-manager">Asset Manager</SelectItem>
                      <SelectItem value="property-manager">Property Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Properties Section */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Home className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-bold">Multifamily Property Portfolio</h3>
                </div>
                <Button
                  type="button"
                  onClick={addProperty}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Property
                </Button>
              </div>
              
              <div className="space-y-4">
                {properties.map((property, index) => (
                  <div key={property.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <Label htmlFor={`property-name-${property.id}`}>Property Name</Label>
                      <Input
                        id={`property-name-${property.id}`}
                        value={property.name}
                        onChange={(e) => updateProperty(property.id, 'name', e.target.value)}
                        placeholder="Property name"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`property-units-${property.id}`}>Number of Units</Label>
                      <Input
                        id={`property-units-${property.id}`}
                        type="number"
                        value={property.units}
                        onChange={(e) => updateProperty(property.id, 'units', e.target.value)}
                        placeholder="e.g. 100"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`property-address-${property.id}`}>Property Address</Label>
                      <Input
                        id={`property-address-${property.id}`}
                        value={property.address}
                        onChange={(e) => updateProperty(property.id, 'address', e.target.value)}
                        placeholder="Property address"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div className="flex items-end">
                      {properties.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeProperty(property.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Tier Selection */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card
                  key={tier.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    formData.selectedTier === tier.id
                      ? 'ring-2 ring-blue-500 shadow-lg'
                      : 'hover:shadow-md'
                  } ${tier.popular ? 'border-purple-200 bg-purple-50' : ''}`}
                  onClick={() => handleInputChange('selectedTier', tier.id)}
                >
                  <CardHeader className="text-center">
                    {tier.popular && (
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                        Most Popular
                      </div>
                    )}
                    <IconComponent className={`h-12 w-12 mx-auto mb-4 text-${tier.color}-600`} />
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-gray-900">
                      ${tier.price}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Step 3: Data Setup */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold">Data Source Setup</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="connect-pm" 
                  name="dataSource" 
                  value="connect-pm"
                  checked={formData.dataSource === 'connect-pm'}
                  onChange={(e) => handleInputChange('dataSource', e.target.value)}
                  className="text-blue-600"
                />
                <label htmlFor="connect-pm" className="font-medium">
                  Connect My PM System <span className="text-sm text-gray-500">(recommended)</span>
                </label>
              </div>

              {formData.dataSource === 'connect-pm' && (
                <div className="ml-6 space-y-4">
                  <div>
                    <Label htmlFor="pmSoftware">Property Management Software</Label>
                    <Select onValueChange={(value) => handleInputChange('pmSoftware', value)} required>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your PM software" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yardi">Yardi</SelectItem>
                        <SelectItem value="onesite">OneSite</SelectItem>
                        <SelectItem value="resman">RESMan</SelectItem>
                        <SelectItem value="appfolio">AppFolio</SelectItem>
                        <SelectItem value="realpage">RealPage</SelectItem>
                        <SelectItem value="entrata">Entrata</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.pmSoftware === 'other' && (
                    <div>
                      <Label htmlFor="otherSoftware">Specify Your PM Software</Label>
                      <Input
                        id="otherSoftware"
                        value={formData.otherSoftware}
                        onChange={(e) => handleInputChange('otherSoftware', e.target.value)}
                        placeholder="Enter your PM software name"
                        className="mt-1"
                        required
                      />
                    </div>
                  )}

                  {formData.pmSoftware && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900">Platform Credentials</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pmUsername">Username</Label>
                          <Input
                            id="pmUsername"
                            value={formData.pmUsername}
                            onChange={(e) => handleInputChange('pmUsername', e.target.value)}
                            placeholder="Enter your PM platform username"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="pmPassword">Password</Label>
                          <Input
                            id="pmPassword"
                            type="password"
                            value={formData.pmPassword}
                            onChange={(e) => handleInputChange('pmPassword', e.target.value)}
                            placeholder="Enter your PM platform password"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="pmConfirmPassword">Confirm Password</Label>
                          <Input
                            id="pmConfirmPassword"
                            type="password"
                            value={formData.pmConfirmPassword}
                            onChange={(e) => handleInputChange('pmConfirmPassword', e.target.value)}
                            placeholder="Confirm your PM platform password"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                      <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium">🔒 Your credentials are encrypted and secure</p>
                        <p>This allows us to automatically sync your property data and KPIs in real-time.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="upload-reports" 
                  name="dataSource" 
                  value="upload-reports"
                  checked={formData.dataSource === 'upload-reports'}
                  onChange={(e) => handleInputChange('dataSource', e.target.value)}
                  className="text-blue-600"
                />
                <label htmlFor="upload-reports" className="font-medium">
                  Upload Reports Manually
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Payment */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your selection before proceeding to payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Company Information</h4>
                    <p className="text-sm text-gray-600">Company: {formData.companyName}</p>
                    <p className="text-sm text-gray-600">Role: {formData.role}</p>
                    <p className="text-sm text-gray-600">Properties: {totalProperties}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Selected Plan</h4>
                    {selectedTierData && (
                      <>
                        <p className="text-sm text-gray-600">Plan: {selectedTierData.name}</p>
                        <p className="text-sm text-gray-600">Price: ${selectedTierData.price}/month</p>
                        <p className="text-sm text-gray-600">Data Integration: {formData.dataSource === 'connect-pm' ? 'PM System' : 'Manual Upload'}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Monthly Cost:</span>
                    <span>${selectedTierData?.price || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Proceed to Payment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSetup;
