// ============================================================
// Order Controller
// ============================================================
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

// ─── @desc    Create new order
// ─── @route   POST /api/orders
// ─── @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock and build order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({ message: 'A product in your cart no longer exists' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.title}". Available: ${product.stock}`,
        });
      }

      orderItems.push({
        product:  product._id,
        title:    product.title,
        image:    product.image,
        price:    item.price,
        quantity: item.quantity,
      });
    }

    // Calculate pricing
    const itemsPrice    = cart.totalAmount;
    const shippingPrice = itemsPrice > 999 ? 0 : 99; // Free shipping over ₹999
    const taxPrice      = Math.round(itemsPrice * 0.18 * 100) / 100; // 18% GST
    const totalAmount   = itemsPrice + shippingPrice + taxPrice;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalAmount,
    });

    // Reduce stock for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// ─── @desc    Get logged-in user's orders
// ─── @route   GET /api/orders/my-orders
// ─── @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'title image');

    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ─── @desc    Get order by ID
// ─── @route   GET /api/orders/:id
// ─── @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user can only view their own orders (unless admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// ─── @desc    Get all orders (Admin)
// ─── @route   GET /api/orders
// ─── @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({ orders, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders };
