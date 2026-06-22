const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Cart = require('../models/Cart');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');
const phonePeService = require('../services/phonePeService');
const emailService = require('../services/emailService');

// @desc    Initiate PhonePe payment
// @route   POST /api/payments/initiate
const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({
    $or: [
      { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : undefined },
      { orderId },
    ],
    user: req.user._id,
  });

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  if (order.paymentStatus === 'paid') {
    throw new ApiError('Order is already paid', 400);
  }

  // Generate a unique merchant order ID (V2 uses merchantOrderId).
  const merchantOrderId = `RSP${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // After payment, PhonePe redirects the user here; this page polls the status.
  // Derive the return URL from the live request origin — the single server hosts
  // both the app and the API, so this always matches the running host/port and
  // avoids stale CLIENT_URL mismatches. PUBLIC_URL overrides for custom domains.
  const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUrl = `${baseUrl.replace(/\/$/, '')}/payment/pending?transactionId=${merchantOrderId}`;

  // Create payment record
  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    transactionId: merchantOrderId,
    phonePeMerchantTransactionId: merchantOrderId,
    amount: order.totalAmount,
    method: 'phonepe',
    status: 'initiated',
  });

  // Update order with transaction ID
  order.transactionId = merchantOrderId;
  order.phonePeTransactionId = merchantOrderId;
  await order.save();

  // Initiate PhonePe payment (V2 Standard Checkout)
  const result = await phonePeService.initiatePayment({
    merchantOrderId,
    amount: order.totalAmount,
    redirectUrl,
  });

  if (!result.success || !result.redirectUrl) {
    payment.status = 'failed';
    await payment.save();
    throw new ApiError('Payment initiation failed', 500);
  }

  res.status(200).json({
    success: true,
    redirectUrl: result.redirectUrl,
    merchantTransactionId: merchantOrderId,
  });
});

// @desc    PhonePe V2 webhook callback
// @route   POST /api/payments/callback
const paymentCallback = asyncHandler(async (req, res) => {
  // V2 webhooks are authenticated via the Authorization header
  // (SHA256 of the username:password configured in the PhonePe dashboard).
  const isValid = phonePeService.verifyCallback(req.headers['authorization']);
  if (!isValid) {
    console.error('Invalid PhonePe callback authorization');
    return res.status(401).json({ success: false, message: 'Invalid authorization' });
  }

  // V2 payload: { event, payload: { merchantOrderId, state, ... } }.
  const payload = req.body?.payload || req.body;
  const transactionId =
    payload?.merchantOrderId || payload?.merchantTransactionId || req.body?.merchantOrderId;

  if (!transactionId) {
    return res.status(400).json({ success: false, message: 'Missing transaction ID' });
  }

  // Find payment
  const payment = await Payment.findOne({ transactionId });
  if (!payment) {
    console.error('Payment not found for transaction:', transactionId);
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  // Idempotency — skip if already processed
  if (payment.status === 'success' || payment.status === 'failed') {
    return res.status(200).json({ success: true, message: 'Already processed' });
  }

  // Verify payment status with PhonePe
  const statusResult = await phonePeService.checkStatus(transactionId);

  const order = await Order.findById(payment.order);
  const user = await User.findById(payment.user);

  if (statusResult.status === 'success') {
    // Payment successful
    payment.status = 'success';
    payment.gatewayResponse = statusResult.data;
    await payment.save();

    if (order) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'Confirmed';
      order.statusHistory.push({
        status: 'Confirmed',
        note: 'Payment received',
      });
      await order.save();

      // Reduce inventory
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

      // Clear user's cart
      await Cart.findOneAndDelete({ user: payment.user });

      // Send emails
      if (user) {
        await emailService.sendPaymentSuccess(order, payment, user);
        await emailService.sendOrderConfirmation(order, user);
      }
    }
  } else {
    // Payment failed
    payment.status = 'failed';
    payment.gatewayResponse = statusResult.data;
    await payment.save();

    if (order) {
      order.paymentStatus = 'failed';
      await order.save();

      if (user) {
        await emailService.sendPaymentFailed(order, user);
      }
    }
  }

  res.status(200).json({ success: true });
});

// @desc    Check payment status
// @route   GET /api/payments/status/:transactionId
const getPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({
    transactionId: req.params.transactionId,
  }).populate('order', 'orderId orderStatus totalAmount');

  if (!payment) {
    throw new ApiError('Payment not found', 404);
  }

  // Verify ownership
  if (
    payment.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError('Not authorized', 403);
  }

  // If still pending, check with PhonePe
  if (payment.status === 'initiated' || payment.status === 'pending') {
    try {
      const statusResult = await phonePeService.checkStatus(req.params.transactionId);
      if (statusResult.status !== 'pending') {
        // Process the result — simulate callback logic
        payment.status = statusResult.status === 'success' ? 'success' : 'failed';
        payment.gatewayResponse = statusResult.data;
        await payment.save();

        const order = await Order.findById(payment.order);
        if (order && statusResult.status === 'success') {
          order.paymentStatus = 'paid';
          order.orderStatus = 'Confirmed';
          order.statusHistory.push({ status: 'Confirmed', note: 'Payment verified' });
          await order.save();
        }
      }
    } catch (err) {
      // Status check failed — return current state
      console.error('PhonePe status check failed:', err.message);
    }
  }

  res.status(200).json({
    success: true,
    payment: {
      transactionId: payment.transactionId,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      order: payment.order,
      createdAt: payment.createdAt,
    },
  });
});

module.exports = {
  initiatePayment,
  paymentCallback,
  getPaymentStatus,
};
