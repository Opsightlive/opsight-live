
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Clock, Filter, Calendar, Building2, Users, Wrench, DollarSign } from 'lucide-react';

const RedFlagTimeline = () => {
  const [filterProperty, setFilterProperty] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const timelineEvents = [
    {
      id: 1,
      date: '2024-01-15',
      time: '14:32',
      property: 'Sunset Gardens',
      issue: 'Multiple tenant complaints about heating system',
      severity: 'critical',
      status: 'resolved',
      category: 'maintenance',
      resolvedDate: '2024-01-18',
      daysToResolve: 3,
      description: 'Several tenants reported inadequate heating in units 201-205. Emergency repair crew dispatched.',
      actions: ['Emergency repair scheduled', 'Temporary heaters provided', 'System fully repaired'],
      impact: 'High - affected 5 units, potential rent withholding'
    },
    {
      id: 2,
      date: '2024-01-12',
      time: '09:15',
      property: 'Metro Plaza',
      issue: 'Rent collection rate dropped to 75%',
      severity: 'high',
      status: 'in-progress',
      category: 'financial',
      description: 'Significant drop in on-time rent payments. Investigating causes and implementing collection procedures.',
      actions: ['Payment reminders sent', 'Late fee notices issued', 'Payment plans offered'],
      impact: 'High - $18,000 in delayed rent payments'
    },
    {
      id: 3,
      date: '2024-01-10',
      time: '16:45',
      property: 'Oak Ridge Apartments',
      issue: 'Occupancy rate declined to 82%',
      severity: 'medium',
      status: 'monitoring',
      category: 'occupancy',
      description: 'Three units became vacant in the past week. Reviewing lease terms and market conditions.',
      actions: ['Market analysis initiated', 'Rent pricing reviewed', 'Marketing campaign launched'],
      impact: 'Medium - $4,500 monthly revenue loss'
    },
    {
      id: 4,
      date: '2024-01-08',
      time: '11:20',
      property: 'Riverside Commons',
      issue: 'Water damage in basement storage area',
      severity: 'medium',
      status: 'resolved',
      category: 'maintenance',
      resolvedDate: '2024-01-10',
      daysToResolve: 2,
      description: 'Pipe burst in basement causing water damage to storage area and some tenant belongings.',
      actions: ['Water extraction completed', 'Pipe repair finished', 'Insurance claim filed'],
      impact: 'Medium - $3,200 in damages and claims'
    },
    {
      id: 5,
      date: '2024-01-05',
      time: '08:30',
      property: 'Metro Plaza',
      issue: 'Security system malfunction',
      severity: 'low',
      status: 'resolved',
      category: 'security',
      resolvedDate: '2024-01-06',
      daysToResolve: 1,
      description: 'Main entrance security system offline. Temporary security measures implemented.',
      actions: ['Security company notified', 'Manual monitoring setup', 'System repaired'],
      impact: 'Low - temporary inconvenience, no security breaches'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      case 'financial':
        return <DollarSign className="h-4 w-4" />;
      case 'occupancy':
        return <Users className="h-4 w-4" />;
      case 'security':
        return <Building2 className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'monitoring':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredEvents = timelineEvents.filter(event => {
    if (filterProperty !== 'all' && event.property !== filterProperty) return false;
    if (filterSeverity !== 'all' && event.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && event.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Blue Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Red Flag Timeline</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Comprehensive chronological view of all property alerts and their resolution progress
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Timeline View</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Alert Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Resolution History</span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <span>Advanced Filtering</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Property</label>
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="Sunset Gardens">Sunset Gardens</SelectItem>
                  <SelectItem value="Metro Plaza">Metro Plaza</SelectItem>
                  <SelectItem value="Oak Ridge Apartments">Oak Ridge Apartments</SelectItem>
                  <SelectItem value="Riverside Commons">Riverside Commons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => (
          <Card key={event.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`}></div>
                    <CardTitle className="text-lg">{event.issue}</CardTitle>
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{event.property}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(event.category)}
                      <span className="capitalize">{event.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    event.severity === 'critical' ? 'destructive' :
                    event.severity === 'high' ? 'destructive' :
                    event.severity === 'medium' ? 'secondary' : 'default'
                  }>
                    {event.severity}
                  </Badge>
                  <Badge variant={
                    event.status === 'resolved' ? 'default' :
                    event.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {event.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">{event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Actions Taken:</h4>
                    <ul className="space-y-1">
                      {event.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Impact Assessment:</h4>
                    <p className="text-sm text-gray-600">{event.impact}</p>
                    {event.resolvedDate && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600">
                          ✓ Resolved on {event.resolvedDate} ({event.daysToResolve} days)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No timeline events match your current filters</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setFilterProperty('all');
                setFilterSeverity('all');
                setFilterStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RedFlagTimeline;
