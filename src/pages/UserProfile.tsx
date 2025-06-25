
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile Settings</h1>
      
      <Card className="bg-white border-2 border-blue-200 rounded-lg">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Profile Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/lovable-uploads/397c940b-b808-40a6-bc06-a8dc80a7bdbb.png" />
                  <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Jordan Carter</h2>
                    <p className="text-xl text-gray-600">Fulldan Carter</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <p className="text-lg text-gray-600">jordan@opsight.io</p>
                      <Button variant="link" className="text-blue-600 p-0 h-auto text-lg">Edit</Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button variant="outline" className="px-6">Upload Photo</Button>
                    <Select defaultValue="GP">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GP">GP</SelectItem>
                        <SelectItem value="LP">LP</SelectItem>
                        <SelectItem value="AM">AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Security */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password" className="text-lg font-medium">Current Password</Label>
                    <Input 
                      id="current-password"
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••"
                      className="mt-2 text-lg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password" className="text-lg font-medium">New Password</Label>
                    <Input 
                      id="new-password"
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="•••••"
                      className="mt-2 text-lg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password" className="text-lg font-medium">Confirm Password</Label>
                    <Input 
                      id="confirm-password"
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-2 text-lg"
                    />
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3">
                    Update Password
                  </Button>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox 
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                    <label className="text-lg font-medium">Enable 2FA</label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-lg">MacBook Pro—Dallas, TX — Last Login: June 11</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-lg">iPhone—Dallas, TX — Last Login: June 10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
