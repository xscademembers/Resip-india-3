const Coupon = require('../models/Coupon');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

// @desc    Validate and apply coupon
// @route   POST /api/coupons/validate
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;

  if (!code) {
    throw new ApiError('Coupon code is required', 400);
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    throw new ApiError('Invalid coupon code', 404);
  }

  const validation = coupon.isValid(req.user._id, orderTotal || 0);
  if (!validation.valid) {
    throw new ApiError(validation.message, 400);
  }

  const discount = coupon.calculateDiscount(orderTotal || 0);

  res.status(200).json({
    success: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      description: coupon.description,
    },
  });
});

module.exports = { validateCoupon };
