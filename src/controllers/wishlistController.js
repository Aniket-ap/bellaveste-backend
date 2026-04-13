const Wishlist = require('../models/wishlistModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

exports.getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }
  res.status(200).json({
    status: 'success',
    data: {
      wishlist
    }
  });
});

exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      wishlist
    }
  });
});

exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) return next(new AppError('Wishlist not found', 404));

  wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
  await wishlist.save();

  res.status(200).json({
    status: 'success',
    data: {
      wishlist
    }
  });
});
