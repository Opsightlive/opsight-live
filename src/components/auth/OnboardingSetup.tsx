
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Home, Mail, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingSetupProps {
  onComplete: () => void;
}

const OnboardingSetup: React.FC<OnboardingSetupProps> = ({ onComplete }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    propertyName: '',
    units: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    dataSource: 'connect-pm'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Register the user with the auth context
    if (formData.email && formData.password) {
      const success = await register(formData.email, formData.password);
      if (success) {
        onComplete();
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">OPSIGHT</h1>
          <p className="text-blue-600 text-lg tracking-wider">OPERATIONAL INSIGHT</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-8">Let's get you set up.</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Company & Role */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <div className="flex items-center mb-4">
              <Building className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold">Company & Role</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name:</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => handleInputChange('role', value)}>
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

          {/* Property Details */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <div className="flex items-center mb-4">
              <Home className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold">Property Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  value={formData.propertyName}
                  onChange={(e) => handleInputChange('propertyName', e.target.value)}
                  placeholder="Enter property name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="units">Number of Units</Label>
                <Input
                  id="units"
                  type="number"
                  value={formData.units}
                  onChange={(e) => handleInputChange('units', e.target.value)}
                  placeholder="e.g. 100"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter property address"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Login Setup */}
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold">Login Setup</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a secure password"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="mt-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Data Source Setup */}
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
        </form>

        <div className="text-center">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSetup;
