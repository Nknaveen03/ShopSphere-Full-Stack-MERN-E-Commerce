// ============================================================
// Admin Controller - Overview statistics
// ============================================================
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ─── @desc    Get dashboard summary statistics
// ─── @route   GET /api/admin/stats
// ─── @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.find({}),
    ]);

    // Calculate total revenue (sum of all orders that are not Cancelled)
    const totalRevenue = orders
      .filter((order) => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate recent orders (last 5)
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate count of products in each category for simple dashboard breakdown
    const categoriesCount = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      categoriesCount: categoriesCount.map(item => ({
        category: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching administrative statistics' });
  }
};

module.exports = { getDashboardStats };
