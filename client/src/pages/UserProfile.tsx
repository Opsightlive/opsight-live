
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Building2, Calendar, Edit, Save, X, Camera, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { user, isCompanyUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    role: user?.role || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log('Saving user data:', formData);
    if (avatarPreview) {
      console.log('Saving new avatar:', avatarPreview);
    }
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
      role: user?.role || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    });
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentAvatar = avatarPreview || user?.avatar;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Blue Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">User Profile</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Manage your account settings and preferences
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Account Management</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span>Company Settings</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>Communication Preferences</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Activity History</span>
              </div>
            </div>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={handleSave} className="bg-white text-blue-600 hover:bg-blue-50">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview - Made Larger */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar 
                  className={`h-32 w-32 ${isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={currentAvatar} alt={user?.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                    onClick={handleAvatarClick}
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAvatarClick}
                className="mx-auto mb-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            )}
            <CardTitle className="text-2xl mb-2">{user?.name || 'User Name'}</CardTitle>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            <div className="flex justify-center mb-6">
              {isCompanyUser ? (
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2">Company Account</Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800 px-4 py-2">Client Account</Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium">{user?.company || 'No company'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium">{user?.role || 'No role specified'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">December 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg">{user?.name || 'Not specified'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg">{user?.email || 'Not specified'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg">{user?.company || 'Not specified'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                {isEditing ? (
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg">{user?.role || 'Not specified'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg">{user?.phone || 'Not specified'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg min-h-[100px]">{user?.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">15</p>
                  <p className="text-sm text-gray-600 mt-2">Properties Managed</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">2,456</p>
                  <p className="text-sm text-gray-600 mt-2">Total Units</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">6</p>
                  <p className="text-sm text-gray-600 mt-2">Months Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
