
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Clock, AlertTriangle, TrendingUp, TrendingDown, Building2 } from 'lucide-react';

const RedFlagTimeline = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedProperty, setSelectedProperty] = useState('all');

  const timelineEvents = [
    {
      date: '2024-01-15',
      time: '14:30',
      property: 'Sunset Gardens',
      type: 'critical',
      title: 'Multiple Tenant Complaints',
      description: 'Received 5 maintenance requests and 2 noise complaints within 24 hours',
      status: 'active',
      impact: 'high'
    },
    {
      date: '2024-01-12',
      time: '09:15',
      property: 'Metro Plaza',
      type: 'warning',
      title: 'Rent Collection Below Target',
      description: 'Monthly collection rate at 78% - below 85% threshold',
      status: 'monitoring',
      impact: 'medium'
    },
    {
      date: '2024-01-10',
      time: '16:45',
      property: 'Riverside Towers',
      type: 'resolved',
      title: 'HVAC System Failure',
      description: 'Complete system failure affecting 12 units - emergency repair completed',
      status: 'resolved',
      impact: 'high'
    },
    {
      date: '2024-01-08',
      time: '11:20',
      property: 'Oak Street Commons',
      type: 'warning',
      title: 'Vacancy Rate Increase',
      description: 'Vacancy increased from 5% to 12% over past month',
      status: 'monitoring',
      impact: 'medium'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <TrendingDown className="h-5 w-5 text-yellow-600" />;
      case 'resolved':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'resolved':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">Red Flag Timeline</h1>
          <p className="text-blue-100">
            Chronological view of all red flag events and their resolution status
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="6months">Last 6 months</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-gray-600" />
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Properties</option>
              <option value="sunset">Sunset Gardens</option>
              <option value="metro">Metro Plaza</option>
              <option value="riverside">Riverside Towers</option>
              <option value="oak">Oak Street Commons</option>
            </select>
          </div>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <Card key={index} className={`border-l-4 ${getEventColor(event.type)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getEventIcon(event.type)}
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">{event.property}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{event.date} at {event.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        event.status === 'active' ? 'destructive' :
                        event.status === 'monitoring' ? 'secondary' : 'default'
                      }
                    >
                      {event.status}
                    </Badge>
                    <Badge variant="outline">
                      {event.impact} impact
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {event.description}
                </CardDescription>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  {event.status === 'active' && (
                    <Button size="sm">
                      Take Action
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">
            Load More Events
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default RedFlagTimeline;
