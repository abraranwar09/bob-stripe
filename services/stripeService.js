const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async () => {
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!priceId) {
    throw new Error('Price ID is required to create a checkout session');
  }

  console.log(`[services/stripeService.js] Creating Stripe checkout session for subscription with price ID: ${priceId}`);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  });

  console.log('[services/stripeService.js] Stripe checkout session for subscription created');
  return session;
}; 