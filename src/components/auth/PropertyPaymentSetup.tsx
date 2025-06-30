
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Building2, FileText, Plus, X, ArrowLeft, Zap, Shield, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DataSetup from './DataSetup';

interface PropertyPaymentSetupProps {
  onComplete: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'ach' | 'invoice';
  propertyIds: string[];
  cardLast4?: string;
  bankName?: string;
  accountLast4?: string;
  invoiceEmail?: string;
  companyName?: string;
}

interface PropertyTier {
  propertyIndex: number;
  tier: 'basic' | 'professional' | 'enterprise';
}

const PropertyPaymentSetup: React.FC<PropertyPaymentSetupProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDataSetup, setShowDataSetup] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [propertyTiers, setPropertyTiers] = useState<PropertyTier[]>([]);
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Tier Selection, 2: Payment Setup
  const { register } = useAuth();
  const navigate = useNavigate();

  const pricingTiers = [
    { 
      id: 'basic', 
      name: 'Basic', 
      price: 3, 
      color: 'blue',
      features: ['Essential monitoring', 'Basic KPI tracking', 'Standard alerts', 'Monthly reporting', 'Email support']
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      price: 4, 
      color: 'blue',
      features: ['Everything in Basic', 'Real-time KPI tracking', 'Predictive alerts', 'AI-powered insights', '24/7 support']
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise', 
      price: 5, 
      color: 'blue',
      features: ['Everything in Professional', 'Advanced analytics', 'Custom integrations', 'Dedicated account manager', 'Priority support']
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleBackClick = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('pendingRegistration');
    if (stored) {
      const data = JSON.parse(stored);
      setRegistrationData(data);
      
      if (data.userData?.properties?.length > 0) {
        // Initialize property tiers with basic tier
        const initialTiers = data.userData.properties.map((_: any, index: number) => ({
          propertyIndex: index,
          tier: 'basic' as const
        }));
        setPropertyTiers(initialTiers);

        // Initialize with one payment method per property
        const initialMethods = data.userData.properties.map((property: any, index: number) => ({
          id: `property-${index}`,
          type: 'card' as const,
          propertyIds: [index.toString()],
          propertyName: property.name
        }));
        setPaymentMethods(initialMethods);
      }
    }
  }, []);

  const updatePropertyTier = (propertyIndex: number, tier: 'basic' | 'professional' | 'enterprise') => {
    setPropertyTiers(prev => 
      prev.map(pt => 
        pt.propertyIndex === propertyIndex ? { ...pt, tier } : pt
      )
    );
  };

  const getPropertyTier = (propertyIndex: number) => {
    return propertyTiers.find(pt => pt.propertyIndex === propertyIndex)?.tier || 'basic';
  };

  const calculateSubtotal = () => {
    if (!registrationData?.userData?.properties) return 0;
    
    return registrationData.userData.properties.reduce((total: number, property: any, index: number) => {
      const tier = getPropertyTier(index);
      const tierData = pricingTiers.find(t => t.id === tier);
      const units = parseInt(property.units || '0');
      return total + (units * (tierData?.price || 3));
    }, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    const hasInvoicePayment = paymentMethods.some(method => method.type === 'invoice');
    
    // 10% discount if no invoice payments (all card/ACH)
    if (!hasInvoicePayment && paymentMethods.length > 0) {
      return Math.round(subtotal * 0.10);
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
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

  const handleContinueToPayment = () => {
    setCurrentStep(2);
  };

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowDataSetup(true);
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  if (showDataSetup) {
    return <DataSetup onComplete={onComplete} />;
  }

  const { userData } = registrationData;
  const properties = userData?.properties || [];
  const totalUnits = properties.reduce((sum: number, prop: any) => sum + parseInt(prop.units || '0'), 0);
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const finalTotal = calculateTotal();

  // Step 1: Tier Selection
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Blue Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
                <p className="text-xl text-blue-100 max-w-3xl">
                  Select pricing tiers for your {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                </p>
                <div className="mt-4 text-blue-100">
                  <p className="text-lg">Total Units: {totalUnits}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackClick}
                className="text-white hover:bg-blue-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Pricing Details Dropdown */}
          <Card>
            <CardHeader>
              <Button
                variant="ghost"
                onClick={() => setShowPricingDetails(!showPricingDetails)}
                className="w-full flex items-center justify-between p-0 h-auto"
              >
                <CardTitle>View Pricing Details</CardTitle>
                {showPricingDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CardHeader>
            {showPricingDetails && (
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {pricingTiers.map((tier) => (
                    <div key={tier.id} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
                      <p className="text-2xl font-bold mb-3">${tier.price}/unit/month</p>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Property Tier Selection */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Select Pricing Tier for Each Property</h3>
            <div className="space-y-4">
              {properties.map((property: any, index: number) => {
                const currentTier = getPropertyTier(index);
                const units = parseInt(property.units || '0');
                
                return (
                  <Card key={index} className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <span className="text-xl">{property.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({units} units)</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {formatCurrency(units * (pricingTiers.find(t => t.id === currentTier)?.price || 3))}/month
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {pricingTiers.map((tier) => {
                          const isSelected = currentTier === tier.id;
                          return (
                            <Card 
                              key={tier.id}
                              className={`cursor-pointer transition-all duration-200 ${
                                isSelected 
                                  ? 'border-2 border-blue-600 shadow-lg ring-2 ring-blue-100 bg-blue-50' 
                                  : 'border-2 border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => updatePropertyTier(index, tier.id as any)}
                            >
                              <CardHeader className="text-center pb-2">
                                <CardTitle className="text-lg">{tier.name}</CardTitle>
                                <div className="text-2xl font-bold text-gray-900">
                                  ${tier.price}/unit
                                </div>
                                <p className="text-sm text-gray-600">
                                  Total: {formatCurrency(units * tier.price)}/month
                                </p>
                              </CardHeader>
                              <CardContent className="pt-2">
                                <Button 
                                  variant={isSelected ? "default" : "outline"}
                                  className={`w-full ${isSelected ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updatePropertyTier(index, tier.id as any);
                                  }}
                                >
                                  {isSelected ? 'Selected' : 'Select Plan'}
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Pricing Summary */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Pricing Summary</h3>
                <div className="bg-white rounded-lg p-4 text-left">
                  <div className="space-y-2">
                    {properties.map((property: any, index: number) => {
                      const tier = getPropertyTier(index);
                      const tierData = pricingTiers.find(t => t.id === tier);
                      const units = parseInt(property.units || '0');
                      const cost = units * (tierData?.price || 3);
                      return (
                        <div key={index} className="flex justify-between items-center">
                          <span>{property.name} ({tierData?.name}):</span>
                          <span className="font-semibold">{formatCurrency(cost)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                    <span>Total Units:</span>
                    <span className="font-semibold">{totalUnits}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Monthly Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={handleContinueToPayment}
              disabled={propertyTiers.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium"
            >
              Continue to Payment Setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Payment Setup
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Payment Setup</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Configure payment methods for your properties
              </p>
              <div className="mt-4 text-blue-100">
                <p className="text-lg">Total Units: {totalUnits}</p>
                <p className="text-2xl font-bold">Monthly Cost: {formatCurrency(finalTotal)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="text-white hover:bg-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Configure Payment Methods</h3>
            <Button onClick={addPaymentMethod} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>

          {/* Payment Speed Promotion Banner */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Zap className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-800">Pay with Credit Card or ACH & Save 10%!</h4>
                  <p className="text-sm text-green-700">
                    Faster processing than invoices. Get instant setup and save money.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {paymentMethods.map((method, index) => {
            const assignedProperties = method.propertyIds.map(id => properties[parseInt(id)]).filter(Boolean);
            
            return (
              <Card key={method.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center flex-wrap gap-2">
                      {method.type === 'card' && <CreditCard className="h-5 w-5 mr-2" />}
                      {method.type === 'ach' && <Building2 className="h-5 w-5 mr-2" />}
                      {method.type === 'invoice' && <FileText className="h-5 w-5 mr-2" />}
                      Payment Method {index + 1}
                      {assignedProperties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {assignedProperties.map((property, propIndex) => (
                            <span key={propIndex} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {property.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {method.type !== 'invoice' && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
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
                      variant={method.type === 'ach' ? 'default' : 'outline'}
                      onClick={() => updatePaymentMethod(method.id, { type: 'ach' })}
                      className={method.type === 'ach' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      ACH/Bank (10% DISCOUNT)
                    </Button>
                    <Button 
                      variant={method.type === 'invoice' ? 'default' : 'outline'}
                      onClick={() => updatePaymentMethod(method.id, { type: 'invoice' })}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Invoice (Standard Rate)
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
                    </div>
                  )}

                  {method.type === 'ach' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Bank Name"
                          className="p-3 border border-gray-300 rounded-lg"
                          value={method.bankName || ''}
                          onChange={(e) => updatePaymentMethod(method.id, { bankName: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Account Holder Name"
                          className="p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Routing Number"
                          className="p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Account Number"
                          className="p-3 border border-gray-300 rounded-lg"
                        />
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
            );
          })}

          {/* Payment Summary */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Payment Summary</h3>
                <div className="bg-white rounded-lg p-4 text-left">
                  <div className="space-y-2">
                    {properties.map((property: any, index: number) => {
                      const tier = getPropertyTier(index);
                      const tierData = pricingTiers.find(t => t.id === tier);
                      const units = parseInt(property.units || '0');
                      const cost = units * (tierData?.price || 3);
                      return (
                        <div key={index} className="flex justify-between items-center">
                          <span>{property.name} ({tierData?.name}):</span>
                          <span className="font-semibold">{formatCurrency(cost)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                    <span>Total Units:</span>
                    <span className="font-semibold">{totalUnits}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 pt-2 border-t">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                      <span>Payment Method Discount (10%):</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Monthly Total:</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={handlePaymentComplete}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-medium"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPaymentSetup;
