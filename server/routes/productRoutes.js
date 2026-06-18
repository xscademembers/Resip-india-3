const express = require('express');
const router = express.Router();
const {
  getProducts, getFeaturedProducts, getTrendingProducts,
  getProduct, getProductReviews, addReview, updateReview, deleteReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { validate, reviewRules } = require('../middleware/validate');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/:slugOrId', getProduct);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, reviewRules, validate, addReview);
router.put('/reviews/:id', protect, updateReview);
router.delete('/reviews/:id', protect, deleteReview);

module.exports = router;
