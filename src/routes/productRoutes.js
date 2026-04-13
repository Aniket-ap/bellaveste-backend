const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(productController.aliasTopProducts, productController.getAllProducts);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    uploadMiddleware.uploadProductImages,
    uploadMiddleware.resizeProductImages,
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    uploadMiddleware.uploadProductImages,
    uploadMiddleware.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

module.exports = router;
