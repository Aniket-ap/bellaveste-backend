const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'A product must have a description']
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  salePrice: Number,
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'A product must belong to a category']
  },
  collections: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Collection'
  }],
  images: [String],
  imageCover: {
    type: String,
    required: [true, 'A product must have a cover image']
  },
  variants: [{
    size: String,
    color: String,
    stock: Number
  }],
  totalStock: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ isDeleted: 1 });

productSchema.pre('save', async function() {
  this.slug = slugify(this.name, { lower: true });
  
  // Calculate total stock if variants exist
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((acc, cur) => acc + cur.stock, 0);
  }
});

// Query Middleware to exclude deleted products
productSchema.pre(/^find/, async function() {
  this.find({ isDeleted: { $ne: true } });
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
