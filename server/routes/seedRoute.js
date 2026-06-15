const express = require('express');
const Product = require('../models/Product');
const User    = require('../models/User');

const router = express.Router();
const sampleProducts = require('../utils/products');

router.get('/', async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(sampleProducts);

    await User.deleteOne({ email: 'admin@shopsphere.com' });
    await User.create({
      name: 'Admin User',
      email: 'admin@shopsphere.com',
      password: 'Admin@123',
      role: 'admin',
    });

    res.json({
      message: '✅ Database seeded successfully!',
      productsCount: inserted.length,
      adminUser: 'admin@shopsphere.com / Admin@123'
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Seeding failed', error: error.message });
  }
});

module.exports = router;