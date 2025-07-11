
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  selector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface DashboardTutorialProps {
  onClose: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Dashboard!',
    description: 'Let\'s take a quick tour of your OPSIGHT dashboard and show you where to find key features.',
    selector: '',
    position: 'top'
  },
  {
    id: 'portfolio-overview',
    title: 'Portfolio Overview',
    description: 'This section shows your total portfolio value, number of properties, and key performance metrics at a glance.',
    selector: '[data-tutorial="portfolio-overview"]',
    position: 'bottom'
  },
  {
    id: 'kpi-cards',
    title: 'Key Performance Indicators',
    description: 'Monitor your most important metrics: occupancy rates, NOI, cash flow, and maintenance costs in real-time.',
    selector: '[data-tutorial="kpi-cards"]',
    position: 'bottom'
  },
  {
    id: 'red-flags',
    title: 'Red Flag Alerts',
    description: 'Critical issues that need your immediate attention are highlighted here. Click to see details and take action.',
    selector: '[data-tutorial="red-flags"]',
    position: 'left'
  },
  {
    id: 'recent-activity',
    title: 'Recent Activity',
    description: 'Stay updated with the latest changes across your portfolio - new leases, maintenance requests, and financial updates.',
    selector: '[data-tutorial="recent-activity"]',
    position: 'left'
  },
  {
    id: 'ai-insights',
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations and predictions based on your portfolio data to make informed decisions.',
    selector: '[data-tutorial="ai-insights"]',
    position: 'top'
  },
  {
    id: 'navigation',
    title: 'Navigation Menu',
    description: 'Use the sidebar to access detailed reports, property management tools, and system settings.',
    selector: '[data-tutorial="sidebar"]',
    position: 'right'
  }
];

const DashboardTutorial: React.FC<DashboardTutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(null);
  const [cardPosition, setCardPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });

  useEffect(() => {
    const step = tutorialSteps[currentStep];
    if (step.selector) {
      const element = document.querySelector(step.selector) as HTMLElement;
      setHighlightElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Calculate card position based on element position
        const rect = element.getBoundingClientRect();
        const position = getCardPosition(rect, step.position);
        setCardPosition(position);
      }
    } else {
      setHighlightElement(null);
      setCardPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onClose();
  };

  const skipTutorial = () => {
    onClose();
  };

  const currentStepData = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Highlight for current element */}
      {highlightElement && (
        <div
          className="fixed z-50 pointer-events-none border-4 border-blue-500 rounded-lg animate-pulse"
          style={{
            top: `${highlightElement.offsetTop - 4}px`,
            left: `${highlightElement.offsetLeft - 4}px`,
            width: `${highlightElement.offsetWidth + 8}px`,
            height: `${highlightElement.offsetHeight + 8}px`,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          }}
        />
      )}

      {/* Tutorial Card */}
      <Card className="fixed z-50 w-96 shadow-2xl" style={cardPosition}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {currentStep + 1}
              </div>
              <span className="text-sm text-gray-500">
                {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTutorial}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="text-xl font-bold mb-3">{currentStepData.title}</h3>
          <p className="text-gray-600 mb-6">{currentStepData.description}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={isFirstStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={skipTutorial}>
                Skip Tour
              </Button>
              <Button onClick={nextStep}>
                {isLastStep ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

function getCardPosition(rect: DOMRect, position: string) {
  const cardWidth = 384; // w-96
  const cardHeight = 300; // approximate height
  const offset = 20;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let top: string | number = '50%';
  let left: string | number = '50%';
  let transform = 'translate(-50%, -50%)';

  switch (position) {
    case 'top':
      top = Math.max(20, rect.top - cardHeight - offset);
      left = Math.max(20, Math.min(windowWidth - cardWidth - 20, rect.left + rect.width / 2 - cardWidth / 2));
      transform = 'none';
      break;
    case 'bottom':
      top = Math.min(windowHeight - cardHeight - 20, rect.bottom + offset);
      left = Math.max(20, Math.min(windowWidth - cardWidth - 20, rect.left + rect.width / 2 - cardWidth / 2));
      transform = 'none';
      break;
    case 'left':
      top = Math.max(20, Math.min(windowHeight - cardHeight - 20, rect.top + rect.height / 2 - cardHeight / 2));
      left = Math.max(20, rect.left - cardWidth - offset);
      transform = 'none';
      break;
    case 'right':
      top = Math.max(20, Math.min(windowHeight - cardHeight - 20, rect.top + rect.height / 2 - cardHeight / 2));
      left = Math.min(windowWidth - cardWidth - 20, rect.right + offset);
      transform = 'none';
      break;
  }

  return { 
    top: typeof top === 'number' ? `${top}px` : top, 
    left: typeof left === 'number' ? `${left}px` : left, 
    transform 
  };
}

export default DashboardTutorial;
