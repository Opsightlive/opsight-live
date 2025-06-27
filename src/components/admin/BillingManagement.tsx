
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download, 
  Send, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BillingManagement = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  const billingData = {
    totalOutstanding: 45200,
    totalPaid: 178950,
    overdue: 12300,
    upcoming: 67800,
    averagePaymentTime: 14
  };

  const invoices = [
    {
      id: 'INV-2024-001',
      client: 'Horizon Real Estate Group',
      amount: 8850,
      status: 'paid',
      dueDate: '2024-01-15',
      paidDate: '2024-01-14',
      services: 'Monthly Subscription - 3 Properties'
    },
    {
      id: 'INV-2024-002',
      client: 'Metro Property Partners',
      amount: 12950,
      status: 'overdue',
      dueDate: '2024-01-10',
      paidDate: null,
      services: 'Monthly Subscription - 5 Properties'
    },
    {
      id: 'INV-2024-003',
      client: 'Urban Development Corp',
      amount: 18600,
      status: 'pending',
      dueDate: '2024-01-20',
      paidDate: null,
      services: 'Monthly Subscription - 8 Properties'
    },
    {
      id: 'INV-2024-004',
      client: 'Sunset Investments LLC',
      amount: 5900,
      status: 'paid',
      dueDate: '2024-01-12',
      paidDate: '2024-01-11',
      services: 'Setup Fee + Monthly Subscription'
    }
  ];

  const handleSendReminder = (invoiceId: string) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent for invoice ${invoiceId}`,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoiceId}`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Total Paid</p>
                <p className="text-xl font-bold text-green-900">
                  ${billingData.totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Overdue</p>
                <p className="text-xl font-bold text-red-900">
                  ${billingData.overdue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-600">Outstanding</p>
                <p className="text-xl font-bold text-yellow-900">
                  ${billingData.totalOutstanding.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Upcoming</p>
                <p className="text-xl font-bold text-blue-900">
                  ${billingData.upcoming.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Payment</p>
                <p className="text-xl font-bold text-purple-900">
                  {billingData.averagePaymentTime} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Statements
          </Button>
        </div>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {getStatusIcon(invoice.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{invoice.id}</span>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{invoice.client}</p>
                    <p className="text-sm text-gray-500">{invoice.services}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-lg">${invoice.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                    {invoice.paidDate && (
                      <p className="text-sm text-green-600">Paid: {invoice.paidDate}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {invoice.status !== 'paid' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReminder(invoice.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManagement;
