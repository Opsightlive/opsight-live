
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Trash2, Eye, Brain, Settings, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIReader = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState('automatic');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    uploadDate: string;
    processed: boolean;
    insights?: string[];
  }>>([
    {
      id: '1',
      name: 'Q3_Financial_Report.pdf',
      size: '2.4 MB',
      type: 'PDF',
      uploadDate: '2024-01-15',
      processed: true,
      insights: [
        'Revenue increased by 12% compared to Q2',
        'Operating expenses within projected range',
        'Occupancy rates showing positive trend'
      ]
    },
    {
      id: '2',
      name: 'Property_Inspection_Report.docx',
      size: '1.8 MB',
      type: 'DOCX',
      uploadDate: '2024-01-14',
      processed: true,
      insights: [
        'Maintenance issues identified in Building A',
        'HVAC systems require attention',
        'Overall property condition: Good'
      ]
    }
  ]);

  // Load upload mode from localStorage on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem('aiReaderMode');
    if (savedMode) {
      setUploadMode(savedMode);
    } else {
      // Default to automatic if no saved preference
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
          processed: false
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Simulate processing
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, processed: true, insights: ['AI analysis in progress...'] }
                : f
            )
          );
        }, 2000);
      });
      
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully`,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">AI Document Reader</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Upload and analyze documents with AI-powered insights for property management and financial reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={uploadMode === 'automatic' ? 'default' : 'secondary'} 
                className="bg-white text-blue-600 flex items-center gap-2"
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
              <p className="text-sm text-blue-100">
                Change mode in <Settings className="h-4 w-4 inline" /> Settings
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {uploadMode === 'automatic' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automatic Document Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
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
                <p className="text-sm text-gray-600">
                  Supported formats: PDF, DOCX, TXT, CSV, XLSX. Max file size: 10MB
                </p>
                <Button onClick={handleFileUpload} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Manually Add Document (Override)
                </Button>
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

        {/* Files List */}
        <div>
          <h2 className="text-lg font-semibold text-black mb-4">
            {uploadMode === 'automatic' ? 'Processed Documents' : 'Uploaded Files'} ({uploadedFiles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <Card key={file.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
                    <Badge variant="secondary">{file.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-gray-600">Size: {file.size}</p>
                  <p className="text-xs text-gray-600">
                    {uploadMode === 'automatic' ? 'Processed' : 'Uploaded'}: {file.uploadDate}
                  </p>
                  
                  {file.processed ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">AI Insights:</span>
                      </div>
                      {file.insights && file.insights.length > 0 ? (
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                          {file.insights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No insights available yet.</p>
                      )}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadInsights(file.name)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Insights
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleViewFile(file.name)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline">Processing...</Badge>
                  )}

                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full justify-center"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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
