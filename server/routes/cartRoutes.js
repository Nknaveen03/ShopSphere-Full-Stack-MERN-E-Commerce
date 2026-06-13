// ============================================================
// Cart Routes
// ============================================================
const express = require('express');
const router  = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.get('/',                    protect, getCart);
router.post('/add',                protect, addToCart);
router.put('/update',              protect, updateCartItem);
router.delete('/clear',            protect, clearCart);
router.delete('/remove/:productId', protect, removeFromCart);

module.exports = router;
