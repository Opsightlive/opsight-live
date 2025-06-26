
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Key, FileText, Globe, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DataSetupProps {
  onComplete: () => void;
}

const DataSetup: React.FC<DataSetupProps> = ({ onComplete }) => {
  const [setupType, setSetupType] = useState<'manual' | 'automatic' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [credentials, setCredentials] = useState({
    platform: '',
    username: '',
    password: ''
  });
  const { completeRegistration } = useAuth();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete the registration process
    const success = await completeRegistration({
      setupType,
      uploadedFiles: uploadedFiles.map(f => f.name),
      credentials: setupType === 'automatic' ? credentials : null
    });
    
    if (success) {
      onComplete();
    }
    
    setIsProcessing(false);
  };

  const canProceed = setupType === 'manual' 
    ? uploadedFiles.length > 0 
    : setupType === 'automatic' 
      ? credentials.platform && credentials.username && credentials.password
      : false;

  if (!setupType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Logo and Title */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto">
                <img 
                  src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                  alt="OPSIGHT Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-black mb-2">OPSIGHT</h1>
            <p className="text-blue-600 text-lg tracking-wider">OPERATIONAL INSIGHT</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-8">Setup Your Data Source</h2>
            <p className="text-gray-600 mt-2">
              Choose how you'd like to connect your property data to get realistic insights
            </p>
          </div>

          {/* Setup Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Manual Upload */}
            <Card 
              className="border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-200"
              onClick={() => setSetupType('manual')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">Manual Upload</CardTitle>
                <p className="text-gray-600">Upload your existing reports and documents</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Upload financial statements</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Import property reports</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Add maintenance records</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Quick setup process</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Automatic Connection */}
            <Card 
              className="border-2 border-blue-600 shadow-lg cursor-pointer transition-all duration-200 relative"
              onClick={() => setSetupType('automatic')}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
              
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">Automatic Connection</CardTitle>
                <p className="text-gray-600">Connect directly to your property platforms</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Real-time data sync</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Automatic updates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Connect multiple platforms</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Enhanced AI insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">OPSIGHT</h1>
          <p className="text-blue-600 text-lg tracking-wider">OPERATIONAL INSIGHT</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-8">
            {setupType === 'manual' ? 'Upload Your Reports' : 'Connect Your Platforms'}
          </h2>
          <p className="text-gray-600 mt-2">
            {setupType === 'manual' 
              ? 'Upload your property reports and financial documents' 
              : 'Provide your platform credentials for automatic data sync'
            }
          </p>
        </div>

        <Card className="border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              {setupType === 'manual' ? (
                <>
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span>Document Upload</span>
                </>
              ) : (
                <>
                  <Key className="h-6 w-6 text-blue-600" />
                  <span>Platform Credentials</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {setupType === 'manual' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Documents (PDF, Excel, Word)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.xlsx,.xls,.docx,.doc"
                    onChange={handleFileUpload}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isProcessing}
                  />
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Uploaded Files:</h4>
                    <ul className="space-y-1">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-600" />
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Management Platform
                  </label>
                  <select
                    value={credentials.platform}
                    onChange={(e) => setCredentials(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isProcessing}
                  >
                    <option value="">Select Platform</option>
                    <option value="appfolio">AppFolio</option>
                    <option value="buildium">Buildium</option>
                    <option value="propertyware">Propertyware</option>
                    <option value="rentmanager">Rent Manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username/Email
                  </label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isProcessing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isProcessing}
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Secure Connection:</strong> Your credentials are encrypted and used only to sync your property data. We never store your passwords.
                  </p>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-6">
              <Button 
                variant="outline" 
                onClick={() => setSetupType(null)}
                className="flex-1"
                disabled={isProcessing}
              >
                Back to Options
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={!canProceed || isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Setting up...</span>
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-gray-500 mt-4 text-sm text-center">
          {setupType === 'manual' 
            ? 'Supported formats: PDF, Excel, Word documents'
            : 'Your credentials are securely encrypted and never stored'
          }
        </p>
      </div>
    </div>
  );
};

export default DataSetup;
