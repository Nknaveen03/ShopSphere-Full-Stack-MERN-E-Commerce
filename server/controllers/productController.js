// ============================================================
// Product Controller
// ============================================================
const Product = require('../models/Product');

// ─── @desc    Get all products with search, filter, pagination
// ─── @route   GET /api/products
// ─── @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      page     = 1,
      limit    = 12,
      sort     = '-createdAt',
    } = req.query;

    // Build query
    const query = {};

    // Search by keyword (text search)
    if (keyword) {
      query.$or = [
        { title:       { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand:       { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort options
    const sortOptions = {
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'rating':     { rating: -1 },
      'newest':     { createdAt: -1 },
    };
    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    // Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortQuery).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      pagination: {
        total,
        page:       pageNum,
        pages:      Math.ceil(total / limitNum),
        limit:      limitNum,
        hasNext:    pageNum < Math.ceil(total / limitNum),
        hasPrev:    pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// ─── @desc    Get featured products
// ─── @route   GET /api/products/featured
// ─── @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products' });
  }
};

// ─── @desc    Get single product by ID
// ─── @route   GET /api/products/:id
// ─── @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// ─── @desc    Get all categories
// ─── @route   GET /api/products/categories
// ─── @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// ─── @desc    Create a product (Admin)
// ─── @route   POST /api/products
// ─── @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// ─── @desc    Update a product (Admin)
// ─── @route   PUT /api/products/:id
// ─── @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// ─── @desc    Delete a product (Admin)
// ─── @route   DELETE /api/products/:id
// ─── @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
