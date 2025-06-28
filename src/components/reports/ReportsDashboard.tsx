
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Mail, Calendar, Clock, AlertCircle, CheckCircle2, Zap, Search, Filter } from 'lucide-react';
import { useLPReports } from '@/hooks/useLPReports';
import { useAuth } from '@/contexts/AuthContext';

export const ReportsDashboard = () => {
  const { user } = useAuth();
  const { 
    reports, 
    statistics, 
    downloadReport, 
    emailReport,
    downloadReportLoading,
    emailReportLoading,
    reportsLoading 
  } = useLPReports(user?.id || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.report_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.generation_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEmailReport = async (reportId: string) => {
    if (!emailRecipients.trim()) return;
    
    const recipients = emailRecipients
      .split(',')
      .map(email => email.trim())
      .filter(email => email.includes('@'));
    
    await emailReport({ reportId, recipients });
    setEmailRecipients('');
    setSelectedReport(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Zap className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (reportsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Zap className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports Dashboard</h2>
          <p className="text-muted-foreground">
            View and manage your generated LP reports
          </p>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{statistics.total_reports}</p>
                  <p className="text-sm text-gray-600">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{statistics.completed_reports}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{statistics.failed_reports}</p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(statistics.avg_generation_time_minutes)}</p>
                  <p className="text-sm text-gray-600">Avg Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{statistics.total_downloads}</p>
                  <p className="text-sm text-gray-600">Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-indigo-600" />
                <div>
                  <p className="text-2xl font-bold">{statistics.total_emails_sent}</p>
                  <p className="text-sm text-gray-600">Emails Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No reports match your current filters'
                : 'Generate your first LP report to get started'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{report.report_title}</h3>
                      <Badge className={getStatusColor(report.generation_status)}>
                        {getStatusIcon(report.generation_status)}
                        <span className="ml-1 capitalize">{report.generation_status}</span>
                      </Badge>
                      {report.ai_summary && (
                        <Badge variant="outline">
                          <Zap className="h-3 w-3 mr-1" />
                          AI Summary
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(report.report_period_start).toLocaleDateString()} - {' '}
                          {new Date(report.report_period_end).toLocaleDateString()}
                        </span>
                      </div>
                      <div>{report.property_ids.length} properties</div>
                      {report.download_count > 0 && (
                        <div>{report.download_count} downloads</div>
                      )}
                      {report.file_size_bytes && (
                        <div>{(report.file_size_bytes / 1024 / 1024).toFixed(1)} MB</div>
                      )}
                    </div>

                    <div className="text-sm text-gray-600">
                      Created: {new Date(report.created_at!).toLocaleDateString()}
                      {report.generated_at && (
                        <span> • Generated: {new Date(report.generated_at).toLocaleDateString()}</span>
                      )}
                      {report.email_sent_at && (
                        <span> • Emailed: {new Date(report.email_sent_at).toLocaleDateString()}</span>
                      )}
                    </div>

                    {report.error_message && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        Error: {report.error_message}
                      </div>
                    )}

                    {report.ai_summary && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-900">
                          <strong>AI Summary:</strong> {report.ai_summary}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    {report.generation_status === 'completed' && (
                      <>
                        <Button
                          onClick={() => downloadReport(report.id!)}
                          disabled={downloadReportLoading}
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => setSelectedReport(report.id!)}
                          variant="outline"
                          size="sm"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </>
                    )}
                    {report.generation_status === 'processing' && (
                      <Badge variant="outline" className="justify-center">
                        <Zap className="h-3 w-3 mr-1 animate-spin" />
                        Processing...
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Email Form */}
                {selectedReport === report.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter email addresses (comma separated)"
                        value={emailRecipients}
                        onChange={(e) => setEmailRecipients(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleEmailReport(report.id!)}
                        disabled={emailReportLoading || !emailRecipients.trim()}
                        size="sm"
                      >
                        Send
                      </Button>
                      <Button
                        onClick={() => setSelectedReport(null)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;
