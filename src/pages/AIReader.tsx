import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Download, Trash2, Eye, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIReader = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          <div>
            <h1 className="text-4xl font-bold mb-4">AI Document Reader</h1>
            <p className="text-xl text-blue-100 max-w-3xl">Upload and analyze documents with AI-powered insights for property management and financial reports</p>
          </div>
        </div>

        {/* Upload Section */}
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

        {/* Files List */}
        <div>
          <h2 className="text-lg font-semibold text-black mb-4">Uploaded Files ({uploadedFiles.length})</h2>
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
                  <p className="text-xs text-gray-600">Uploaded: {file.uploadDate}</p>
                  
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
