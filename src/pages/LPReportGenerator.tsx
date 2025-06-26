
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, Users, TrendingUp, DollarSign, BarChart3, Settings } from 'lucide-react';

const LPReportGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('quarterly');
  const [reportName, setReportName] = useState('');
  const [selectedLPs, setSelectedLPs] = useState<string[]>([]);

  const reportTemplates = [
    {
      id: 'quarterly',
      name: 'Quarterly Performance Report',
      description: 'Comprehensive quarterly update with financial metrics and portfolio performance',
      sections: ['Executive Summary', 'Financial Performance', 'Portfolio Updates', 'Market Analysis', 'Future Outlook']
    },
    {
      id: 'annual',
      name: 'Annual Investor Report',
      description: 'Detailed annual review with complete financial statements and strategic updates',
      sections: ['Year in Review', 'Financial Statements', 'Portfolio Performance', 'Market Conditions', 'Strategic Initiatives']
    },
    {
      id: 'monthly',
      name: 'Monthly Update',
      description: 'Brief monthly summary highlighting key metrics and recent developments',
      sections: ['Performance Highlights', 'Property Updates', 'Financial Summary', 'Upcoming Events']
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Build your own report with selected sections and customized content',
      sections: ['Customizable Sections']
    }
  ];

  const limitedPartners = [
    { id: 'lp1', name: 'Pension Fund Alpha', email: 'contact@pensionfundalpha.com', investment: '$2.5M' },
    { id: 'lp2', name: 'Family Office Beta', email: 'invest@familyofficebeta.com', investment: '$1.8M' },
    { id: 'lp3', name: 'Institutional Investor Gamma', email: 'reports@invgamma.com', investment: '$3.2M' },
    { id: 'lp4', name: 'Private Wealth Delta', email: 'info@pwdelta.com', investment: '$900K' },
    { id: 'lp5', name: 'Endowment Fund Epsilon', email: 'admin@endowmenteps.org', investment: '$1.5M' }
  ];

  const reportHistory = [
    {
      name: 'Q4 2023 Performance Report',
      date: '2024-01-15',
      recipients: 12,
      status: 'delivered',
      downloads: 45
    },
    {
      name: 'Annual Report 2023',
      date: '2024-01-01',
      recipients: 18,
      status: 'delivered',
      downloads: 72
    },
    {
      name: 'Q3 2023 Update',
      date: '2023-10-15',
      recipients: 12,
      status: 'delivered',
      downloads: 38
    }
  ];

  const handleLPSelection = (lpId: string, checked: boolean) => {
    if (checked) {
      setSelectedLPs([...selectedLPs, lpId]);
    } else {
      setSelectedLPs(selectedLPs.filter(id => id !== lpId));
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">LP Report Generator</h1>
          <p className="text-blue-100">
            Create and distribute professional reports for your limited partners
          </p>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList>
            <TabsTrigger value="create">Create Report</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Report Configuration */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Report Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Report Name</label>
                      <Input
                        placeholder="Q1 2024 Performance Report"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Report Template</label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Reporting Period</label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="date" />
                        <Input type="date" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Report Sections</label>
                      <div className="space-y-2">
                        {reportTemplates.find(t => t.id === selectedTemplate)?.sections.map((section, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`section-${index}`} defaultChecked />
                            <label htmlFor={`section-${index}`} className="text-sm">{section}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Select Recipients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {limitedPartners.map(lp => (
                        <div key={lp.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={lp.id}
                              checked={selectedLPs.includes(lp.id)}
                              onCheckedChange={(checked) => handleLPSelection(lp.id, checked as boolean)}
                            />
                            <div>
                              <p className="font-medium">{lp.name}</p>
                              <p className="text-sm text-gray-600">{lp.email}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{lp.investment}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview & Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Report preview will appear here</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Button className="w-full">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Generate Preview
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download Draft
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribution Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Selected Recipients:</span>
                        <span className="font-medium">{selectedLPs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Report Sections:</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Estimated Size:</span>
                        <span className="font-medium">2.4 MB</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" disabled={selectedLPs.length === 0}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate & Send Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTemplates.map(template => (
                <Card key={template.id} className={selectedTemplate === template.id ? 'border-blue-500' : ''}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Included Sections:</h4>
                        <div className="space-y-1">
                          {template.sections.map((section, index) => (
                            <div key={index} className="text-sm text-gray-600">• {section}</div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant={selectedTemplate === template.id ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
                <CardDescription>Previously generated and distributed reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportHistory.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.date}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {report.recipients} recipients
                          </span>
                          <span className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {report.downloads} downloads
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{report.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Report Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Report Template</label>
                    <Select defaultValue="quarterly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly Performance Report</SelectItem>
                        <SelectItem value="annual">Annual Investor Report</SelectItem>
                        <SelectItem value="monthly">Monthly Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Branding</label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="logo" defaultChecked />
                      <label htmlFor="logo" className="text-sm">Include company logo</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="branding" defaultChecked />
                      <label htmlFor="branding" className="text-sm">Apply brand colors</label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribution Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Auto-send Schedule</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual only</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifications" defaultChecked />
                      <label htmlFor="notifications" className="text-sm">Send delivery notifications</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tracking" defaultChecked />
                      <label htmlFor="tracking" className="text-sm">Enable download tracking</label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LPReportGenerator;
