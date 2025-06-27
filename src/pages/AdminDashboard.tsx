
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  Building2, 
  TrendingUp, 
  CreditCard,
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Settings,
  Download,
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import ClientManagement from '@/components/admin/ClientManagement';
import BillingManagement from '@/components/admin/BillingManagement';
import CashFlowManagement from '@/components/admin/CashFlowManagement';
import PaymentDistribution from '@/components/admin/PaymentDistribution';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data - in real app this would come from your database
  const adminMetrics = {
    totalRevenue: 847500,
    monthlyRecurring: 125000,
    totalClients: 24,
    activeProperties: 156,
    pendingPayments: 15400,
    cashOnHand: 245000,
    profitMargin: 34.2,
    growthRate: 12.8
  };

  const recentTransactions = [
    {
      id: 1,
      client: 'Horizon Real Estate Group',
      amount: 8850,
      type: 'subscription',
      status: 'completed',
      date: '2024-01-15',
      properties: 3
    },
    {
      id: 2,
      client: 'Metro Property Partners',
      amount: 12950,
      type: 'subscription',
      status: 'pending',
      date: '2024-01-14',
      properties: 5
    },
    {
      id: 3,
      client: 'Sunset Investments LLC',
      amount: 5900,
      type: 'setup',
      status: 'completed',
      date: '2024-01-13',
      properties: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-xl text-blue-100">Business Operations & Client Management</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500 text-white px-4 py-2 text-lg">
                LIVE SYSTEM
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cash Flow
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Distributions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-900">
                        ${adminMetrics.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600 flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +{adminMetrics.growthRate}% this month
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Monthly Recurring</p>
                      <p className="text-3xl font-bold text-blue-900">
                        ${adminMetrics.monthlyRecurring.toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-600">Subscription revenue</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Active Clients</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {adminMetrics.totalClients}
                      </p>
                      <p className="text-sm text-purple-600">{adminMetrics.activeProperties} properties</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Cash on Hand</p>
                      <p className="text-3xl font-bold text-orange-900">
                        ${adminMetrics.cashOnHand.toLocaleString()}
                      </p>
                      <p className="text-sm text-orange-600">{adminMetrics.profitMargin}% profit margin</p>
                    </div>
                    <Building2 className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Transactions
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {transaction.status === 'completed' ? 
                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{transaction.client}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.properties} properties • {transaction.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${transaction.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <BillingManagement />
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cashflow">
            <CashFlowManagement />
          </TabsContent>

          {/* Payment Distribution Tab */}
          <TabsContent value="payments">
            <PaymentDistribution />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
