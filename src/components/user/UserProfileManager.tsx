import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Mail, Building, Phone, Shield, Calendar, CreditCard } from 'lucide-react';

interface UserProfileManagerProps {
  onClose?: () => void;
}

const UserProfileManager: React.FC<UserProfileManagerProps> = ({ onClose }) => {
  const { user, profile, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        phone: profile.phone || '',
        role: profile.role || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        phone: profile.phone || '',
        role: profile.role || ''
      });
    }
    setIsEditing(false);
  };

  const getSubscriptionStatus = () => {
    if (!profile) return 'Unknown';
    
    if (profile.subscription_status === 'trial') {
      const trialEnd = new Date(profile.trial_end || '');
      const now = new Date();
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0) {
        return `Trial (${daysLeft} days left)`;
      } else {
        return 'Trial Expired';
      }
    }
    
    return profile.subscription_status || 'Unknown';
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 font-medium">{profile.full_name || 'Not set'}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  {isEditing ? (
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 font-medium">{profile.company_name || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 font-medium">{profile.phone || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  {isEditing ? (
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Role</option>
                      <option value="Property Manager">Property Manager</option>
                      <option value="Property Owner">Property Owner</option>
                      <option value="Company Admin">Company Admin</option>
                      <option value="Analyst">Analyst</option>
                      <option value="User">User</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-900 font-medium">{profile.role || 'Not set'}</p>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Subscription</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {getSubscriptionStatus()}
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Member Since</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Last Updated</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Onboarding</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.onboarding_completed ? 'Completed' : 'Pending'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://calendly.com/opsightlive', '_blank')}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Support Call
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Building className="h-4 w-4 mr-2" />
                Manage Properties
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManager;
