import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { PRICING_TIERS, PricingTier, calculateMonthlyPrice } from '@/config/pricing';

interface PricingCardProps {
  tier: PricingTier;
  unitCount: number;
  onSelect: (tier: PricingTier) => void;
  isPopular?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  unitCount,
  onSelect,
  isPopular = false
}) => {
  const tierConfig = PRICING_TIERS[tier];
  const monthlyPrice = calculateMonthlyPrice(tier, unitCount);

  return (
    <Card className={`relative ${isPopular ? 'border-blue-500 shadow-lg' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{tierConfig.name}</CardTitle>
        <CardDescription>
          ${tierConfig.pricePerUnit}/unit/month
        </CardDescription>
        <div className="text-3xl font-bold">
          ${monthlyPrice.toLocaleString()}
          <span className="text-sm font-normal text-gray-500">/month</span>
        </div>
        <div className="text-sm text-gray-500">
          for {unitCount.toLocaleString()} units
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2 mb-6">
          {tierConfig.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={() => onSelect(tier)}
          className={`w-full ${isPopular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
        >
          Select {tierConfig.name}
        </Button>
      </CardContent>
    </Card>
  );
};
