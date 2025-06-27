
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, Mail, Database, User } from 'lucide-react';

interface OnboardingSetupProps {
  onComplete: () => void;
}

const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onComplete }) => {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [units, setUnits] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataSource, setDataSource] = useState('connect');

  const handleGetStarted = () => {
    // Store the setup data
    const setupData = {
      companyName,
      role,
      propertyName,
      units,
      address,
      email,
      password,
      dataSource
    };
    
    localStorage.setItem('onboardingData', JSON.stringify(setupData));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
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

        {/* Setup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Company & Role Card */}
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
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <Select value={role} onValueChange={setRole}>
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

          {/* Property Details Card */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyName" className="text-sm font-medium">Property Name</Label>
                <Input
                  id="propertyName"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="Greenview Apts"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="units" className="text-sm font-medium">Units</Label>
                <Input
                  id="units"
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, State"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Login Setup Card */}
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
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Source Setup Card */}
          <Card className="border-2">
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
        </div>

        {/* Get Started Button */}
        <div className="text-center">
          <Button 
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSetup;
