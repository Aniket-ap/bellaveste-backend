const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.addToCart)
  .delete(cartController.clearCart);

router.patch('/update-item', cartController.updateCartItem);
router.delete('/remove-item/:itemId', cartController.removeItem);

module.exports = router;
