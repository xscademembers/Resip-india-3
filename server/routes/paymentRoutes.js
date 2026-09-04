const express = require('express');
const router = express.Router();
const { initiatePayment, paymentCallback, getPaymentStatus } = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.post('/initiate', optionalAuth, paymentLimiter, initiatePayment);

// Cashfree webhook — needs raw body for HMAC signature verification.
router.post('/callback', paymentCallback);

router.get('/status/:transactionId', optionalAuth, getPaymentStatus);

module.exports = router;
