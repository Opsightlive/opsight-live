
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar, Filter } from 'lucide-react';
import FollowUpActions from '@/components/resolution/FollowUpActions';

const ResolutionSummary = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [expandedResolution, setExpandedResolution] = useState<string | null>(null);

  const resolutions = [
    {
      id: '1',
      property: 'Oak Ridge Complex',
      issue: 'Collections Rate Below Threshold',
      description: 'Collections rate dropped to 93.2% from target of 95%',
      assignedPM: 'Sarah Johnson',
      status: 'resolved',
      resolvedDate: '2024-01-15',
      resolutionMethod: 'Implemented new payment reminder system and extended office hours',
      daysToResolve: 3,
      impact: 'Collections improved to 96.1%',
      severity: 'critical'
    },
    {
      id: '2',
      property: 'Cedar Point Villas',
      issue: 'Physical Occupancy Declining',
      description: 'Occupancy trending below 90% target',
      assignedPM: 'Mike Torres',
      status: 'in-progress',
      startDate: '2024-01-14',
      resolutionMethod: 'Launched targeted marketing campaign and lease incentives',
      daysActive: 2,
      severity: 'warning'
    },
    {
      id: '3',
      property: 'Meridian Apartments',
      issue: 'Slow Leasing Velocity',
      description: 'Days to lease averaging 28 days vs 20 day target',
      assignedPM: 'Lisa Chen',
      status: 'pending',
      reportedDate: '2024-01-13',
      severity: 'critical'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'warning': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const filteredResolutions = resolutions.filter(resolution => {
    return (selectedStatus === 'all' || resolution.status === selectedStatus) &&
           (selectedProperty === 'all' || resolution.property === selectedProperty);
  });

  const toggleExpanded = (id: string) => {
    setExpandedResolution(expandedResolution === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Resolution Summary</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Track and manage the resolution of red flag alerts and performance issues across your portfolio
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-base font-medium text-black">Status:</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 px-3 py-1 text-sm rounded"
              >
                <option value="all">All Statuses</option>
                <option value="resolved">Resolved</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-base font-medium text-black">Property:</label>
              <select 
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="border border-gray-300 px-3 py-1 text-sm rounded"
              >
                <option value="all">All Properties</option>
                <option value="Oak Ridge Complex">Oak Ridge Complex</option>
                <option value="Cedar Point Villas">Cedar Point Villas</option>
                <option value="Meridian Apartments">Meridian Apartments</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resolutions List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black mb-4">
            Resolution Items ({filteredResolutions.length})
          </h2>
          
          {filteredResolutions.map((resolution) => (
            <div key={resolution.id}>
              <Card className={`border-2 ${getStatusColor(resolution.status)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {resolution.status === 'resolved' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {resolution.status === 'in-progress' && <Clock className="h-5 w-5 text-yellow-600" />}
                      {resolution.status === 'pending' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                      
                      <div>
                        <CardTitle className="text-lg">{resolution.issue}</CardTitle>
                        <p className="text-sm text-gray-600">{resolution.property}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityBadge(resolution.severity)}>
                        {resolution.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(resolution.status)}>
                        {resolution.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4">{resolution.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Assigned PM:</span>
                      <p className="text-sm text-black">{resolution.assignedPM}</p>
                    </div>
                    
                    {resolution.status === 'resolved' && (
                      <>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Resolved Date:</span>
                          <p className="text-sm text-black">{resolution.resolvedDate}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Days to Resolve:</span>
                          <p className="text-sm text-black">{resolution.daysToResolve} days</p>
                        </div>
                      </>
                    )}
                    
                    {resolution.status === 'in-progress' && (
                      <>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Start Date:</span>
                          <p className="text-sm text-black">{resolution.startDate}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Days Active:</span>
                          <p className="text-sm text-black">{resolution.daysActive} days</p>
                        </div>
                      </>
                    )}
                    
                    {resolution.status === 'pending' && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Reported Date:</span>
                        <p className="text-sm text-black">{resolution.reportedDate}</p>
                      </div>
                    )}
                  </div>

                  {resolution.resolutionMethod && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-600">Resolution Method:</span>
                      <p className="text-sm text-black mt-1">{resolution.resolutionMethod}</p>
                    </div>
                  )}

                  {resolution.impact && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Impact:</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">{resolution.impact}</p>
                    </div>
                  )}

                  <button
                    onClick={() => toggleExpanded(resolution.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedResolution === resolution.id ? 'Hide Actions' : 'Show Follow-Up Actions'}
                  </button>
                </CardContent>
              </Card>

              {/* Follow-Up Actions */}
              {expandedResolution === resolution.id && (
                <FollowUpActions resolution={resolution} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResolutionSummary;
