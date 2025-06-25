
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Users, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Clock, Activity, Settings, Target, PieChart, BarChart3, Crown, Globe, Briefcase, Shield, Zap, Award, Rocket, Brain } from 'lucide-react';

const CompanyDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // CEO/Founder Financial Metrics
  const financialMetrics = {
    monthlyRevenue: 47200,
    monthlyExpenses: 28500,
    netProfit: 18700,
    profitMargin: 39.6,
    yearlyProjection: 566400,
    cashFlow: 'positive',
    enterpriseValue: 2850000,
    burnRate: 45000,
    runway: 18 // months
  };

  // Market Intelligence & Opportunities
  const marketIntelligence = {
    totalAddressableMarket: 12500000000, // $12.5B
    marketGrowthRate: 23.4,
    competitorCount: 147,
    marketShare: 0.45,
    emergingOpportunities: [
      { market: 'AI-Powered Property Analytics', size: 850000000, growth: 45.2 },
      { market: 'Cross-Border Real Estate', size: 2300000000, growth: 28.7 },
      { market: 'Institutional Crypto Real Estate', size: 450000000, growth: 89.3 }
    ]
  };

  // Strategic Partnerships & M&A Pipeline
  const strategicOpportunities = [
    {
      type: 'Acquisition Target',
      company: 'PropertyTech Innovations',
      value: 15000000,
      synergies: 'AI technology stack + 50K user base',
      timeline: 'Q1 2025',
      probability: 75
    },
    {
      type: 'Strategic Partnership',
      company: 'Goldman Sachs Real Estate',
      value: 50000000,
      synergies: 'Enterprise client access + institutional credibility',
      timeline: 'Q4 2024',
      probability: 60
    },
    {
      type: 'Joint Venture',
      company: 'Singapore Sovereign Wealth Fund',
      value: 100000000,
      synergies: 'Asian market entry + regulatory expertise',
      timeline: 'Q2 2025',
      probability: 40
    }
  ];

  // Global Expansion Metrics
  const globalExpansion = {
    currentMarkets: 3,
    targetMarkets: ['UK', 'Singapore', 'Dubai', 'Toronto', 'Sydney'],
    regulatoryApprovals: { pending: 2, approved: 1, inProgress: 2 },
    localPartners: 8,
    complianceCost: 850000
  };

  // Competitive Moat Analysis
  const competitiveAdvantages = [
    { advantage: 'Proprietary AI Algorithm', strength: 95, defensibility: 'High' },
    { advantage: 'Network Effects', strength: 78, defensibility: 'Medium' },
    { advantage: 'Regulatory Moats', strength: 65, defensibility: 'High' },
    { advantage: 'Brand Recognition', strength: 45, defensibility: 'Medium' },
    { advantage: 'Data Monopoly', strength: 82, defensibility: 'Very High' }
  ];

  // Business Growth & Direction
  const businessMetrics = {
    totalConsumers: 247,
    monthlyGrowthRate: 12.3,
    customerRetentionRate: 94.2,
    marketPenetration: 8.7,
    competitivePosition: 'Strong',
    industryRanking: 3,
    customerLifetimeValue: 85000,
    customerAcquisitionCost: 2400
  };

  // Strategic Goals & Vision
  const strategicGoals = [
    { goal: 'Achieve unicorn valuation ($1B)', progress: 28.5, target: 'Q4 2025' },
    { goal: 'Expand to 5 international markets', progress: 20, target: 'Q2 2026' },
    { goal: 'IPO readiness & compliance', progress: 35, target: 'Q1 2027' },
    { goal: 'AI patent portfolio (50+ patents)', progress: 60, target: 'Q3 2025' },
    { goal: 'Enterprise clients (Fortune 500)', progress: 15, target: 'Q4 2025' }
  ];

  const recentAlerts = [
    {
      id: 1,
      client: 'Blackstone Group',
      type: 'Enterprise Inquiry',
      message: 'Requesting enterprise demo for $2M+ annual contract',
      severity: 'info',
      timestamp: '5 min ago',
      status: 'active'
    },
    {
      id: 2,
      client: 'Market Intelligence',
      type: 'Competitive Threat',
      message: 'Competitor raised $50M Series B - aggressive expansion planned',
      severity: 'high',
      timestamp: '12 min ago',
      status: 'monitoring'
    },
    {
      id: 3,
      client: 'Regulatory Update',
      type: 'Policy Change',
      message: 'EU GDPR update affects data processing - compliance review needed',
      severity: 'high',
      timestamp: '1 hour ago',
      status: 'pending'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-yellow-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Executive Command Center</h1>
              <p className="text-gray-600 dark:text-gray-400">Strategic Intelligence & Billionaire Decision Support</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Executive Settings
            </Button>
          </div>
        </div>
      </div>

      {/* High-Level Financial Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enterprise Value</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(financialMetrics.enterpriseValue)}</p>
              </div>
              <Crown className="h-6 w-6 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-800 text-xs mt-2">
              {financialMetrics.profitMargin}% margin
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TAM</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(marketIntelligence.totalAddressableMarket)}</p>
              </div>
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-xs mt-2">
              {marketIntelligence.marketGrowthRate}% growth
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Runway</p>
                <p className="text-2xl font-bold text-purple-600">{financialMetrics.runway}mo</p>
              </div>
              <Rocket className="h-6 w-6 text-purple-600" />
            </div>
            <Badge className="bg-purple-100 text-purple-800 text-xs mt-2">
              {formatCurrency(financialMetrics.burnRate)}/mo burn
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">LTV/CAC</p>
                <p className="text-2xl font-bold text-orange-600">{(businessMetrics.customerLifetimeValue / businessMetrics.customerAcquisitionCost).toFixed(1)}x</p>
              </div>
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <Badge className="bg-orange-100 text-orange-800 text-xs mt-2">
              Excellent unit economics
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Share</p>
                <p className="text-2xl font-bold text-red-600">{marketIntelligence.marketShare}%</p>
              </div>
              <PieChart className="h-6 w-6 text-red-600" />
            </div>
            <Badge className="bg-red-100 text-red-800 text-xs mt-2">
              #{businessMetrics.industryRanking} in category
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Strategic M&A Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span>Strategic M&A Pipeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strategicOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{opportunity.company}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{opportunity.type}</Badge>
                    <Badge className={`text-xs ${opportunity.probability > 60 ? 'bg-green-100 text-green-800' : opportunity.probability > 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {opportunity.probability}% prob
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{opportunity.synergies}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-600">{formatCurrency(opportunity.value)}</span>
                  <span className="text-gray-500">{opportunity.timeline}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Competitive Moat Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Competitive Moat Strength</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{advantage.advantage}</span>
                  <Badge className={`text-xs ${advantage.defensibility === 'Very High' ? 'bg-green-100 text-green-800' : advantage.defensibility === 'High' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {advantage.defensibility}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{width: `${advantage.strength}%`}}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {advantage.strength}% strength
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Global Expansion Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <span>Global Expansion Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-xl font-bold text-purple-600 mb-1">{globalExpansion.currentMarkets}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Markets</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold text-blue-600 mb-1">{globalExpansion.localPartners}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Strategic Partners</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Target Markets Pipeline</h4>
              {globalExpansion.targetMarkets.map((market, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">{market}</span>
                  <Badge variant="outline" className="text-xs">
                    {index < 2 ? 'Priority' : 'Secondary'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Intelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-orange-600" />
              <span>Emerging Market Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketIntelligence.emergingOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{opportunity.market}</span>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                    {opportunity.growth}% CAGR
                  </Badge>
                </div>
                <div className="text-lg font-bold text-orange-600">
                  {formatCurrency(opportunity.size)} TAM
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Executive Strategic Goals */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Billionaire-Level Strategic Objectives</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategicGoals.map((goal, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{goal.goal}</span>
                  <Badge variant="outline" className="text-xs">{goal.target}</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-700" 
                    style={{width: `${goal.progress}%`}}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {goal.progress}% complete
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Executive Intelligence Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-red-600" />
            <span>Executive Intelligence Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{alert.client}</span>
                    <Badge variant="outline" className="text-xs">{alert.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alert.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{alert.timestamp}</span>
                    <Badge className={`text-xs ${alert.status === 'active' ? 'bg-red-100 text-red-800' : alert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {alert.status}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="ml-2">
                  Executive Action
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            Access Full Intelligence Brief
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
