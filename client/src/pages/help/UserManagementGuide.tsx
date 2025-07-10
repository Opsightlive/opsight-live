
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagementGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/help')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Managing team members and permissions in OpSight</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                Adding Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Follow these steps to invite new users to your OpSight account:</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Navigate to the Users section in your dashboard</li>
                <li>Click the "Invite User" button</li>
                <li>Enter the user's email address and select their role</li>
                <li>Choose which properties they should have access to</li>
                <li>Send the invitation - they'll receive an email to complete setup</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                User Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Owner/Admin</h3>
                  <p className="text-gray-600 mb-2">Full access to all features and settings</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Manage all properties and data</li>
                    <li>Invite and manage team members</li>
                    <li>Configure system settings</li>
                    <li>Access billing and subscription settings</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Asset Manager</h3>
                  <p className="text-gray-600 mb-2">Access to assigned properties with management capabilities</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>View and manage assigned properties</li>
                    <li>Configure alerts and KPIs</li>
                    <li>Generate and export reports</li>
                    <li>Communicate with property managers</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Property Manager</h3>
                  <p className="text-gray-600 mb-2">Property-specific access with operational focus</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>View assigned property data</li>
                    <li>Respond to red flag alerts</li>
                    <li>Upload reports and documents</li>
                    <li>Update property information</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Viewer</h3>
                  <p className="text-gray-600 mb-2">Read-only access to assigned properties</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>View property performance data</li>
                    <li>Access reports and dashboards</li>
                    <li>Receive alert notifications</li>
                    <li>Export basic reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Use the Principle of Least Privilege</h4>
                    <p className="text-gray-600 text-sm">Give users only the access they need to perform their job functions.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Regular Access Reviews</h4>
                    <p className="text-gray-600 text-sm">Periodically review user permissions to ensure they're still appropriate.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Property-Specific Access</h4>
                    <p className="text-gray-600 text-sm">Limit users to only the properties they need to manage or monitor.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserManagementGuide;
