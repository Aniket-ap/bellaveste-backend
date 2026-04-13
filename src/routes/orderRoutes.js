const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(orderController.createOrder)
  .get(authController.restrictTo('admin'), orderController.getAllOrders);

router.get('/my-orders', orderController.getMyOrders);

router
  .route('/:id')
  .get(orderController.getOrder);

router.patch(
  '/:id/pay',
  orderController.updateOrderToPaid
);

router.patch(
  '/:id/deliver',
  authController.restrictTo('admin'),
  orderController.updateOrderToDelivered
);

router.patch(
  '/:id/status',
  authController.restrictTo('admin'),
  orderController.updateOrderStatus
);

module.exports = router;
