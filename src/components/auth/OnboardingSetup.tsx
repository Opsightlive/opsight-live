
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building, Home, Database, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    dataSource: 'connect-pm',
    pmSoftware: '',
    otherSoftware: ''
  });

  const [properties, setProperties] = useState<Property[]>([
    { id: '1', name: '', units: '', address: '' }
  ]);

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

    // If connecting PM system, validate software selection
    if (formData.dataSource === 'connect-pm') {
      if (!formData.pmSoftware) {
        alert('Please select your property management software');
        return;
      }
      if (formData.pmSoftware === 'other' && !formData.otherSoftware.trim()) {
        alert('Please specify your property management software');
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
          {totalProperties > 0 && (
            <p className="text-gray-600 mt-2">
              {totalProperties} {totalProperties === 1 ? 'property' : 'properties'} configured
            </p>
          )}
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
                        <SelectItem value="onesite">OneSite</SelectItem>
                        <SelectItem value="yardi">Yardi</SelectItem>
                        <SelectItem value="resman">RESMan</SelectItem>
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
              Complete Setup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingSetup;
