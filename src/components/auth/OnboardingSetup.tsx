
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, Mail, Database, User, Eye, EyeOff, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';

interface OnboardingSetupProps {
  onComplete: () => void;
}

const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  
  // Step 1: Initial Setup
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [units, setUnits] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dataSource, setDataSource] = useState('connect');
  
  // Step 2: Plan Selection
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [unitCount, setUnitCount] = useState('100');
  
  // Step 3: Payment
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const passwordsMatch = password === confirmPassword;

  const handleGetStarted = () => {
    setStep(2);
  };

  const handleContinueToPayment = () => {
    setStep(3);
  };

  const handleCompleteSetup = () => {
    setStep(4);
  };

  const handleFinishSetup = () => {
    onComplete();
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
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

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Company & Role */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Company & Role</h3>
                </div>
                
                <div>
                  <Label className="text-sm">Company Name:</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Jordan Equity Partners"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="GP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gp">GP</SelectItem>
                      <SelectItem value="lp">LP</SelectItem>
                      <SelectItem value="pm">Property Manager</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Property Details</h3>
                </div>
                
                <div>
                  <Label className="text-sm">Property Name</Label>
                  <Input
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="Greenview Apts"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Units</Label>
                  <Input
                    type="number"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Address</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Login Setup */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Login Setup</h3>
                </div>
                
                <div>
                  <Label className="text-sm">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@example.co"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••"
                      className={`pr-10 ${!passwordsMatch && confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
              </div>

              {/* Data Source Setup */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Data Source Setup</h3>
                </div>
                
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
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleGetStarted}
                disabled={!passwordsMatch || !password || !confirmPassword}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-semibold rounded-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
            <p className="text-gray-600">Start your 14-day free trial • No charges until day 15</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">14-Day Free Trial</h3>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  We won't charge your card during the trial period. On day 15, you'll be charged for your selected plan.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">📊 Calculate Your Cost</h3>
                <div className="flex items-center gap-4">
                  <Label>Number of Units/Doors</Label>
                  <Input
                    type="number"
                    value={unitCount}
                    onChange={(e) => setUnitCount(e.target.value)}
                    className="w-32"
                    placeholder="100"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Enter the total number of units across your entire portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`border rounded-lg p-6 cursor-pointer transition-all ${selectedPlan === 'basic' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                     onClick={() => setSelectedPlan('basic')}>
                  <h3 className="font-bold text-xl mb-2">Basic</h3>
                  <div className="text-3xl font-bold mb-2">
                    ${(parseInt(unitCount || '0') * 3).toLocaleString()}
                    <span className="text-lg text-gray-600">/monthly</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">$3 per door/month</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Essential monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Basic KPI tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Standard alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Monthly reporting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Email support
                    </li>
                  </ul>
                  <Button 
                    variant={selectedPlan === 'basic' ? 'default' : 'outline'} 
                    className="w-full mt-4"
                    onClick={() => setSelectedPlan('basic')}
                  >
                    Select Plan
                  </Button>
                </div>

                <div className={`border rounded-lg p-6 cursor-pointer transition-all relative ${selectedPlan === 'professional' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                     onClick={() => setSelectedPlan('professional')}>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Professional</h3>
                  <div className="text-3xl font-bold mb-2">
                    ${(parseInt(unitCount || '0') * 4).toLocaleString()}
                    <span className="text-lg text-gray-600">/monthly</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">$4 per door/month</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Everything in Basic
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Real-time KPI tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Predictive alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      AI-powered insights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      24/7 support
                    </li>
                  </ul>
                  <Button 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setSelectedPlan('professional')}
                  >
                    Selected Plan
                  </Button>
                </div>

                <div className={`border rounded-lg p-6 cursor-pointer transition-all ${selectedPlan === 'enterprise' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                     onClick={() => setSelectedPlan('enterprise')}>
                  <h3 className="font-bold text-xl mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold mb-2">
                    ${(parseInt(unitCount || '0') * 5).toLocaleString()}
                    <span className="text-lg text-gray-600">/monthly</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">$5 per door/month</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Everything in Professional
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Custom integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Dedicated account manager
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                  <Button 
                    variant={selectedPlan === 'enterprise' ? 'default' : 'outline'} 
                    className="w-full mt-4"
                    onClick={() => setSelectedPlan('enterprise')}
                  >
                    Select Plan
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-blue-800 mb-2">Your Selected Plan</h4>
                <p className="text-blue-700">
                  Professional • {unitCount} units • monthly billing
                </p>
                <div className="text-2xl font-bold text-blue-800 mt-2">
                  ${(parseInt(unitCount || '0') * 4).toLocaleString()}/monthly
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleContinueToPayment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-semibold"
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">OPSIGHT</h1>
            <p className="text-sm text-gray-600">OPERATIONAL INSIGHT</p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Choose Your Plan</h2>
            <p className="text-gray-600">Start your 14-day free trial • No charges until day 15</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-800 mb-1">Payment Schedule</h4>
                <p className="text-green-700 text-sm">
                  We won't charge your card during the trial period. First payment of $400,800 on your card ending in 2424.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">  
                <h4 className="font-semibold text-green-800 mb-1">Pay with Credit Card & Save 3%!</h4>
                <p className="text-green-700 text-sm">
                  Get instant rebate activation when purchasing with your credit card online.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">💳 Payment Method 1 (required)</Label>
                  <div className="flex gap-4 mt-2">
                    <Button variant="default" className="bg-green-600 hover:bg-green-700">
                      Credit Card
                    </Button>
                    <Button variant="outline">
                      ACH/Bank
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Card Number</Label>
                    <Input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234567890"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Expiry</Label>
                    <Input
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="12/25"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">CVV</Label>
                    <Input
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Name on Card</Label>
                    <Input
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="JOHN DOE"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>• Payment Manager will process charges during free trial</p>
                  <p>• First payment will show on your credit card statement within</p>
                  <p>  two business days of our billing cycle</p>
                </div>

                <div className="text-sm">
                  <p>Assign Properties to this Payment Method:</p>
                  <p className="text-gray-600">All applicable units</p>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Add CVV (AMZ)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Pricing
              </Button>
              <Button 
                onClick={handleCompleteSetup}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Complete & Start Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">OPSIGHT</h1>
            <p className="text-sm text-gray-600">OPERATIONAL INSIGHT</p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Connecting Your Data</h2>
            <p className="text-gray-600">We're connecting to your property management system to sync your data.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>PM System Connection</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Payment processed successfully</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Credentials verified and encrypted</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Properties configured 2</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>PM Software revision</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-blue-800 mb-1">📊 Syncing Your Data...</h4>
              <p className="text-blue-700 text-sm">
                This process can take a few minutes. We're importing your properties, units, tenants, and financial data.
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleFinishSetup}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-semibold"
              >
                Complete Setup & Access Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OnboardingSetup;
