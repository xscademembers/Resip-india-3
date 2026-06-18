const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

// @desc    Get all products with filters, search, sort, pagination
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sort,
    page = 1,
    limit = 20,
  } = req.query;

  const query = { isActive: true, hidden: false };

  // Search by name/description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { categoryName: { $regex: search, $options: 'i' } },
    ];
  }

  // Category filter (by slug or ID)
  if (category && category !== 'All') {
    const cat = await Category.findOne({
      $or: [{ slug: category }, { name: category }],
    });
    if (cat) {
      query.category = cat._id;
    } else {
      query.categoryName = category;
    }
  }

  // Brand filter
  if (brand) {
    query.brand = { $regex: brand, $options: 'i' };
  }

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Rating filter
  if (rating) {
    query.averageRating = { $gte: parseFloat(rating) };
  }

  // In-stock filter
  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  // Sorting
  let sortOption = { sortOrder: 1, createdAt: -1 };
  if (sort) {
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { numReviews: -1, averageRating: -1 };
        break;
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const products = await Product.find({
    isFeatured: true,
    isActive: true,
    hidden: false,
  })
    .populate('category', 'name slug')
    .sort({ sortOrder: 1 })
    .limit(limit);

  res.status(200).json({ success: true, products });
});

// @desc    Get trending products
// @route   GET /api/products/trending
const getTrendingProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const products = await Product.find({
    isTrending: true,
    isActive: true,
    hidden: false,
  })
    .populate('category', 'name slug')
    .sort({ sortOrder: 1 })
    .limit(limit);

  res.status(200).json({ success: true, products });
});

// @desc    Get single product by slug or legacy ID
// @route   GET /api/products/:slugOrId
const getProduct = asyncHandler(async (req, res) => {
  const { slugOrId } = req.params;

  let product = await Product.findOne({
    $or: [{ slug: slugOrId }, { legacyId: slugOrId }, { _id: slugOrId.match(/^[0-9a-fA-F]{24}$/) ? slugOrId : undefined }],
    isActive: true,
    hidden: false,
  }).populate('category', 'name slug');

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  res.status(200).json({ success: true, product });
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
const getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Find product by slug, legacyId, or _id
  const product = await Product.findOne({
    $or: [
      { slug: req.params.id },
      { legacyId: req.params.id },
      { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined },
    ],
  });

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  const [reviews, total] = await Promise.all([
    Review.find({ product: product._id, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: product._id, isApproved: true }),
  ]);

  res.status(200).json({
    success: true,
    reviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [
      { slug: req.params.id },
      { legacyId: req.params.id },
      { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined },
    ],
  });

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  // Check if already reviewed
  const existingReview = await Review.findOne({
    product: product._id,
    user: req.user._id,
  });

  if (existingReview) {
    throw new ApiError('You have already reviewed this product', 400);
  }

  // Check if verified purchase
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': product._id,
    paymentStatus: 'paid',
  });

  const review = await Review.create({
    user: req.user._id,
    product: product._id,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    images: req.body.images || [],
    isVerifiedPurchase: !!hasPurchased,
  });

  res.status(201).json({ success: true, review });
});

// @desc    Update review
// @route   PUT /api/products/reviews/:id
const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to edit this review', 403);
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    {
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
      images: req.body.images,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, review });
});

// @desc    Delete review
// @route   DELETE /api/products/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  // Allow owner or admin
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError('Not authorized to delete this review', 403);
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Review deleted' });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getProduct,
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
};
