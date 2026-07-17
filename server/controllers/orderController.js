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
const DEFAULT_SHIPPING_CHARGE = 50;
const DEFAULT_TAX_PERCENT = 18;
const DEFAULT_COD_CHARGE = 50;

/** Load tax/shipping/COD rules from admin Settings, falling back to defaults. */
const getPricingConfig = async () => {
  const [taxPercent, freeShippingThreshold, shippingCharge, codCharge] = await Promise.all([
    Settings.getSetting('tax_percent', DEFAULT_TAX_PERCENT),
    Settings.getSetting('free_shipping_threshold', DEFAULT_FREE_SHIPPING_THRESHOLD),
    Settings.getSetting('shipping_charge', DEFAULT_SHIPPING_CHARGE),
    Settings.getSetting('cod_charge', DEFAULT_COD_CHARGE),
  ]);
  return {
    taxPercent: Number(taxPercent),
    freeShippingThreshold: Number(freeShippingThreshold),
    shippingCharge: Number(shippingCharge),
    codCharge: Number(codCharge),
  };
};

// @desc    Create order
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, billingAddress, couponCode, paymentMethod = 'cashfree' } = req.body;
  const isCod = paymentMethod === 'cod';

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

  const { taxPercent, freeShippingThreshold, shippingCharge: shippingFee, codCharge: codFee } =
    await getPricingConfig();

  const afterDiscount = subtotal - couponDiscount;
  const taxAmount = Math.round((afterDiscount * taxPercent) / 100);
  const shippingCharge = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  // Extra handling fee charged only for Cash on Delivery orders.
  const codCharge = isCod ? codFee : 0;
  const totalAmount = afterDiscount + taxAmount + shippingCharge + codCharge;

  // COD orders are confirmed immediately (no online payment step); online
  // orders stay Pending until the payment gateway confirms.
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
    codCharge,
    totalAmount,
    paymentMethod,
    orderStatus: isCod ? 'Confirmed' : 'Pending',
    paymentStatus: 'pending',
    statusHistory: [
      { status: isCod ? 'Confirmed' : 'Pending', note: isCod ? 'Order placed (Cash on Delivery)' : 'Order created' },
    ],
  });

  // Update coupon usage
  if (couponDoc) {
    couponDoc.usedCount += 1;
    couponDoc.usedBy.push(req.user._id);
    await couponDoc.save();
  }

  // For COD there is no payment gateway callback, so finalise the order now:
  // reduce inventory, clear the cart, and send confirmation emails.
  if (isCod) {
    for (const item of order.items) {
      const inventory = await Inventory.findOne({ product: item.product });
      if (inventory) {
        await inventory.reduceSaleStock(item.quantity, order._id);
      } else {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
    }

    await Cart.findOneAndDelete({ user: req.user._id });

    const user = await require('../models/User').findById(req.user._id);
    if (user) {
      Promise.allSettled([
        emailService.sendCustomerOrderConfirmation(order, { amount: 0, transactionId: 'COD', gatewayResponse: {} }, user),
        emailService.sendAdminOrderNotification(order, { amount: 0, transactionId: 'COD', gatewayResponse: {} }, user),
      ]).catch(() => {});
    }
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
