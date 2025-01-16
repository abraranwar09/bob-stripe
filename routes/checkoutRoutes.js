const express = require('express');
const router = express.Router();
const { createCheckoutSession, retrieveCheckoutSession } = require('../controllers/checkoutController');

router.post('/checkout', (req, res, next) => {
  console.log('Route file: Received request to create a checkout session');
  next();
}, createCheckoutSession);

router.get('/checkout/session/:sessionId', retrieveCheckoutSession);

module.exports = router; 