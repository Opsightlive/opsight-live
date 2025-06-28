
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, FileText, Settings, Zap, Mail, Download, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLPReports } from '@/hooks/useLPReports';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const LPReportBuilder = () => {
  const { user } = useAuth();
  const { 
    reports, 
    templates, 
    generateReport, 
    generateReportLoading,
    saveTemplate,
    saveTemplateLoading,
    getDefaultSections,
    reportsLoading
  } = useLPReports(user?.id || '');

  const [reportConfig, setReportConfig] = useState({
    report_title: '',
    report_period_start: '',
    report_period_end: '',
    property_ids: [] as string[],
    sections: getDefaultSections(),
    ai_summary_enabled: true,
    email_recipients: [] as string[],
    template_id: undefined as string | undefined
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Load user properties
  React.useEffect(() => {
    if (user?.id) {
      supabaseService.getUserProperties(user.id).then(setProperties);
    }
  }, [user?.id]);

  const handlePropertySelection = (propertyId: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      property_ids: checked 
        ? [...prev.property_ids, propertyId]
        : prev.property_ids.filter(id => id !== propertyId)
    }));
  };

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, enabled } : section
      )
    }));
  };

  const handleAddEmail = () => {
    if (emailInput && !reportConfig.email_recipients.includes(emailInput)) {
      setReportConfig(prev => ({
        ...prev,
        email_recipients: [...prev.email_recipients, emailInput]
      }));
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setReportConfig(prev => ({
      ...prev,
      email_recipients: prev.email_recipients.filter(e => e !== email)
    }));
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setReportConfig(prev => ({
        ...prev,
        sections: template.sections,
        ai_summary_enabled: template.ai_summary_enabled,
        email_recipients: template.email_recipients,
        template_id: templateId
      }));
      toast.success('Template loaded');
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    await saveTemplate({
      template_name: templateName,
      description: `Template created from report: ${reportConfig.report_title}`,
      sections: reportConfig.sections,
      chart_configs: {},
      ai_summary_enabled: reportConfig.ai_summary_enabled,
      auto_generation_enabled: false,
      email_recipients: reportConfig.email_recipients,
      is_active: true
    });

    setTemplateName('');
    setSaveAsTemplate(false);
  };

  const handleGenerateReport = async () => {
    // Validation
    if (!reportConfig.report_title.trim()) {
      toast.error('Please enter a report title');
      return;
    }
    if (!reportConfig.report_period_start || !reportConfig.report_period_end) {
      toast.error('Please select report period dates');
      return;
    }
    if (reportConfig.property_ids.length === 0) {
      toast.error('Please select at least one property');
      return;
    }

    const enabledSections = reportConfig.sections.filter(s => s.enabled);
    if (enabledSections.length === 0) {
      toast.error('Please select at least one report section');
      return;
    }

    await generateReport(reportConfig);
  };

  // Calculate estimated generation time based on complexity
  const estimatedTime = useMemo(() => {
    const baseTime = 2; // 2 minutes base
    const propertyMultiplier = reportConfig.property_ids.length * 0.5;
    const sectionMultiplier = reportConfig.sections.filter(s => s.enabled).length * 0.3;
    const aiMultiplier = reportConfig.ai_summary_enabled ? 1 : 0;
    
    return Math.ceil(baseTime + propertyMultiplier + sectionMultiplier + aiMultiplier);
  }, [reportConfig]);

  const recentReports = reports.slice(0, 5);
  const processingReports = reports.filter(r => r.generation_status === 'processing');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">LP Report Generator</h2>
          <p className="text-muted-foreground">
            Create comprehensive limited partner reports with AI-powered insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {processingReports.length > 0 && (
            <Badge variant="outline" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              {processingReports.length} Processing
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Templates */}
          {templates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Templates</CardTitle>
                <CardDescription>Load a pre-configured template to get started faster</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div 
                      key={template.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleLoadTemplate(template.id!)}
                    >
                      <h3 className="font-semibold mb-2">{template.template_name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {template.sections.filter(s => s.enabled).length} sections
                        </Badge>
                        {template.ai_summary_enabled && (
                          <Badge variant="outline">
                            <Zap className="h-3 w-3 mr-1" />
                            AI Insights
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Set up the basic parameters for your LP report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  placeholder="Q4 2024 Limited Partner Report"
                  value={reportConfig.report_title}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, report_title: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Period Start</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={reportConfig.report_period_start}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, report_period_start: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Period End</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={reportConfig.report_period_end}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, report_period_end: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Property Selection</CardTitle>
              <CardDescription>Choose which properties to include in the report</CardDescription>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No properties found</p>
                  <p className="text-sm text-gray-400">
                    Add properties to your portfolio to generate reports
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={property.id}
                        checked={reportConfig.property_ids.includes(property.id)}
                        onCheckedChange={(checked) => handlePropertySelection(property.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{property.name}</span>
                          <Badge variant="outline">{property.tier}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {property.address} • {property.units} units
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setReportConfig(prev => ({ 
                        ...prev, 
                        property_ids: properties.map(p => p.id) 
                      }))}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setReportConfig(prev => ({ ...prev, property_ids: [] }))}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Report Sections</CardTitle>
              <CardDescription>Customize which sections to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportConfig.sections.map((section) => (
                  <div key={section.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={section.id}
                      checked={section.enabled}
                      onCheckedChange={(checked) => handleSectionToggle(section.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={section.id} className="text-base font-medium cursor-pointer">
                        {section.name}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {section.type === 'executive_summary' && 'High-level overview with key metrics and AI insights'}
                        {section.type === 'financial_performance' && 'Revenue, expenses, NOI trends, and cash flow analysis'}
                        {section.type === 'property_updates' && 'Occupancy rates, maintenance updates, and lease activity'}
                        {section.type === 'market_analysis' && 'Market trends, comparable analysis, and economic indicators'}
                        {section.type === 'distributions' && 'Distribution history and projected returns'}
                        {section.type === 'future_outlook' && 'Projections and planned improvements'}
                      </p>
                    </div>
                    {section.enabled && (
                      <Badge variant="secondary" className="mt-1">
                        Enabled
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="ai-summary"
                  checked={reportConfig.ai_summary_enabled}
                  onCheckedChange={(checked) => setReportConfig(prev => ({ 
                    ...prev, 
                    ai_summary_enabled: checked as boolean 
                  }))}
                />
                <div className="flex-1">
                  <Label htmlFor="ai-summary" className="text-base font-medium cursor-pointer">
                    AI-Powered Executive Summary
                  </Label>
                  <p className="text-sm text-gray-600">
                    Generate intelligent insights and trend analysis using AI
                  </p>
                </div>
                <Badge variant="outline">
                  <Zap className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Email Recipients */}
          <Card>
            <CardHeader>
              <CardTitle>Email Distribution</CardTitle>
              <CardDescription>Automatically email the report when generated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                />
                <Button onClick={handleAddEmail} variant="outline">
                  Add
                </Button>
              </div>

              {reportConfig.email_recipients.length > 0 && (
                <div className="space-y-2">
                  {reportConfig.email_recipients.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{email}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveEmail(email)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Report Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Properties:</span>
                  <span className="font-medium">{reportConfig.property_ids.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium">
                    {reportConfig.sections.filter(s => s.enabled).length} enabled
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Summary:</span>
                  <span className="font-medium">
                    {reportConfig.ai_summary_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Recipients:</span>
                  <span className="font-medium">{reportConfig.email_recipients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Generation Time:</span>
                  <span className="font-medium">{estimatedTime} minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save as Template */}
          <Card>
            <CardHeader>
              <CardTitle>Save Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-template"
                  checked={saveAsTemplate}
                  onCheckedChange={setSaveAsTemplate}
                />
                <Label htmlFor="save-template">Save as template</Label>
              </div>

              {saveAsTemplate && (
                <div className="space-y-2">
                  <Input
                    placeholder="Template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                  <Button 
                    onClick={handleSaveTemplate}
                    disabled={saveTemplateLoading || !templateName.trim()}
                    className="w-full"
                    variant="outline"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate Report */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handleGenerateReport}
                disabled={generateReportLoading || reportConfig.property_ids.length === 0}
              >
                {generateReportLoading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              {reportConfig.property_ids.length === 0 && (
                <div className="flex items-center space-x-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Select properties to continue</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reports */}
          {recentReports.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{report.report_title}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(report.created_at!).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {report.generation_status === 'completed' && (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Ready
                            </Badge>
                          )}
                          {report.generation_status === 'processing' && (
                            <Badge variant="outline" className="text-blue-600">
                              <Zap className="h-3 w-3 mr-1 animate-spin" />
                              Processing
                            </Badge>
                          )}
                          {report.generation_status === 'failed' && (
                            <Badge variant="outline" className="text-red-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        {report.generation_status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LPReportBuilder;
