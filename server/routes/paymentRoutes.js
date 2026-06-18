const express = require('express');
const router = express.Router();
const { initiatePayment, paymentCallback, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.post('/initiate', protect, paymentLimiter, initiatePayment);
router.post('/callback', paymentCallback); // S2S — no auth needed
router.get('/status/:transactionId', protect, getPaymentStatus);

module.exports = router;
