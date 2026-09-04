const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  getOrderConfirmation,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, orderRules } = require('../middleware/validate');

// Guest-friendly confirmation (must be before /:id)
router.get('/confirm/:orderId', getOrderConfirmation);

// Create order — guests and logged-in users
router.post('/', optionalAuth, orderRules, validate, createOrder);

router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
