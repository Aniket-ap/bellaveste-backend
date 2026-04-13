const mongoose = require('mongoose');
const slugify = require('slugify');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A collection must have a name'],
    unique: true,
    trim: true
  },
  slug: String,
  image: String,
  description: String
});

collectionSchema.pre('save', async function() {
  this.slug = slugify(this.name, { lower: true });
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
