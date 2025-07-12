import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export interface CreateSubscriptionParams {
  customerId: string;
  unitCount: number;
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
}

export const createSubscription = async ({ customerId, unitCount, tier }: CreateSubscriptionParams) => {
  const pricePerUnit = tier === 'BASIC' ? 3 : tier === 'PRO' ? 4 : 5;
  const amount = pricePerUnit * unitCount * 100; // Convert to cents

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `OPSIGHT ${tier} - ${unitCount} units`,
        },
        unit_amount: amount,
        recurring: {
          interval: 'month',
        },
      },
    }],
    metadata: {
      unitCount: unitCount.toString(),
      tier,
      pricePerUnit: pricePerUnit.toString(),
    },
  });

  return subscription;
};

export const createCustomer = async (email: string, name: string) => {
  return await stripe.customers.create({
    email,
    name,
  });
};

export const createCheckoutSession = async (params: {
  customerId: string;
  unitCount: number;
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
  successUrl: string;
  cancelUrl: string;
}) => {
  const { customerId, unitCount, tier, successUrl, cancelUrl } = params;
  const pricePerUnit = tier === 'BASIC' ? 3 : tier === 'PRO' ? 4 : 5;
  const amount = pricePerUnit * unitCount * 100;

  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `OPSIGHT ${tier} Plan`,
          description: `${unitCount} units at $${pricePerUnit}/unit/month`,
        },
        unit_amount: amount,
        recurring: {
          interval: 'month',
        },
      },
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      unitCount: unitCount.toString(),
      tier,
      pricePerUnit: pricePerUnit.toString(),
    },
  });
};

export default stripe;
