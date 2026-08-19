const express = require('express');
const router = express.Router();
const { initiatePayment, paymentCallback, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.post('/initiate', protect, paymentLimiter, initiatePayment);

// Cashfree webhook   needs raw body for HMAC signature verification.
// The raw body middleware is applied in server.js; we just need to make
// sure the route itself doesn't require auth (S2S callback).
router.post('/callback', paymentCallback);

router.get('/status/:transactionId', protect, getPaymentStatus);

module.exports = router;
