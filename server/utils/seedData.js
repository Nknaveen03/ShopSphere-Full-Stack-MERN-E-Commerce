const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Product  = require('../models/Product');
const User     = require('../models/User');
const products = require('./products');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} products`);

    await User.deleteOne({ email: 'admin@shopsphere.com' });
    await User.create({
      name: 'Admin User',
      email: 'admin@shopsphere.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@shopsphere.com / Admin@123');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
