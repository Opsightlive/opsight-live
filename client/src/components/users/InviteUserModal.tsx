
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    properties: '',
    autoExpire: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Handle final submission
      console.log('Inviting user:', formData);
      onClose();
      setStep(1);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold">Invite User</DialogTitle>
            <p className="text-gray-600">Step {step} of 2</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {step === 1 && (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Full Name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="gp@example.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => handleInputChange('role', value)} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="GP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gp">GP</SelectItem>
                    <SelectItem value="lp">LP</SelectItem>
                    <SelectItem value="asset-manager">Asset Manager</SelectItem>
                    <SelectItem value="property-manager">Property Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="properties">Assign Properties</Label>
                <Select onValueChange={(value) => handleInputChange('properties', value)} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greenview">Greenview Apts</SelectItem>
                    <SelectItem value="arlington">Arlington Heights</SelectItem>
                    <SelectItem value="downtown">Downtown Plaza</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={formData.autoExpire}
                  onCheckedChange={(checked) => handleInputChange('autoExpire', checked as boolean)}
                />
                <label className="text-sm font-medium">Auto-expire invite in 7 days</label>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-4">Review Invitation</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                <p><strong>Name:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Role:</strong> {formData.role}</p>
                <p><strong>Properties:</strong> {formData.properties}</p>
                {formData.autoExpire && <p><strong>Expires:</strong> 7 days</p>}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step === 2 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
            >
              {step === 1 ? 'Continue' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
