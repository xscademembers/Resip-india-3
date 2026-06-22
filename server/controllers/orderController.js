const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');

// Default pricing rules (used when no admin Settings value is present).
const DEFAULT_FREE_SHIPPING_THRESHOLD = 999;
const DEFAULT_SHIPPING_CHARGE = 99;
const DEFAULT_TAX_PERCENT = 18;

/** Load tax/shipping rules from admin Settings, falling back to defaults. */
const getPricingConfig = async () => {
  const [taxPercent, freeShippingThreshold, shippingCharge] = await Promise.all([
    Settings.getSetting('tax_percent', DEFAULT_TAX_PERCENT),
    Settings.getSetting('free_shipping_threshold', DEFAULT_FREE_SHIPPING_THRESHOLD),
    Settings.getSetting('shipping_charge', DEFAULT_SHIPPING_CHARGE),
  ]);
  return {
    taxPercent: Number(taxPercent),
    freeShippingThreshold: Number(freeShippingThreshold),
    shippingCharge: Number(shippingCharge),
  };
};

// @desc    Create order
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, billingAddress, couponCode, paymentMethod = 'phonepe' } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError('Cart is empty', 400);
  }

  // Validate stock for all items
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      throw new ApiError(`Product ${item.product?.name || 'unknown'} is no longer available`, 400);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(`Insufficient stock for ${product.name}. Available: ${product.stock}`, 400);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      quantity: item.quantity,
      price: item.price,
      setSize: item.setSize,
      fragrance: item.fragrance,
      labelType: item.labelType,
      subtotal: item.price * item.quantity,
    });
  }

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Apply coupon
  let couponDiscount = 0;
  let couponDoc = null;
  if (couponCode) {
    couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (couponDoc) {
      const validation = couponDoc.isValid(req.user._id, subtotal);
      if (validation.valid) {
        couponDiscount = couponDoc.calculateDiscount(subtotal);
      }
    }
  }

  const { taxPercent, freeShippingThreshold, shippingCharge: shippingFee } = await getPricingConfig();

  const afterDiscount = subtotal - couponDiscount;
  const taxAmount = Math.round((afterDiscount * taxPercent) / 100);
  const shippingCharge = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const totalAmount = afterDiscount + taxAmount + shippingCharge;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    coupon: couponDoc?._id,
    couponCode: couponDoc?.code,
    couponDiscount,
    subtotal,
    taxPercent,
    taxAmount,
    shippingCharge,
    totalAmount,
    paymentMethod,
    orderStatus: 'Pending',
    paymentStatus: 'pending',
    statusHistory: [{ status: 'Pending', note: 'Order created' }],
  });

  // Update coupon usage
  if (couponDoc) {
    couponDoc.usedCount += 1;
    couponDoc.usedBy.push(req.user._id);
    await couponDoc.save();
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    $or: [
      { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined },
      { orderId: req.params.id },
    ],
  }).populate('user', 'name email');

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Only owner or admin can view
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError('Not authorized', 403);
  }

  res.status(200).json({ success: true, order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    $or: [
      { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined },
      { orderId: req.params.id },
    ],
  });

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError('Not authorized', 403);
  }

  // Only allow cancel for certain statuses
  const cancellable = ['Pending', 'Confirmed'];
  if (!cancellable.includes(order.orderStatus)) {
    throw new ApiError(`Cannot cancel order with status: ${order.orderStatus}`, 400);
  }

  order.orderStatus = 'Cancelled';
  order.cancelledAt = new Date();
  order.statusHistory.push({
    status: 'Cancelled',
    note: req.body.reason || 'Cancelled by user',
    updatedBy: req.user._id,
  });
  await order.save();

  // Restore inventory
  for (const item of order.items) {
    const inventory = await Inventory.findOne({ product: item.product });
    if (inventory) {
      await inventory.restoreStock(item.quantity, order._id);
    } else {
      // Update product stock directly
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  // Send cancellation email
  const user = await require('../models/User').findById(order.user);
  if (user) {
    await emailService.sendOrderCancelled(order, user);
  }

  res.status(200).json({ success: true, order });
});

module.exports = {
  createOrder,
  getOrder,
  cancelOrder,
};
