
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
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const { register } = useAuth();

  // Move formatCurrency function to the top to avoid hoisting issues
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const stored = localStorage.getItem('pendingRegistration');
    if (stored) {
      setRegistrationData(JSON.parse(stored));
    }
  }, []);

  const handlePlanSelection = (plan: 'monthly' | 'annual') => {
    setSelectedPlan(plan);
  };

  const handleProceedToPayment = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentComplete = async () => {
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
  const propertyCount = userData?.propertyCount || 1;
  const monthlyTotal = propertyCount * 295;
  const annualTotal = monthlyTotal * 12;
  const annualSavings = monthlyTotal * 2; // 2 months free
  const discountedAnnualTotal = annualTotal - annualSavings;

  if (showPaymentForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
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
            <h2 className="text-3xl font-bold text-gray-900 mt-8">Payment Information</h2>
            <p className="text-gray-600 mt-2">
              {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan - {formatCurrency(selectedPlan === 'monthly' ? monthlyTotal : discountedAnnualTotal)}
              {selectedPlan === 'monthly' ? '/month' : '/year'}
            </p>
          </div>

          {/* Payment Form */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mock Payment Form - In real implementation, use Stripe Elements */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isProcessing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(selectedPlan === 'monthly' ? monthlyTotal : discountedAnnualTotal)}
                    {selectedPlan === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Back to Plans
                  </Button>
                  <Button 
                    onClick={handlePaymentComplete}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Complete Payment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-gray-500 mt-4 text-sm text-center">
            Secure payment powered by Stripe • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-gray-900 mt-8">Choose your plan</h2>
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
            {userData?.properties?.map((property: any, index: number) => (
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
          <Card 
            className={`border-2 cursor-pointer transition-all duration-200 ${
              selectedPlan === 'monthly' 
                ? 'border-blue-600 shadow-lg ring-2 ring-blue-100' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handlePlanSelection('monthly')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Monthly</CardTitle>
                {selectedPlan === 'monthly' && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">{formatCurrency(monthlyTotal)}</span>
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
          <Card 
            className={`border-2 cursor-pointer transition-all duration-200 relative ${
              selectedPlan === 'annual' 
                ? 'border-blue-600 shadow-lg ring-2 ring-blue-100' 
                : 'border-blue-600 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => handlePlanSelection('annual')}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Save {formatCurrency(annualSavings)}
              </span>
            </div>
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Annual</CardTitle>
                {selectedPlan === 'annual' && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">{formatCurrency(discountedAnnualTotal)}</span>
                <span className="text-gray-500 ml-1">/year</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="line-through text-gray-400">{formatCurrency(annualTotal)}</span> 
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
            onClick={handleProceedToPayment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Continue to Payment
          </Button>
          <p className="text-gray-500 mt-4 text-sm">
            Selected: {selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan • 
            {formatCurrency(selectedPlan === 'monthly' ? monthlyTotal : discountedAnnualTotal)}
            {selectedPlan === 'monthly' ? '/month' : '/year'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSetup;
