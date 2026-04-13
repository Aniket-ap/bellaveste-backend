const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  
  const sales = await Order.aggregate([
    {
      $match: { isPaid: true }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' }
      }
    }
  ]);

  const totalSales = sales.length > 0 ? sales[0].totalSales : 0;

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalOrders,
      totalProducts,
      totalSales
    }
  });
});
