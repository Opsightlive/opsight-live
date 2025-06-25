
import React, { useState } from 'react';
import { Bot, Lightbulb, Target, Clock, CheckCircle } from 'lucide-react';

interface AlertData {
  id: number;
  metric: string;
  property: string;
  severity: 'critical' | 'warning';
  value: string;
  threshold: string;
  category: string;
  assignedPM: string;
  daysActive: number;
}

interface AIAdvice {
  ownership: string;
  immediateActions: string[];
  rootCause: string;
  timeline: string;
  successMetrics: string[];
  resolutionSummary: string;
}

interface AIAdvisorProps {
  alert: AlertData;
  onResolve?: (resolution: string) => void;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ alert, onResolve }) => {
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResolution, setShowResolution] = useState(false);

  const generateAdvice = (alertData: AlertData): AIAdvice => {
    // AI-generated advice based on alert type and severity
    const adviceMap: Record<string, AIAdvice> = {
      'Collections Rate': {
        ownership: `As the asset manager, you own this collections performance. The ${alertData.assignedPM} must take immediate action, but ultimate accountability rests with you to ensure resident retention and payment compliance.`,
        immediateActions: [
          'Review delinquency reports and identify top 5 highest-risk accounts',
          'Implement immediate payment plan outreach for residents 30+ days past due',
          'Audit current collection procedures and staff training effectiveness',
          'Schedule daily check-ins with PM until collections normalize'
        ],
        rootCause: 'Collections issues typically stem from insufficient follow-up procedures, lack of payment plan options, or inadequate resident communication during financial hardship.',
        timeline: '7-14 days to see initial improvement, 30 days for full recovery to target levels',
        successMetrics: ['Collections rate above 95%', 'Reduced delinquency aging', 'Improved resident payment patterns'],
        resolutionSummary: 'Implemented enhanced collection procedures with daily PM oversight, resulting in improved resident payment compliance and reduced delinquency.'
      },
      'Physical Occupancy': {
        ownership: `You are directly responsible for this occupancy performance. While leasing execution falls to ${alertData.assignedPM}, your strategic oversight and resource allocation determine success.`,
        immediateActions: [
          'Analyze current marketing channels and adjust ad spend allocation',
          'Review pricing strategy against comparable properties in market',
          'Evaluate showing-to-lease conversion rates and identify bottlenecks',
          'Implement immediate incentive programs to accelerate leasing velocity'
        ],
        rootCause: 'Occupancy issues often result from pricing misalignment, insufficient marketing reach, poor unit presentation, or inadequate leasing team training.',
        timeline: '14-21 days to see leasing momentum, 45-60 days to achieve target occupancy',
        successMetrics: ['Occupancy above 90%', 'Increased showing volume', 'Improved lease conversion rates'],
        resolutionSummary: 'Executed comprehensive leasing strategy including pricing optimization and enhanced marketing, achieving target occupancy levels.'
      },
      'Days to Lease': {
        ownership: `This leasing velocity directly impacts your asset performance. You must ensure ${alertData.assignedPM} has the tools and processes needed to compete effectively in your market.`,
        immediateActions: [
          'Audit current leasing process from inquiry to lease signing',
          'Review unit turnover procedures and identify preparation delays',
          'Analyze competitor pricing and amenity offerings',
          'Implement expedited application processing and approval workflows'
        ],
        rootCause: 'Extended lease-up periods typically indicate process inefficiencies, competitive disadvantages, or insufficient prospect follow-up systems.',
        timeline: '10-14 days to optimize processes, 21-30 days to achieve target lease velocity',
        successMetrics: ['Days to lease under 20', 'Reduced vacancy loss', 'Improved prospect-to-lease conversion'],
        resolutionSummary: 'Streamlined leasing operations and competitive positioning, resulting in accelerated lease-up performance and reduced vacancy costs.'
      },
      'Work Order Response': {
        ownership: `Maintenance response times reflect directly on your operational standards. You must ensure ${alertData.assignedPM} maintains service levels that protect resident satisfaction and asset value.`,
        immediateActions: [
          'Review current work order prioritization and assignment processes',
          'Evaluate maintenance staffing levels and contractor relationships',
          'Implement emergency vs. routine request categorization system',
          'Establish daily maintenance completion reporting and accountability'
        ],
        rootCause: 'Delayed maintenance response often stems from understaffing, poor vendor management, or inadequate work order tracking systems.',
        timeline: '3-5 days for immediate process improvements, 14 days for sustained performance',
        successMetrics: ['Response times under 48 hours', 'Improved resident satisfaction scores', 'Reduced maintenance backlogs'],
        resolutionSummary: 'Optimized maintenance operations with enhanced staffing and processes, achieving target response times and improved resident satisfaction.'
      }
    };

    return adviceMap[alertData.metric] || {
      ownership: `You are accountable for this performance metric. Work closely with ${alertData.assignedPM} to implement immediate corrective measures.`,
      immediateActions: ['Analyze root cause factors', 'Develop action plan with clear timelines', 'Implement daily monitoring protocols'],
      rootCause: 'Performance issues require immediate investigation to identify underlying operational or market factors.',
      timeline: '7-14 days for initial assessment and corrective actions',
      successMetrics: ['Metric performance above threshold', 'Sustained improvement trend'],
      resolutionSummary: 'Implemented targeted corrective measures to address performance gap and restore operational standards.'
    };
  };

  const handleGetAdvice = () => {
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      const aiAdvice = generateAdvice(alert);
      setAdvice(aiAdvice);
      setIsLoading(false);
    }, 1500);
  };

  const handleResolveWithAI = () => {
    if (advice && onResolve) {
      onResolve(advice.resolutionSummary);
      setShowResolution(true);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mt-4">
      <div className="flex items-center mb-4">
        <Bot className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-blue-900">AI Performance Advisor</h3>
      </div>

      {!advice && !isLoading && (
        <div className="text-center">
          <p className="text-blue-700 mb-4">Get AI-powered advice and resolution guidance for this alert</p>
          <button
            onClick={handleGetAdvice}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
          >
            <Bot className="h-4 w-4 mr-2" />
            Get AI Advice
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700">AI analyzing alert and generating recommendations...</p>
        </div>
      )}

      {advice && (
        <div className="space-y-6">
          {/* Ownership & Accountability */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-3">
              <Target className="h-5 w-5 text-red-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Your Ownership & Accountability</h4>
            </div>
            <p className="text-gray-700 font-medium">{advice.ownership}</p>
          </div>

          {/* Immediate Actions */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-3">
              <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Immediate Action Plan</h4>
            </div>
            <ul className="space-y-2">
              {advice.immediateActions.map((action, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-3 mt-0.5 min-w-[20px] text-center">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Root Cause & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Root Cause Analysis</h4>
              <p className="text-gray-700 text-sm">{advice.rootCause}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Expected Timeline</h4>
              </div>
              <p className="text-gray-700 text-sm">{advice.timeline}</p>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3">Success Metrics to Track</h4>
            <div className="flex flex-wrap gap-2">
              {advice.successMetrics.map((metric, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {metric}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-blue-200">
            <button
              onClick={handleResolveWithAI}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
              disabled={showResolution}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {showResolution ? 'Resolution Applied' : 'Apply AI Resolution'}
            </button>
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Create Action Plan
            </button>
          </div>

          {showResolution && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Resolution Summary Applied</h4>
              </div>
              <p className="text-green-800">{advice.resolutionSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
