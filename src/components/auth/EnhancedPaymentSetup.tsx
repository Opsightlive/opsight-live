
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CreditCard, Building2, FileText, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DataSetup from './DataSetup';

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
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [showDataSetup, setShowDataSetup] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { register } = useAuth();

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
      const data = JSON.parse(stored);
      setRegistrationData(data);
      
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
  const propertyCount = properties.length;
  const monthlyTotal = propertyCount * 295;
  const annualTotal = monthlyTotal * 12;
  const annualSavings = monthlyTotal * 2;
  const discountedAnnualTotal = annualTotal - annualSavings;

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
          <h2 className="text-3xl font-bold text-gray-900 mt-8">Payment Setup</h2>
          <p className="text-gray-600 mt-2">
            Configure billing for your {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview & Plan</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="review">Review & Complete</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Plan Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card 
                className={`border-2 cursor-pointer transition-all duration-200 ${
                  selectedPlan === 'monthly' 
                    ? 'border-blue-600 shadow-lg ring-2 ring-blue-100' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedPlan('monthly')}
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
                      <span className="text-gray-700">Predictive alerts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card 
                className={`border-2 cursor-pointer transition-all duration-200 relative ${
                  selectedPlan === 'annual' 
                    ? 'border-blue-600 shadow-lg ring-2 ring-blue-100' 
                    : 'border-blue-600 shadow-lg hover:shadow-xl'
                }`}
                onClick={() => setSelectedPlan('annual')}
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
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Property Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                  Your Portfolio ({propertyCount} {propertyCount === 1 ? 'Property' : 'Properties'})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.map((property: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900">{property.name}</h4>
                      <p className="text-sm text-gray-600">{property.units} units</p>
                      <p className="text-sm text-gray-500">{property.address}</p>
                      <p className="text-sm text-blue-600 font-medium mt-2">
                        ${295}/{selectedPlan === 'monthly' ? 'month' : 'year'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                onClick={() => setActiveTab('payment')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium"
              >
                Continue to Payment Setup
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Payment Methods</h3>
                <Button onClick={addPaymentMethod} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

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
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
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
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          <p className="font-medium">Invoice Payment:</p>
                          <p>We'll send an invoice to the provided email address. Payment terms are Net 30.</p>
                        </div>
                      </div>
                    )}

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
                            <span className="text-sm">{property.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setActiveTab('overview')}>
                  Back to Overview
                </Button>
                <Button onClick={() => setActiveTab('review')} className="bg-blue-600 hover:bg-blue-700">
                  Review & Complete
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
                      <p className="font-semibold">{selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan</p>
                      <p className="text-gray-600">{propertyCount} {propertyCount === 1 ? 'property' : 'properties'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {formatCurrency(selectedPlan === 'monthly' ? monthlyTotal : discountedAnnualTotal)}
                      </p>
                      <p className="text-gray-600">
                        {selectedPlan === 'monthly' ? '/month' : '/year'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods Summary */}
              {paymentMethods.map((method, index) => (
                <Card key={method.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {method.type === 'card' ? (
                        <CreditCard className="h-5 w-5 mr-2" />
                      ) : (
                        <FileText className="h-5 w-5 mr-2" />
                      )}
                      Payment Method {index + 1} - {method.type === 'card' ? 'Credit Card' : 'Invoice'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">Properties covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {method.propertyIds.map(propId => {
                        const property = properties[parseInt(propId)];
                        return property ? (
                          <span key={propId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {property.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}

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
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Setup
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
