
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Building2, DollarSign, Zap } from 'lucide-react';

interface PricingTier {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic',
    price: 3,
    features: ['Essential monitoring', 'Basic KPI tracking', 'Standard alerts', 'Monthly reporting', 'Email support']
  },
  {
    name: 'Professional',
    price: 4,
    features: ['Everything in Basic', 'Real-time KPI tracking', 'Predictive alerts', 'AI-powered insights', '24/7 support'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 5,
    features: ['Everything in Professional', 'Advanced analytics', 'Custom integrations', 'Dedicated account manager', 'Priority support']
  }
];

interface PricingCalculatorProps {
  onPlanSelect?: (tier: string, billingPeriod: 'monthly' | 'annual', units: number, total: number) => void;
  showActions?: boolean;
  defaultUnits?: number;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({ 
  onPlanSelect, 
  showActions = true,
  defaultUnits = 1 
}) => {
  const [units, setUnits] = useState(defaultUnits);
  const [selectedTier, setSelectedTier] = useState('Professional');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const getTierPrice = (tierName: string) => {
    return pricingTiers.find(tier => tier.name === tierName)?.price || 0;
  };

  const calculatePrice = (tierName: string, period: 'monthly' | 'annual', unitCount: number) => {
    const basePrice = getTierPrice(tierName);
    const monthlyTotal = basePrice * unitCount;
    
    if (period === 'annual') {
      // 2 months free on annual billing
      return monthlyTotal * 10;
    }
    
    return monthlyTotal;
  };

  const getAnnualSavings = (tierName: string, unitCount: number) => {
    const monthlyTotal = getTierPrice(tierName) * unitCount;
    const annualTotal = monthlyTotal * 12;
    const discountedAnnual = calculatePrice(tierName, 'annual', unitCount);
    return annualTotal - discountedAnnual;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePlanSelect = (tierName: string) => {
    const total = calculatePrice(tierName, billingPeriod, units);
    onPlanSelect?.(tierName, billingPeriod, units, total);
  };

  return (
    <div className="space-y-6">
      {/* Unit Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-blue-600" />
            Calculate Your Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="units">Number of Units/Doors</Label>
              <Input
                id="units"
                type="number"
                min="1"
                value={units}
                onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-1"
                placeholder="Enter number of units"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the total number of units across your entire portfolio
              </p>
            </div>

            {/* Billing Period Toggle */}
            <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'annual')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual (Save 17%)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Tier Selection */}
      <div className="grid md:grid-cols-3 gap-6">
        {pricingTiers.map((tier) => {
          const price = calculatePrice(tier.name, billingPeriod, units);
          const isSelected = selectedTier === tier.name;
          const savings = billingPeriod === 'annual' ? getAnnualSavings(tier.name, units) : 0;

          return (
            <Card 
              key={tier.name}
              className={`relative cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-2 border-blue-600 shadow-lg ring-2 ring-blue-100' 
                  : 'border-2 border-gray-200 hover:border-blue-300'
              } ${tier.popular ? 'border-blue-600 shadow-lg' : ''}`}
              onClick={() => setSelectedTier(tier.name)}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{formatCurrency(price)}</span>
                    <span className="text-gray-500 ml-1">/{billingPeriod}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    ${tier.price} per door/{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </p>
                  {billingPeriod === 'annual' && savings > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Save {formatCurrency(savings)} per year!
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Zap className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {showActions && (
                  <Button 
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full ${isSelected ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(tier.name);
                    }}
                  >
                    {isSelected ? 'Selected Plan' : 'Select Plan'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Your Selected Plan</h3>
                <p className="text-gray-600">
                  {selectedTier} • {units} {units === 1 ? 'unit' : 'units'} • {billingPeriod} billing
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(calculatePrice(selectedTier, billingPeriod, units))}
              </p>
              <p className="text-gray-600">/{billingPeriod}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCalculator;
