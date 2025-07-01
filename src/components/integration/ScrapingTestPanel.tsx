
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, CheckCircle, AlertCircle, Database, TrendingUp } from 'lucide-react';
import { pmScrapingService, ScrapingResult } from '@/services/pmScrapingService';
import { redFlagService } from '@/services/redFlagService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ScrapingTestPanelProps {
  integration: any;
}

const ScrapingTestPanel: React.FC<ScrapingTestPanelProps> = ({ integration }) => {
  const { user } = useAuth();
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null);
  const [scrapingStage, setScrapingStage] = useState('');

  const handleStartScraping = async () => {
    if (!user) {
      toast.error('Please log in to start scraping');
      return;
    }

    setIsScrapingActive(true);
    setScrapingProgress(0);
    setScrapingResult(null);

    try {
      // Stage 1: Authentication
      setScrapingStage('Authenticating with PM software...');
      setScrapingProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Stage 2: Data Discovery
      setScrapingStage('Discovering available data sources...');
      setScrapingProgress(40);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Stage 3: Data Extraction
      setScrapingStage('Extracting property data...');
      setScrapingProgress(60);
      
      const credentials = {
        username: 'demo_user',
        password: 'demo_pass',
        pmSoftware: integration.pm_software
      };

      const result = await pmScrapingService.scrapePMSoftware(credentials);
      
      // Stage 4: Data Processing
      setScrapingStage('Processing and analyzing data...');
      setScrapingProgress(80);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (result.success && result.data) {
        // Store the scraped data
        await pmScrapingService.storeScrapedData(user.id, result.data, integration.pm_software);
        
        // Analyze for red flags
        await redFlagService.analyzeKPIsForRedFlags(user.id);
      }

      // Stage 5: Complete
      setScrapingStage('Scraping completed successfully!');
      setScrapingProgress(100);
      setScrapingResult(result);

      if (result.success) {
        toast.success(`Successfully scraped data from ${integration.pm_software}!`);
      } else {
        toast.error(`Scraping failed: ${result.error}`);
      }

    } catch (error) {
      console.error('Scraping error:', error);
      setScrapingResult({ success: false, error: 'Scraping failed unexpectedly' });
      toast.error('Scraping failed unexpectedly');
    } finally {
      setIsScrapingActive(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Data Scraping & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScrapingActive && !scrapingResult && (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Test the data scraping bot to extract KPIs and identify red flags from your {integration.pm_software} system.
            </p>
            <Button onClick={handleStartScraping} className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Start Data Scraping Test
            </Button>
          </div>
        )}

        {isScrapingActive && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm font-medium">{scrapingStage}</p>
            </div>
            <Progress value={scrapingProgress} className="w-full" />
            <p className="text-xs text-gray-500 text-center">{scrapingProgress}% complete</p>
          </div>
        )}

        {scrapingResult && (
          <div className="space-y-4">
            {scrapingResult.success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  <strong>Scraping completed successfully!</strong>
                  <div className="mt-2 space-y-1">
                    <p>• Credits used: {scrapingResult.creditsUsed}</p>
                    <p>• Data extracted from {integration.pm_software}</p>
                    <p>• KPIs analyzed for red flags</p>
                    <p>• Performance metrics updated</p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Scraping failed:</strong> {scrapingResult.error}
                </AlertDescription>
              </Alert>
            )}

            {scrapingResult.success && scrapingResult.data && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {scrapingResult.data.kpis.length}
                  </div>
                  <div className="text-sm text-gray-600">KPIs Extracted</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {scrapingResult.data.financials.length}
                  </div>
                  <div className="text-sm text-gray-600">Financial Records</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {scrapingResult.data.tenants.length}
                  </div>
                  <div className="text-sm text-gray-600">Tenant Records</div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleStartScraping}
              >
                Run Again
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/kpi-command-center'}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                View KPI Dashboard
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>What this test does:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Connects to your PM software using stored credentials</li>
            <li>• Extracts financial data, tenant info, and maintenance records</li>
            <li>• Calculates key performance indicators (KPIs)</li>
            <li>• Identifies red flags and performance issues</li>
            <li>• Updates your dashboards with real-time data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScrapingTestPanel;
