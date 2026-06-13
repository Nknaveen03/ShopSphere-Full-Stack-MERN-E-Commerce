// ============================================================
// Product Routes
// ============================================================
const express = require('express');
const router  = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/',            getProducts);
router.get('/featured',    getFeaturedProducts);
router.get('/categories',  getCategories);
router.get('/:id',         getProductById);

// Admin routes
router.post('/',       protect, adminOnly, createProduct);
router.put('/:id',     protect, adminOnly, updateProduct);
router.delete('/:id',  protect, adminOnly, deleteProduct);

module.exports = router;
