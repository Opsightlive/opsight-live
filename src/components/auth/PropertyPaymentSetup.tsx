
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Building2, FileText, Plus, X, ArrowLeft, Zap, Shield, Calendar, DollarSign } from 'lucide-react';
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

const PropertyPaymentSetup: React.FC<PropertyPaymentSetupProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDataSetup, setShowDataSetup] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
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
      
      // Initialize with one payment method per property
      if (data.userData?.properties?.length > 0) {
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
  const totalUnits = properties.reduce((sum: number, prop: any) => sum + parseInt(prop.units || '0'), 0);
  const monthlyTotal = totalUnits * 4; // $4 per unit
  
  // Calculate credit card discount (10% off)
  const creditCardDiscount = 0.10;
  const hasAllCardPayments = paymentMethods.every(method => method.type === 'card');
  const discountAmount = hasAllCardPayments ? Math.round(monthlyTotal * creditCardDiscount) : 0;
  const finalTotal = monthlyTotal - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Your New Portfolio Payment</h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Configure payment methods for your {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </p>
              <div className="mt-4 text-blue-100">
                <p className="text-lg">Total Units: {totalUnits}</p>
                <p className="text-2xl font-bold">Monthly Cost: {formatCurrency(finalTotal)}</p>
                {hasAllCardPayments && discountAmount > 0 && (
                  <p className="text-green-200">You save {formatCurrency(discountAmount)} with credit card payments!</p>
                )}
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
            <h3 className="text-2xl font-bold text-gray-900">Payment Methods by Property</h3>
            <Button onClick={addPaymentMethod} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>

          {/* Credit Card Promotion Banner */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Zap className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-800">Pay with Credit Card & Save 10%!</h4>
                  <p className="text-sm text-green-700">
                    Get instant processing and save money with our credit card discount.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {paymentMethods.map((method, index) => {
            const assignedProperty = method.propertyIds.length > 0 ? properties[parseInt(method.propertyIds[0])] : null;
            return (
              <Card key={method.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {method.type === 'card' && <CreditCard className="h-5 w-5 mr-2" />}
                      {method.type === 'ach' && <Building2 className="h-5 w-5 mr-2" />}
                      {method.type === 'invoice' && <FileText className="h-5 w-5 mr-2" />}
                      Payment Method {index + 1}
                      {assignedProperty && (
                        <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {assignedProperty.name}
                        </span>
                      )}
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
                      variant={method.type === 'ach' ? 'default' : 'outline'}
                      onClick={() => updatePaymentMethod(method.id, { type: 'ach' })}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      ACH/Bank Transfer
                    </Button>
                    <Button 
                      variant={method.type === 'invoice' ? 'default' : 'outline'}
                      onClick={() => updatePaymentMethod(method.id, { type: 'invoice' })}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Invoice
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
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Units:</span>
                    <span className="font-semibold">{totalUnits}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Rate per Unit:</span>
                    <span className="font-semibold">$4/month</span>
                  </div>
                  {hasAllCardPayments && discountAmount > 0 && (
                    <>
                      <div className="flex justify-between items-center mb-2 text-gray-500">
                        <span>Subtotal:</span>
                        <span className="line-through">{formatCurrency(monthlyTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2 text-green-600">
                        <span>Credit Card Discount (10%):</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    </>
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
