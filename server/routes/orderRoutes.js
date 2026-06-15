// ============================================================
// Order Routes
// ============================================================
const express = require('express');
const router  = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',           protect, createOrder);
router.get('/my-orders',   protect, getMyOrders);
router.get('/:id',         protect, getOrderById);

// Admin routes
router.get('/',            protect, adminOnly, getAllOrders);
router.put('/:id',         protect, adminOnly, updateOrderStatus);
router.delete('/:id',      protect, adminOnly, deleteOrder);

module.exports = router;
