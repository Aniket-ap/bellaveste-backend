const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity, variant } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check stock
  if (product.totalStock < quantity) {
     return next(new AppError('Not enough stock', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Check if product already in cart with same variant
  const itemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId && 
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, variant });
  }
  
  await cart.save();
  
  // Recalculate total price
  cart = await cart.populate('items.product');
  
  cart.totalPrice = cart.items.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);
  
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { itemId, quantity } = req.body;
  
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return next(new AppError('Cart not found', 404));

  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  
  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  
  // Recalculate total
  cart = await cart.populate('items.product');
  cart.totalPrice = cart.items.reduce((acc, item) => {
     return acc + (item.product.price * item.quantity);
  }, 0);
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

exports.removeItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return next(new AppError('Cart not found', 404));

  cart.items = cart.items.filter(item => item._id.toString() !== itemId);

  await cart.save();
  
  // Recalculate total
  cart = await cart.populate('items.product');
  cart.totalPrice = cart.items.reduce((acc, item) => {
     return acc + (item.product.price * item.quantity);
  }, 0);
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }
  res.status(204).json({ status: 'success', data: null });
});
