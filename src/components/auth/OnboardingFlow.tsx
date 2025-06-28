import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft, Building2, Users, Target, Settings } from 'lucide-react';
import { toast } from 'sonner';

const OnboardingFlow: React.FC = () => {
  const { user, userRoles } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    fullName: '',
    companyName: '',
    role: userRoles[0] || 'analyst',
    phoneNumber: '',
    companySize: '',
    primaryGoals: [] as string[],
    dataSource: '',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true
    }
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to OPSIGHT',
      description: 'Let\'s get you set up for success',
      icon: <Building2 className="h-8 w-8" />
    },
    {
      id: 'profile',
      title: 'Your Profile',
      description: 'Tell us about yourself',
      icon: <Users className="h-8 w-8" />
    },
    {
      id: 'goals',
      title: 'Your Goals',
      description: 'What do you want to achieve?',
      icon: <Target className="h-8 w-8" />
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      icon: <Settings className="h-8 w-8" />
    }
  ];

  const companyGoals = [
    'Improve operational efficiency',
    'Enhance property performance monitoring',
    'Streamline LP reporting',
    'Better risk management',
    'Automate routine tasks',
    'Improve tenant satisfaction',
    'Optimize maintenance costs',
    'Enhance portfolio insights'
  ];

  useEffect(() => {
    if (user) {
      // Load any existing onboarding data
      setOnboardingData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || ''
      }));
    }
  }, [user]);

  const handleGoalToggle = (goal: string) => {
    setOnboardingData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      // Update user profile in the existing user_profiles table
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          full_name: onboardingData.fullName,
          company_name: onboardingData.companyName,
          phone: onboardingData.phoneNumber,
          role: onboardingData.role
        });

      if (error) throw error;

      // Save to localStorage to prevent re-showing
      localStorage.setItem('onboardingCompleted', 'true');
      
      toast.success('Welcome to OPSIGHT! Your account is now set up.');
      
      // Refresh page to show main app
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete setup. Please try again.');
    }
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT" 
                className="h-20 w-20 mx-auto mb-4"
              />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to OPSIGHT</h2>
              <p className="text-lg text-gray-600">
                Let's get you set up so you can start gaining operational insights right away.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">What you'll get:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time property insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automated LP reporting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Smart alerts & notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Advanced analytics</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={onboardingData.fullName}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={onboardingData.companyName}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter your company name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                value={onboardingData.phoneNumber}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Enter your phone number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Select 
                value={onboardingData.companySize}
                onValueChange={(value) => setOnboardingData(prev => ({ ...prev, companySize: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">What are your primary goals with OPSIGHT?</h3>
              <p className="text-gray-600 mb-4">Select all that apply:</p>
              
              <div className="grid grid-cols-1 gap-3">
                {companyGoals.map((goal) => (
                  <div
                    key={goal}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      onboardingData.primaryGoals.includes(goal)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleGoalToggle(goal)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{goal}</span>
                      {onboardingData.primaryGoals.includes(goal) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="dataSource">Primary Data Source</Label>
              <Select 
                value={onboardingData.dataSource}
                onValueChange={(value) => setOnboardingData(prev => ({ ...prev, dataSource: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your main data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yardi">Yardi</SelectItem>
                  <SelectItem value="realpage">RealPage</SelectItem>
                  <SelectItem value="appfolio">AppFolio</SelectItem>
                  <SelectItem value="buildium">Buildium</SelectItem>
                  <SelectItem value="rent-manager">Rent Manager</SelectItem>
                  <SelectItem value="other">Other / Manual Entry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Notification Preferences</h3>
              <p className="text-gray-600 mb-4">Choose how you'd like to receive updates:</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive alerts and reports via email</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={onboardingData.notificationPreferences.email}
                    onChange={(e) => setOnboardingData(prev => ({
                      ...prev,
                      notificationPreferences: {
                        ...prev.notificationPreferences,
                        email: e.target.checked
                      }
                    }))}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-gray-600">Get urgent alerts via text message</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={onboardingData.notificationPreferences.sms}
                    onChange={(e) => setOnboardingData(prev => ({
                      ...prev,
                      notificationPreferences: {
                        ...prev.notificationPreferences,
                        sms: e.target.checked
                      }
                    }))}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-600">Get real-time updates in your browser</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={onboardingData.notificationPreferences.push}
                    onChange={(e) => setOnboardingData(prev => ({
                      ...prev,
                      notificationPreferences: {
                        ...prev.notificationPreferences,
                        push: e.target.checked
                      }
                    }))}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return true;
      case 'profile':
        return onboardingData.fullName.trim() !== '' && onboardingData.companyName.trim() !== '';
      case 'goals':
        return onboardingData.primaryGoals.length > 0 && onboardingData.dataSource !== '';
      case 'preferences':
        return true;
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {steps[currentStep].icon}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h1>
                <p className="text-gray-600">{steps[currentStep].description}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step content */}
        <Card>
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
