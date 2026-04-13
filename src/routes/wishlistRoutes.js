const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(wishlistController.getWishlist)
  .post(wishlistController.addToWishlist);

router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
