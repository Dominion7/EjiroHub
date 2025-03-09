const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  variants: [{
    color: String,
    size: String,
    stock: Number,
    price: Number,
    images: [String]
  }],
  category: String,
  supplier: String
});
module.exports = mongoose.model('Product', productSchema);