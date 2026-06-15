// server/routes/seedRoute.js
const express = require('express');
const Product = require('../models/Product');
const User    = require('../models/User');

const router = express.Router();

const sampleProducts = [
  { title: 'Wireless Noise-Cancelling Headphones', price: 2999, category: 'Electronics', brand: 'SoundMax', stock: 50, rating: 4.5, numReviews: 128, description: 'Premium wireless headphones with ANC technology', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', isFeatured: true },
  { title: 'Mechanical Gaming Keyboard', price: 1499, category: 'Electronics', brand: 'KeyTech', stock: 35, rating: 4.3, numReviews: 89, description: 'RGB mechanical keyboard with Cherry MX switches', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', isFeatured: true },
  { title: 'Wireless Charging Pad', price: 899, category: 'Electronics', brand: 'ChargeFast', stock: 65, rating: 4.3, numReviews: 211, description: '15W fast wireless charger, Qi compatible', image: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=400', isFeatured: true },
  { title: 'Portable Bluetooth Speaker', price: 1799, category: 'Electronics', brand: 'SoundMax', stock: 45, rating: 4.2, numReviews: 76, description: 'Waterproof speaker with 20hr battery life', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', isFeatured: true },
  { title: 'Laptop Stand Adjustable', price: 1299, category: 'Electronics', brand: 'DeskPro', stock: 55, rating: 4.6, numReviews: 143, description: 'Aluminum adjustable laptop stand, fits 11-17"', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', isFeatured: true },
  { title: 'USB-C Hub 7-in-1', price: 1099, category: 'Electronics', brand: 'DeskPro', stock: 75, rating: 4.4, numReviews: 223, description: 'HDMI 4K, 3x USB-A, SD card, PD charging', image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400', isFeatured: true },
  { title: 'Smart LED Desk Lamp', price: 1299, category: 'Electronics', brand: 'ChargeFast', stock: 50, rating: 4.5, numReviews: 167, description: 'Touch dimmer, colour temp control, USB charging port', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
  { title: "Men's Cotton T-Shirt Pack", price: 999, category: 'Clothing', brand: 'BasicWear', stock: 150, rating: 4.3, numReviews: 534, description: 'Pack of 3 premium 100% cotton tees', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
  { title: 'Tote Bag Canvas', price: 449, category: 'Clothing', brand: 'BasicWear', stock: 200, rating: 4.7, numReviews: 512, description: 'Heavy-duty canvas tote, 15L capacity', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400' },
  { title: 'Running Shoes', price: 2499, category: 'Sports', brand: 'StridePro', stock: 80, rating: 4.5, numReviews: 289, description: 'Lightweight cushioned running shoes for all terrain', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { title: 'Yoga Mat Pro', price: 899, category: 'Sports', brand: 'ZenFit', stock: 75, rating: 4.4, numReviews: 167, description: 'Non-slip 6mm thick premium yoga mat', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
  { title: 'Stainless Steel Water Bottle', price: 399, category: 'Sports', brand: 'HydroLife', stock: 200, rating: 4.6, numReviews: 312, description: 'Insulated 1L bottle keeps drinks cold 24hrs', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' },
  { title: 'Resistance Band Set', price: 599, category: 'Sports', brand: 'ZenFit', stock: 130, rating: 4.5, numReviews: 267, description: 'Set of 5 bands, 10-50 lbs resistance levels', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400' },
  { title: 'Sports Duffel Bag', price: 1599, category: 'Sports', brand: 'StridePro', stock: 45, rating: 4.3, numReviews: 134, description: '40L waterproof duffel with shoe compartment', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { title: 'Jump Rope Speed', price: 349, category: 'Sports', brand: 'ZenFit', stock: 160, rating: 4.5, numReviews: 389, description: 'Adjustable speed rope with ball bearings', image: 'https://images.unsplash.com/photo-1598875184988-5e67b1a874b8?w=400' },
  { title: 'Ceramic Coffee Mug Set', price: 799, category: 'Home & Garden', brand: 'BrewHouse', stock: 60, rating: 4.8, numReviews: 198, description: 'Set of 4 handcrafted ceramic mugs, 350ml each', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400' },
  { title: 'Scented Candle Collection', price: 699, category: 'Home & Garden', brand: 'AromaBliss', stock: 120, rating: 4.9, numReviews: 421, description: 'Set of 3 soy wax candles, 40hr burn each', image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?w=400' },
  { title: 'Digital Kitchen Scale', price: 499, category: 'Home & Garden', brand: 'KitchenPro', stock: 110, rating: 4.7, numReviews: 392, description: 'Accurate 5kg digital scale with tare function', image: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=400' },
  { title: 'Bamboo Cutting Board', price: 649, category: 'Home & Garden', brand: 'EcoKitchen', stock: 85, rating: 4.8, numReviews: 329, description: 'Large bamboo board with juice groove, eco-friendly', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
  { title: 'Air Fryer 4L', price: 3499, category: 'Home & Garden', brand: 'KitchenPro', stock: 30, rating: 4.6, numReviews: 312, description: 'Digital air fryer with 8 preset cooking modes', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400' },
  { title: 'Throw Blanket Knit', price: 1199, category: 'Home & Garden', brand: 'CozyNest', stock: 70, rating: 4.9, numReviews: 267, description: 'Chunky knit throw blanket, 130x150cm', image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400' },
  { title: 'Linen Cushion Covers', price: 549, category: 'Home & Garden', brand: 'CozyNest', stock: 90, rating: 4.6, numReviews: 274, description: 'Set of 2 washed linen cushion covers, 45x45cm', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
  { title: 'Face Moisturiser SPF50', price: 849, category: 'Beauty', brand: 'GlowLab', stock: 95, rating: 4.6, numReviews: 187, description: 'Lightweight daily moisturiser with SPF50 protection', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' },
  { title: 'Vitamin C Serum', price: 999, category: 'Beauty', brand: 'GlowLab', stock: 110, rating: 4.7, numReviews: 445, description: '20% Vitamin C brightening serum, 30ml', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400' },
  { title: 'Perfume Woody Oud', price: 2199, category: 'Beauty', brand: 'LensKraft', stock: 40, rating: 4.8, numReviews: 156, description: 'Long-lasting eau de parfum, 100ml', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400' },
  { title: 'Plant-Based Protein Powder', price: 1899, category: 'Beauty', brand: 'NutriForce', stock: 90, rating: 4.1, numReviews: 203, description: 'Chocolate flavour, 1kg, 25g protein per serving', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400' },
  { title: 'Desk Organiser Bamboo', price: 749, category: 'Automotive', brand: 'EcoKitchen', stock: 60, rating: 4.4, numReviews: 156, description: '6-compartment bamboo desk organiser', image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400' },
];

router.get('/', async (req, res) => {
  try {
    // Seed products
    await Product.deleteMany({});
    const inserted = await Product.insertMany(sampleProducts);

    // Seed admin user
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