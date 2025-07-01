
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Target, Lightbulb, Award } from 'lucide-react';
import { engagementService, EngagementMetrics } from '@/services/engagementService';
import { useAuth } from '@/hooks/useAuth';

const EngagementScoreCard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEngagementMetrics();
    }
  }, [user]);

  const loadEngagementMetrics = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const engagementMetrics = await engagementService.calculateEngagementScore(user.id);
      setMetrics(engagementMetrics);
    } catch (error) {
      console.error('Error loading engagement metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Unable to load engagement metrics</p>
          <Button onClick={loadEngagementMetrics} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Engagement Score
            </div>
            <Badge className={getScoreBadgeColor(metrics.overallScore)}>
              {metrics.overallScore}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                {metrics.overallScore}
              </span>
              <div className="flex items-center gap-2">
                {getTrendIcon(metrics.improvementTrend)}
                <span className="text-sm capitalize">{metrics.improvementTrend}</span>
              </div>
            </div>
            
            <Progress value={metrics.overallScore} className="h-3" />
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>vs Industry Average</span>
              <span className={metrics.benchmarkComparison >= 0 ? 'text-green-600' : 'text-red-600'}>
                {metrics.benchmarkComparison >= 0 ? '+' : ''}{metrics.benchmarkComparison}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Responsiveness</span>
                <span className={`text-sm font-bold ${getScoreColor(metrics.responsiveness)}`}>
                  {metrics.responsiveness}%
                </span>
              </div>
              <Progress value={metrics.responsiveness} className="h-2" />
              <p className="text-xs text-gray-500">How quickly you respond to alerts</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Proactivity</span>
                <span className={`text-sm font-bold ${getScoreColor(metrics.proactivity)}`}>
                  {metrics.proactivity}%
                </span>
              </div>
              <Progress value={metrics.proactivity} className="h-2" />
              <p className="text-xs text-gray-500">Taking action before issues become problems</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Data Quality</span>
                <span className={`text-sm font-bold ${getScoreColor(metrics.dataQuality)}`}>
                  {metrics.dataQuality}%
                </span>
              </div>
              <Progress value={metrics.dataQuality} className="h-2" />
              <p className="text-xs text-gray-500">Frequency and accuracy of data syncing</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">System Usage</span>
                <span className={`text-sm font-bold ${getScoreColor(metrics.systemUsage)}`}>
                  {metrics.systemUsage}%
                </span>
              </div>
              <Progress value={metrics.systemUsage} className="h-2" />
              <p className="text-xs text-gray-500">How actively you use platform features</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementScoreCard;
