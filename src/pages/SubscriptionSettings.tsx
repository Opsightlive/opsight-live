
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import SubscriptionManagement from '@/components/subscription/SubscriptionManagement';

const SubscriptionSettings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div>
            <h1 className="text-4xl font-bold mb-4">Subscription Settings</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Manage your subscription, billing information, and plan details for your multifamily portfolio management.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <SubscriptionManagement />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
