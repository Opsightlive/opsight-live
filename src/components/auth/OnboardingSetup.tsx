
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Home, Database, Plus, Trash2, ArrowLeft } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
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

  const handleBackClick = () => {
    navigate(-1);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate properties
    const validProperties = properties.filter(prop => 
      prop.name.trim() && prop.units.trim() && prop.address.trim()
    );

    if (validProperties.length === 0) {
      alert('Please add at least one complete property');
      return;
    }

    // Validate required fields
    if (!formData.companyName.trim() || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }

    // If connecting PM system, validate software selection and credentials
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
    
    // Get existing registration data and merge with new data
    const existingRegistration = JSON.parse(localStorage.getItem('pendingRegistration') || '{}');
    
    // Store the registration data for use after payment
    localStorage.setItem('pendingRegistration', JSON.stringify({
      ...existingRegistration,
      userData: {
        companyName: formData.companyName,
        role: formData.role,
        properties: validProperties,
        dataSource: formData.dataSource,
        pmSoftware: formData.pmSoftware === 'other' ? formData.otherSoftware : formData.pmSoftware,
        pmCredentials: formData.dataSource === 'connect-pm' ? {
          username: formData.pmUsername,
          password: formData.pmPassword
        } : null,
        propertyCount: validProperties.length,
        totalCost: validProperties.length * 295
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Add New Property</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Let's get your new property set up with OPSIGHT
              </p>
              {totalProperties > 0 && (
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                <h3 className="text-xl font-bold">Property Portfolio</h3>
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
                        <SelectItem value="mri">MRI Software</SelectItem>
                        <SelectItem value="propertyware">Propertyware</SelectItem>
                        <SelectItem value="buildium">Buildium</SelectItem>
                        <SelectItem value="rent-manager">Rent Manager</SelectItem>
                        <SelectItem value="property-solutions">Property Solutions</SelectItem>
                        <SelectItem value="voyager">Voyager</SelectItem>
                        <SelectItem value="greystar">Greystar</SelectItem>
                        <SelectItem value="camden">Camden</SelectItem>
                        <SelectItem value="aimco">AIMCO</SelectItem>
                        <SelectItem value="bozzuto">Bozzuto</SelectItem>
                        <SelectItem value="lincoln">Lincoln Property Company</SelectItem>
                        <SelectItem value="equity">Equity Residential</SelectItem>
                        <SelectItem value="avalon">AvalonBay Communities</SelectItem>
                        <SelectItem value="essex">Essex Property Trust</SelectItem>
                        <SelectItem value="mid-america">Mid-America Apartment Communities</SelectItem>
                        <SelectItem value="uli">ULI</SelectItem>
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

          <div className="text-center">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium"
            >
              See Your New Portfolio Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingSetup;
