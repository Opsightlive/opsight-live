
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentSetupProps {
  onComplete: () => void;
}

const PaymentSetup: React.FC<PaymentSetupProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const { register } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('pendingRegistration');
    if (stored) {
      setRegistrationData(JSON.parse(stored));
    }
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete the registration process
    setIsProcessing(false);
    onComplete();
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  const { userData } = registrationData;
  const propertyCount = userData.propertyCount || 1;
  const monthlyTotal = propertyCount * 295;
  const annualTotal = monthlyTotal * 12;
  const annualSavings = monthlyTotal * 2; // 2 months free

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto">
              <img 
                src="/lovable-uploads/1b9e258c-4380-4c9d-87a5-88ee69196380.png" 
                alt="OPSIGHT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">OPSIGHT</h1>
          <p className="text-blue-600 text-lg tracking-wider">OPERATIONAL INSIGHT</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-8">Complete your setup</h2>
          <p className="text-gray-600 mt-2">
            {propertyCount} {propertyCount === 1 ? 'property' : 'properties'} • $295 per property per month
          </p>
        </div>

        {/* Property Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-bold">Your Portfolio</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.properties?.map((property: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{property.name}</h4>
                <p className="text-sm text-gray-600">{property.units} units</p>
                <p className="text-sm text-gray-500">{property.address}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Monthly Plan */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold">Monthly</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">${monthlyTotal}</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-sm text-gray-600">${295} per property</p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Full platform access</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Real-time KPI tracking</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Predictive red flag alerts</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">AI-powered insights</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">24/7 support</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="border-2 border-blue-600 shadow-lg relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Save ${annualSavings}
              </span>
            </div>
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold">Annual</CardTitle>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">${annualTotal - annualSavings}</span>
                <span className="text-gray-500 ml-1">/year</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="line-through text-gray-400">${annualTotal}</span> 
                <span className="ml-2 text-green-600 font-medium">2 months free!</span>
              </p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Everything in Monthly</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated account manager</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {isProcessing ? 'Processing...' : 'Complete Setup'}
          </Button>
          <p className="text-gray-500 mt-4 text-sm">
            Secure payment powered by Stripe • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSetup;
