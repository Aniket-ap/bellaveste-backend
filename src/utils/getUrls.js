const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/categoryModel');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const category = await Category.findOne();
    
    console.log('\n--- API Endpoints ---');
    console.log('1. Get All Products:');
    console.log('   http://localhost:5000/api/v1/products');
    
    console.log('\n2. Get All Categories:');
    console.log('   http://localhost:5000/api/v1/categories');

    if (category) {
      console.log(`\n3. Get Products by Category (${category.name}):`);
      console.log(`   http://localhost:5000/api/v1/products?category=${category._id}`);
    } else {
      console.log('\n3. Get Products by Category:');
      console.log('   (No categories found to generate example)');
    }
    console.log('---------------------\n');
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
});
