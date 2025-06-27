
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  DollarSign, 
  Building2, 
  Calendar,
  Phone,
  Mail,
  MoreVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClientManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const clients = [
    {
      id: 1,
      name: 'Horizon Real Estate Group',
      contact: 'Sarah Johnson',
      email: 'sarah@horizonrealestate.com',
      phone: '+1 (555) 123-4567',
      properties: 3,
      monthlyRevenue: 8850,
      status: 'active',
      joinDate: '2023-08-15',
      lastPayment: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150'
    },
    {
      id: 2,
      name: 'Metro Property Partners',
      contact: 'Michael Chen',
      email: 'michael@metroprop.com',
      phone: '+1 (555) 987-6543',
      properties: 5,
      monthlyRevenue: 12950,
      status: 'active',
      joinDate: '2023-11-22',
      lastPayment: '2024-01-14',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      id: 3,
      name: 'Sunset Investments LLC',
      contact: 'Jennifer Williams',
      email: 'jennifer@sunsetinv.com',
      phone: '+1 (555) 456-7890',
      properties: 2,
      monthlyRevenue: 5900,
      status: 'trial',
      joinDate: '2024-01-10',
      lastPayment: '2024-01-13',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    {
      id: 4,
      name: 'Urban Development Corp',
      contact: 'David Rodriguez',
      email: 'david@urbandev.com',
      phone: '+1 (555) 234-5678',
      properties: 8,
      monthlyRevenue: 18600,
      status: 'active',
      joinDate: '2023-06-05',
      lastPayment: '2024-01-12',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  ];

  const handleViewClient = (clientId: number) => {
    toast({
      title: "Client Details",
      description: `Opening detailed view for client ${clientId}`,
    });
  };

  const handleEditClient = (clientId: number) => {
    toast({
      title: "Edit Client",
      description: `Opening edit form for client ${clientId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Add New Client
        </Button>
      </div>

      {/* Client Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{clients.length}</p>
              <p className="text-sm text-gray-600">Total Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {clients.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {clients.reduce((sum, c) => sum + c.properties, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Properties</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                ${clients.reduce((sum, c) => sum + c.monthlyRevenue, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{client.contact}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      {client.properties} properties
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <DollarSign className="h-4 w-4" />
                      ${client.monthlyRevenue.toLocaleString()}/mo
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Joined {client.joinDate}
                    </div>
                    <div>Last payment: {client.lastPayment}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClient(client.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClient(client.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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

export default ClientManagement;
