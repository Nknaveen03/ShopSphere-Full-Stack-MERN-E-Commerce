// ============================================================
// Order Routes
// ============================================================
const express = require('express');
const router  = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',           protect, createOrder);
router.get('/my-orders',   protect, getMyOrders);
router.get('/:id',         protect, getOrderById);
router.get('/',            protect, adminOnly, getAllOrders); // Admin: all orders

module.exports = router;
