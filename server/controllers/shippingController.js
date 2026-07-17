const delhiveryService = require('../services/delhiveryService');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

/** GET /api/shipping/pincode/:pincode — public pincode serviceability check */
const checkPincode = asyncHandler(async (req, res) => {
  if (!delhiveryService.isConfigured()) {
    throw new ApiError('Shipping service is not configured', 503);
  }

  const result = await delhiveryService.checkPincodeServiceability(req.params.pincode);
  res.status(200).json({ success: true, ...result });
});

module.exports = { checkPincode };
