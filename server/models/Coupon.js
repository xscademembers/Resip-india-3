const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Value cannot be negative'],
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number, // Cap for percentage discounts
      default: null,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // User-specific coupons
    applicableUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ code: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ isActive: 1 });

// Check if coupon is valid
couponSchema.methods.isValid = function (userId, orderTotal) {
  // Check active
  if (!this.isActive) return { valid: false, message: 'Coupon is not active' };

  // Check expiry
  if (new Date() > this.expiryDate)
    return { valid: false, message: 'Coupon has expired' };

  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit)
    return { valid: false, message: 'Coupon usage limit reached' };

  // Check if user already used
  if (this.usedBy.includes(userId))
    return { valid: false, message: 'You have already used this coupon' };

  // Check user-specific
  if (
    this.applicableUsers.length > 0 &&
    !this.applicableUsers.includes(userId)
  )
    return {
      valid: false,
      message: 'This coupon is not applicable to your account',
    };

  // Check minimum order value
  if (orderTotal < this.minOrderValue)
    return {
      valid: false,
      message: `Minimum order value is ₹${this.minOrderValue}`,
    };

  return { valid: true };
};

// Calculate discount
couponSchema.methods.calculateDiscount = function (orderTotal) {
  let discount = 0;
  if (this.type === 'percentage') {
    discount = (orderTotal * this.value) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.value;
  }
  return Math.min(discount, orderTotal);
};

module.exports = mongoose.model('Coupon', couponSchema);
