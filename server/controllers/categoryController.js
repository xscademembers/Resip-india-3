const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

// @desc    Get all active categories
// @route   GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ sortOrder: 1 })
    .populate('subcategories');

  res.status(200).json({ success: true, categories });
});

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    $or: [{ slug: req.params.slug }, { legacyId: req.params.slug }],
    isActive: true,
  });

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  res.status(200).json({ success: true, category });
});

module.exports = { getCategories, getCategory };
