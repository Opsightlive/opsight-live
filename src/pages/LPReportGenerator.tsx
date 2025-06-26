
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Mail, Eye, Users } from 'lucide-react';

const LPReportGenerator = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [copyMyself, setCopyMyself] = useState(true);
  const [notifyWhenViewed, setNotifyWhenViewed] = useState(true);
  const [sendToAllLPs, setSendToAllLPs] = useState(false);

  const [sections, setSections] = useState({
    kpiSummary: true,
    occupancyBreakdown: true,
    collectionsRevenue: true,
    redFlagSummary: true,
    renewalLeasing: true
  });

  const properties = [
    { value: 'greenview', label: 'Greenview Apartments' },
    { value: 'oakwood', label: 'Oakwood Commons' },
    { value: 'cedar', label: 'Cedar Ridge Complex' }
  ];

  const dateRanges = [
    { value: 'may2025', label: 'May 1 - May 31, 2025' },
    { value: 'q1-2025', label: 'Q1 2025' },
    { value: 'april2025', label: 'April 1 - April 30, 2025' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const formatOptions = [
    { value: 'PDF', label: 'PDF' },
    { value: 'Excel', label: 'Excel' },
    { value: 'LP Dashboard', label: 'LP Dashboard' }
  ];

  const handleSectionChange = (sectionKey: string, checked: boolean) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: checked
    }));
  };

  const handlePreviewReport = () => {
    console.log('Previewing report with:', {
      property: selectedProperty,
      dateRange: selectedDateRange,
      format: selectedFormat,
      sections
    });
  };

  const handleSendReport = () => {
    console.log('Sending report to:', emailRecipient, {
      copyMyself,
      notifyWhenViewed,
      sendToAllLPs,
      property: selectedProperty,
      dateRange: selectedDateRange,
      format: selectedFormat,
      sections
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Limited Partner Report Generator</h1>
          <p className="text-gray-600">Generate comprehensive reports for your limited partners with customizable sections and delivery options.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Configuration */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  Report Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Property</Label>
                    <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Greenview Apts" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.value} value={property.value}>
                            {property.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Date Range</Label>
                    <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="May 1 - May 31, 2025" />
                      </SelectTrigger>
                      <SelectContent>
                        {dateRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Format</Label>
                  <div className="flex space-x-2">
                    {formatOptions.map((format) => (
                      <Button
                        key={format.value}
                        variant={selectedFormat === format.value ? "default" : "outline"}
                        onClick={() => setSelectedFormat(format.value)}
                        className={`px-6 py-3 ${
                          selectedFormat === format.value 
                            ? "bg-blue-600 text-white" 
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={handlePreviewReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Preview Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sections to Include */}
            <Card>
              <CardHeader>
                <CardTitle>Sections to Include:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { key: 'kpiSummary', label: 'KPI Summary', checked: sections.kpiSummary },
                    { key: 'occupancyBreakdown', label: 'Occupancy Breakdown', checked: sections.occupancyBreakdown },
                    { key: 'collectionsRevenue', label: 'Collections & Revenue', checked: sections.collectionsRevenue },
                    { key: 'redFlagSummary', label: 'Red Flag Summary', checked: sections.redFlagSummary },
                    { key: 'renewalLeasing', label: 'Renewal + Leasing Performance', checked: sections.renewalLeasing }
                  ].map((section) => (
                    <div key={section.key} className="flex items-center space-x-3">
                      <Checkbox
                        id={section.key}
                        checked={section.checked}
                        onCheckedChange={(checked) => handleSectionChange(section.key, checked === true)}
                        className="w-5 h-5"
                      />
                      <Label htmlFor={section.key} className="text-base cursor-pointer">
                        {section.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Send To Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send To:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter email address"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    className="h-12"
                    disabled={sendToAllLPs}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="sendToAllLPs"
                      checked={sendToAllLPs}
                      onCheckedChange={(checked) => setSendToAllLPs(checked === true)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="sendToAllLPs" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Send to All Limited Partners</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Automatically send to all LPs in your contact list
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="copyMyself"
                      checked={copyMyself}
                      onCheckedChange={(checked) => setCopyMyself(checked === true)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="copyMyself" className="cursor-pointer">
                      Copy Myself
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="notifyWhenViewed"
                      checked={notifyWhenViewed}
                      onCheckedChange={(checked) => setNotifyWhenViewed(checked === true)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="notifyWhenViewed" className="cursor-pointer">
                      Notify When Viewed
                    </Label>
                  </div>
                </div>

                {sendToAllLPs && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Sending to all Limited Partners:</p>
                    <ul className="text-sm text-blue-700 mt-1">
                      <li>• John Smith (john@example.com)</li>
                      <li>• Sarah Johnson (sarah@example.com)</li>
                      <li>• Mike Chen (mike@example.com)</li>
                      <li>• + 12 more partners</li>
                    </ul>
                  </div>
                )}

                <Button 
                  onClick={handleSendReport}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  disabled={!sendToAllLPs && !emailRecipient.trim()}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  {sendToAllLPs ? 'Send to All LPs' : 'Send Report'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Previous Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPReportGenerator;
