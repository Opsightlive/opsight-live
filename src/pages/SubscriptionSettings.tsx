
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import SubscriptionManagement from '@/components/subscription/SubscriptionManagement';

const SubscriptionSettings = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Settings</h1>
        <p className="text-gray-600">
          Manage your subscription, billing information, and plan details.
        </p>
      </div>

      <SubscriptionManagement />
    </div>
  );
};

export default SubscriptionSettings;
