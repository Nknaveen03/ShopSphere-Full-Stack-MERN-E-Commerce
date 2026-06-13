// ============================================================
// Cart Controller
// ============================================================
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

// ─── @desc    Get user's cart
// ─── @route   GET /api/cart
// ─── @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'title image price stock'
    );

    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// ─── @desc    Add item to cart
// ─── @route   POST /api/cart/add
// ─── @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < 1) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      const newQty = cart.items[existingItemIndex].quantity + parseInt(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} items available` });
      }
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      // Add new item
      if (parseInt(quantity) > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} items available` });
      }
      cart.items.push({
        product:  productId,
        quantity: parseInt(quantity),
        price:    product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product', 'title image price stock');

    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// ─── @desc    Update cart item quantity
// ─── @route   PUT /api/cart/update
// ─── @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (parseInt(quantity) <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock
      const product = await Product.findById(productId);
      if (parseInt(quantity) > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} items available` });
      }
      cart.items[itemIndex].quantity = parseInt(quantity);
    }

    await cart.save();
    await cart.populate('items.product', 'title image price stock');

    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
};

// ─── @desc    Remove item from cart
// ─── @route   DELETE /api/cart/remove/:productId
// ─── @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product', 'title image price stock');

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

// ─── @desc    Clear entire cart
// ─── @route   DELETE /api/cart/clear
// ─── @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
