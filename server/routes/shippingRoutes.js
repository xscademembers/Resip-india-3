const express = require('express');
const router = express.Router();
const { checkPincode } = require('../controllers/shippingController');

router.get('/pincode/:pincode', checkPincode);

module.exports = router;
