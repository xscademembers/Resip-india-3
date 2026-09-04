const mongoose = require('mongoose');

/**
 * Append-only ledger for Carbon Points.
 * Balance on User.carbonPoints is the source of truth for the wallet;
 * ledger rows exist for audit / history.
 */
const carbonLedgerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      index: true,
    },
    type: {
      type: String,
      enum: ['earn', 'redeem', 'reverse'],
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    /** Rupee value associated with this movement (1 point = ₹1). */
    amountInr: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

carbonLedgerSchema.index({ user: 1, createdAt: -1 });
carbonLedgerSchema.index({ order: 1, type: 1 });

module.exports = mongoose.model('CarbonLedger', carbonLedgerSchema);
