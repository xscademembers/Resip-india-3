const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    story: {
      type: String,
      default: '',
    },
    features: [{ type: String }],
    whyChooseHeading: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    categoryName: {
      type: String,
      default: '',
    },
    subcategory: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      default: '',
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    discountPercent: {
      type: Number,
      min: [0, 'Discount percent cannot be negative'],
      max: [100, 'Discount percent cannot exceed 100'],
    },
    images: [{ type: String }],
    beforeImage: {
      type: String,
      default: '',
    },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    variants: [
      {
        name: String,
        value: String,
        price: Number,
        stock: Number,
      },
    ],
    // ReSip-specific: glass set pricing
    glassSetPricing: {
      format: {
        type: String,
        enum: ['24', '612'],
      },
      setOf2: Number,
      setOf4: Number,
      setOf6: Number,
      setOf12: Number,
    },
    // ReSip-specific: candle options
    fragrances: [{ type: String }],
    labelImageSurcharge: {
      type: Number,
      default: 0,
    },
    usageTips: [{ type: String }],
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 100,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    // Legacy ID from constants.ts for backward compatibility
    legacyId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isTrending: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ legacyId: 1 });
productSchema.index({ isActive: 1, hidden: 1 });

// Auto-generate slug from name before save
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Virtual for primary image
productSchema.virtual('image').get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : '';
});

module.exports = mongoose.model('Product', productSchema);
