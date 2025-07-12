import React, { useState } from 'react';
import { PricingCard } from '@/components/pricing/PricingCard';
import { PRICING_TIERS, PricingTier } from '@/config/pricing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Building, Users } from 'lucide-react';

const PricingPage = () => {
  const [unitCount, setUnitCount] = useState(100);
  const [selectedTier, setSelectedTier] = useState<PricingTier>('BASIC');

  const handleUnitCountChange = (value: string) => {
    const count = parseInt(value) || 0;
    setUnitCount(count);
    
    // Auto-select appropriate tier based on unit count
    if (count <= 1000) setSelectedTier('BASIC');
    else if (count <= 5000) setSelectedTier('PRO');
    else setSelectedTier('ENTERPRISE');
  };

  const handleTierSelect = (tier: PricingTier) => {
    setSelectedTier(tier);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pay only for what you use. Our unit-based pricing scales with your portfolio size.
          </p>
        </div>

        {/* Unit Calculator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Portfolio Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="unitCount">Total Units in Portfolio</Label>
                <Input
                  id="unitCount"
                  type="number"
                  value={unitCount}
                  onChange={(e) => handleUnitCountChange(e.target.value)}
                  placeholder="Enter total units"
                  className="mt-2"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Building className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Monthly Cost</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(PRICING_TIERS[selectedTier].pricePerUnit * unitCount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            tier="BASIC"
            unitCount={unitCount}
            onSelect={handleTierSelect}
            isPopular={selectedTier === 'BASIC'}
          />
          <PricingCard
            tier="PRO"
            unitCount={unitCount}
            onSelect={handleTierSelect}
            isPopular={selectedTier === 'PRO'}
          />
          <PricingCard
            tier="ENTERPRISE"
            unitCount={unitCount}
            onSelect={handleTierSelect}
            isPopular={selectedTier === 'ENTERPRISE'}
          />
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pro
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Red Flag Alerts
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">✓</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">✓</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Advanced Analytics
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">✓</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Priority Support
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">✓</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Custom Integrations
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
