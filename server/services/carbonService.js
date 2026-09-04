const User = require('../models/User');
const CarbonLedger = require('../models/CarbonLedger');

/** ₹10 paid in cash = 1 Carbon Point. */
const RUPEES_PER_POINT = 10;
/** 1 Carbon Point = ₹1 off. */
const INR_PER_POINT = 1;

/**
 * Points earned from cash paid (after coupon + points discount).
 * Do not earn on rupees "paid" with redeemed points.
 */
function pointsFromCashPaid(cashPaidInr) {
  const amount = Math.max(0, Math.floor(Number(cashPaidInr) || 0));
  return Math.floor(amount / RUPEES_PER_POINT);
}

function discountFromPoints(points) {
  return Math.max(0, Math.floor(Number(points) || 0)) * INR_PER_POINT;
}

/**
 * Redeem points at order create time. Deducts from wallet and writes a ledger row.
 * Returns { pointsUsed, discountInr }.
 */
async function redeemPoints(userId, pointsRequested, orderId, maxDiscountInr) {
  const requested = Math.max(0, Math.floor(Number(pointsRequested) || 0));
  if (!userId || requested <= 0) {
    return { pointsUsed: 0, discountInr: 0 };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { pointsUsed: 0, discountInr: 0 };
  }

  const maxByBalance = Math.max(0, Math.floor(user.carbonPoints || 0));
  const maxByOrder = Math.max(0, Math.floor(Number(maxDiscountInr) || 0));
  const pointsUsed = Math.min(requested, maxByBalance, maxByOrder);
  if (pointsUsed <= 0) {
    return { pointsUsed: 0, discountInr: 0 };
  }

  const discountInr = discountFromPoints(pointsUsed);
  user.carbonPoints = Math.max(0, (user.carbonPoints || 0) - pointsUsed);
  await user.save();

  await CarbonLedger.create({
    user: userId,
    order: orderId,
    type: 'redeem',
    points: -pointsUsed,
    amountInr: -discountInr,
    note: `Redeemed ${pointsUsed} Carbon Points (−₹${discountInr})`,
  });

  return { pointsUsed, discountInr };
}

/**
 * Award earn points after payment success (online) or delivery (COD).
 * Idempotent via order.carbonPointsAwarded.
 */
async function awardEarnPoints(order) {
  if (!order || !order.user || order.isGuest) return 0;
  if (order.carbonPointsAwarded) return order.carbonPointsEarned || 0;

  // Cash paid = order total (already net of coupon + points discount).
  const cashPaid = Math.max(0, Number(order.totalAmount) || 0);
  const points = pointsFromCashPaid(cashPaid);
  if (points <= 0) {
    order.carbonPointsEarned = 0;
    order.carbonPointsAwarded = true;
    await order.save();
    return 0;
  }

  const user = await User.findById(order.user);
  if (!user) return 0;

  user.carbonPoints = (user.carbonPoints || 0) + points;
  await user.save();

  await CarbonLedger.create({
    user: order.user,
    order: order._id,
    type: 'earn',
    points,
    amountInr: cashPaid,
    note: `Earned ${points} Carbon Points from order ${order.orderId}`,
  });

  order.carbonPointsEarned = points;
  order.carbonPointsAwarded = true;
  await order.save();
  return points;
}

/**
 * Claw back earned points (and restore redeemed points) on cancel/refund.
 * Caps wallet at 0. Idempotent: only reverses if award happened or redeem happened.
 */
async function reversePointsForOrder(order, reason = 'Order cancelled/refunded') {
  if (!order || !order.user || order.isGuest) return;

  const user = await User.findById(order.user);
  if (!user) return;

  // Reverse earn if already awarded
  if (order.carbonPointsAwarded && (order.carbonPointsEarned || 0) > 0) {
    const earned = order.carbonPointsEarned;
    user.carbonPoints = Math.max(0, (user.carbonPoints || 0) - earned);
    await CarbonLedger.create({
      user: order.user,
      order: order._id,
      type: 'reverse',
      points: -earned,
      amountInr: 0,
      note: `Reversed earn of ${earned} points — ${reason}`,
    });
    order.carbonPointsEarned = 0;
    order.carbonPointsAwarded = false;
  }

  // Restore redeemed points
  if ((order.carbonPointsUsed || 0) > 0) {
    const used = order.carbonPointsUsed;
    const discount = order.carbonPointsDiscount || used;
    user.carbonPoints = (user.carbonPoints || 0) + used;
    await CarbonLedger.create({
      user: order.user,
      order: order._id,
      type: 'reverse',
      points: used,
      amountInr: discount,
      note: `Restored ${used} redeemed points — ${reason}`,
    });
    // If payment never completed, put the discount back so a retry is not undercharged.
    if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'refunded') {
      order.totalAmount = Math.max(0, (Number(order.totalAmount) || 0) + discount);
    }
    order.carbonPointsUsed = 0;
    order.carbonPointsDiscount = 0;
  }

  await user.save();
  await order.save();
}

/**
 * Build a lightweight contact object for emails when there is no User document.
 */
function guestContactFromOrder(order) {
  return {
    _id: null,
    name: order.guestName || order.shippingAddress?.fullName || 'Customer',
    email: order.guestEmail || '',
    phone: order.guestPhone || order.shippingAddress?.phone || '',
  };
}

module.exports = {
  RUPEES_PER_POINT,
  INR_PER_POINT,
  pointsFromCashPaid,
  discountFromPoints,
  redeemPoints,
  awardEarnPoints,
  reversePointsForOrder,
  guestContactFromOrder,
};
