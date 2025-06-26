
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CreditCard, Building2, FileText, Plus, X, ArrowLeft, Zap, Shield, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DataSetup from './DataSetup';
import PricingCalculator from '../pricing/PricingCalculator';

interface EnhancedPaymentSetupProps {
  onComplete: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'invoice';
  propertyIds: string[];
  cardLast4?: string;
  invoiceEmail?: string;
  companyName?: string;
}

const EnhancedPaymentSetup: React.FC<EnhancedPaymentSetupProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    tier: 'Professional',
    billingPeriod: 'monthly' as 'monthly' | 'annual',
    units: 1,
    total: 4
  });
  const [showDataSetup, setShowDataSetup] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activeTab, setActiveTab] = useState('pricing');
  const { register } = useAuth();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const stored = localStorage.getItem('pendingRegistration');
    if (stored) {
      const data = JSON.parse(stored);
      setRegistrationData(data);
      
      // Calculate units from properties
      const propertyCount = data.userData?.properties?.length || 1;
      const totalUnits = data.userData?.properties?.reduce((sum: number, prop: any) => sum + (prop.units || 1), 0) || 1;
      
      setSelectedPlan(prev => ({
        ...prev,
        units: totalUnits
      }));
      
      // Initialize with one payment method covering all properties
      if (data.userData?.properties?.length > 0) {
        setPaymentMethods([{
          id: '1',
          type: 'card',
          propertyIds: data.userData.properties.map((_: any, index: number) => index.toString())
        }]);
      }
    }
  }, []);

  const handlePlanSelect = (tier: string, billingPeriod: 'monthly' | 'annual', units: number, total: number) => {
    setSelectedPlan({ tier, billingPeriod, units, total });
    setActiveTab('payment');
  };

  const addPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      propertyIds: []
    };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === id ? { ...method, ...updates } : method
    ));
  };

  const assignPropertyToMethod = (propertyIndex: string, methodId: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      propertyIds: method.id === methodId 
        ? [...method.propertyIds.filter(id => id !== propertyIndex), propertyIndex]
        : method.propertyIds.filter(id => id !== propertyIndex)
    })));
  };

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowDataSetup(true);
  };

  const handleDataSetupComplete = () => {
    onComplete();
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  if (showDataSetup) {
    return <DataSetup onComplete={handleDataSetupComplete} />;
  }

  const { userData } = registrationData;
  const properties = userData?.properties || [];

  // Calculate credit card discount (10% off)
  const creditCardDiscount = 0.10;
  const hasAllCardPayments = paymentMethods.every(method => method.type === 'card');
  const discountAmount = hasAllCardPayments ? Math.round(selectedPlan.total * creditCardDiscount) : 0;
  const finalTotal = selectedPlan.total - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="mr-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

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
          <h2 className="text-3xl font-bold text-gray-900 mt-8">Choose Your Plan</h2>
          <p className="text-gray-600 mt-2">
            Start your 14-day free trial • No charges until day 15
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pricing">Plan Selection</TabsTrigger>
            <TabsTrigger value="payment">Payment Setup</TabsTrigger>
            <TabsTrigger value="review">Review & Start Trial</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing">
            {/* Free Trial Banner */}
            <Card className="border-2 border-green-200 bg-green-50 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-600 mr-4" />
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-green-800 mb-2">14-Day Free Trial</h3>
                    <p className="text-green-700">
                      We won't charge your card during the trial period. On day 15, you'll be charged for your selected plan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PricingCalculator 
              onPlanSelect={handlePlanSelect}
              defaultUnits={selectedPlan.units}
            />
          </TabsContent>

          <TabsContent value="payment">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Payment Information</h3>
                <Button onClick={addPaymentMethod} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              {/* Trial Information */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Payment Schedule</h4>
                      <p className="text-sm text-blue-700">
                        Your card will be securely stored but not charged during the 14-day trial. 
                        First payment of {formatCurrency(finalTotal)} will occur on day 15.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Card Promotion Banner */}
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Zap className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-green-800">Pay with Credit Card & Save 10%!</h4>
                      <p className="text-sm text-green-700">
                        Get instant account activation, secure processing, and save money with our credit card discount.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {paymentMethods.map((method, index) => (
                <Card key={method.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        {method.type === 'card' ? (
                          <CreditCard className="h-5 w-5 mr-2" />
                        ) : (
                          <FileText className="h-5 w-5 mr-2" />
                        )}
                        Payment Method {index + 1}
                        {method.type === 'card' && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            10% DISCOUNT
                          </span>
                        )}
                      </CardTitle>
                      {paymentMethods.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removePaymentMethod(method.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                      <Button 
                        variant={method.type === 'card' ? 'default' : 'outline'}
                        onClick={() => updatePaymentMethod(method.id, { type: 'card' })}
                        className={method.type === 'card' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card (10% DISCOUNT)
                      </Button>
                      <Button 
                        variant={method.type === 'invoice' ? 'default' : 'outline'}
                        onClick={() => updatePaymentMethod(method.id, { type: 'invoice' })}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Invoice/ACH
                      </Button>
                    </div>

                    {method.type === 'card' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="p-3 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="p-3 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            className="p-3 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Cardholder Name"
                            className="p-3 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                          <p className="font-medium">✓ Secure storage - no charges during trial</p>
                          <p className="font-medium">✓ 10% discount automatically applied</p>
                          <p className="font-medium">✓ First charge on day 15: {formatCurrency(finalTotal)}</p>
                        </div>
                      </div>
                    )}

                    {method.type === 'invoice' && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Company Name"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          value={method.companyName || ''}
                          onChange={(e) => updatePaymentMethod(method.id, { companyName: e.target.value })}
                        />
                        <input
                          type="email"
                          placeholder="Billing Email"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          value={method.invoiceEmail || ''}
                          onChange={(e) => updatePaymentMethod(method.id, { invoiceEmail: e.target.value })}
                        />
                        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                          <p className="font-medium">⚠️ Invoice Payment Processing:</p>
                          <p>• Payment terms are Net 30 days</p>
                          <p>• Account activation delayed until payment received</p>
                          <p>• Processing time: 3-5 business days minimum</p>
                          <p>• No instant access to platform features</p>
                        </div>
                      </div>
                    )}

                    {properties.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assign Properties to this Payment Method:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {properties.map((property: any, propIndex: number) => (
                            <label key={propIndex} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={method.propertyIds.includes(propIndex.toString())}
                                onChange={() => assignPropertyToMethod(propIndex.toString(), method.id)}
                                className="rounded"
                              />
                              <span className="text-sm">{property.name} ({property.units} units)</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setActiveTab('pricing')}>
                  Back to Pricing
                </Button>
                <Button onClick={() => setActiveTab('review')} className="bg-blue-600 hover:bg-blue-700">
                  Review & Start Trial
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Review Your Setup</h3>
              
              {/* Plan Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Selected Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{selectedPlan.tier} Plan</p>
                      <p className="text-gray-600">
                        {selectedPlan.units} {selectedPlan.units === 1 ? 'unit' : 'units'} • {selectedPlan.billingPeriod} billing
                      </p>
                      {hasAllCardPayments && discountAmount > 0 && (
                        <p className="text-green-600 font-medium">Credit Card Discount Applied!</p>
                      )}
                    </div>
                    <div className="text-right">
                      {hasAllCardPayments && discountAmount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatCurrency(selectedPlan.total)}
                        </p>
                      )}
                      <p className="text-2xl font-bold">
                        {formatCurrency(finalTotal)}
                      </p>
                      <p className="text-gray-600">
                        /{selectedPlan.billingPeriod}
                      </p>
                      {hasAllCardPayments && discountAmount > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          You save {formatCurrency(discountAmount)}!
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trial Information */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-800 mb-2">14-Day Free Trial</h3>
                    <p className="text-blue-700 mb-4">
                      Your trial starts immediately with full access to all features. 
                      We'll charge your card {formatCurrency(finalTotal)} on day 15.
                    </p>
                    <div className="bg-white rounded-lg p-4 text-left">
                      <h4 className="font-semibold text-gray-900 mb-2">What happens next:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>✓ Immediate access to your OPSIGHT dashboard</li>
                        <li>✓ Full platform features unlocked</li>
                        <li>✓ 14 days to explore without any charges</li>
                        <li>✓ First payment on {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setActiveTab('payment')}>
                  Back to Payment
                </Button>
                <Button 
                  onClick={handlePaymentComplete}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Starting Trial...</span>
                    </div>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Start 14-Day Free Trial
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedPaymentSetup;
