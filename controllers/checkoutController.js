const stripeService = require('../services/stripeService');

exports.createCheckoutSession = async (req, res) => {
  console.log('Controller: Starting to create a checkout session');
  try {
    const session = await stripeService.createCheckoutSession(req.body.priceId);
    console.log('Controller: Checkout session created successfully');
    res.json(session);
  } catch (error) {
    console.error(`Controller: Error creating checkout session: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}; 