
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Database, Archive, Calendar, BarChart3, AlertTriangle, Filter, Search, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataFile {
  id: string;
  name: string;
  type: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  date: string;
  size: string;
  category: 'KPI' | 'Red Flag' | 'LP Report';
  property?: string;
}

const DataVault = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('kpi-snapshots');
  const { toast } = useToast();

  const dataFiles: DataFile[] = [
    {
      id: '1',
      name: 'Q4_2024_KPI_Summary.pdf',
      type: 'PDF',
      date: 'Dec 15, 2024',
      size: '2.3 MB',
      category: 'KPI',
      property: 'Portfolio Wide'
    },
    {
      id: '2',
      name: 'Occupancy_Trends_Nov.xlsx',
      type: 'Excel',
      date: 'Nov 30, 2024',
      size: '1.8 MB',
      category: 'KPI',
      property: 'Greenview Apts'
    },
    {
      id: '3',
      name: 'Red_Flag_Alert_History.csv',
      type: 'CSV',
      date: 'Dec 10, 2024',
      size: '856 KB',
      category: 'Red Flag',
      property: 'Multiple Properties'
    },
    {
      id: '4',
      name: 'LP_Quarterly_Report_Q3.pdf',
      type: 'PDF',
      date: 'Oct 1, 2024',
      size: '5.2 MB',
      category: 'LP Report',
      property: 'Portfolio Wide'
    },
    {
      id: '5',
      name: 'Delinquency_Analysis_Dec.json',
      type: 'JSON',
      date: 'Dec 5, 2024',
      size: '342 KB',
      category: 'Red Flag',
      property: 'Harbor View'
    },
    {
      id: '6',
      name: 'Annual_Performance_2024.xlsx',
      type: 'Excel',
      date: 'Dec 1, 2024',
      size: '3.1 MB',
      category: 'LP Report',
      property: 'Portfolio Wide'
    }
  ];

  const filteredFiles = dataFiles.filter(file => {
    switch (activeTab) {
      case 'kpi-snapshots':
        return file.category === 'KPI';
      case 'red-flag-history':
        return file.category === 'Red Flag';
      case 'lp-report-archive':
        return file.category === 'LP Report';
      default:
        return true;
    }
  });

  const handleFileSelect = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(filteredFiles.map(file => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to download",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Download Started",
      description: `Downloading ${selectedFiles.length} selected files`,
    });
    console.log('Downloading files:', selectedFiles);
  };

  const handleExportAll = () => {
    toast({
      title: "Export Started",
      description: "Creating ZIP archive of all files",
    });
    console.log('Exporting all files to ZIP');
  };

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "File upload functionality coming soon",
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-4 w-4 text-red-600" />;
      case 'Excel':
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      case 'CSV':
        return <Database className="h-4 w-4 text-blue-600" />;
      case 'JSON':
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'PDF': 'bg-red-100 text-red-800',
      'Excel': 'bg-green-100 text-green-800',
      'CSV': 'bg-blue-100 text-blue-800',
      'JSON': 'bg-purple-100 text-purple-800'
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  const allSelected = filteredFiles.length > 0 && selectedFiles.length === filteredFiles.length;
  const someSelected = selectedFiles.length > 0 && selectedFiles.length < filteredFiles.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-black">Data Vault</h1>
          <p className="text-gray-600 mt-2">Centralized repository for all your property data, reports, and analytics</p>
        </div>

        {/* Data Architecture Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Files</p>
                  <p className="text-2xl font-bold">{dataFiles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">KPI Reports</p>
                  <p className="text-2xl font-bold">{dataFiles.filter(f => f.category === 'KPI').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Alert History</p>
                  <p className="text-2xl font-bold">{dataFiles.filter(f => f.category === 'Red Flag').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Archive className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">LP Reports</p>
                  <p className="text-2xl font-bold">{dataFiles.filter(f => f.category === 'LP Report').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Document Archive</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="kpi-snapshots" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>KPI Snapshots</span>
                </TabsTrigger>
                <TabsTrigger value="red-flag-history" className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Red Flag History</span>
                </TabsTrigger>
                <TabsTrigger value="lp-report-archive" className="flex items-center space-x-2">
                  <Archive className="h-4 w-4" />
                  <span>LP Report Archive</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleDownloadSelected}
                      disabled={selectedFiles.length === 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Selected ({selectedFiles.length})
                    </Button>
                    <Button variant="outline" onClick={handleExportAll}>
                      <Archive className="h-4 w-4 mr-2" />
                      Export All to ZIP
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredFiles.length} files • {selectedFiles.length} selected
                  </div>
                </div>

                {/* File Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedFiles.includes(file.id)}
                              onCheckedChange={(checked) => handleFileSelect(file.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file.type)}
                              <span className="font-medium">{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(file.type)}
                          </TableCell>
                          <TableCell className="text-gray-600">{file.property}</TableCell>
                          <TableCell className="text-gray-600">{file.date}</TableCell>
                          <TableCell className="text-gray-600">{file.size}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Download Started",
                                    description: `Downloading ${file.name}`,
                                  });
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "File Deleted",
                                    description: `${file.name} has been deleted`,
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Data Architecture Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Sources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Property Management Systems</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Financial Data APIs</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Automated Report Generation</span>
                        <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Manual Upload</span>
                        <Badge className="bg-gray-100 text-gray-800">Available</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Storage & Retention</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Storage Used</span>
                        <span className="text-sm font-medium">2.4 GB / 100 GB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Retention Policy</span>
                        <span className="text-sm font-medium">7 Years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Backup Status</span>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Sync</span>
                        <span className="text-sm font-medium">2 hours ago</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataVault;
