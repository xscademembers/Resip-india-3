const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['add', 'remove', 'adjust', 'sale', 'return', 'reserve', 'release'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    default: '',
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    stockHistory: [stockHistorySchema],
    lastRestocked: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

inventorySchema.index({ product: 1 });

// Virtual: available stock
inventorySchema.virtual('availableStock').get(function () {
  return this.stock - this.reservedStock;
});

// Virtual: is low stock
inventorySchema.virtual('isLowStock').get(function () {
  return this.stock <= this.lowStockThreshold;
});

// Method: reduce stock after sale
inventorySchema.methods.reduceSaleStock = function (quantity, orderId) {
  if (this.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  this.stock -= quantity;
  this.stockHistory.push({
    type: 'sale',
    quantity: -quantity,
    reason: 'Order placed',
    orderId,
  });
  return this.save();
};

// Method: restore stock after cancellation
inventorySchema.methods.restoreStock = function (quantity, orderId) {
  this.stock += quantity;
  this.stockHistory.push({
    type: 'return',
    quantity,
    reason: 'Order cancelled/returned',
    orderId,
  });
  return this.save();
};

module.exports = mongoose.model('Inventory', inventorySchema);
