
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, RefreshCw } from 'lucide-react';

interface DeliveryLog {
  id: string;
  date: string;
  property: string;
  recipient: string;
  channel: 'Email' | 'SMS' | 'Push';
  status: 'Delivered' | 'Opened' | 'Escalated' | 'Failed' | 'Pending';
  timestamp: string;
  alertType?: string;
}

const AlertDeliveryLogs = () => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('');
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  // Mock data - replace with actual API call
  const deliveryLogs: DeliveryLog[] = [
    {
      id: '1',
      date: 'Jun 11',
      property: 'Greenview Apt',
      recipient: 'Sarah Jones',
      channel: 'Email',
      status: 'Opened',
      timestamp: '2024-06-11T09:30:00Z',
      alertType: 'Financial Risk'
    },
    {
      id: '2',
      date: 'Jun 10',
      property: 'Lakewood Villas',
      recipient: 'PM Team',
      channel: 'SMS',
      status: 'Escalated',
      timestamp: '2024-06-10T14:22:00Z',
      alertType: 'Performance Issue'
    },
    {
      id: '3',
      date: 'Jun 09',
      property: 'Edgewater Lofts',
      recipient: 'Ops Manager',
      channel: 'Email',
      status: 'Delivered',
      timestamp: '2024-06-09T11:15:00Z',
      alertType: 'Maintenance Alert'
    },
    {
      id: '4',
      date: 'Jun 08',
      property: 'Sunset Commons',
      recipient: 'John Smith',
      channel: 'Push',
      status: 'Failed',
      timestamp: '2024-06-08T16:45:00Z',
      alertType: 'Budget Alert'
    },
    {
      id: '5',
      date: 'Jun 07',
      property: 'Harbor View',
      recipient: 'Lisa Chen',
      channel: 'Email',
      status: 'Pending',
      timestamp: '2024-06-07T10:30:00Z',
      alertType: 'KPI Warning'
    }
  ];

  const properties = ['Greenview Apt', 'Lakewood Villas', 'Edgewater Lofts', 'Sunset Commons', 'Harbor View'];
  const channels = ['Email', 'SMS', 'Push'];
  const statuses = ['Delivered', 'Opened', 'Escalated', 'Failed', 'Pending'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Opened':
        return 'bg-blue-100 text-blue-800';
      case 'Escalated':
        return 'bg-orange-100 text-orange-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'Email':
        return 'bg-purple-100 text-purple-800';
      case 'SMS':
        return 'bg-green-100 text-green-800';
      case 'Push':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = deliveryLogs.filter(log => {
    if (selectedProperty && log.property !== selectedProperty) return false;
    if (selectedChannel && log.channel !== selectedChannel) return false;
    if (selectedStatus && log.status !== selectedStatus) return false;
    return true;
  });

  const handleSelectLog = (logId: string) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map(log => log.id));
    }
  };

  const handleDownloadLog = () => {
    console.log('Downloading full log...');
    // Implement download functionality
  };

  const handleExportCSV = () => {
    console.log('Exporting as CSV...');
    // Implement CSV export functionality
  };

  const handleResendSelected = () => {
    if (selectedLogs.length === 0) return;
    console.log('Resending selected logs:', selectedLogs);
    // Implement resend functionality
  };

  const handleViewDetails = (logId: string) => {
    console.log('Viewing details for log:', logId);
    // Implement view details functionality
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with blue background matching the mockup */}
      <div className="bg-blue-500 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold">Alert Delivery Logs + Escalation Tracker</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Properties</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property} value={property}>
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Channels</SelectItem>
                {channels.map(channel => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                placeholder="Date Range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Delivery Logs ({filteredLogs.length})</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSelectAll}>
                {selectedLogs.length === filteredLogs.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-blue-500">
                <TableRow>
                  <TableHead className="text-white">
                    <input
                      type="checkbox"
                      checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead className="text-white font-semibold">Date</TableHead>
                  <TableHead className="text-white font-semibold">Property</TableHead>
                  <TableHead className="text-white font-semibold">Recipient</TableHead>
                  <TableHead className="text-white font-semibold">Channel</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedLogs.includes(log.id)}
                        onChange={() => handleSelectLog(log.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{log.date}</TableCell>
                    <TableCell>{log.property}</TableCell>
                    <TableCell>{log.recipient}</TableCell>
                    <TableCell>
                      <Badge className={getChannelColor(log.channel)}>
                        {log.channel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(log.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleDownloadLog} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Log
        </Button>
        
        <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export as CSV
        </Button>
        
        <Button 
          onClick={handleResendSelected}
          disabled={selectedLogs.length === 0}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <RefreshCw className="h-4 w-4" />
          Resend Selected
        </Button>
      </div>
    </div>
  );
};

export default AlertDeliveryLogs;
