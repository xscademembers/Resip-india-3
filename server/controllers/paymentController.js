const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Cart = require('../models/Cart');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');
const cashfreeService = require('../services/cashfreeService');
const emailService = require('../services/emailService');
const carbonService = require('../services/carbonService');

const getSessionId = (req) =>
  req.cookies?.cartSession || req.headers['x-cart-session'] || null;

/** Order is accessible if owned by user, matching guest cart session, access token, or admin. */
function canAccessOrder(order, req) {
  if (req.user?.role === 'admin') return true;
  if (req.user && order.user && order.user.toString() === req.user._id.toString()) {
    return true;
  }
  const token =
    req.query?.token ||
    req.headers['x-order-token'] ||
    req.body?.accessToken;
  if (token && order.accessToken && String(token) === String(order.accessToken)) {
    return true;
  }
  if (order.isGuest) {
    const sessionId = getSessionId(req);
    if (sessionId && order.cartSessionId && order.cartSessionId === sessionId) {
      return true;
    }
  }
  return false;
}

function canAccessPayment(payment, order, req) {
  if (req.user?.role === 'admin') return true;
  if (req.user && payment.user && payment.user.toString() === req.user._id.toString()) {
    return true;
  }
  if (order) return canAccessOrder(order, req);
  return false;
}

function isAbsoluteUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

/** Build Cashfree cart_details so hosted checkout shows the purchased items. */
function buildCashfreeCartDetails(order) {
  const rawItems = Array.isArray(order.items) ? order.items : [];
  if (rawItems.length === 0) return null;

  const itemsSum = rawItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const total = Number(order.totalAmount) || 0;
  let shippingCharge = parseFloat((total - itemsSum).toFixed(2));
  let priceScale = 1;
  if (shippingCharge < 0) {
    priceScale = itemsSum > 0 ? total / itemsSum : 1;
    shippingCharge = 0;
  }

  const cart_items = rawItems.map((item, idx) => {
    const qty = Number(item.quantity) || 1;
    const original = Number(item.price) || 0;
    const discounted = parseFloat((original * priceScale).toFixed(2));
    const productId = item.product ? String(item.product) : `item${idx + 1}`;
    const row = {
      item_id: productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || `item${idx + 1}`,
      item_name: String(item.name || 'Item').slice(0, 100),
      item_original_unit_price: parseFloat(original.toFixed(2)),
      item_discounted_unit_price: discounted,
      item_quantity: qty,
      item_currency: 'INR',
    };
    if (isAbsoluteUrl(item.image)) row.item_image_url = item.image;
    return row;
  });

  const computed =
    cart_items.reduce((sum, item) => sum + item.item_discounted_unit_price * item.item_quantity, 0) +
    shippingCharge;
  const drift = parseFloat((total - computed).toFixed(2));
  if (Number.isFinite(drift) && drift !== 0) {
    shippingCharge = parseFloat((shippingCharge + drift).toFixed(2));
    if (shippingCharge < 0) shippingCharge = 0;
  }

  const addr = order.shippingAddress || {};
  const details = {
    cart_name: String(order.orderId || 'ReSip India').slice(0, 100),
    shipping_charge: shippingCharge,
    cart_items,
  };

  if (addr.fullName && addr.addressLine1 && addr.city && addr.pincode) {
    details.customer_shipping_address = {
      name: String(addr.fullName).slice(0, 100),
      address_1: String(addr.addressLine1).slice(0, 255),
      address_2: String(addr.addressLine2 || '').slice(0, 255),
      city: String(addr.city).slice(0, 100),
      state: String(addr.state || '').slice(0, 100),
      country: String(addr.country || 'India').slice(0, 100),
      pincode: String(addr.pincode).slice(0, 10),
    };
  }

  return details;
}

async function finalizeSuccessfulPayment(payment, order, bodyData) {
  payment.status = 'success';
  if (bodyData) payment.gatewayResponse = bodyData;
  await payment.save();

  if (!order) return;

  order.paymentStatus = 'paid';
  order.orderStatus = 'Confirmed';
  order.statusHistory.push({
    status: 'Confirmed',
    note: 'Payment received via Cashfree',
  });
  await order.save();

  for (const item of order.items) {
    const inventory = await Inventory.findOne({ product: item.product });
    if (inventory) {
      await inventory.reduceSaleStock(item.quantity, order._id);
    } else {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }
  }

  if (order.user) {
    await Cart.findOneAndDelete({ user: order.user });
  } else if (order.cartSessionId) {
    await Cart.findOneAndDelete({ sessionId: order.cartSessionId });
  }

  // Online: award Carbon Points when paid
  await carbonService.awardEarnPoints(order);

  const user = order.user ? await User.findById(order.user) : null;
  const contact = user || carbonService.guestContactFromOrder(order);
  if (contact?.email) {
    const claim = await Payment.findOneAndUpdate(
      { _id: payment._id, confirmationEmailsSent: { $ne: true } },
      { $set: { confirmationEmailsSent: true } }
    );
    if (claim) {
      Promise.allSettled([
        emailService.sendCustomerOrderConfirmation(order, payment, contact),
        emailService.sendAdminOrderNotification(order, payment, contact),
      ]).catch(() => {});
    }
  }
}

async function finalizeFailedPayment(payment, order, bodyData) {
  payment.status = 'failed';
  if (bodyData) payment.gatewayResponse = bodyData;
  await payment.save();

  if (order) {
    order.paymentStatus = 'failed';
    await order.save();

    // Restore any redeemed points so the customer is not stuck.
    await carbonService.reversePointsForOrder(order, 'Payment failed');

    const user = order.user ? await User.findById(order.user) : null;
    const contact = user || carbonService.guestContactFromOrder(order);
    if (contact?.email) {
      await emailService.sendPaymentFailed(order, contact);
    }
  }
}

