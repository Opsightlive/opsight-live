
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Database, Upload, AlertCircle, ArrowRight, Zap } from 'lucide-react';

interface DataIntegrationWizardProps {
  onComplete: () => void;
}

const DataIntegrationWizard: React.FC<DataIntegrationWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [integrationMethod, setIntegrationMethod] = useState<'api' | 'upload' | ''>('');
  const [pmSoftware, setPmSoftware] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isConnecting, setIsConnecting] = useState(false);

  const pmSoftwareOptions = [
    { value: 'yardi', label: 'Yardi', supported: true },
    { value: 'appfolio', label: 'AppFolio', supported: true },
    { value: 'buildium', label: 'Buildium', supported: true },
    { value: 'propertyware', label: 'Propertyware', supported: true },
    { value: 'onesite', label: 'OneSite', supported: false },
    { value: 'resman', label: 'RESMan', supported: false },
    { value: 'entrata', label: 'Entrata', supported: false }
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate API connection
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsConnecting(false);
    setStep(4); // Success step
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-6 w-6 text-blue-600 mr-2" />
                Choose Integration Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  integrationMethod === 'api' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setIntegrationMethod('api')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">API Integration</h3>
                      <p className="text-sm text-gray-600">Real-time data sync (Recommended)</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Automated</Badge>
                </div>
              </div>

              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  integrationMethod === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setIntegrationMethod('upload')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Upload className="h-6 w-6 text-gray-600" />
                    <div>
                      <h3 className="font-semibold">Manual Upload</h3>
                      <p className="text-sm text-gray-600">Upload reports periodically</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Manual</Badge>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!integrationMethod}
                className="w-full"
              >
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select Your PM Software</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={pmSoftware} onValueChange={setPmSoftware}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your property management software" />
                </SelectTrigger>
                <SelectContent>
                  {pmSoftwareOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} disabled={!option.supported}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        {option.supported ? (
                          <Badge className="bg-green-100 text-green-800 ml-2">Supported</Badge>
                        ) : (
                          <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {pmSoftware && !pmSoftwareOptions.find(opt => opt.value === pmSoftware)?.supported && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Integration Coming Soon</p>
                      <p className="text-sm text-yellow-700">
                        We're working on this integration. For now, you can use manual upload.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!pmSoftware}
                  className="flex-1"
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        if (integrationMethod === 'upload') {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium">Drag & drop your files here</p>
                  <p className="text-sm text-gray-600">or click to browse</p>
                  <Button variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Supported file types:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Property rent rolls (.xlsx, .csv)</li>
                    <li>Financial statements (.pdf, .xlsx)</li>
                    <li>Occupancy reports (.xlsx, .csv)</li>
                    <li>Maintenance logs (.xlsx, .csv)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        }

        return (
          <Card>
            <CardHeader>
              <CardTitle>Connect to {pmSoftwareOptions.find(opt => opt.value === pmSoftware)?.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Secure Connection</p>
                    <p className="text-sm text-blue-700">
                      Your credentials are encrypted and stored securely. We only access data you authorize.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Your PM software username"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Your PM software password"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handleConnect}
                  disabled={!credentials.username || !credentials.password || isConnecting}
                  className="flex-1"
                >
                  {isConnecting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <>Connect Now <ArrowRight className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="h-6 w-6 mr-2" />
                Connection Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your data is syncing!</h3>
                <p className="text-gray-600">
                  We're importing your property data. This usually takes 5-10 minutes.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Properties imported</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Tenant data synced</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                  <span>Financial data processing...</span>
                </div>
              </div>

              <Button onClick={onComplete} className="w-full">
                View Your Dashboard
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Connect Your Data</h1>
          <Badge variant="outline">Step {step} of 4</Badge>
        </div>
        <p className="text-gray-600">
          Let's connect your property management data to start generating insights.
        </p>
      </div>

      {renderStep()}
    </div>
  );
};

export default DataIntegrationWizard;
