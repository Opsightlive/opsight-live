
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, User, Eye, EyeOff, AlertCircle, CheckCircle, CreditCard, Loader2, Building2 } from 'lucide-react';
import MultiPropertySetup from './MultiPropertySetup';

interface OnboardingSetupProps {
  onComplete: () => void;
}

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

const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Login Setup
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Step 2: Properties
  const [properties, setProperties] = useState<Property[]>([]);
  
  // Step 3: Payment
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const passwordsMatch = password === confirmPassword;

  const handleContinueToProperties = () => {
    console.log('Login setup complete:', { companyName, role, email });
    setStep(2);
  };

  const handlePropertiesComplete = (propertiesData: Property[]) => {
    setProperties(propertiesData);
    setStep(3);
  };

  const handleCompleteSetup = () => {
    console.log('Completing setup with payment info');
    setStep(4);
    startDataSync();
  };

  const startDataSync = () => {
    setLoading(true);
    
    setTimeout(() => {
      localStorage.setItem('userProperties', JSON.stringify(properties));
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    }, 3000);
  };

  const getTotalCost = () => {
    return properties.reduce((total, property) => total + property.cost, 0);
  };

  const getTotalCostWithDiscount = () => {
    const totalCost = getTotalCost();
    return totalCost * 0.9; // 10% discount
  };

  // Step 1: Login Setup
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">OPSIGHT</h1>
            <p className="text-blue-200 text-base sm:text-lg mb-4">OPERATIONAL INSIGHT</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Create Your Account</h2>
            <p className="text-blue-200 text-sm sm:text-base">Start your 14-day free trial</p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-gray-700 text-sm sm:text-base">Company Name</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                    className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-700 text-sm sm:text-base">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="mt-1 h-10 sm:h-11">
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
                
                <div>
                  <Label className="text-gray-700 text-sm sm:text-base">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-700 text-sm sm:text-base">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="pr-10 h-10 sm:h-11 text-sm sm:text-base"
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
                  <Label className="text-gray-700 text-sm sm:text-base">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className={`pr-10 h-10 sm:h-11 text-sm sm:text-base ${!passwordsMatch && confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 min-w-[24px] min-h-[24px]"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {!passwordsMatch && confirmPassword && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs sm:text-sm">
                      <AlertCircle className="h-3 w-3" />
                      Passwords do not match
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleContinueToProperties}
                disabled={!passwordsMatch || !password || !confirmPassword || !email || !companyName || !role}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm sm:text-lg font-semibold h-11 sm:h-12"
              >
                Continue to Property Setup
              </Button>

              <div className="text-center text-xs sm:text-sm text-gray-600">
                <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Properties Setup  
  if (step === 2) {
    return (
      <MultiPropertySetup 
        onComplete={handlePropertiesComplete}
        onBack={() => setStep(1)}
      />
    );
  }

  // Step 3: Payment Setup
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl sm:max-w-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">OPSIGHT</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-4">Payment Information</h2>
            <p className="text-sm sm:text-base text-gray-600">Start your 14-day free trial • No charges until day 15</p>
          </div>

          <Card>
            <CardContent className="p-4 sm:p-8">
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Order Summary</h4>
                  <div className="space-y-2">
                    {properties.map((property) => (
                      <div key={property.id} className="flex justify-between text-xs sm:text-sm">
                        <span className="truncate mr-2">{property.name} ({property.units} units, {property.tier})</span>
                        <span className="whitespace-nowrap">${property.cost.toFixed(2)}/month</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>${getTotalCost().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm text-green-600">
                        <span>Discount (10%)</span>
                        <span>-${(getTotalCost() - getTotalCostWithDiscount()).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-sm sm:text-base">
                        <span>Total Monthly</span>
                        <span>${getTotalCostWithDiscount().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm">Card Number</Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Expiry</Label>
                      <Input
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="12/25"
                        className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm">CVV</Label>
                      <Input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Name on Card</Label>
                      <Input
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="JOHN DOE"
                        className="mt-1 h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="h-11 sm:h-12 text-sm sm:text-base">
                  Back to Properties
                </Button>
                <Button 
                  onClick={handleCompleteSetup}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-11 sm:h-12 text-sm sm:text-base"
                >
                  Complete Setup & Start Trial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 4: Processing
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl sm:max-w-2xl text-center">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Setting Up Your Account</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Configuring your properties and dashboard...</p>
              
              <div className="space-y-2 text-xs sm:text-sm text-left max-w-md mx-auto">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Processing account information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Setting up property profiles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  <span>Configuring dashboard and monitoring</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default OnboardingSetup;
