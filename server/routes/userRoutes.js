const express = require('express');
const router = express.Router();
const {
  updateProfile, changePassword,
  getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
  getWishlist, toggleWishlist, getOrderHistory,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate, addressRules } = require('../middleware/validate');

router.use(protect); // All user routes are protected

router.put('/profile', updateProfile);
router.put('/password', changePassword);

router.get('/addresses', getAddresses);
router.post('/addresses', addressRules, validate, addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.put('/addresses/:id/default', setDefaultAddress);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);

router.get('/orders', getOrderHistory);

module.exports = router;
