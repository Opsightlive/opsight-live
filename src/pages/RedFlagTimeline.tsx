
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Filter } from 'lucide-react';

const RedFlagTimeline = () => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const timelineEvents = [
    {
      id: 1,
      date: '2024-01-15',
      time: '09:30 AM',
      property: 'Sunset Gardens Apartments',
      event: 'Occupancy Rate Drop',
      description: 'Occupancy dropped from 94% to 87% in past 30 days',
      severity: 'High',
      status: 'Active',
      category: 'Occupancy',
      actionTaken: null
    },
    {
      id: 2,
      date: '2024-01-14',
      time: '02:15 PM',
      property: 'Metro Plaza Complex',
      event: 'Maintenance Cost Spike',
      description: 'Monthly maintenance costs exceeded budget by 35%',
      severity: 'Medium',
      status: 'Resolved',
      category: 'Financial',
      actionTaken: 'Negotiated new vendor contracts'
    },
    {
      id: 3,
      date: '2024-01-12',
      time: '11:45 AM',
      property: 'Riverside Towers',
      event: 'Tenant Satisfaction Drop',
      description: 'Average satisfaction score dropped to 3.2/5',
      severity: 'Medium',
      status: 'In Progress',
      category: 'Tenant Relations',
      actionTaken: 'Tenant survey deployed'
    },
    {
      id: 4,
      date: '2024-01-10',
      time: '04:20 PM',
      property: 'Oak Street Residences',
      event: 'Late Rent Payments Increase',
      description: '23% increase in late rent payments this month',
      severity: 'High',
      status: 'Active',
      category: 'Collections',
      actionTaken: null
    },
    {
      id: 5,
      date: '2024-01-08',
      time: '08:10 AM',
      property: 'Pine Hill Apartments',
      event: 'Energy Cost Anomaly',
      description: 'Utility costs 45% higher than historical average',
      severity: 'Low',
      status: 'Resolved',
      category: 'Operations',
      actionTaken: 'HVAC system optimized'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredEvents = timelineEvents.filter(event => {
    if (filterSeverity !== 'all' && event.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && event.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Red Flag Timeline</h1>
          <p className="text-gray-600 mt-2">Chronological view of all portfolio alerts and resolutions</p>
        </div>
        <div className="flex space-x-2">
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">24</span>
            <p className="text-sm text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-red-600">8</span>
            <p className="text-sm text-gray-500">Requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">3.2</span>
            <p className="text-sm text-gray-500">Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">87%</span>
            <p className="text-sm text-gray-500">Within SLA</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Alert Timeline
          </CardTitle>
          <CardDescription>Recent red flag events across your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                    {getStatusIcon(event.status)}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{event.event}</h3>
                        <Badge variant={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{event.date}</p>
                        <p>{event.time}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-1">{event.property}</p>
                    <p className="text-gray-700 mt-2">{event.description}</p>
                    
                    {event.actionTaken && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Action Taken:</strong> {event.actionTaken}
                        </p>
                      </div>
                    )}
                    
                    {event.status === 'Active' && (
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">
                          Take Action
                        </Button>
                      </div>
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

export default RedFlagTimeline;
