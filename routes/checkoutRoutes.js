const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/checkoutController');

router.post('/checkout', (req, res, next) => {
  console.log('Route file: Received request to create a checkout session');
  next();
}, createCheckoutSession);

module.exports = router; 