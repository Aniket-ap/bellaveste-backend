const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Review = require('../models/reviewModel');
const Category = require('../models/categoryModel');
const Collection = require('../models/collectionModel');

dotenv.config({ path: './.env' });

// DB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('DB connection successful!');
});

// Dummy Data Generators
const users = [
  {
    name: 'Admin User',
    email: 'admin@bellaveste.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'admin',
    photo: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    photo: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    photo: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
  },
  {
    name: 'Mike Brown',
    email: 'mike@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    photo: 'https://ui-avatars.com/api/?name=Mike+Brown&background=random'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    photo: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random'
  },
  {
    name: 'David Lee',
    email: 'david@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
    photo: 'https://ui-avatars.com/api/?name=David+Lee&background=random'
  }
];

const categories = [
  {
    name: 'Men',
    description: 'Stylish clothing for men',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Women',
    description: 'Elegant fashion for women',
    image: 'https://images.unsplash.com/photo-1525845859779-54d477ff291f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Kids',
    description: 'Comfortable and fun clothes for kids',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80'
  }
];

const collections = [
  {
    name: 'Summer Collection',
    description: 'Cool styles for hot days',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Winter Essentials',
    description: 'Warm and cozy outfits',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
  }
];

// Product Templates
const menProducts = [
  { name: 'Classic Leather Jacket', price: 199.99, image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Slim Fit Denim Jeans', price: 59.99, image: 'https://images.unsplash.com/photo-1542272617-08f086303293?auto=format&fit=crop&w=800&q=80' },
  { name: 'Casual Cotton T-Shirt', price: 24.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
  { name: 'Formal Oxford Shirt', price: 49.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chino Pants', price: 44.99, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
  { name: 'Wool Blend Coat', price: 149.99, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80' },
  { name: 'Athletic Hoodie', price: 39.99, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Summer Shorts', price: 29.99, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Business Suit', price: 299.99, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80' },
  { name: 'Polo Shirt', price: 34.99, image: 'https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?auto=format&fit=crop&w=800&q=80' }
];

const womenProducts = [
  { name: 'Floral Summer Dress', price: 79.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' },
  { name: 'High-Waist Jeans', price: 64.99, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
  { name: 'Silk Blouse', price: 89.99, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pencil Skirt', price: 45.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cozy Knit Sweater', price: 55.99, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80' },
  { name: 'Evening Gown', price: 199.99, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Denim Jacket', price: 69.99, image: 'https://images.unsplash.com/photo-1527016021513-b09758b777da?auto=format&fit=crop&w=800&q=80' },
  { name: 'Activewear Leggings', price: 39.99, image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Trench Coat', price: 129.99, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bohemian Maxi Dress', price: 84.99, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' }
];

const kidsProducts = [
  { name: 'Cartoon Print T-Shirt', price: 19.99, image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Denim Overalls', price: 34.99, image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Colorful Hoodie', price: 29.99, image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Party Dress', price: 49.99, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cotton Pajamas', price: 24.99, image: 'https://images.unsplash.com/photo-1530735038726-a73fd6e6a349?auto=format&fit=crop&w=800&q=80' },
  { name: 'Winter Jacket', price: 59.99, image: 'https://images.unsplash.com/photo-1519238263496-63f82629f545?auto=format&fit=crop&w=800&q=80' },
  { name: 'School Uniform Set', price: 44.99, image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sports Jersey', price: 22.99, image: 'https://images.unsplash.com/photo-1513159446162-54eb8bdaf2e4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Raincoat', price: 39.99, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Swimwear', price: 19.99, image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80' }
];

const importData = async () => {
  try {
    // 1. Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Collection.deleteMany();
    await Review.deleteMany();
    console.log('Data destroyed...');

    // 2. Create Users
    console.log('Creating users...');
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const regularUsers = createdUsers.filter(u => u.role === 'user');
    console.log('Users created...');

    // 3. Create Categories
    const createdCategories = await Category.create(categories);
    const menCat = createdCategories.find(c => c.name === 'Men');
    const womenCat = createdCategories.find(c => c.name === 'Women');
    const kidsCat = createdCategories.find(c => c.name === 'Kids');
    console.log('Categories created...');

    // 4. Create Collections
    const createdCollections = await Collection.create(collections);
    console.log('Collections created...');

    // 5. Create Products
    const createProductData = (template, category) => {
      return {
        name: template.name,
        description: `This is a high-quality ${template.name.toLowerCase()} suitable for various occasions. Made with premium materials for maximum comfort and durability.`,
        price: template.price,
        category: category._id,
        imageCover: template.image,
        images: [template.image, template.image, template.image], // Dummy additional images
        variants: [
          { size: 'S', color: 'Black', stock: 10 },
          { size: 'M', color: 'Blue', stock: 15 },
          { size: 'L', color: 'Red', stock: 5 }
        ],
        collections: [createdCollections[Math.floor(Math.random() * createdCollections.length)]._id]
      };
    };

    const allProducts = [
      ...menProducts.map(p => createProductData(p, menCat)),
      ...womenProducts.map(p => createProductData(p, womenCat)),
      ...kidsProducts.map(p => createProductData(p, kidsCat))
    ];

    const createdProducts = await Product.create(allProducts);
    console.log('Products created...');

    // 6. Create Reviews
    const reviews = [];
    createdProducts.forEach(product => {
      // Create 1-3 reviews per product
      const numReviews = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numReviews; i++) {
        const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
        reviews.push({
          review: `Great product! Really loved the quality of the ${product.name}.`,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
          product: product._id,
          user: randomUser._id
        });
      }
    });

    await Review.create(reviews);
    console.log('Reviews created...');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Collection.deleteMany();
    await Review.deleteMany();
    console.log('Data destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Please specify --import or --delete');
  process.exit();
}
