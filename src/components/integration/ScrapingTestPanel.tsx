
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, TestTube, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { usePMIntegration } from '@/hooks/usePMIntegration';

interface ScrapingTestPanelProps {
  integration: {
    id: string;
    pm_software: string;
    integration_name: string;
    sync_status: string;
    last_sync?: string | null;
  };
}

const ScrapingTestPanel: React.FC<ScrapingTestPanelProps> = ({ integration }) => {
  const { testIntegration, syncIntegration } = usePMIntegration();
  const [isTestingMock, setIsTestingMock] = useState(false);
  const [isTestingReal, setIsTestingReal] = useState(false);

  const handleTestMockData = async () => {
    setIsTestingMock(true);
    try {
      await testIntegration(integration.id, true); // Test mode = true
    } finally {
      setIsTestingMock(false);
    }
  };

  const handleTestRealScraping = async () => {
    setIsTestingReal(true);
    try {
      await syncIntegration(integration.id, false); // Test mode = false (real scraping)
    } finally {
      setIsTestingReal(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'testing':
      case 'syncing':
        return <TestTube className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const isScrapingSupported = integration.pm_software.toLowerCase() === 'onesite';

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Web Scraping Test Panel
          <Badge variant="outline" className="ml-auto">
            {getStatusIcon(integration.sync_status)}
            {integration.sync_status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">How Web Scraping Works</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Test Mode:</strong> Returns mock data to verify the integration works</li>
            <li>• <strong>Real Scraping:</strong> Uses Puppeteer to log into your PM software and extract actual data</li>
            <li>• <strong>Supported:</strong> OneSite/RealPage (others coming soon)</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Test Mode */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TestTube className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold">Test Mode</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Validates integration setup with mock data
            </p>
            <Button
              onClick={handleTestMockData}
              disabled={isTestingMock || integration.sync_status === 'testing'}
              variant="outline"
              className="w-full"
            >
              {isTestingMock ? (
                <>
                  <TestTube className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Test with Mock Data
                </>
              )}
            </Button>
          </div>

          {/* Real Scraping */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold">Real Scraping</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {isScrapingSupported 
                ? 'Scrape live data from your PM software' 
                : 'Not yet supported for this PM software'
              }
            </p>
            <Button
              onClick={handleTestRealScraping}
              disabled={
                !isScrapingSupported || 
                isTestingReal || 
                integration.sync_status === 'syncing' ||
                integration.sync_status === 'testing'
              }
              className="w-full"
            >
              {isTestingReal ? (
                <>
                  <Globe className="h-4 w-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  {isScrapingSupported ? 'Start Real Scraping' : 'Coming Soon'}
                </>
              )}
            </Button>
          </div>
        </div>

        {!isScrapingSupported && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-semibold">PM Software Not Yet Supported</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Real web scraping for {integration.pm_software} is coming soon. You can test with mock data for now.
            </p>
          </div>
        )}

        {integration.last_sync && (
          <div className="text-sm text-gray-600">
            <strong>Last Sync:</strong> {new Date(integration.last_sync).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScrapingTestPanel;
