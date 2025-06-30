
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Building2, Zap } from 'lucide-react';
import OneSiteCredentialForm from './OneSiteCredentialForm';
import { useToast } from '@/hooks/use-toast';

interface PMIntegrationWizardProps {
  onComplete: () => void;
  preSelectedPM?: string;
}

const PMIntegrationWizard: React.FC<PMIntegrationWizardProps> = ({ onComplete, preSelectedPM }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(preSelectedPM ? 2 : 1);
  const [selectedPM, setSelectedPM] = useState<string>(preSelectedPM || '');

  const pmSoftwareOptions = [
    { 
      name: 'OneSite', 
      id: 'onesite', 
      description: 'Leading property management platform',
      popular: true 
    },
    { 
      name: 'Yardi Voyager', 
      id: 'yardi', 
      description: 'Industry standard property management',
      popular: true 
    },
    { 
      name: 'AppFolio', 
      id: 'appfolio', 
      description: 'Cloud-based property management',
      popular: true 
    },
    { 
      name: 'RESMan', 
      id: 'resman', 
      description: 'Residential property management',
      popular: false 
    },
    { 
      name: 'Entrata', 
      id: 'entrata', 
      description: 'Multifamily property management',
      popular: false 
    },
    { 
      name: 'Rent Manager', 
      id: 'rentmanager', 
      description: 'Comprehensive property management',
      popular: false 
    },
    { 
      name: 'Buildium', 
      id: 'buildium', 
      description: 'Small to mid-size property management',
      popular: false 
    }
  ];

  const handlePMSelection = (pmId: string) => {
    setSelectedPM(pmId);
    setCurrentStep(2);
  };

  const handleCredentialsSubmit = async (credentials: any) => {
    try {
      console.log('Integration setup completed successfully');
      
      toast({
        title: "Integration Complete!",
        description: `Successfully connected to ${selectedPM}. Data sync will begin automatically.`,
      });
      
      setCurrentStep(3);
      setTimeout(() => onComplete(), 2000);
      
    } catch (error) {
      console.error('Error in wizard:', error);
      toast({
        title: "Setup Error",
        description: "Failed to complete integration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Your Property Management Software
              </h2>
              <p className="text-gray-600">
                Choose your PM software to enable automatic data synchronization
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {pmSoftwareOptions.map((pm) => (
                <Card 
                  key={pm.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                  onClick={() => handlePMSelection(pm.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{pm.name}</h3>
                          <p className="text-sm text-gray-600">{pm.description}</p>
                        </div>
                      </div>
                      {pm.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don't see your PM software? <Button variant="link" className="p-0 h-auto">Contact us</Button> for custom integration.
              </p>
            </div>
          </div>
        );

      case 2:
        const selectedPMData = pmSoftwareOptions.find(pm => pm.id === selectedPM);
        
        // Use OneSite specific form for OneSite
        if (selectedPM === 'onesite') {
          return (
            <OneSiteCredentialForm
              onCredentialsSubmit={handleCredentialsSubmit}
              onBack={() => setCurrentStep(1)}
            />
          );
        }
        
        // For other PM systems, show coming soon message
        return (
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedPMData?.name} Integration Coming Soon
              </h2>
              <p className="text-gray-600">
                We're working on this integration. OneSite is currently available for testing.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back to Selection
              </Button>
              <Button onClick={() => handlePMSelection('onesite')}>
                Try OneSite Instead
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Integration Complete!
              </h2>
              <p className="text-gray-600">
                Your PM software is now connected. Data synchronization will begin automatically.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-800">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Automatic sync in progress...</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
            {step < 3 && (
              <div className={`
                w-12 h-1 mx-2
                ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>

      {renderStep()}
    </div>
  );
};

export default PMIntegrationWizard;
