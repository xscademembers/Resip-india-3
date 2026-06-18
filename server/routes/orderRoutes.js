const express = require('express');
const router = express.Router();
const { createOrder, getOrder, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { validate, orderRules } = require('../middleware/validate');

router.use(protect);

router.post('/', orderRules, validate, createOrder);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
