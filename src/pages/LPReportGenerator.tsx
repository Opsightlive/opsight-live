
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, Building2, DollarSign, Users, TrendingUp, Settings, Eye, Send } from 'lucide-react';

const LPReportGenerator = () => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [reportPeriod, setReportPeriod] = useState('quarterly');
  const [reportSections, setReportSections] = useState({
    executiveSummary: true,
    financialPerformance: true,
    propertyUpdates: true,
    marketAnalysis: true,
    distributions: true,
    futureOutlook: true
  });

  const properties = [
    { id: '1', name: 'Sunset Gardens', units: 45, type: 'Multifamily' },
    { id: '2', name: 'Metro Plaza', units: 32, type: 'Mixed Use' },
    { id: '3', name: 'Oak Ridge Apartments', units: 68, type: 'Multifamily' },
    { id: '4', name: 'Riverside Commons', units: 52, type: 'Multifamily' }
  ];

  const reportTemplates = [
    {
      name: 'Standard Quarterly Report',
      description: 'Comprehensive quarterly report with all key metrics',
      sections: ['Executive Summary', 'Financial Performance', 'Property Updates', 'Market Analysis'],
      duration: '~15 minutes to generate'
    },
    {
      name: 'Financial Summary',
      description: 'Focus on financial metrics and distributions',
      sections: ['Financial Performance', 'Cash Flow Analysis', 'Distributions'],
      duration: '~8 minutes to generate'
    },
    {
      name: 'Property Performance',
      description: 'Detailed property-by-property analysis',
      sections: ['Property Updates', 'Occupancy Trends', 'Maintenance Updates'],
      duration: '~12 minutes to generate'
    }
  ];

  const handlePropertySelection = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties([...selectedProperties, propertyId]);
    } else {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    }
  };

  const handleSectionToggle = (section: string, checked: boolean) => {
    setReportSections(prev => ({
      ...prev,
      [section]: checked
    }));
  };

  const generateReport = () => {
    console.log('Generating report with:', {
      properties: selectedProperties,
      period: reportPeriod,
      sections: reportSections
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Blue Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">LP Report Generator</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Create professional limited partner reports with automated data analysis and insights
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Automated Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Quarterly & Annual</span>
              </div>
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                <span>Direct Distribution</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Templates</CardTitle>
              <CardDescription>Choose a pre-configured report template or customize your own</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportTemplates.map((template, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="space-y-2">
                      {template.sections.map((section, sectionIndex) => (
                        <Badge key={sectionIndex} variant="outline" className="mr-1 mb-1">
                          {section}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">{template.duration}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Properties</CardTitle>
              <CardDescription>Choose which properties to include in the report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={property.id}
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={(checked) => handlePropertySelection(property.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{property.name}</span>
                        <Badge variant="outline">{property.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{property.units} units</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedProperties(properties.map(p => p.id))}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedProperties([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Report Sections</CardTitle>
              <CardDescription>Customize which sections to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(reportSections).map(([key, checked]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <Checkbox
                      id={key}
                      checked={checked}
                      onCheckedChange={(checked) => handleSectionToggle(key, checked as boolean)}
                    />
                    <Label htmlFor={key} className="text-sm capitalize cursor-pointer">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Configure report period and formatting options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="period" className="text-sm font-medium">Report Period</Label>
                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="custom">Custom Period</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="format" className="text-sm font-medium">Output Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Workbook</SelectItem>
                      <SelectItem value="powerpoint">PowerPoint Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title" className="text-sm font-medium">Report Title</Label>
                <Input
                  id="title"
                  placeholder="Q4 2024 Limited Partner Report"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview & Actions */}
        <div className="space-y-6">
          {/* Report Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Report Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Properties:</span>
                  <span className="font-medium">{selectedProperties.length} selected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium capitalize">{reportPeriod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium">{Object.values(reportSections).filter(Boolean).length} sections</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Est. Generation Time:</span>
                  <span className="font-medium">~12 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Q3 2024 Report</p>
                    <p className="text-xs text-gray-600">Generated Dec 15, 2024</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Q2 2024 Report</p>
                    <p className="text-xs text-gray-600">Generated Sep 15, 2024</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={generateReport}
                disabled={selectedProperties.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Preview Report
              </Button>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LPReportGenerator;
