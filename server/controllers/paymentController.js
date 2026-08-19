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

// @desc    Initiate Cashfree payment
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

  // Generate a unique Cashfree order ID per payment attempt.
  const cfMerchantOrderId = `RSP${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // Build the return URL   Cashfree appends ?order_id=... automatically.
  // Use PUBLIC_URL if defined, otherwise construct from request headers.
  // If behind a proxy (like Render), req.protocol is correctly set to 'https' 
  // because of `app.set('trust proxy', 1)` in server.js.
  let baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  baseUrl = baseUrl.replace(/\/$/, '');
  
  const returnUrl = `${baseUrl}/payment/pending?order_id={order_id}`;

  // Build the webhook URL for server-to-server notifications.
  const notifyUrl = `${baseUrl}/api/payments/callback`;

  // Get customer details from the authenticated user.
  const user = await User.findById(req.user._id);

  // Create payment record
  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    transactionId: cfMerchantOrderId,
    gatewayOrderId: '', // Will be updated after Cashfree responds
    amount: order.totalAmount,
    method: 'cashfree',
    status: 'initiated',
  });

  // Update order with transaction ID
  order.transactionId = cfMerchantOrderId;
  order.cashfreeOrderId = cfMerchantOrderId;
  await order.save();

  // Create Cashfree order
  const result = await cashfreeService.createOrder({
    orderId: cfMerchantOrderId,
    amount: order.totalAmount,
    customerDetails: {
      id: req.user._id.toString(),
      email: user?.email,
      phone: user?.phone || '9999999999',
      name: user?.name,
    },
    returnUrl,
    notifyUrl,
  });

  if (!result.success || !result.paymentSessionId) {
    payment.status = 'failed';
    await payment.save();
    throw new ApiError('Payment initiation failed', 500);
  }

  // Store the Cashfree cf_order_id
  payment.gatewayOrderId = result.cfOrderId || '';
  await payment.save();

  res.status(200).json({
    success: true,
    paymentSessionId: result.paymentSessionId,
    cfOrderId: result.cfOrderId,
    merchantOrderId: cfMerchantOrderId,
  });
});

// @desc    Cashfree webhook callback
// @route   POST /api/payments/callback
const paymentCallback = asyncHandler(async (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const rawBody = req.rawBody || '';

  const isValid = cashfreeService.verifyWebhook(signature, rawBody, timestamp);
  if (!isValid) {
    console.error('Invalid Cashfree webhook signature');
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }

  // Parse the webhook payload.
  // Cashfree sends: { type, data: { order: { order_id, ... }, payment: { ... } } }
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const eventType = body?.type;
  const orderData = body?.data?.order;
  const paymentData = body?.data?.payment;

  const transactionId = orderData?.order_id;
  if (!transactionId) {
    return res.status(400).json({ success: false, message: 'Missing order_id' });
  }

  // Find payment
  const payment = await Payment.findOne({ transactionId });
  if (!payment) {
    console.error('Payment not found for Cashfree order:', transactionId);
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  // Idempotency   skip if already processed
  if (payment.status === 'success' || payment.status === 'failed') {
    return res.status(200).json({ success: true, message: 'Already processed' });
  }

  const order = await Order.findById(payment.order);
  const user = await User.findById(payment.user);

  // Determine outcome from webhook event type or order status
  const isSuccess =
    eventType === 'PAYMENT_SUCCESS_WEBHOOK' ||
    orderData?.order_status === 'PAID';

  if (isSuccess) {
    // Payment successful
    payment.status = 'success';
    payment.gatewayResponse = body?.data || {};
    await payment.save();

    if (order) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'Confirmed';
      order.statusHistory.push({
        status: 'Confirmed',
        note: 'Payment received via Cashfree',
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

      // Send order confirmation emails exactly once. Atomically "claim" the
      // right to send so the webhook and status-check paths can't both send.
      if (user) {
        const claim = await Payment.findOneAndUpdate(
          { _id: payment._id, confirmationEmailsSent: { $ne: true } },
          { $set: { confirmationEmailsSent: true } }
        );
        if (claim) {
          Promise.allSettled([
            emailService.sendCustomerOrderConfirmation(order, payment, user),
            emailService.sendAdminOrderNotification(order, payment, user),
          ]).catch(() => {});
        }
      }
    }
  } else {
    // Payment failed
    payment.status = 'failed';
    payment.gatewayResponse = body?.data || {};
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

  // If still pending, check with Cashfree
  if (payment.status === 'initiated' || payment.status === 'pending') {
    try {
      const statusResult = await cashfreeService.getOrderStatus(req.params.transactionId);
      if (statusResult.status !== 'pending') {
        // Process the result
        payment.status = statusResult.status === 'success' ? 'success' : 'failed';
        payment.gatewayResponse = statusResult.data;
        await payment.save();

        const order = await Order.findById(payment.order);
        if (order && statusResult.status === 'success') {
          order.paymentStatus = 'paid';
          order.orderStatus = 'Confirmed';
          order.statusHistory.push({ status: 'Confirmed', note: 'Payment verified via Cashfree' });
          await order.save();

          // Clear cart on successful payment confirmation
          await Cart.findOneAndDelete({ user: payment.user });

          // Send confirmation emails exactly once. Atomically "claim" the right
          // to send so the webhook and status-check paths can't both send.
          const emailUser = await User.findById(payment.user);
          if (emailUser) {
            const claim = await Payment.findOneAndUpdate(
              { _id: payment._id, confirmationEmailsSent: { $ne: true } },
              { $set: { confirmationEmailsSent: true } }
            );
            if (claim) {
              Promise.allSettled([
                emailService.sendCustomerOrderConfirmation(order, payment, emailUser),
                emailService.sendAdminOrderNotification(order, payment, emailUser),
              ]).catch(() => {});
            }
          }
        }
      }
    } catch (err) {
      // Status check failed   return current state
      console.error('Cashfree status check failed:', err.message);
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
