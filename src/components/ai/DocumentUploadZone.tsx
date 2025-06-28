
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDocumentProcessing } from '@/hooks/useDocumentProcessing';

const DocumentUploadZone = () => {
  const { uploads, isUploading, uploadAndProcessDocument, removeUpload } = useDocumentProcessing();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      uploadAndProcessDocument(file);
    });
  }, [uploadAndProcessDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing...';
      case 'completed': return 'Completed';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, Excel, CSV, Word, and Text files (Max 10MB each)
            </p>
          </div>
        </CardContent>
      </Card>

      {uploads.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Progress</h3>
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium truncate">{upload.file.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={`${getStatusColor(upload.status)} text-white`}
                        >
                          {getStatusText(upload.status)}
                        </Badge>
                        {upload.status === 'error' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeUpload(upload.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={upload.progress} className="flex-1" />
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        {upload.progress}%
                      </span>
                    </div>
                    {upload.error && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">{upload.error}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUploadZone;