// @desc    Initiate Cashfree payment
// @route   POST /api/payments/initiate
const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({
    $or: [
      { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : undefined },
      { orderId },
    ],
  });

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  if (!canAccessOrder(order, req)) {
    throw new ApiError('Not authorized to pay for this order', 403);
  }

  if (order.paymentStatus === 'paid') {
    throw new ApiError('Order is already paid', 400);
  }

  if (order.paymentMethod === 'cod') {
    throw new ApiError('COD orders do not need online payment', 400);
  }

  const cfMerchantOrderId = `RSP${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  let baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  baseUrl = baseUrl.replace(/\/$/, '');

  const returnUrl = `${baseUrl}/payment/pending?order_id={order_id}`;
  const notifyUrl = `${baseUrl}/api/payments/callback`;

  const user = order.user ? await User.findById(order.user) : null;
  const customerEmail =
    user?.email || order.guestEmail || '';
  const customerPhone =
    user?.phone || order.guestPhone || order.shippingAddress?.phone || '9999999999';
  const customerName =
    user?.name || order.guestName || order.shippingAddress?.fullName || 'Customer';
  const customerId = user
    ? user._id.toString()
    : `guest${order.cartSessionId || order._id.toString()}`;

  const payment = await Payment.create({
    order: order._id,
    user: order.user || undefined,
    transactionId: cfMerchantOrderId,
    gatewayOrderId: '',
    amount: order.totalAmount,
    method: 'cashfree',
    status: 'initiated',
  });

  order.transactionId = cfMerchantOrderId;
  order.cashfreeOrderId = cfMerchantOrderId;
  await order.save();

  let result;
  try {
    result = await cashfreeService.createOrder({
      orderId: cfMerchantOrderId,
      amount: order.totalAmount,
      customerDetails: {
        id: customerId,
        email: customerEmail,
        phone: customerPhone,
        name: customerName,
      },
      returnUrl,
      notifyUrl,
      cartDetails: buildCashfreeCartDetails(order),
    });
  } catch (err) {
    payment.status = 'failed';
    await payment.save();
    throw new ApiError(err.message || 'Payment initiation failed', 502);
  }

  if (!result.success || !result.paymentSessionId) {
    payment.status = 'failed';
    await payment.save();
    throw new ApiError('Payment initiation failed', 500);
  }

  payment.gatewayOrderId = result.cfOrderId || '';
  await payment.save();

  res.status(200).json({
    success: true,
    paymentSessionId: result.paymentSessionId,
    cfOrderId: result.cfOrderId,
    merchantOrderId: cfMerchantOrderId,
    accessToken: order.accessToken,
    orderId: order.orderId,
    cashfreeEnv: cashfreeService.isProduction ? 'production' : 'sandbox',
  });
});

// @desc    Cashfree webhook callback
// @route   POST /api/payments/callback
const paymentCallback = asyncHandler(async (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const rawBody = req.rawBody || '';

  const isValid = cashfreeService.verifyWebhook(signature, rawBody, timestamp);
  if (!isValid) {
    console.error('Invalid Cashfree webhook signature');
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const eventType = body?.type;
  const orderData = body?.data?.order;

  const transactionId = orderData?.order_id;
  if (!transactionId) {
    return res.status(400).json({ success: false, message: 'Missing order_id' });
  }

  const payment = await Payment.findOne({ transactionId });
  if (!payment) {
    console.error('Payment not found for Cashfree order:', transactionId);
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  if (payment.status === 'success' || payment.status === 'failed') {
    return res.status(200).json({ success: true, message: 'Already processed' });
  }

  const order = await Order.findById(payment.order);

  const isSuccess =
    eventType === 'PAYMENT_SUCCESS_WEBHOOK' ||
    orderData?.order_status === 'PAID';

  if (isSuccess) {
    await finalizeSuccessfulPayment(payment, order, body?.data || {});
  } else {
    await finalizeFailedPayment(payment, order, body?.data || {});
  }

  res.status(200).json({ success: true });
});

// @desc    Check payment status
// @route   GET /api/payments/status/:transactionId
const getPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({
    transactionId: req.params.transactionId,
  }).populate('order');

  if (!payment) {
    throw new ApiError('Payment not found', 404);
  }

  const order = payment.order;
  if (!canAccessPayment(payment, order, req)) {
    throw new ApiError('Not authorized', 403);
  }

  if (payment.status === 'initiated' || payment.status === 'pending') {
    try {
      const statusResult = await cashfreeService.getOrderStatus(req.params.transactionId);
      if (statusResult.status !== 'pending') {
        const freshOrder = await Order.findById(payment.order?._id || payment.order);
        if (statusResult.status === 'success') {
          await finalizeSuccessfulPayment(payment, freshOrder, statusResult.data);
        } else {
          await finalizeFailedPayment(payment, freshOrder, statusResult.data);
        }
      }
    } catch (err) {
      console.error('Cashfree status check failed:', err.message);
    }
  }

  const refreshed = await Payment.findById(payment._id).populate(
    'order',
    'orderId orderStatus totalAmount accessToken paymentStatus isGuest'
  );

  res.status(200).json({
    success: true,
    payment: {
      transactionId: refreshed.transactionId,
      amount: refreshed.amount,
      status: refreshed.status,
      method: refreshed.method,
      order: refreshed.order,
      createdAt: refreshed.createdAt,
    },
  });
});

module.exports = {
  initiatePayment,
  paymentCallback,
  getPaymentStatus,
};
