const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getDashboard,
  getAdminProducts, createProduct, updateProduct, deleteProduct, uploadProductImages,
  createCategory, updateCategory, deleteCategory,
  getAdminOrders, getAdminOrderDetail, updateOrderStatus,
  getCustomers, getCustomerDetail,
  getAdminCoupons, createCoupon, updateCoupon, deleteCoupon,
  getInventory, updateInventory,
  getAdminReviews, updateReview, deleteReview,
  getBanners, createBanner, updateBanner, deleteBanner,
  getSettings, updateSettings,
  getPayments,
} = require('../controllers/adminController');
const { validate, productRules, couponRules } = require('../middleware/validate');

// All admin routes require auth + admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboard);

// Products
router.get('/products', getAdminProducts);
router.post('/products', productRules, validate, createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/images', upload.array('images', 10), uploadProductImages);

// Categories
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Orders
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderDetail);
router.put('/orders/:id/status', updateOrderStatus);

// Customers
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetail);

// Coupons
router.get('/coupons', getAdminCoupons);
router.post('/coupons', couponRules, validate, createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Inventory
router.get('/inventory', getInventory);
router.put('/inventory/:productId', updateInventory);

// Reviews
router.get('/reviews', getAdminReviews);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

// Banners
router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Payments
router.get('/payments', getPayments);

module.exports = router;
