const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const Banner = require('../models/Banner');
const Settings = require('../models/Settings');
const Inventory = require('../models/Inventory');
const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');
const { deleteImage, getPublicIdFromUrl } = require('../middleware/upload');

// ═══════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════

const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    monthlyRevenue,
    topProducts,
    lowStockProducts,
    ordersByStatus,
  ] = await Promise.all([
    // Total revenue
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    // Total orders
    Order.countDocuments(),
    // Total customers
    User.countDocuments({ role: 'user' }),
    // Total products
    Product.countDocuments({ isActive: true }),
    // Recent 10 orders
    Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10)
      .lean(),
    // Monthly revenue (last 12 months)
    Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Top 10 selling products
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]),
    // Low stock products
    Product.find({ stock: { $lte: 10 }, isActive: true })
      .select('name stock lowStockThreshold images')
      .sort('stock')
      .limit(20)
      .lean(),
    // Orders by status
    Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    dashboard: {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      monthlyRevenue,
      topProducts,
      lowStockProducts,
      ordersByStatus: ordersByStatus.reduce((acc, s) => {
        acc[s._id] = s.count;
        return acc;
      }, {}),
    },
  });
});

// ═══════════════════════════════════════════════
//  PRODUCTS ADMIN
// ═══════════════════════════════════════════════

const getAdminProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search;
  const category = req.query.category;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const createProduct = asyncHandler(async (req, res) => {
  // Auto-generate SKU if not provided
  if (!req.body.sku) {
    req.body.sku = `RSP-${Date.now().toString(36).toUpperCase()}`;
  }

  // Set categoryName
  if (req.body.category) {
    const cat = await Category.findById(req.body.category);
    if (cat) req.body.categoryName = cat.name;
  }

  const product = await Product.create(req.body);

  // Create inventory record
  await Inventory.create({
    product: product._id,
    stock: product.stock || 0,
    lowStockThreshold: product.lowStockThreshold || 10,
  });

  res.status(201).json({ success: true, product });
});

const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) throw new ApiError('Product not found', 404);

  // Update categoryName if category changed
  if (req.body.category && req.body.category !== product.category?.toString()) {
    const cat = await Category.findById(req.body.category);
    if (cat) req.body.categoryName = cat.name;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Sync inventory stock
  if (req.body.stock !== undefined) {
    await Inventory.findOneAndUpdate(
      { product: product._id },
      { stock: req.body.stock },
      { upsert: true }
    );
  }

  res.status(200).json({ success: true, product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError('Product not found', 404);

  // Delete images from Cloudinary
  for (const url of product.images || []) {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) await deleteImage(publicId);
  }

  await Product.findByIdAndDelete(req.params.id);
  await Inventory.findOneAndDelete({ product: req.params.id });

  res.status(200).json({ success: true, message: 'Product deleted' });
});

const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError('Product not found', 404);

  const imageUrls = req.files.map((file) => file.path);
  product.images = [...(product.images || []), ...imageUrls];
  await product.save();

  res.status(200).json({ success: true, images: product.images });
});

// ═══════════════════════════════════════════════
//  CATEGORIES ADMIN
// ═══════════════════════════════════════════════

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError('Category not found', 404);
  res.status(200).json({ success: true, category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  // Check if products exist in this category
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    throw new ApiError(`Cannot delete: ${productCount} products in this category`, 400);
  }
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Category deleted' });
});

// ═══════════════════════════════════════════════
//  ORDERS ADMIN
// ═══════════════════════════════════════════════

const getAdminOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status;
  const search = req.query.search;

  const query = {};
  if (status) query.orderStatus = status;
  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: 'i' } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getAdminOrderDetail = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) throw new ApiError('Order not found', 404);
  res.status(200).json({ success: true, order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError('Order not found', 404);

  const validStatuses = [
    'Pending', 'Confirmed', 'Packed', 'Shipped',
    'Out For Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded',
  ];

  if (!validStatuses.includes(status)) {
    throw new ApiError('Invalid order status', 400);
  }

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'Delivered') order.deliveredAt = new Date();
  if (status === 'Cancelled') order.cancelledAt = new Date();

  order.statusHistory.push({
    status,
    note: note || `Status updated to ${status}`,
    updatedBy: req.user._id,
  });

  await order.save();

  // Send email notification
  const user = await User.findById(order.user);
  if (user) {
    if (status === 'Cancelled') {
      await emailService.sendOrderCancelled(order, user);
    } else {
      await emailService.sendOrderStatusUpdate(order, user);
    }
  }

  // Restore stock on cancellation/return
  if (['Cancelled', 'Returned'].includes(status)) {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  res.status(200).json({ success: true, order });
});

// ═══════════════════════════════════════════════
//  CUSTOMERS ADMIN
// ═══════════════════════════════════════════════

const getCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search;

  const query = { role: 'user' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [customers, total] = await Promise.all([
    User.find(query).sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    customers,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getCustomerDetail = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id);
  if (!customer) throw new ApiError('Customer not found', 404);

  const orders = await Order.find({ user: req.params.id }).sort('-createdAt').limit(20);

  res.status(200).json({ success: true, customer, orders });
});

// ═══════════════════════════════════════════════
//  COUPONS ADMIN
// ═══════════════════════════════════════════════

const getAdminCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json({ success: true, coupons });
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new ApiError('Coupon not found', 404);
  res.status(200).json({ success: true, coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Coupon deleted' });
});

// ═══════════════════════════════════════════════
//  INVENTORY ADMIN
// ═══════════════════════════════════════════════

const getInventory = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .select('name images stock lowStockThreshold sku categoryName')
    .sort('stock');

  res.status(200).json({ success: true, inventory: products });
});

const updateInventory = asyncHandler(async (req, res) => {
  const { stock, lowStockThreshold } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { stock, lowStockThreshold },
    { new: true }
  );

  if (!product) throw new ApiError('Product not found', 404);

  // Sync inventory model
  await Inventory.findOneAndUpdate(
    { product: req.params.productId },
    { stock, lowStockThreshold },
    { upsert: true }
  );

  res.status(200).json({ success: true, product });
});

// ═══════════════════════════════════════════════
//  REVIEWS ADMIN
// ═══════════════════════════════════════════════

const getAdminReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Review.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    reviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: req.body.isApproved },
    { new: true }
  );
  if (!review) throw new ApiError('Review not found', 404);
  res.status(200).json({ success: true, review });
});

const deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Review deleted' });
});

// ═══════════════════════════════════════════════
//  BANNERS ADMIN
// ═══════════════════════════════════════════════

const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort('sortOrder');
  res.status(200).json({ success: true, banners });
});

const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, banner });
});

const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!banner) throw new ApiError('Banner not found', 404);
  res.status(200).json({ success: true, banner });
});

const deleteBanner = asyncHandler(async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Banner deleted' });
});

// ═══════════════════════════════════════════════
//  SETTINGS ADMIN
// ═══════════════════════════════════════════════

const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.find().sort('group key');
  res.status(200).json({ success: true, settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body; // Array of { key, value, group }

  if (!Array.isArray(settings)) {
    throw new ApiError('Settings must be an array', 400);
  }

  for (const setting of settings) {
    await Settings.setSetting(setting.key, setting.value, setting.group, req.user._id);
  }

  const updated = await Settings.find().sort('group key');
  res.status(200).json({ success: true, settings: updated });
});

// ═══════════════════════════════════════════════
//  PAYMENTS ADMIN
// ═══════════════════════════════════════════════

const getPayments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find()
      .populate('user', 'name email')
      .populate('order', 'orderId totalAmount')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Payment.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    payments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

module.exports = {
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
};
