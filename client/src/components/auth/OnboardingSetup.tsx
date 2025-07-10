import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Database, User, Plus, X, CreditCard, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from 'sonner';

interface OnboardingSetupProps {
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

const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onComplete }) => {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [dataSource, setDataSource] = useState('connect');
  const [properties, setProperties] = useState<Property[]>([
    { name: '', units: '', address: '', tier: 'basic', pmSoftware: '', paymentMethod: 'card' }
  ]);
  const [isSaving, setIsSaving] = useState(false);

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
      features: ['Everything in Basic', 'Real-time KPI tracking', 'Predictive alerts', 'AI-powered insights', '24/7 support']
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise', 
      price: 5, 
      features: ['Everything in Professional', 'Advanced analytics', 'Custom integrations', 'Dedicated account manager', 'Priority support']
    }
  ];

  const pmSoftwareOptions = [
    'AppFolio',
    'Yardi',
    'RentManager',
    'Buildium',
    'TenantCloud',
    'Rent Spree',
    'SimplifyEm',
    'Landlord Studio',
    'RentBerry',
    'Avail',
    'Other'
  ];

  const addProperty = () => {
    setProperties([...properties, { name: '', units: '', address: '', tier: 'basic', pmSoftware: '', paymentMethod: 'card' }]);
  };

  const removeProperty = (index: number) => {
    if (properties.length > 1) {
      setProperties(properties.filter((_, i) => i !== index));
    }
  };

  const updateProperty = (index: number, updates: Partial<Property>) => {
    setProperties(properties.map((prop, i) => i === index ? { ...prop, ...updates } : prop));
  };

  const calculateTotalCost = () => {
    return properties.reduce((total, property) => {
      const units = parseInt(property.units || '0');
      const tierPrice = pricingTiers.find(t => t.id === property.tier)?.price || 3;
      return total + (units * tierPrice);
    }, 0);
  };

  const calculateDiscount = () => {
    const totalCost = calculateTotalCost();
    const achProperties = properties.filter(p => p.paymentMethod === 'ach');
    const cardProperties = properties.filter(p => p.paymentMethod === 'card');
    
    let discount = 0;
    
    achProperties.forEach(property => {
      const units = parseInt(property.units || '0');
      const tierPrice = pricingTiers.find(t => t.id === property.tier)?.price || 3;
      discount += (units * tierPrice) * 0.05;
    });
    
    cardProperties.forEach(property => {
      const units = parseInt(property.units || '0');
      const tierPrice = pricingTiers.find(t => t.id === property.tier)?.price || 3;
      discount += (units * tierPrice) * 0.03;
    });
    
    return Math.round(discount * 100) / 100;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword) {
      setPasswordsMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordsMatch(password === value);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleGetStarted = async () => {
    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    if (!companyName || !role || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (properties.some(p => !p.name || !p.units || !p.address)) {
      toast.error('Please complete all property information');
      return;
    }

    setIsSaving(true);
    
    try {
      // Store the setup data in localStorage for the payment step
      const setupData = {
        companyName,
        role,
        email,
        password,
        dataSource,
        properties: properties.map(prop => ({
          ...prop,
          monthlyCost: (() => {
            const units = parseInt(prop.units || '0');
            const tierPrice = pricingTiers.find(t => t.id === prop.tier)?.price || 3;
            return units * tierPrice;
          })()
        })),
        totalCost: calculateTotalCost(),
        discount: calculateDiscount()
      };
      
      localStorage.setItem('onboardingData', JSON.stringify(setupData));
      
      toast.success('Setup data saved successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving setup data:', error);
      toast.error('Failed to save setup data');
    } finally {
      setIsSaving(false);
    }
  };

  const totalCost = calculateTotalCost();
  const discount = calculateDiscount();
  const finalCost = totalCost - discount;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <img 
              src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
              alt="OPSIGHT Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">OPSIGHT</h1>
          <p className="text-blue-600 text-lg mb-4">OPERATIONAL INSIGHT</p>
          <h2 className="text-2xl font-semibold text-gray-800">Let's get you set up.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
                Company & Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium">Company Name:</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Jordan Equity Partners"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="GP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gp">GP (General Partner)</SelectItem>
                    <SelectItem value="lp">LP (Limited Partner)</SelectItem>
                    <SelectItem value="pm">Property Manager</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                Login Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@example.co"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="••••••••••"
                    className="pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    placeholder="••••••••••"
                    className={`pr-10 ${!passwordsMatch && confirmPassword ? 'border-red-500' : ''}`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!passwordsMatch && confirmPassword && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    Passwords do not match
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
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
            {properties.map((property, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Property {index + 1}</h4>
                  {properties.length > 1 && (
                    <Button 
                      onClick={() => removeProperty(index)} 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Property Name</Label>
                    <Input
                      value={property.name}
                      onChange={(e) => updateProperty(index, { name: e.target.value })}
                      placeholder="Greenview Apts"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Units</Label>
                    <Input
                      type="number"
                      value={property.units}
                      onChange={(e) => updateProperty(index, { units: e.target.value })}
                      placeholder="100"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    <Input
                      value={property.address}
                      onChange={(e) => updateProperty(index, { address: e.target.value })}
                      placeholder="123 Main St, City, State"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">PM Software</Label>
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
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <Select 
                      value={property.paymentMethod} 
                      onValueChange={(value: 'card' | 'ach') => updateProperty(index, { paymentMethod: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Credit Card (3% discount)
                          </div>
                        </SelectItem>
                        <SelectItem value="ach">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            ACH/Bank (5% discount)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Pricing Tier</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {pricingTiers.map((tier) => {
                      const isSelected = property.tier === tier.id;
                      const units = parseInt(property.units || '0');
                      const monthlyCost = units * tier.price;
                      
                      return (
                        <div
                          key={tier.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => updateProperty(index, { tier: tier.id as any })}
                        >
                          <div className="text-center">
                            <h5 className="font-medium">{tier.name}</h5>
                            <p className="text-sm text-gray-600">${tier.price}/unit/month</p>
                            {units > 0 && (
                              <p className="text-sm font-medium text-blue-600 mt-1">
                                {formatCurrency(monthlyCost)}/month
                              </p>
                            )}
                            {isSelected && (
                              <Check className="h-4 w-4 text-blue-600 mx-auto mt-2" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-2 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-blue-600" />
              Data Source Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={dataSource} onValueChange={setDataSource} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="connect" id="connect" />
                <Label htmlFor="connect" className="text-sm">
                  Connect My PM System <span className="text-blue-600">(recommended)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="text-sm">Upload Reports Manually</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {totalCost > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Cost Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Units: {properties.reduce((sum, prop) => sum + parseInt(prop.units || '0'), 0)}</span>
                  <span className="font-medium">{formatCurrency(totalCost)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Payment Discounts:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Monthly Total:</span>
                  <span>{formatCurrency(finalCost)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button 
            onClick={handleGetStarted}
            disabled={!passwordsMatch || !password || !confirmPassword || isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Setup...
              </div>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSetup;
