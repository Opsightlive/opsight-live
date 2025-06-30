
import React from 'react';
import Layout from '@/components/layout/Layout';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <>
      <Navigation />
      <Layout>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-xl text-blue-100">
              Configure your OPSIGHT preferences and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage your profile and account preferences</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configure how you receive alerts and updates</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Integration Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage your property management integrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Password and security preferences</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Settings;
