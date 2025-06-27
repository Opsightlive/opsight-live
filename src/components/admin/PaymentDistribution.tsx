
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Send, 
  DollarSign, 
  Banknote, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentDistribution = () => {
  const { toast } = useToast();
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [distributionAmount, setDistributionAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  const accountBalance = 245000;
  const pendingDistributions = 15000;
  const availableForDistribution = accountBalance - pendingDistributions;

  const bankAccounts = [
    {
      id: 'primary',
      name: 'Business Checking',
      bank: 'Chase Bank',
      accountNumber: '****1234',
      type: 'checking',
      isDefault: true
    },
    {
      id: 'savings',
      name: 'Business Savings',
      bank: 'Chase Bank',
      accountNumber: '****5678',
      type: 'savings',
      isDefault: false
    },
    {
      id: 'investment',
      name: 'Investment Account',
      bank: 'Morgan Stanley',
      accountNumber: '****9012',
      type: 'investment',
      isDefault: false
    }
  ];

  const recentDistributions = [
    {
      id: 'DIST-2024-001',
      amount: 50000,
      account: 'Business Checking',
      status: 'completed',
      date: '2024-01-12',
      type: 'profit_distribution'
    },
    {
      id: 'DIST-2024-002',
      amount: 25000,
      account: 'Business Savings',
      status: 'pending',
      date: '2024-01-15',
      type: 'reserve_fund'
    },
    {
      id: 'DIST-2024-003',
      amount: 15000,
      account: 'Investment Account',
      status: 'processing',
      date: '2024-01-14',
      type: 'investment'
    }
  ];

  const scheduledDistributions = [
    {
      id: 'SCHED-001',
      amount: 30000,
      account: 'Business Checking',
      frequency: 'monthly',
      nextDate: '2024-02-01',
      type: 'profit_distribution'
    },
    {
      id: 'SCHED-002',
      amount: 10000,
      account: 'Business Savings',
      frequency: 'quarterly',
      nextDate: '2024-04-01',
      type: 'reserve_fund'
    }
  ];

  const handleDistribution = () => {
    if (!distributionAmount || !selectedAccount) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and select account",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(distributionAmount);
    if (amount > availableForDistribution) {
      toast({
        title: "Insufficient Funds",
        description: `Maximum available: $${availableForDistribution.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Distribution Initiated",
      description: `$${amount.toLocaleString()} distribution to ${selectedAccount} has been initiated`,
    });

    setDistributionAmount('');
    setSelectedAccount('');
    setShowDistributionModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing': return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Account Balance</p>
                <p className="text-3xl font-bold text-blue-900">
                  ${accountBalance.toLocaleString()}
                </p>
              </div>
              <Banknote className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending Distributions</p>
                <p className="text-3xl font-bold text-yellow-900">
                  ${pendingDistributions.toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Available to Distribute</p>
                <p className="text-3xl font-bold text-green-900">
                  ${availableForDistribution.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Distributions</h2>
        <div className="flex gap-2">
          <Dialog open={showDistributionModal} onOpenChange={setShowDistributionModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Send className="h-4 w-4" />
                New Distribution
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Payment Distribution</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Distribution Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={distributionAmount}
                    onChange={(e) => setDistributionAmount(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available: ${availableForDistribution.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label htmlFor="account">Destination Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.name}>
                          {account.name} - {account.bank} ({account.accountNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleDistribution} className="w-full">
                  Initiate Distribution
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Distribution
          </Button>
        </div>
      </div>

      {/* Bank Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-8 w-8 text-gray-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{account.name}</h4>
                      {account.isDefault && (
                        <Badge className="bg-blue-100 text-blue-800">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{account.bank} • {account.accountNumber}</p>
                    <p className="text-xs text-gray-500 capitalize">{account.type} account</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent and Scheduled Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Distributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Distributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDistributions.map((distribution) => (
                <div key={distribution.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(distribution.status)}
                    <div>
                      <p className="font-medium">{distribution.id}</p>
                      <p className="text-sm text-gray-600">{distribution.account}</p>
                      <p className="text-xs text-gray-500">{distribution.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${distribution.amount.toLocaleString()}</p>
                    <Badge className={getStatusColor(distribution.status)}>
                      {distribution.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Distributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled Distributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledDistributions.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{schedule.account}</p>
                    <p className="text-sm text-gray-600 capitalize">{schedule.frequency} distribution</p>
                    <p className="text-xs text-gray-500">Next: {schedule.nextDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${schedule.amount.toLocaleString()}</p>
                    <Button variant="outline" size="sm" className="mt-1">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDistribution;
