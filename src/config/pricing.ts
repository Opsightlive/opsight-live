export const PRICING_TIERS = {
  BASIC: {
    name: 'Basic',
    pricePerUnit: 3,
    features: [
      'Red Flag Alerts',
      'Basic Analytics',
      'Email Support',
      'Standard Reports'
    ],
    maxUnits: 1000
  },
  PRO: {
    name: 'Pro',
    pricePerUnit: 4,
    features: [
      'Everything in Basic',
      'Advanced Analytics',
      'Priority Support',
      'Custom Reports',
      'API Access',
      'Team Management'
    ],
    maxUnits: 5000
  },
  ENTERPRISE: {
    name: 'Enterprise',
    pricePerUnit: 5,
    features: [
      'Everything in Pro',
      'Dedicated Support',
      'Custom Integrations',
      'White-label Options',
      'Consulting Services',
      'SLA Guarantee'
    ],
    maxUnits: Infinity
  }
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;

export const calculateMonthlyPrice = (tier: PricingTier, unitCount: number): number => {
  const tierConfig = PRICING_TIERS[tier];
  return tierConfig.pricePerUnit * unitCount;
};

export const getTierByUnitCount = (unitCount: number): number => {
  if (unitCount <= 1000) return 3;
  if (unitCount <= 5000) return 4;
  return 5;
};
