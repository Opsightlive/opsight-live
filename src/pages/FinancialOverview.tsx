
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';

const FinancialOverview = () => {
  const financialData = {
    totalRevenue: 125000,
    totalExpenses: 87500,
    netIncome: 37500,
    cashFlow: 42300,
    occupancyRate: 94.2,
    avgRentPerUnit: 1850,
    maintenanceCosts: 15200,
    capexSpending: 28500
  };

  const properties = [
    { name: 'Sunset Gardens', revenue: 45000, expenses: 28000, roi: 12.5 },
    { name: 'Metro Plaza', revenue: 38000, expenses: 24500, roi: 10.8 },
    { name: 'Riverside Commons', revenue: 42000, expenses: 25000, roi: 14.2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive financial performance tracking and analysis
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Reports
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                ${financialData.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                ${financialData.totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-red-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +3.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Net Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                ${financialData.netIncome.toLocaleString()}
              </div>
              <p className="text-xs text-blue-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.7% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Cash Flow</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                ${financialData.cashFlow.toLocaleString()}
              </div>
              <p className="text-xs text-purple-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.4% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Property Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property Performance
            </CardTitle>
            <CardDescription>
              Individual property financial performance breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.map((property, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{property.name}</h3>
                      <p className="text-sm text-gray-500">Monthly Performance</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Revenue</p>
                      <p className="text-sm text-green-600">${property.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Expenses</p>
                      <p className="text-sm text-red-600">${property.expenses.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">ROI</p>
                      <Badge variant={property.roi > 12 ? "default" : "secondary"}>
                        {property.roi}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Occupancy Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {financialData.occupancyRate}%
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Above market average of 91.5%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avg Rent/Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                ${financialData.avgRentPerUnit}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                +3.2% increase this quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maintenance Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                ${financialData.maintenanceCosts.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                12% of gross revenue
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
