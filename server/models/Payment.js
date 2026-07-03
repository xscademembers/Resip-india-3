const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    gatewayOrderId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    method: {
      type: String,
      enum: ['cashfree', 'upi', 'card', 'netbanking', 'wallet', 'cod'],
      default: 'cashfree',
    },
    status: {
      type: String,
      enum: ['initiated', 'success', 'failed', 'refunded', 'pending'],
      default: 'initiated',
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    refundId: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['none', 'initiated', 'completed', 'failed'],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
