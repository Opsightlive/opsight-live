
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentSetupProps {
  onComplete: () => void;
}

const PaymentSetup: React.FC<PaymentSetupProps> = ({ onComplete }) => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [isProcessing, setIsProcessing] = useState(false);
  const { register } = useAuth();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$49',
      period: '/month',
      features: [
        'Up to 5 properties',
        'Basic reporting',
        'Email support',
        'Standard integrations'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$99',
      period: '/month',
      popular: true,
      features: [
        'Up to 25 properties',
        'Advanced analytics',
        'Priority support',
        'All integrations',
        'Custom reports',
        'API access'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      features: [
        'Unlimited properties',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'Advanced security',
        'Training included'
      ]
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete the registration process
    setIsProcessing(false);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
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
          <h2 className="text-3xl font-bold text-gray-900 mt-8">Choose your plan</h2>
          <p className="text-gray-600 mt-2">Select the plan that best fits your needs</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id 
                  ? 'border-blue-600 border-2 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'transform scale-105' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6">
                  <div className={`w-4 h-4 rounded-full border-2 mx-auto ${
                    selectedPlan === plan.id 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPlan === plan.id && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {isProcessing ? 'Processing...' : 'Continue to Payment'}
          </Button>
          <p className="text-gray-500 mt-4 text-sm">
            Secure payment powered by Stripe • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSetup;
