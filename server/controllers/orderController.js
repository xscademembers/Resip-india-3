const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');
const carbonService = require('../services/carbonService');

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

const getSessionId = (req) =>
  req.cookies?.cartSession || req.headers['x-cart-session'] || null;

/** Resolve cart for logged-in user or guest session. */
const findCartForRequest = async (req) => {
  if (req.user) {
    return Cart.findOne({ user: req.user._id }).populate('items.product');
  }
  const sessionId = getSessionId(req);
  if (!sessionId) return null;
  return Cart.findOne({ sessionId }).populate('items.product');
};

const clearCartForRequest = async (req, cart) => {
  if (req.user) {
    await Cart.findOneAndDelete({ user: req.user._id });
  } else if (cart?.sessionId) {
    await Cart.findOneAndDelete({ sessionId: cart.sessionId });
  } else {
    const sessionId = getSessionId(req);
    if (sessionId) await Cart.findOneAndDelete({ sessionId });
  }
};

const contactFromOrder = (order, user) => {
  if (user) return user;
  return carbonService.guestContactFromOrder(order);
};

// @desc    Create order (guest or logged-in)
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    billingAddress,
    couponCode,
    paymentMethod = 'cashfree',
    guestEmail,
    carbonPointsToUse = 0,
  } = req.body;
  const isCod = paymentMethod === 'cod';
  const isGuest = !req.user;

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    throw new ApiError('Shipping address is required', 400);
  }

  // Guests must provide email (for confirmation + Cashfree).
  const email = isGuest
    ? String(guestEmail || shippingAddress.email || '').trim().toLowerCase()
    : req.user.email;
  if (isGuest) {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new ApiError('A valid email is required for guest checkout', 400);
    }
  }

  const cart = await findCartForRequest(req);
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

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Coupons: logged-in only
  let couponDiscount = 0;
  let couponDoc = null;
  if (couponCode) {
    if (!req.user) {
      throw new ApiError('Please sign in to apply a coupon', 401);
    }
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

  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const taxAmount = Math.round((afterCoupon * taxPercent) / 100);
  const shippingCharge = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const codCharge = isCod ? codFee : 0;

  // Max redeemable points = remaining amount before points (cannot go negative).
  const prePointsTotal = afterCoupon + taxAmount + shippingCharge + codCharge;
  let carbonPointsUsed = 0;
  let carbonPointsDiscount = 0;

  // Create order first so redeem can reference order._id; adjust total after redeem.
  const accessToken = crypto.randomBytes(24).toString('hex');
  const sessionId = cart.sessionId || getSessionId(req) || undefined;

  const order = await Order.create({
    user: req.user?._id,
    isGuest,
    guestEmail: isGuest ? email : undefined,
    guestPhone: isGuest ? shippingAddress.phone : undefined,
    guestName: isGuest ? shippingAddress.fullName : undefined,
    accessToken,
    cartSessionId: sessionId,
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
    carbonPointsUsed: 0,
    carbonPointsDiscount: 0,
    carbonPointsEarned: 0,
    totalAmount: prePointsTotal,
    paymentMethod,
    orderStatus: isCod ? 'Confirmed' : 'Pending',
    paymentStatus: 'pending',
    statusHistory: [
      {
        status: isCod ? 'Confirmed' : 'Pending',
        note: isCod ? 'Order placed (Cash on Delivery)' : 'Order created',
      },
    ],
  });

  // Redeem carbon points (logged-in only) against pre-points total.
  if (req.user && carbonPointsToUse > 0) {
    const redeem = await carbonService.redeemPoints(
      req.user._id,
      carbonPointsToUse,
      order._id,
      prePointsTotal
    );
    carbonPointsUsed = redeem.pointsUsed;
    carbonPointsDiscount = redeem.discountInr;
  }

  order.carbonPointsUsed = carbonPointsUsed;
  order.carbonPointsDiscount = carbonPointsDiscount;
  order.totalAmount = Math.max(0, prePointsTotal - carbonPointsDiscount);
  await order.save();

  if (couponDoc && req.user) {
    couponDoc.usedCount += 1;
    couponDoc.usedBy.push(req.user._id);
    await couponDoc.save();
  }

  // COD: finalise now. Points earn waits until Delivered.
  if (isCod) {
    for (const item of order.items) {
      const inventory = await Inventory.findOne({ product: item.product });
      if (inventory) {
        await inventory.reduceSaleStock(item.quantity, order._id);
      } else {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }
    }

    await clearCartForRequest(req, cart);

    const user = req.user ? await User.findById(req.user._id) : null;
    const contact = contactFromOrder(order, user);
    Promise.allSettled([
      emailService.sendCustomerOrderConfirmation(
        order,
        { amount: 0, transactionId: 'COD', gatewayResponse: {} },
        contact
      ),
      emailService.sendAdminOrderNotification(
        order,
        { amount: 0, transactionId: 'COD', gatewayResponse: {} },
        contact
      ),
    ]).catch(() => {});
  }

  res.status(201).json({
    success: true,
    order,
    accessToken: order.accessToken,
  });
});

// @desc    Get single order (owner or admin)
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

  const isOwner =
    order.user &&
    order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError('Not authorized', 403);
  }

  res.status(200).json({ success: true, order });
});

// @desc    Guest/public order confirmation by orderId + accessToken
// @route   GET /api/orders/confirm/:orderId
const getOrderConfirmation = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const token = String(req.query.token || '').trim();
  if (!token) {
    throw new ApiError('Confirmation token is required', 400);
  }

  const order = await Order.findOne({ orderId, accessToken: token }).select(
    '-__v'
  );

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Strip sensitive fields from public response
  const publicOrder = order.toObject();
  // Keep accessToken out of nested copies if client stores it separately
  delete publicOrder.cartSessionId;

  res.status(200).json({ success: true, order: publicOrder });
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

  const isOwner = order.user && order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError('Not authorized', 403);
  }

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

  await carbonService.reversePointsForOrder(order, 'Cancelled by user');

  for (const item of order.items) {
    const inventory = await Inventory.findOne({ product: item.product });
    if (inventory) {
      await inventory.restoreStock(item.quantity, order._id);
    } else {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  const user = order.user ? await User.findById(order.user) : null;
  const contact = contactFromOrder(order, user);
  if (contact?.email) {
    await emailService.sendOrderCancelled(order, contact);
  }

  res.status(200).json({ success: true, order });
});

module.exports = {
  createOrder,
  getOrder,
  getOrderConfirmation,
  cancelOrder,
};
