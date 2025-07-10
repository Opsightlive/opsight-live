
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

interface UserSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const UserSetupModal: React.FC<UserSetupModalProps> = ({ isOpen, onClose, userEmail }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    role: '',
    portfolioSize: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to update user profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-gray-900">
            Complete Your Profile
          </DialogTitle>
          <p className="text-gray-600 text-center">
            Help us personalize your Opsight experience
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => handleInputChange('role', value)} required>
              <SelectTrigger className="border-gray-300 focus:border-blue-600 focus:ring-blue-600">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asset-manager">Asset Manager</SelectItem>
                <SelectItem value="portfolio-manager">Portfolio Manager</SelectItem>
                <SelectItem value="property-manager">Property Manager</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="portfolioSize">Portfolio Size</Label>
            <Select onValueChange={(value) => handleInputChange('portfolioSize', value)} required>
              <SelectTrigger className="border-gray-300 focus:border-blue-600 focus:ring-blue-600">
                <SelectValue placeholder="Select portfolio size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 properties</SelectItem>
                <SelectItem value="11-50">11-50 properties</SelectItem>
                <SelectItem value="51-100">51-100 properties</SelectItem>
                <SelectItem value="100+">100+ properties</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Saving...' : 'Complete Setup'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserSetupModal;
