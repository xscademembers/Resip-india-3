const mongoose = require('mongoose');
const crypto = require('crypto');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  setSize: { type: Number },
  fragrance: { type: String },
  labelType: { type: String, enum: ['text', 'image'] },
  subtotal: { type: Number, required: true },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
      landmark: String,
    },
    billingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
      landmark: String,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    couponCode: String,
    couponDiscount: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    taxPercent: {
      type: Number,
      default: 18, // GST
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingCharge: {
      type: Number,
      default: 0,
    },
    codCharge: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cashfree', 'cod', 'upi', 'card', 'netbanking'],
      default: 'cashfree',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
    cashfreeOrderId: String,
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Packed',
        'Shipped',
        'Out For Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
        'Refunded',
      ],
      default: 'Pending',
    },
    trackingNumber: String,
    statusHistory: [statusHistorySchema],
    deliveredAt: Date,
    cancelledAt: Date,
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

// Auto-generate orderId before save
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.orderId = `RSP-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
