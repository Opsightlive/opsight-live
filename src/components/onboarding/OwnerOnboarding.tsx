
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, DollarSign, Target, ArrowRight, CheckCircle } from 'lucide-react';

interface OwnerOnboardingProps {
  onComplete: () => void;
}

const OwnerOnboarding: React.FC<OwnerOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [ownerProfile, setOwnerProfile] = useState({
    portfolioSize: '',
    investmentFocus: 'multifamily', // Default to multifamily
    primaryConcerns: [] as string[],
    reportingFrequency: ''
  });

  const ownerConcerns = [
    'Cash flow optimization',
    'Occupancy management',
    'Property performance benchmarking',
    'PM oversight and accountability',
    'Market trend analysis',
    'Risk mitigation',
    'Portfolio diversification',
    'Exit strategy planning'
  ];

  const handleConcernToggle = (concern: string) => {
    setOwnerProfile(prev => ({
      ...prev,
      primaryConcerns: prev.primaryConcerns.includes(concern)
        ? prev.primaryConcerns.filter(c => c !== concern)
        : [...prev.primaryConcerns, concern]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tell us about your multifamily portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Approximate portfolio value</Label>
                <select 
                  className="w-full mt-2 p-3 border rounded-lg"
                  value={ownerProfile.portfolioSize}
                  onChange={(e) => setOwnerProfile(prev => ({ ...prev, portfolioSize: e.target.value }))}
                >
                  <option value="">Select range</option>
                  <option value="10-50M">$10M - $50M</option>
                  <option value="50-100M">$50M - $100M</option>
                  <option value="100-250M">$100M - $250M</option>
                  <option value="250M+">$250M+</option>
                </select>
              </div>

              <div>
                <Label className="mb-3 block">Investment focus</Label>
                <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Multifamily Properties</span>
                    <Badge className="ml-auto">Selected</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Focus on apartment complexes, condominiums, and residential rental properties
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)}
                disabled={!ownerProfile.portfolioSize}
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
              <CardTitle>What are your primary concerns?</CardTitle>
              <p className="text-gray-600">Select all that apply - this helps us prioritize your alerts</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {ownerConcerns.map((concern) => (
                  <div
                    key={concern}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      ownerProfile.primaryConcerns.includes(concern)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleConcernToggle(concern)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{concern}</span>
                      {ownerProfile.primaryConcerns.includes(concern) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={ownerProfile.primaryConcerns.length === 0}
                  className="flex-1"
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Reporting preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>How often do you want performance reports?</Label>
                <select 
                  className="w-full mt-2 p-3 border rounded-lg"
                  value={ownerProfile.reportingFrequency}
                  onChange={(e) => setOwnerProfile(prev => ({ ...prev, reportingFrequency: e.target.value }))}
                >
                  <option value="">Select frequency</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="custom">Custom schedule</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Your OPSIGHT Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Portfolio Focus:</span>
                    <Badge>Multifamily</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Concerns:</span>
                    <span>{ownerProfile.primaryConcerns.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reporting:</span>
                    <span className="capitalize">{ownerProfile.reportingFrequency}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={onComplete}
                  disabled={!ownerProfile.reportingFrequency}
                  className="flex-1"
                >
                  Complete Setup
                </Button>
              </div>
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
        <h1 className="text-3xl font-bold mb-2">Add New Multifamily Property</h1>
        <p className="text-gray-600">
          Let's customize your experience for optimal multifamily portfolio oversight
        </p>
        <div className="flex items-center space-x-2 mt-4">
          <Badge variant="outline">Step {step} of 3</Badge>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default OwnerOnboarding;
