const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Wishlist must belong to a user'],
    unique: true
  },
  products: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }]
});

wishlistSchema.pre(/^find/, async function() {
  this.populate({
    path: 'products',
    select: 'name price imageCover slug'
  });
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
