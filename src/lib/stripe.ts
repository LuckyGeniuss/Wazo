import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-02-25.clover', // Update to the latest stable version or match the one installed
  appInfo: {
    name: 'Multi-tenant SaaS Builder',
    version: '1.0.0',
  },
});
