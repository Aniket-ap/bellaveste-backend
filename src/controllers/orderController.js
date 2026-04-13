const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const factory = require('./handlerFactory');

exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  // 1) Get items from cart
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return next(new AppError('No items in cart', 400));
  }

  // 2) Verify stock and prepare order items
  const orderItems = [];
  
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product) {
       return next(new AppError(`Product not found: ${item.product.name}`, 404));
    }
    
    // Check total stock (simplified)
    if (product.totalStock < item.quantity) {
       return next(new AppError(`Not enough stock for ${product.name}`, 400));
    }
    
    // Reduce stock
    product.totalStock -= item.quantity;
    await product.save({ validateBeforeSave: false });

    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      variant: item.variant
    });
  }

  // 3) Create Order
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: cart.totalPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentMethod === 'card' ? true : false,
    paidAt: paymentMethod === 'card' ? Date.now() : null,
    paymentResult: paymentMethod === 'card' ? { id: 'dummy_txn_id', status: 'completed' } : {},
    status: paymentMethod === 'card' ? 'processing' : 'pending'
  });

  // 4) Clear Cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.getOrder = factory.getOne(Order, { path: 'items.product' });
exports.getAllOrders = factory.getAll(Order); // For admin

exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address
  };

  const updatedOrder = await order.save();
  res.status(200).json({ status: 'success', data: { order: updatedOrder } });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'delivered';

  const updatedOrder = await order.save();
  res.status(200).json({ status: 'success', data: { order: updatedOrder } });
});
