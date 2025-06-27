import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Download, Trash2, Eye, Brain, Settings, Zap, Clock, Folder, Search, Filter, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Bot, Lightbulb, FileSearch, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIReader = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState('automatic');
  const [autoProcessingEnabled, setAutoProcessingEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [processingFrequency, setProcessingFrequency] = useState('realtime');
  const [watchedFolders, setWatchedFolders] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: '1',
      name: 'Q4_Financial_Report.pdf',
      size: '3.2 MB',
      type: 'PDF',
      uploadDate: '2024-01-15',
      processed: true,
      category: 'Financial',
      confidence: 92,
      insights: [
        'Revenue increased by 15% compared to Q3',
        'Operating expenses within projected range at 68% of revenue',
        'Occupancy rates showing strong upward trend across all properties',
        'Rent collection efficiency improved by 8%',
        'Recommended: Review pricing strategy for underperforming units'
      ],
      keyMetrics: {
        revenue: '$2.4M',
        expenses: '$1.6M',
        noi: '$800K',
        occupancy: '94.2%'
      },
      riskFactors: ['Market rent pressure', 'Aging HVAC systems'],
      opportunities: ['Rent optimization', 'Energy efficiency upgrades']
    },
    {
      id: '2',
      name: 'Property_Inspection_Sunset_Gardens.docx',
      size: '2.1 MB',
      type: 'DOCX',
      uploadDate: '2024-01-14',
      processed: true,
      category: 'Operations',
      confidence: 88,
      insights: [
        'Overall property condition rated as Good (8.2/10)',
        'HVAC systems require attention in Buildings A & C',
        'Roof inspection recommended within 6 months',
        'Landscaping and common areas in excellent condition',
        'Security system upgrade recommended'
      ],
      actionItems: [
        'Schedule HVAC maintenance for Buildings A & C',
        'Get roof inspection quotes',
        'Research security system vendors'
      ],
      priorityScore: 'Medium'
    },
    {
      id: '3',
      name: 'Market_Analysis_Metro_Area.xlsx',
      size: '1.8 MB',
      type: 'XLSX',
      uploadDate: '2024-01-13',
      processed: true,
      category: 'Market Research',
      confidence: 95,
      insights: [
        'Market rents increased 6.2% year-over-year',
        'Vacancy rates at historic low of 3.8%',
        'New supply pipeline shows 2,400 units over next 18 months',
        'Demographic trends favor continued growth',
        'Recommended: Implement rent increases across portfolio'
      ],
      marketTrends: {
        rentGrowth: '6.2%',
        vacancyRate: '3.8%',
        newSupply: '2,400 units',
        absorption: '92%'
      }
    }
  ]);

  const [aiInsights, setAiInsights] = useState({
    totalDocuments: 847,
    processedThisMonth: 156,
    keyTrends: [
      'Maintenance costs trending up 12% across portfolio',
      'Rent collection rates improving consistently',
      'Energy efficiency opportunities identified in 60% of properties'
    ],
    riskAlerts: [
      'Lease expiration concentration in Q2 2024',
      'Capital expenditure budget trending 15% over plan'
    ],
    recommendations: [
      'Implement predictive maintenance program',
      'Review lease renewal incentive strategy',
      'Consider energy audit for underperforming properties'
    ]
  });

  const documentCategories = [
    { name: 'All Documents', value: 'all', count: 847 },
    { name: 'Financial', value: 'financial', count: 234 },
    { name: 'Operations', value: 'operations', count: 189 },
    { name: 'Legal', value: 'legal', count: 145 },
    { name: 'Market Research', value: 'market', count: 98 },
    { name: 'Compliance', value: 'compliance', count: 87 },
    { name: 'Other', value: 'other', count: 94 }
  ];

  useEffect(() => {
    const savedMode = localStorage.getItem('aiReaderMode');
    if (savedMode) {
      setUploadMode(savedMode);
    } else {
      setUploadMode('automatic');
      localStorage.setItem('aiReaderMode', 'automatic');
    }
  }, []);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
          uploadDate: new Date().toISOString().split('T')[0],
          processed: false,
          category: 'Other',
          confidence: 0
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, processed: true, confidence: Math.floor(Math.random() * 20) + 80, insights: ['AI analysis completed...'] }
                : f
            )
          );
        }, 3000);
      });
      
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded and processing started`,
      });
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File deleted",
      description: "File removed successfully",
    });
  };

  const handleViewFile = (fileName: string) => {
    toast({
      title: "Opening file",
      description: `Opening ${fileName}`,
    });
  };

  const handleDownloadInsights = (fileName: string) => {
    toast({
      title: "Downloading insights",
      description: `Insights for ${fileName} downloaded`,
    });
  };

  const handleCreateReport = () => {
    toast({
      title: "Generating Portfolio Report",
      description: "AI is creating a comprehensive portfolio analysis...",
    });
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">AI Document Intelligence Center</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Advanced AI-powered document analysis for comprehensive property management insights
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>{aiInsights.totalDocuments} Total Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  <span>{aiInsights.processedThisMonth} Processed This Month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>98.3% Accuracy Rate</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Badge 
                variant={uploadMode === 'automatic' ? 'default' : 'secondary'} 
                className="bg-white text-blue-600 flex items-center gap-2 px-4 py-2"
              >
                {uploadMode === 'automatic' ? (
                  <>
                    <Zap className="h-4 w-4" />
                    Automatic Mode
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Manual Mode
                  </>
                )}
              </Badge>
              <Button onClick={handleCreateReport} className="bg-white text-blue-600 hover:bg-blue-50">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate AI Report
              </Button>
            </div>
          </div>
        </div>

        {/* AI Insights Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Key Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiInsights.keyTrends.map((trend, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    {trend}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiInsights.riskAlerts.map((alert, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {alert}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiInsights.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Document Library</TabsTrigger>
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.name} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Enhanced Document Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg font-medium">{file.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>{file.size}</span>
                            <Badge variant="outline">{file.type}</Badge>
                            {file.category && <Badge variant="secondary">{file.category}</Badge>}
                          </div>
                        </div>
                      </div>
                      {file.confidence && (
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Confidence</div>
                          <div className="text-lg font-bold text-green-600">{file.confidence}%</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {file.processed ? (
                      <>
                        {file.keyMetrics && (
                          <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
                            <div>
                              <div className="text-sm text-gray-600">Revenue</div>
                              <div className="font-semibold">{file.keyMetrics.revenue}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">NOI</div>
                              <div className="font-semibold">{file.keyMetrics.noi}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Occupancy</div>
                              <div className="font-semibold">{file.keyMetrics.occupancy}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Expenses</div>
                              <div className="font-semibold">{file.keyMetrics.expenses}</div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">AI Insights:</span>
                          </div>
                          <ul className="list-disc pl-6 text-sm space-y-1">
                            {file.insights?.slice(0, 3).map((insight, index) => (
                              <li key={index}>{insight}</li>
                            ))}
                          </ul>
                        </div>

                        {file.riskFactors && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="font-medium">Risk Factors:</span>
                            </div>
                            <ul className="list-disc pl-6 text-sm space-y-1">
                              {file.riskFactors.map((risk, index) => (
                                <li key={index} className="text-red-600">{risk}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {file.actionItems && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="font-medium">Action Items:</span>
                            </div>
                            <ul className="list-disc pl-6 text-sm space-y-1">
                              {file.actionItems.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewFile(file.name)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Document
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadInsights(file.name)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bookmark className="h-4 w-4 mr-2" />
                            Save Insights
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileSearch className="h-4 w-4 mr-2" />
                            Deep Analysis
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span>Processing...</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    )}

                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Document
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload">
            {uploadMode === 'automatic' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Automatic Document Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Automatic Mode Active</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Documents are automatically detected and processed from your connected sources. 
                        New documents will appear here as they are discovered and analyzed.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Monitoring for new documents...
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-900">Processing Options</h5>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Auto-Processing</Label>
                            <p className="text-sm text-gray-600">Automatically process new documents</p>
                          </div>
                          <Switch 
                            checked={autoProcessingEnabled}
                            onCheckedChange={setAutoProcessingEnabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Watch Folders</Label>
                            <p className="text-sm text-gray-600">Monitor connected folder sources</p>
                          </div>
                          <Switch 
                            checked={watchedFolders}
                            onCheckedChange={setWatchedFolders}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Email Notifications</Label>
                            <p className="text-sm text-gray-600">Get notified when documents are processed</p>
                          </div>
                          <Switch 
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <p className="text-sm text-gray-600">
                      Supported formats: PDF, DOCX, TXT, CSV, XLSX. Max file size: 10MB
                    </p>
                    <Button onClick={handleFileUpload}>
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Processing Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Processed</span>
                      <span className="font-bold">{aiInsights.totalDocuments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-bold">{aiInsights.processedThisMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Confidence</span>
                      <span className="font-bold">91.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time</span>
                      <span className="font-bold">2.3 sec avg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Accuracy Rate</span>
                        <span>98.3%</span>
                      </div>
                      <Progress value={98.3} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Processing Speed</span>
                        <span>95.7%</span>
                      </div>
                      <Progress value={95.7} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Insight Quality</span>
                        <span>92.1%</span>
                      </div>
                      <Progress value={92.1} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="automatic" 
                        name="mode" 
                        value="automatic"
                        checked={uploadMode === 'automatic'}
                        onChange={(e) => setUploadMode(e.target.value)}
                      />
                      <label htmlFor="automatic">Automatic Processing</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="manual" 
                        name="mode" 
                        value="manual"
                        checked={uploadMode === 'manual'}
                        onChange={(e) => setUploadMode(e.target.value)}
                      />
                      <label htmlFor="manual">Manual Upload</label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Analysis Depth</Label>
                      <Select defaultValue="comprehensive">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Analysis</SelectItem>
                          <SelectItem value="standard">Standard Analysis</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Report Format</Label>
                      <Select defaultValue="detailed">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary Only</SelectItem>
                          <SelectItem value="detailed">Detailed Report</SelectItem>
                          <SelectItem value="executive">Executive Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default AIReader;
