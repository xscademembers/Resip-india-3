const User = require('../models/User');
const Address = require('../models/Address');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

// @desc    Update profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, user });
});

// @desc    Change password
// @route   PUT /api/users/password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const { currentPassword, newPassword } = req.body;

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ApiError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password changed successfully' });
});

// @desc    Get user addresses
// @route   GET /api/users/addresses
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort('-isDefault -createdAt');
  res.status(200).json({ success: true, addresses });
});

// @desc    Add address
// @route   POST /api/users/addresses
const addAddress = asyncHandler(async (req, res) => {
  req.body.user = req.user._id;

  // If first address, make it default
  const count = await Address.countDocuments({ user: req.user._id });
  if (count === 0) req.body.isDefault = true;

  const address = await Address.create(req.body);
  res.status(201).json({ success: true, address });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:id
const updateAddress = asyncHandler(async (req, res) => {
  let address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    throw new ApiError('Address not found', 404);
  }

  address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, address });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    throw new ApiError('Address not found', 404);
  }

  // If deleted address was default, set another as default
  if (address.isDefault) {
    const first = await Address.findOne({ user: req.user._id });
    if (first) {
      first.isDefault = true;
      await first.save();
    }
  }

  res.status(200).json({ success: true, message: 'Address deleted' });
});

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    throw new ApiError('Address not found', 404);
  }

  // Unset all others
  await Address.updateMany(
    { user: req.user._id },
    { isDefault: false }
  );

  address.isDefault = true;
  await address.save();

  res.status(200).json({ success: true, address });
});

// @desc    Get wishlist
// @route   GET /api/users/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'name slug price images glassSetPricing categoryName isFeatured'
  );

  if (!wishlist) {
    wishlist = { products: [] };
  }

  res.status(200).json({ success: true, wishlist });
});

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:productId
const toggleWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [req.params.productId],
    });
    return res.status(200).json({
      success: true,
      action: 'added',
      wishlist,
    });
  }

  const idx = wishlist.products.indexOf(req.params.productId);
  if (idx > -1) {
    wishlist.products.splice(idx, 1);
    await wishlist.save();
    return res.status(200).json({ success: true, action: 'removed', wishlist });
  }

  wishlist.products.push(req.params.productId);
  await wishlist.save();
  res.status(200).json({ success: true, action: 'added', wishlist });
});

// @desc    Get order history
// @route   GET /api/users/orders
const getOrderHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Carbon Points balance + recent ledger
// @route   GET /api/users/carbon-points
const getCarbonPoints = asyncHandler(async (req, res) => {
  const CarbonLedger = require('../models/CarbonLedger');
  const user = await User.findById(req.user._id).select('carbonPoints name email');
  const ledger = await CarbonLedger.find({ user: req.user._id })
    .sort('-createdAt')
    .limit(30)
    .populate('order', 'orderId totalAmount');

  res.status(200).json({
    success: true,
    carbonPoints: user?.carbonPoints || 0,
    ledger,
  });
});

module.exports = {
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getWishlist,
  toggleWishlist,
  getOrderHistory,
  getCarbonPoints,
};
