import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, ArrowRight, Sparkles, Building, Users, BarChart3, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface WelcomeFlowProps {
  onComplete: () => void;
}

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ onComplete }) => {
  const { user, profile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: 'Welcome to OPSIGHT!',
      description: 'Let\'s get you set up for success',
      icon: Sparkles,
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'User'}!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            You\'re now part of a community of professionals who are transforming their operational insights. 
            Let\'s get you started with a few quick steps.
          </p>
        </div>
      )
    },
    {
      title: 'Complete Your Profile',
      description: 'Help us personalize your experience',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Tell us a bit about yourself and your company to get the most out of OPSIGHT.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={profile?.full_name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                defaultValue={profile?.company_name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select your role</option>
                <option value="Property Manager">Property Manager</option>
                <option value="Property Owner">Property Owner</option>
                <option value="Company Admin">Company Admin</option>
                <option value="Analyst">Analyst</option>
                <option value="User">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue={profile?.phone || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Connect Your Data',
      description: 'Integrate your existing systems',
      icon: Building,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Connect your property management software and data sources to start getting insights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Property Management</h3>
                    <p className="text-sm text-gray-600">Connect your PM software</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="text-sm text-gray-600">Import your data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Security</h3>
                    <p className="text-sm text-gray-600">Set up 2FA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Team</h3>
                    <p className="text-sm text-gray-600">Invite team members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: 'Schedule Your Onboarding',
      description: 'Get personalized training',
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You\'re All Set!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your OPSIGHT account is ready to go. Schedule a personalized onboarding call with our experts 
              to learn how to get the most out of the platform.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.open('https://calendly.com/opsightlive', '_blank')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Schedule Onboarding Call
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onComplete}
              className="w-full"
            >
              Skip for Now
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Our onboarding calls typically last 30 minutes and cover everything 
              you need to know to get started with OPSIGHT.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      setIsLoading(true);
      try {
        // Mark onboarding as completed
        await updateProfile({ onboarding_completed: true });
        toast.success('Welcome to OPSIGHT!');
        onComplete();
      } catch (error) {
        console.error('Error completing onboarding:', error);
        toast.error('Failed to complete onboarding');
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStepData.title}
            </CardTitle>
            <CardDescription className="text-lg">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentStepData.content}
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext} 
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? 'Completing...' : 'Complete Setup'}
                  </Button>
                )}
              </div>
            </div>
            
            {currentStep < steps.length - 1 && (
              <div className="text-center">
                <Button variant="ghost" onClick={handleSkip} className="text-gray-500">
                  Skip for now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeFlow;
