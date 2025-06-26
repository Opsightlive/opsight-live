
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Calendar, AlertTriangle, Zap, ArrowUpCircle, Settings } from 'lucide-react';
import PricingCalculator from '../pricing/PricingCalculator';

interface SubscriptionManagementProps {
  currentPlan?: {
    tier: string;
    units: number;
    billingPeriod: 'monthly' | 'annual';
    amount: number;
    nextBilling: string;
    status: 'active' | 'trial' | 'cancelled';
  };
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ 
  currentPlan = {
    tier: 'Professional',
    units: 50,
    billingPeriod: 'monthly',
    amount: 200,
    nextBilling: '2025-01-15',
    status: 'trial'
  }
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800">Free Trial</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePlanChange = (tier: string, billingPeriod: 'monthly' | 'annual', units: number, total: number) => {
    console.log('Plan change requested:', { tier, billingPeriod, units, total });
    // Here you would call your subscription update API
    setShowUpgradeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Current Subscription
            </CardTitle>
            {getStatusBadge(currentPlan.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg">{currentPlan.tier} Plan</h3>
              <p className="text-gray-600">{currentPlan.units} units • {currentPlan.billingPeriod} billing</p>
              <div className="mt-2">
                <span className="text-2xl font-bold">{formatCurrency(currentPlan.amount)}</span>
                <span className="text-gray-500">/{currentPlan.billingPeriod}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {currentPlan.status === 'trial' 
                    ? `Trial ends ${formatDate(currentPlan.nextBilling)}`
                    : `Next billing ${formatDate(currentPlan.nextBilling)}`
                  }
                </span>
              </div>
              
              {currentPlan.status === 'trial' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800">Free Trial Active</p>
                      <p className="text-blue-700">
                        We won't charge your card during the trial. 
                        On day 15, you'll be charged {formatCurrency(currentPlan.amount)} for the full month.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Change Your Subscription Plan</DialogTitle>
                </DialogHeader>
                <PricingCalculator 
                  onPlanSelect={handlePlanChange}
                  defaultUnits={currentPlan.units}
                />
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage Billing
            </Button>
            
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Professional Plan</p>
                <p className="text-sm text-gray-600">Jan 1, 2025 - Jan 31, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(200)}</p>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Professional Plan</p>
                <p className="text-sm text-gray-600">Dec 1, 2024 - Dec 31, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(200)}</p>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
            
            <div className="text-center py-4">
              <Button variant="ghost" size="sm">View All Billing History</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
