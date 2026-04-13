const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A category name must have less or equal then 40 characters'],
    minlength: [3, 'A category name must have more or equal then 3 characters']
  },
  slug: String,
  image: String,
  description: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

categorySchema.pre('save', async function() {
  this.slug = slugify(this.name, { lower: true });
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
