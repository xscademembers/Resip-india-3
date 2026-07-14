const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

function attachGuestSessionHeader(res, cart) {
  if (cart?.sessionId) {
    res.setHeader('x-cart-session', cart.sessionId);
  }
}

// @desc    Get cart
// @route   GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart;

  if (req.user) {
    cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name slug price images stock glassSetPricing fragrances labelImageSurcharge categoryName'
    );
  } else {
    const sessionId = req.cookies?.cartSession || req.headers['x-cart-session'];
    if (sessionId) {
      cart = await Cart.findOne({ sessionId }).populate(
        'items.product',
        'name slug price images stock glassSetPricing fragrances labelImageSurcharge categoryName'
      );
    }
  }

  if (!cart) {
    cart = { items: [], totalItems: 0, subtotal: 0 };
  }

  attachGuestSessionHeader(res, cart);
  res.status(200).json({ success: true, cart });
});

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, setSize, fragrance, labelType } = req.body;

  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new ApiError('Insufficient stock', 400);
  }

  // Calculate price based on options
  let price = product.price;
  if (product.glassSetPricing) {
    const p = product.glassSetPricing;
    if (p.format === '24') {
      price = setSize === 4 ? p.setOf4 : p.setOf2;
    } else if (p.format === '612') {
      price = setSize === 12 ? p.setOf12 : p.setOf6;
    }
  }
  if (labelType === 'image' && product.labelImageSurcharge) {
    price += product.labelImageSurcharge;
  }

  let cart;
  const cartQuery = req.user
    ? { user: req.user._id }
    : { sessionId: req.cookies?.cartSession || req.headers['x-cart-session'] };

  cart = await Cart.findOne(cartQuery);

  if (!cart) {
    // Create new cart
    const cartData = {
      items: [{ product: productId, quantity, setSize, fragrance, labelType, price }],
    };

    if (req.user) {
      cartData.user = req.user._id;
    } else {
      const sessionId = require('crypto').randomBytes(16).toString('hex');
      cartData.sessionId = sessionId;
      res.cookie('cartSession', sessionId, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });
    }

    cart = await Cart.create(cartData);
  } else {
    // Check if item already exists (same product + same options)
    const existingIdx = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.setSize === setSize &&
        item.fragrance === fragrance &&
        item.labelType === labelType
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
      cart.items[existingIdx].price = price;
    } else {
      cart.items.push({ product: productId, quantity, setSize, fragrance, labelType, price });
    }

    await cart.save();
  }

  cart = await Cart.findById(cart._id).populate(
    'items.product',
    'name slug price images stock glassSetPricing fragrances labelImageSurcharge categoryName'
  );

  attachGuestSessionHeader(res, cart);
  res.status(200).json({ success: true, cart });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cartQuery = req.user
    ? { user: req.user._id }
    : { sessionId: req.cookies?.cartSession || req.headers['x-cart-session'] };

  const cart = await Cart.findOne(cartQuery);
  if (!cart) {
    throw new ApiError('Cart not found', 404);
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new ApiError('Item not found in cart', 404);
  }

  if (quantity <= 0) {
    cart.items.pull(req.params.itemId);
  } else {
    // Check stock
    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) {
      throw new ApiError('Insufficient stock', 400);
    }
    item.quantity = quantity;
  }

  await cart.save();

  const updated = await Cart.findById(cart._id).populate(
    'items.product',
    'name slug price images stock glassSetPricing fragrances labelImageSurcharge categoryName'
  );

  attachGuestSessionHeader(res, updated);
  res.status(200).json({ success: true, cart: updated });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
const removeCartItem = asyncHandler(async (req, res) => {
  const cartQuery = req.user
    ? { user: req.user._id }
    : { sessionId: req.cookies?.cartSession || req.headers['x-cart-session'] };

  const cart = await Cart.findOne(cartQuery);
  if (!cart) {
    throw new ApiError('Cart not found', 404);
  }

  cart.items.pull(req.params.itemId);
  await cart.save();

  const updated = await Cart.findById(cart._id).populate(
    'items.product',
    'name slug price images stock glassSetPricing fragrances labelImageSurcharge categoryName'
  );

  attachGuestSessionHeader(res, updated);
  res.status(200).json({ success: true, cart: updated });
});

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  const cartQuery = req.user
    ? { user: req.user._id }
    : { sessionId: req.cookies?.cartSession || req.headers['x-cart-session'] };

  await Cart.findOneAndDelete(cartQuery);

  res.status(200).json({ success: true, message: 'Cart cleared' });
});

// @desc    Merge guest cart into user cart after login
// @route   POST /api/cart/merge
const mergeCart = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId || !req.user) {
    return res.status(200).json({ success: true, message: 'Nothing to merge' });
  }

  const guestCart = await Cart.findOne({ sessionId });
  if (!guestCart || guestCart.items.length === 0) {
    return res.status(200).json({ success: true, message: 'No guest cart found' });
  }

  let userCart = await Cart.findOne({ user: req.user._id });

  if (!userCart) {
    // Transfer guest cart to user
    guestCart.user = req.user._id;
    guestCart.sessionId = undefined;
    await guestCart.save();
    userCart = guestCart;
  } else {
    // Merge items
    for (const guestItem of guestCart.items) {
      const existingIdx = userCart.items.findIndex(
        (item) =>
          item.product.toString() === guestItem.product.toString() &&
          item.setSize === guestItem.setSize &&
          item.fragrance === guestItem.fragrance &&
          item.labelType === guestItem.labelType
      );

      if (existingIdx > -1) {
        userCart.items[existingIdx].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    await userCart.save();
    await Cart.findByIdAndDelete(guestCart._id);
  }

  const updated = await Cart.findById(userCart._id).populate(
    'items.product',
    'name slug price images stock glassSetPricing fragrances labelImageSurcharge categoryName'
  );

  res.status(200).json({ success: true, cart: updated });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
};
